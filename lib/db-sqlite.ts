// SQLite database implementation
import Database from 'better-sqlite3';
import path from 'path';
import { randomBytes } from 'crypto';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(dbPath);

function cuid(): string {
  return randomBytes(16).toString('hex');
}

function toTimestamp(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  return new Date(date).getTime();
}

function fromTimestamp(timestamp: number | null): Date | null {
  if (!timestamp) return null;
  return new Date(timestamp);
}

export const userDb = {
  create: (data: { email: string; password?: string; name?: string }) => {
    const id = cuid();
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO User (id, email, password, name, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.email, data.password || null, data.name || null, now, now);
    return userDb.findById(id);
  },

  findByEmail: (email: string) => {
    const stmt = db.prepare('SELECT * FROM User WHERE email = ?');
    const row = stmt.get(email) as any;
    if (!row) return null;
    return {
      ...row,
      createdAt: fromTimestamp(row.createdAt),
      updatedAt: fromTimestamp(row.updatedAt),
    };
  },

  findById: (id: string) => {
    const stmt = db.prepare('SELECT * FROM User WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
