// Deprecated: the project now uses Supabase-backed database access.
// This file remains as a compatibility shim so imports do not break during migration.

console.warn('⚠️ lib/db-sqlite.ts is deprecated. Use lib/db.ts or lib/db-supabase.ts instead.');

export * from './db-supabase';
export { supabase as db } from './db-supabase';
