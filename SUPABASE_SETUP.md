# Supabase Setup Guide for NextTouch

This guide walks you through setting up Supabase as the production database for NextTouch.

## Why Supabase?

- ✅ **Production-ready PostgreSQL** - More reliable than SQLite for serverless deployments
- ✅ **Free tier available** - 500MB database, 2GB file storage, 50,000 monthly active users
- ✅ **Automatic backups** - Daily backups included
- ✅ **Real-time capabilities** - Built-in real-time subscriptions (future feature)
- ✅ **Row Level Security** - Database-level security policies
- ✅ **Hosted & managed** - No infrastructure to maintain

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: NextTouch (or your preferred name)
   - **Database Password**: Generate a secure password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for MVP
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

## Step 2: Run Database Migration

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the contents of `/workspace/supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates:
- `users` table
- `leads` table  
- `activities` table
- Indexes for performance
- Row Level Security policies

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, click **"Project Settings"** (gear icon)
2. Navigate to **"API"** section
3. You'll need two values:

   **Project URL:**
   ```
   Copy the value under "Project URL"
   Example: https://abcdefghijklm.supabase.co
   ```

   **Service Role Key (Secret):**
   ```
   Click "Reveal" next to "service_role"
   Copy this key (keep it secret!)
   ```

## Step 4: Update Environment Variables

### For Local Development

Add to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add these variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service role key (keep secret!) |
   | `AUTH_SECRET` | Your NextAuth secret |
   | `OPENAI_API_KEY` | (Optional) Your OpenAI key |

4. Click **"Save"**

## Step 5: Seed Sample Data (Optional)

If you want to populate your Supabase database with sample leads:

```bash
npm run db:seed:supabase
```

This creates:
- Demo user (demo@nexttouch.app / demo123)
- 12 sample real estate leads
- Initial activity records

## Step 6: Deploy to Vercel

### Option A: From CLI

```bash
# Make sure environment variables are set first
npm run build
npx vercel --prod
```

### Option B: From Vercel Dashboard

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables (Step 4)
4. Deploy

## Step 7: Verify Everything Works

1. Visit your deployed URL
2. Log in with demo credentials (if you seeded data)
3. Check that leads load on the dashboard
4. Try adding a new lead
5. Check Today's 10 list

## Database Switching Logic

NextTouch automatically detects which database to use:

- **If Supabase env vars are set** → Uses Supabase (PostgreSQL)
- **If no Supabase env vars** → Uses local SQLite

No code changes needed! Just add/remove environment variables.

## Supabase Dashboard Features

Once set up, you can use the Supabase dashboard to:

### Table Editor
- View and edit data directly
- Click **"Table Editor"** to see your tables
- Useful for debugging and manual updates

### SQL Editor
- Run custom queries
- Create reports
- Bulk operations

### Authentication (Future Enhancement)
- Supabase has built-in auth that could replace NextAuth
- Supports email, OAuth, magic links
- User management UI included

### Storage (Future Enhancement)
- Store profile pictures, documents
- 1GB free storage included

### Real-time (Future Enhancement)
- Live updates when leads change
- Team collaboration features

## Troubleshooting

### "Missing Supabase environment variables" Error

**Problem:** App crashes on startup

**Solution:** Check that both env vars are set correctly:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### "relation does not exist" Error

**Problem:** Tables not created

**Solution:** Run the migration SQL from Step 2 again

### Connection Timeout

**Problem:** Can't connect to Supabase

**Solution:** 
1. Check your project is not paused (free tier pauses after inactivity)
2. Verify the URL is correct
3. Check your network/firewall settings

### Row Level Security Blocks Access

**Problem:** Can't read/write data even though tables exist

**Solution:** The RLS policies might be blocking access. To temporarily disable (dev only):

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
```

For production, update the policies to match your auth setup.

## Migration from SQLite

If you already have data in SQLite and want to migrate:

1. Export your SQLite data:
   ```bash
   sqlite3 prisma/dev.db .dump > backup.sql
   ```

2. Convert and import to Supabase (manual process):
   - Export users, leads, activities as CSV
   - Use Supabase Table Editor to import CSV
   - Or write a migration script

## Cost Estimates

**Free Tier (suitable for MVP):**
- 500 MB database space
- 2 GB file storage
- 50,000 monthly active users
- Social OAuth providers
- 50 GB bandwidth

**Pro Tier ($25/month):**
- 8 GB database space
- 100 GB file storage
- 100,000 monthly active users
- Daily backups with 7-day retention
- 250 GB bandwidth

For most real estate agents, free tier is sufficient.

## Next Steps

Once Supabase is working:

1. ✅ Remove SQLite dependencies (optional)
2. ✅ Set up automated backups
3. ✅ Configure database alerts
4. ✅ Add monitoring (Supabase provides built-in metrics)
5. ✅ Consider enabling Supabase Auth for better auth UX

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **NextTouch Issues:** (Your GitHub repo)

---

**You're all set!** Your NextTouch app is now running on production-grade PostgreSQL via Supabase. 🚀
