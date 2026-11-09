import pg from 'pg';
import { config } from '../config/env.js';

const { Pool } = pg;

/**
 * Configure database connection pool based on:
 * pool_size = floor((DB_MAX_CONNECTIONS - DB_RESERVED_CONNECTIONS) / TOTAL_WORKERS)
 */
function calculatePoolSize() {
  const maxDbConnections = parseInt(process.env.DB_MAX_CONNECTIONS || '100', 10);
  const reservedConnections = parseInt(process.env.DB_RESERVED_CONNECTIONS || '5', 10);
  const totalWorkers = parseInt(process.env.BACKEND_WORKERS || '1', 10);

  const available = Math.max(5, maxDbConnections - reservedConnections);
  const calculated = Math.floor(available / Math.max(1, totalWorkers));
  const configured = parseInt(process.env.DB_POOL_MAX || String(calculated), 10);

  return Math.min(configured, calculated);
}

const poolSize = calculatePoolSize();

const poolConfig = {
  max: poolSize,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT_MS || '5000', 10),
};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL.includes('localhost')) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  poolConfig.host = process.env.PGHOST || 'localhost';
  poolConfig.port = parseInt(process.env.PGPORT || '5432', 10);
  poolConfig.database = process.env.PGDATABASE || 'ieee_website';
  poolConfig.user = process.env.PGUSER || 'postgres';
  poolConfig.password = process.env.PGPASSWORD || 'postgres';
}

export const pool = new Pool(poolConfig);

// Handle idle client errors without crashing the backend process
pool.on('error', (err) => {
  console.error('[PostgreSQL Pool] Unexpected error on idle client:', err.message);
});

/**
 * Transaction Helper
 * Guarantees ACID transactional integrity with automatic COMMIT and ROLLBACK
 */
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Initialize PostgreSQL Schema with Proper Tables, Foreign Keys & B-Tree Indexes
 */
export async function initPostgresSchema() {
  const client = await pool.connect();
  try {
    console.log('[PostgreSQL] Initializing tables and performance indexes...');
    await client.query('BEGIN');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'member',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. User Profiles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_uid VARCHAR(128) PRIMARY KEY REFERENCES users(uid) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        college_email VARCHAR(255),
        usn VARCHAR(64) UNIQUE,
        branch VARCHAR(255),
        year VARCHAR(50),
        membership_id VARCHAR(64),
        bio TEXT DEFAULT '',
        photo_url TEXT DEFAULT '',
        skills JSONB DEFAULT '[]'::jsonb,
        socials JSONB DEFAULT '{"linkedin":"","github":"","instagram":"","website":""}'::jsonb,
        achievements JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Refresh Tokens / Sessions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_uid VARCHAR(128) REFERENCES users(uid) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        revoked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. B-Tree Indexes for High-Concurrency Fast Lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(lower(email));
      CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
      CREATE INDEX IF NOT EXISTS idx_profiles_usn ON profiles(upper(usn));
      CREATE INDEX IF NOT EXISTS idx_profiles_membership_id ON profiles(membership_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_uid ON refresh_tokens(user_uid);
    `);

    await client.query('COMMIT');
    console.log('[PostgreSQL] Database schema and indexes verified successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[PostgreSQL] Schema initialization error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// ─── High-Concurrency Database Operations with Transactions ──────────

/**
 * Atomic User & Profile Creation within a Single PostgreSQL Transaction
 * Prevents race conditions and duplicate account creation under concurrent traffic.
 */
export async function createPostgresUser(userData) {
  const normalizedEmail = (userData.email || '').toLowerCase().trim();
  const normalizedUsn = (userData.usn || '').toUpperCase().trim();
  const uid = userData.uid || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return await withTransaction(async (client) => {
    // Check duplicates inside transaction
    const dupCheck = await client.query(
      `SELECT u.email, p.usn FROM users u 
       LEFT JOIN profiles p ON u.uid = p.user_uid 
       WHERE lower(u.email) = lower($1) OR (p.usn IS NOT NULL AND upper(p.usn) = upper($2))`,
      [normalizedEmail, normalizedUsn]
    );

    if (dupCheck.rows.length > 0) {
      const match = dupCheck.rows[0];
      if (match.email && match.email.toLowerCase() === normalizedEmail) {
        throw new Error('An account with this college email already exists.');
      }
      if (match.usn && match.usn.toUpperCase() === normalizedUsn) {
        throw new Error('An account with this college USN already exists.');
      }
    }

    // 1. Insert into users
    const userRes = await client.query(
      `INSERT INTO users (uid, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING uid, email, role, created_at, updated_at`,
      [uid, normalizedEmail, userData.passwordHash, userData.role || 'member']
    );

    // 2. Insert into profiles
    const profileRes = await client.query(
      `INSERT INTO profiles (user_uid, name, college_email, usn, branch, year, membership_id, bio, photo_url, skills, socials, achievements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        uid,
        userData.name.trim(),
        normalizedEmail,
        normalizedUsn || null,
        (userData.branch || '').trim(),
        (userData.year || '').trim(),
        (userData.membershipId || normalizedUsn || '').trim(),
        userData.bio || (userData.membershipId ? `Verified IEEE Member (ID: ${userData.membershipId})` : ''),
        userData.photoURL || '',
        JSON.stringify(userData.skills || []),
        JSON.stringify(userData.socials || { linkedin: '', github: '', instagram: '', website: '' }),
        JSON.stringify(userData.achievements || []),
      ]
    );

    return {
      ...userRes.rows[0],
      profile: profileRes.rows[0],
    };
  });
}

