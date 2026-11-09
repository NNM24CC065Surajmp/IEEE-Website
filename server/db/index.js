import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

/**
 * Concurrency Mutex Lock Manager
 * Prevents race conditions during simultaneous registrations or profile updates.
 */
class MutexManager {
  constructor() {
    this.locks = new Map();
  }

  async acquire(key, timeoutMs = 5000) {
    const startTime = Date.now();
    while (this.locks.has(key)) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Lock acquisition timeout for key: ${key}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    this.locks.set(key, Date.now());
  }

  release(key) {
    this.locks.delete(key);
  }
}

/**
 * Database Connection & Concurrency Pool Manager
 */
class DatabasePool {
  constructor(maxConnections = 20) {
    this.maxConnections = maxConnections;
    this.activeConnections = 0;
    this.queue = [];
    this.mutex = new MutexManager();
    this.users = new Map();
    this.emailIndex = new Map();
    this.usnIndex = new Map();
    this.membershipIdIndex = new Map();
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(USERS_FILE)) {
      try {
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        const data = JSON.parse(raw);
        for (const user of data) {
          this.indexUser(user);
        }
        console.log(`[DatabasePool] Hydrated ${this.users.size} user records into memory index.`);
      } catch (err) {
        console.error('[DatabasePool] Failed to parse existing users data:', err.message);
      }
    } else {
      // Seed initial structure
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  indexUser(user) {
    if (!user || !user.uid) return;
    this.users.set(user.uid, user);
    if (user.email) this.emailIndex.set(user.email.toLowerCase(), user.uid);
    if (user.usn) this.usnIndex.set(user.usn.toUpperCase(), user.uid);
    if (user.membershipId) this.membershipIdIndex.set(user.membershipId.toUpperCase(), user.uid);
  }

  async acquireConnection(timeoutMs = 5000) {
    const startTime = Date.now();
    while (this.activeConnections >= this.maxConnections) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error('Database connection pool exhausted. Please retry shortly.');
      }
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
    this.activeConnections++;
    return {
      release: () => {
        this.activeConnections = Math.max(0, this.activeConnections - 1);
      },
    };
  }

  async persistToDisk() {
    try {
      const records = Array.from(this.users.values());
      const tempFile = `${USERS_FILE}.tmp`;
      await fs.promises.writeFile(tempFile, JSON.stringify(records, null, 2), 'utf-8');
      await fs.promises.rename(tempFile, USERS_FILE);
    } catch (err) {
      console.error('[DatabasePool] Disk persistence error:', err.message);
    }
  }

  // ─── Query & Mutation Methods with Mutex & Index Lookups ─────────

  async findUserByUid(uid) {
    const conn = await this.acquireConnection();
    try {
      return this.users.get(uid) || null;
    } finally {
      conn.release();
    }
  }

  async findUserByEmail(email) {
    const conn = await this.acquireConnection();
    try {
      const uid = this.emailIndex.get((email || '').toLowerCase());
      return uid ? this.users.get(uid) || null : null;
    } finally {
      conn.release();
    }
  }

  async findUserByUsn(usn) {
    const conn = await this.acquireConnection();
    try {
      const uid = this.usnIndex.get((usn || '').toUpperCase());
      return uid ? this.users.get(uid) || null : null;
    } finally {
      conn.release();
    }
  }

  /**
   * Atomic user creation with race condition protection
   */
  async createUser(userData) {
    const normalizedEmail = (userData.email || '').toLowerCase().trim();
    const normalizedUsn = (userData.usn || '').toUpperCase().trim();

    // Acquire locks on email and USN to guarantee zero duplicates on concurrent hits
    await this.mutex.acquire(`auth:${normalizedEmail}`);
    if (normalizedUsn) {
      await this.mutex.acquire(`usn:${normalizedUsn}`);
    }

    const conn = await this.acquireConnection();
    try {
      // Check for duplicates
      if (this.emailIndex.has(normalizedEmail)) {
        throw new Error('An account with this college email already exists.');
      }
      if (normalizedUsn && this.usnIndex.has(normalizedUsn)) {
        throw new Error('An account with this college USN already exists.');
      }

      const uid = userData.uid || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const newUser = {
        ...userData,
        uid,
        email: normalizedEmail,
        usn: normalizedUsn,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.indexUser(newUser);
      // Non-blocking disk persist
      this.persistToDisk();

      return newUser;
    } finally {
      conn.release();
      this.mutex.release(`auth:${normalizedEmail}`);
      if (normalizedUsn) {
        this.mutex.release(`usn:${normalizedUsn}`);
      }
    }
  }

  /**
   * Atomic profile update
   */
  async updateUser(uid, updateData) {
    await this.mutex.acquire(`user:${uid}`);
    const conn = await this.acquireConnection();
    try {
      const existing = this.users.get(uid);
      if (!existing) {
        // If not existing, create new record
        return await this.createUser({ uid, ...updateData });
      }

      const updated = {
        ...existing,
        ...updateData,
        uid,
        updatedAt: new Date().toISOString(),
      };

      this.indexUser(updated);
      this.persistToDisk();
      return updated;
    } finally {
      conn.release();
      this.mutex.release(`user:${uid}`);
    }
  }

  /**
   * Paginated user list for dashboard or admin operations
   */
  async listUsers({ page = 1, limit = 20, search = '' } = {}) {
    const conn = await this.acquireConnection();
    try {
      let all = Array.from(this.users.values());
      if (search) {
        const s = search.toLowerCase();
        all = all.filter(
          (u) =>
            (u.name && u.name.toLowerCase().includes(s)) ||
            (u.email && u.email.toLowerCase().includes(s)) ||
            (u.usn && u.usn.toLowerCase().includes(s))
        );
      }

      const total = all.length;
      const startIndex = (page - 1) * limit;
      const data = all.slice(startIndex, startIndex + limit);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data,
      };
    } finally {
      conn.release();
    }
  }

  getMetrics() {
    return {
      activeConnections: this.activeConnections,
      maxConnections: this.maxConnections,
      totalUsers: this.users.size,
      indexedEmails: this.emailIndex.size,
      indexedUsns: this.usnIndex.size,
      activeLocks: this.mutex.locks.size,
    };
  }
}

export const dbPool = new DatabasePool();
