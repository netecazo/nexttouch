      ...row,// SQLite database implementation
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
      createdAt: fromTimestamp(row.createdAt),
      updatedAt: fromTimestamp(row.updatedAt),
    };
  },
};

export const leadDb = {
  create: (data: {
    name: string;
    phone?: string;
    email?: string;
    source?: string;
    stage?: string;
    notes?: string;
    lastContactDate?: Date | string;
    userId: string;
  }) => {
    const id = cuid();
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO Lead (id, name, phone, email, source, stage, notes, lastContactDate, createdAt, updatedAt, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.name,
      data.phone || null,
      data.email || null,
      data.source || null,
      data.stage || 'new',
      data.notes || null,
      toTimestamp(data.lastContactDate),
      now,
      now,
      data.userId
    );
    return leadDb.findById(id);
  },

  findById: (id: string) => {
    const stmt = db.prepare('SELECT * FROM Lead WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      ...row,
      lastContactDate: fromTimestamp(row.lastContactDate),
      createdAt: fromTimestamp(row.createdAt),
      updatedAt: fromTimestamp(row.updatedAt),
    };
  },

  findMany: (where: { userId: string }) => {
    const stmt = db.prepare('SELECT * FROM Lead WHERE userId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(where.userId) as any[];
    return rows.map(row => ({
      ...row,
      lastContactDate: fromTimestamp(row.lastContactDate),
      createdAt: fromTimestamp(row.createdAt),
      updatedAt: fromTimestamp(row.updatedAt),
    }));
  },

  update: (id: string, data: Partial<{
    name: string;
    phone: string;
    email: string;
    source: string;
    stage: string;
    notes: string;
    lastContactDate: Date | string | null;
  }>) => {
    const current = leadDb.findById(id);
    if (!current) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.phone !== undefined) {
      updates.push('phone = ?');
      values.push(data.phone || null);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email || null);
    }
    if (data.source !== undefined) {
      updates.push('source = ?');
      values.push(data.source || null);
    }
    if (data.stage !== undefined) {
      updates.push('stage = ?');
      values.push(data.stage);
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?');
      values.push(data.notes || null);
    }
    if (data.lastContactDate !== undefined) {
      updates.push('lastContactDate = ?');
      values.push(toTimestamp(data.lastContactDate));
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());

    if (updates.length > 0) {
      values.push(id);
      const stmt = db.prepare(`UPDATE Lead SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(...values);
    }

    return leadDb.findById(id);
  },

  delete: (id: string) => {
    const stmt = db.prepare('DELETE FROM Lead WHERE id = ?');
    stmt.run(id);
  },
};

export const activityDb = {
  create: (data: {
    type: string;
    message?: string;
    leadId: string;
    userId: string;
  }) => {
    const id = cuid();
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO Activity (id, type, message, createdAt, leadId, userId)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.type,
      data.message || null,
      now,
      data.leadId,
      data.userId
    );
    return activityDb.findById(id);
  },

  findById: (id: string) => {
    const stmt = db.prepare('SELECT * FROM Activity WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      ...row,
      createdAt: fromTimestamp(row.createdAt),
    };
  },

  findMany: (where: { leadId: string }) => {
    const stmt = db.prepare('SELECT * FROM Activity WHERE leadId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(where.leadId) as any[];
    return rows.map(row => ({
      ...row,
      createdAt: fromTimestamp(row.createdAt),
    }));
  },
};

export { db };
