# NextTouch

**Real estate follow-up, simplified.**

NextTouch helps real estate agents stop losing leads by providing a prioritized daily list of 10 contacts with AI-drafted messages. Every message is reviewed before sending—nothing goes out automatically.

![NextTouch](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## What It Does

Real estate agents pay for leads (Zillow, Facebook, open houses), but follow-up is scattered and many leads go cold. NextTouch solves this by:

1. **Ranking leads by urgency** using a transparent scoring system
2. **Drafting personalized messages** using AI or smart templates
3. **Showing you exactly who to contact today** in a simple daily list

You approve each message before it goes out. No automation, no drip campaigns, no complicated setup.

## Features

### Core Functionality
- ✅ **Daily "Today's 10" list** - Prioritized leads ranked by likelihood to go cold
- ✅ **AI-drafted messages** - Personalized texts generated from lead notes (OpenAI)
- ✅ **Template fallbacks** - Works without an API key using smart templates
- ✅ **Transparent scoring** - See exactly why each lead is prioritized
- ✅ **Approve/Edit/Skip workflow** - Full control over every message
- ✅ **Activity logging** - Track all interactions with each lead

### Lead Management
- ✅ **CSV import** - Bulk upload your existing leads
- ✅ **Manual add/edit** - Add and update leads individually
- ✅ **Lead stages** - New, Hot, Qualified, Warm, Nurture, Cold
- ✅ **Search & filter** - Find leads by stage, source, or date
- ✅ **Activity history** - View full timeline per lead

### Technical
- ✅ **SQLite database** - Easy local setup, swappable to Postgres
- ✅ **Email/password auth** - Simple authentication without paid services
- ✅ **SMS integration ready** - Clean hooks for Twilio (copies text or opens SMS link)
- ✅ **Tested scoring logic** - 10 passing tests for ranking algorithm
- ✅ **Type-safe** - Full TypeScript coverage

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (development) / Supabase PostgreSQL (production)
- **Auth**: NextAuth.js v5 (credentials provider)
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (optional, with template fallbacks)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexttouch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   # Generate with: openssl rand -base64 32
   AUTH_SECRET=your-secret-key-here

   # Optional: OpenAI API key for AI-generated messages
   # Without this, the app uses template-based fallbacks
   OPENAI_API_KEY=sk-your-key-here
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000)

### Demo Account

After seeding, you can log in with:
- **Email**: demo@nexttouch.app
- **Password**: demo123

The demo account includes 12 sample leads with realistic real estate scenarios.

## Project Structure

```
nexttouch/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth endpoints
│   │   ├── generate-message/ # AI message generation
│   │   └── leads/            # Lead CRUD operations
│   ├── dashboard/            # Today's 10 list
│   ├── leads/                # All leads + detail pages
│   ├── login/                # Authentication
│   └── page.tsx              # Landing page
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Database client & helpers
│   ├── db-init.ts            # Database initialization
│   ├── seed.ts               # Sample data seeder
│   ├── scoring.ts            # Lead ranking algorithm
│   └── messages.ts           # AI/template message generation
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── dev.db                # SQLite database (generated)
├── __tests__/
│   └── scoring.test.ts       # Scoring logic tests
└── package.json
```

## Scoring Algorithm

Leads are ranked by a transparent point system:

### Base Scores (by stage)
- Hot: 100
- Qualified: 80
- Warm: 60
- New: 50
- Nurture: 40
- Cold: 20

### Time-Based Bonuses
- **Hot/Qualified leads**: +50 if no contact in 7+ days
- **New leads**: +60 if < 1 day old, +40 if < 3 days
- **Warm leads**: +40 if no contact in 10+ days
- **Nurture leads**: +35 if no contact in 60+ days

### Other Factors
- **Referrals**: +15 points
- **Open House**: +10 points
- **Recent inquiry** (< 7 days): +15 points
- **Detailed notes** (> 50 chars): +5 points

**Priority Levels:**
- Urgent: 120+ points
- High: 90-119 points
- Medium: 60-89 points
- Low: < 60 points

## CSV Import Format

Import leads with a CSV file containing these columns (case-insensitive):

| Column | Required | Example |
|--------|----------|---------|
| name | Yes | "John Doe" |
| phone | No | "(555) 123-4567" |
| email | No | "john@example.com" |
| source | No | "Zillow", "Referral", "Open House" |
| stage | No | "hot", "qualified", "warm", "new", "nurture", "cold" |
| notes | No | "Looking for 3-bed in downtown. Budget $450k." |
| lastContactDate | No | "2024-10-15" or "10/15/2024" |

Example CSV:
```csv
name,phone,email,source,stage,notes,lastContactDate
Jane Smith,(555) 234-5678,jane@email.com,Zillow,qualified,Pre-approved for $500k. Wants 4-bed near schools.,2024-10-10
```

## Testing

Run the scoring logic tests:

```bash
npm test
```

Tests cover:
- Lead prioritization by stage and time
- Score calculation accuracy
- Priority level assignments
- Edge cases (empty lists, referrals, etc.)

## Deployment

### Supabase Setup (Recommended for Production)

NextTouch automatically uses Supabase when environment variables are configured. No code changes needed!

**Quick Setup:**
1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
3. Add environment variables (see below)
4. Deploy to Vercel

📖 **[Complete Supabase Setup Guide](./SUPABASE_SETUP.md)**

### Vercel (Recommended)

1. **Push to GitHub/GitLab**

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel auto-detects Next.js

3. **Add environment variables**
   - `AUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `OPENAI_API_KEY` (optional)

4. **Deploy**

5. **Upgrade database for production**
   
   For production, swap SQLite for Postgres:
   - Use Vercel Postgres or Supabase
   - Update `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Run migrations on your hosted database
   - Add `DATABASE_URL` to Vercel env vars

### Other Platforms

NextTouch is a standard Next.js app and works on any platform supporting Node.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify
- Netlify

For SQLite in production, ensure your platform supports persistent filesystem storage, or migrate to Postgres.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | Secret key for NextAuth session encryption |
| `OPENAI_API_KEY` | No | OpenAI API key for AI message generation. Without this, the app uses template-based fallbacks. |
| `NEXT_PUBLIC_SUPABASE_URL` | No (Yes for production) | Your Supabase project URL. When set with service key, app uses Supabase instead of SQLite. |
| `SUPABASE_SERVICE_ROLE_KEY` | No (Yes for production) | Your Supabase service role key (secret). Required for database operations. |

## Future Enhancements

Potential additions (not in MVP):

- [ ] **Twilio integration** - Send SMS directly from the app
- [ ] **Email sending** - Send emails in addition to texts  
- [ ] **CRM connectors** - Follow Up Boss, kvCORE, Lofty APIs
- [ ] **Webhooks** - Real-time lead updates from external sources
- [ ] **Team features** - Multi-agent dashboards, lead assignment
- [ ] **Calendar integration** - Schedule follow-ups
- [ ] **Reporting** - Response rates, conversion metrics
- [ ] **Mobile app** - iOS/Android native apps

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Open a GitHub issue
- Email: support@nexttouch.app

---

Built with ❤️ for real estate agents who want to stay on top of their follow-up without the overhead.
