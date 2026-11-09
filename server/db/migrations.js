import { pool, initPostgresSchema } from './postgres.js';

/**
 * Migration 001: Initialize PostgreSQL Tables & Indexes
 */
export async function up() {
  console.log('[PostgreSQL Migration] Running migration 001: Creating users, profiles, refresh_tokens tables & B-Tree indexes...');
  try {
    await initPostgresSchema();
    console.log('[PostgreSQL Migration] Migration 001 applied successfully.');
  } catch (err) {
    console.error('[PostgreSQL Migration] Migration failed:', err.message);
    throw err;
  }
}

/**
 * Rollback Migration 001: Drop Tables
 */
export async function down() {
  console.log('[PostgreSQL Migration] Rolling back migration 001 (Dropping tables)...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS refresh_tokens CASCADE;');
    await client.query('DROP TABLE IF EXISTS profiles CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    await client.query('COMMIT');
    console.log('[PostgreSQL Migration] Rollback completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[PostgreSQL Migration] Rollback failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Support CLI run: node server/db/migrations.js up / down
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2] || 'up';
  if (cmd === 'up') {
    up().then(() => process.exit(0)).catch(() => process.exit(1));
  } else if (cmd === 'down') {
    down().then(() => process.exit(0)).catch(() => process.exit(1));
  }
}
