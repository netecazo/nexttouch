import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const dbDir = path.dirname(dbPath);

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Lead (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    source TEXT,
    stage TEXT NOT NULL DEFAULT 'new',
    notes TEXT,
    lastContactDate INTEGER,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Activity (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    message TEXT,
    createdAt INTEGER NOT NULL,
    leadId TEXT NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY (leadId) REFERENCES Lead(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_lead_userId ON Lead(userId);
  CREATE INDEX IF NOT EXISTS idx_activity_leadId ON Activity(leadId);
  CREATE INDEX IF NOT EXISTS idx_activity_userId ON Activity(userId);
`);

console.log('✓ Database initialized successfully');

db.close();
