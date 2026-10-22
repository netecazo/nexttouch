// Database abstraction layer - automatically uses Supabase if configured, otherwise SQLite
// This file dynamically imports the correct database implementation

const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

// Import the appropriate database module
let dbModule: any;

if (useSupabase) {
  console.log('Using Supabase database');
  dbModule = require('./db-supabase');
} else {
  console.log('Using SQLite database');
  dbModule = require('./db-sqlite');
}

// Re-export everything from the selected database module
export const userDb = dbModule.userDb;
export const leadDb = dbModule.leadDb;
export const activityDb = dbModule.activityDb;
