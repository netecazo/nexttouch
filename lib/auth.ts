import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { userDb, leadDb, activityDb } from "@/lib/db";

// Demo credentials
const DEMO_EMAIL = "demo@nexttouch.app";
const DEMO_PASSWORD = "demo123";
const DEMO_NAME = "Demo Agent";

// Auto-create demo user with sample leads if it doesn't exist
async function ensureDemoUser() {
  try {
    let user = await userDb.findByEmail(DEMO_EMAIL);
    
    if (!user) {
      console.log('Demo user not found, creating...');
      
      // Create demo user
      const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
      user = await userDb.create({
        email: DEMO_EMAIL,
        password: hashedPassword,
        name: DEMO_NAME,
      });
      
      console.log('✓ Created demo user:', user.email);
      
      // Create sample leads
      const sampleLeads = [
        {
          name: 'Dana Robertson',
          phone: '(555) 234-5678',
          email: 'dana.r@email.com',
          source: 'Zillow',
          stage: 'qualified',
          notes: 'Interested in 3-bedroom homes in Maple Street area. Budget $450k-$500k.',
          lastContactDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'Marcus Thompson',
          phone: '(555) 345-6789',
          email: 'mthompson@email.com',
          source: 'Open House',
          stage: 'warm',
          notes: 'Met at open house. Very interested in properties with large yards for his dogs.',
          lastContactDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'Sarah Mitchell',
          phone: '(555) 567-8901',
          email: 'sarah.m@email.com',
          source: 'Zillow',
          stage: 'hot',
          notes: 'Pre-approved for $550k. Needs to find something quickly - lease ends in 60 days.',
          lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ];
      
      for (const leadData of sampleLeads) {
        try {
          const lead = await leadDb.create({
            ...leadData,
            userId: user.id,
          });
          
          if (leadData.lastContactDate) {
            await activityDb.create({
              type: 'contact',
              message: 'Initial contact made',
              leadId: lead.id,
              userId: user.id,
            });
          }
          
          console.log('✓ Created lead:', lead.name);
        } catch (error) {
          console.error('Error creating lead:', error);
        }
      }
      
      console.log('✓ Demo data seeded successfully');
    }
    
    return user;
  } catch (error) {
    console.error('Error ensuring demo user:', error);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Required for NextAuth v5 in production
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('[Auth] Starting authorization...');
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            console.log('[Auth] Missing email or password');
            return null;
          }

          console.log('[Auth] Checking for demo user:', email === DEMO_EMAIL ? 'YES' : 'NO');

          // Auto-create demo user if logging in with demo credentials and user doesn't exist
          if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
            console.log('[Auth] Demo credentials detected, ensuring demo user exists...');
            const demoUser = await ensureDemoUser();
            if (demoUser) {
              console.log('[Auth] Demo user ready');
            } else {
              console.log('[Auth] Failed to ensure demo user');
            }
          }

          console.log('[Auth] Looking up user by email...');
          const user = await userDb.findByEmail(email);
          
          if (!user) {
            console.log('[Auth] User not found');
            return null;
          }

          if (!user.password) {
            console.log('[Auth] User has no password');
            return null;
          }

          console.log('[Auth] Comparing password...');
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            console.log('[Auth] Password comparison failed');
            return null;
          }

          console.log('[Auth] Authorization successful for:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('[Auth] Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