/**
 * Fast Indexed User Lookup by Email (Includes Profile Data)
 */
export async function findPostgresUserByEmail(email) {
  const query = `
    SELECT u.uid, u.email, u.password_hash as "passwordHash", u.role, u.created_at, u.updated_at,
           p.name, p.college_email as "collegeEmail", p.usn, p.branch, p.year, p.membership_id as "membershipId",
           p.bio, p.photo_url as "photoURL", p.skills, p.socials, p.achievements
    FROM users u
    LEFT JOIN profiles p ON u.uid = p.user_uid
    WHERE lower(u.email) = lower($1)
    LIMIT 1;
  `;
  const res = await pool.query(query, [email.toLowerCase().trim()]);
  return res.rows[0] || null;
}

/**
 * Fast Indexed User Lookup by UID (Includes Profile Data)
 */
export async function findPostgresUserByUid(uid) {
  const query = `
    SELECT u.uid, u.email, u.role, u.created_at, u.updated_at,
           p.name, p.college_email as "collegeEmail", p.usn, p.branch, p.year, p.membership_id as "membershipId",
           p.bio, p.photo_url as "photoURL", p.skills, p.socials, p.achievements
    FROM users u
    LEFT JOIN profiles p ON u.uid = p.user_uid
    WHERE u.uid = $1
    LIMIT 1;
  `;
  const res = await pool.query(query, [uid]);
  return res.rows[0] || null;
}

/**
 * Atomic Profile Update within Transaction
 */
export async function updatePostgresUserProfile(uid, updateFields) {
  return await withTransaction(async (client) => {
    const existing = await client.query('SELECT user_uid FROM profiles WHERE user_uid = $1', [uid]);
    if (existing.rows.length === 0) {
      throw new Error('Profile record not found.');
    }

    const setClauses = [];
    const values = [uid];
    let idx = 2;

    const allowed = {
      name: 'name',
      collegeEmail: 'college_email',
      branch: 'branch',
      year: 'year',
      usn: 'usn',
      membershipId: 'membership_id',
      bio: 'bio',
      photoURL: 'photo_url',
      skills: 'skills',
      socials: 'socials',
      achievements: 'achievements',
    };

    for (const [key, col] of Object.entries(allowed)) {
      if (updateFields[key] !== undefined) {
        let val = updateFields[key];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        setClauses.push(`${col} = $${idx}`);
        values.push(val);
        idx++;
      }
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    const updateQuery = `
      UPDATE profiles
      SET ${setClauses.join(', ')}
      WHERE user_uid = $1
      RETURNING *;
    `;

    const res = await client.query(updateQuery, values);
    return res.rows[0];
  });
}

/**
 * Paginated User Directory
 */
export async function listPostgresUsers({ page = 1, limit = 20, search = '' } = {}) {
  const offset = (Math.max(1, page) - 1) * limit;
  let where = '';
  const params = [limit, offset];

  if (search) {
    where = 'WHERE lower(u.email) LIKE $3 OR lower(p.name) LIKE $3 OR upper(p.usn) LIKE $3';
    params.push(`%${search.toLowerCase().trim()}%`);
  }

  const dataQuery = `
    SELECT u.uid, u.email, u.role, p.name, p.usn, p.branch, p.year, p.membership_id as "membershipId", u.created_at
    FROM users u
    LEFT JOIN profiles p ON u.uid = p.user_uid
    ${where}
    ORDER BY u.created_at DESC
    LIMIT $1 OFFSET $2;
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM users u
    LEFT JOIN profiles p ON u.uid = p.user_uid
    ${where};
  `;

  const [dataRes, countRes] = await Promise.all([
    pool.query(dataQuery, params),
    pool.query(countQuery, search ? [`%${search.toLowerCase().trim()}%`] : []),
  ]);

  const total = parseInt(countRes.rows[0].total, 10);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: dataRes.rows,
  };
}

export function getPostgresPoolMetrics() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    maxConfigured: poolSize,
  };
}
