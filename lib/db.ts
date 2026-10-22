// Database abstraction layer - uses Supabase for production
// For production (Vercel), Supabase is required via environment variables

const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!useSupabase) {
  console.warn('⚠️  No Supabase credentials found at build time. This is expected - credentials will be provided at runtime.');
}

// Always use Supabase in production
export * from './db-supabase';
