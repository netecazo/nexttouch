// Database abstraction layer - uses Supabase for production
// For production (Vercel), Supabase is required via environment variables

const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!useSupabase) {
  console.warn('⚠️  No Supabase credentials found. Using Supabase is required for production.');
  throw new Error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

// Always use Supabase in production
export * from './db-supabase';
