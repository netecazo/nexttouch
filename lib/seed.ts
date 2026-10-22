import { userDb, leadDb, activityDb } from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = userDb.create({
    email: 'demo@nexttouch.app',
    password: hashedPassword,
    name: 'Demo Agent',
  });

  console.log(`✓ Created user: ${user!.email}`);

  // Sample leads with realistic real estate scenarios
  const sampleLeads = [
    {
      name: 'Dana Robertson',
      phone: '(555) 234-5678',
      email: 'dana.r@email.com',
      source: 'Zillow',
      stage: 'qualified',
      notes: 'Interested in 3-bedroom homes in Maple Street area. Budget $450k-$500k. Mentioned kids need to stay in current school district. Liked the property at 142 Maple Ave but wanted to see more options.',
      lastContactDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    },
    {
      name: 'Marcus Thompson',
      phone: '(555) 345-6789',
      email: 'mthompson@email.com',
      source: 'Open House',
      stage: 'warm',
      notes: 'Met at open house on Sunday. Very interested in properties with large yards for his dogs. Works from home so needs a home office. Looking to move within 3 months.',
      lastContactDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
    {
      name: 'The Chen Family',
      phone: '(555) 456-7890',
      email: 'chen.family@email.com',
      source: 'Facebook Ad',
      stage: 'nurture',
      notes: 'First-time buyers. Planning to purchase in spring (4-5 months). Want a 4-bed in good school district. Budget around $600k. Very detail-oriented, asked lots of questions about the buying process.',
      lastContactDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    },
    {
      name: 'Sarah Mitchell',
      phone: '(555) 567-8901',
      email: 'sarah.m@email.com',
      source: 'Zillow',
      stage: 'hot',
      notes: 'Pre-approved for $550k. Needs to find something quickly - lease ends in 60 days. Wants modern kitchen, 3+ bedrooms. Works downtown so proximity to transit is important.',
      lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      name: 'Robert Kim',
      phone: '(555) 678-9012',
      email: 'rob.kim@email.com',
      source: 'Referral',
      stage: 'qualified',
      notes: 'Referred by Jennifer Park. Looking to downsize from current 5-bed to a 2-3 bed condo. Empty nesters. Want walkable neighborhood with restaurants. Budget $400k-$450k.',
      lastContactDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    },
    {
      name: 'Jennifer & Mike Lopez',
      phone: '(555) 789-0123',
      email: 'lopez.family@email.com',
      source: 'Open House',
      stage: 'cold',
      notes: 'Met at open house 6 months ago. Were interested but timing wasn\'t right - Mike was waiting for job transfer confirmation. Should follow up to see if situation has changed.',
      lastContactDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    },
    {
      name: 'Amanda Foster',
      phone: '(555) 890-1234',
      email: 'amanda.foster@email.com',
      source: 'Zillow',
      stage: 'new',
      notes: 'Just inquired yesterday about listings in Riverside area. Budget $350k-$400k. Single, works in tech. Wants 2-bed condo with parking.',
      lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      name: 'David & Lisa Patel',
      phone: '(555) 901-2345',
      email: 'patel.d@email.com',
      source: 'Website',
      stage: 'qualified',
      notes: 'Growing family, expecting third child. Need 4+ bedrooms. Currently renting but want to buy before baby arrives (3 months). Budget $650k. Prefer newer construction.',
      lastContactDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      name: 'Tom Richardson',
      phone: '(555) 012-3456',
      email: 'tom.rich@email.com',
      source: 'Facebook Ad',
      stage: 'warm',
      notes: 'Investment property buyer. Looking for properties under $300k that need renovation. Has experience flipping houses. Cash buyer so can close quickly.',
      lastContactDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
    },
    {
      name: 'Emily Watson',
      phone: '(555) 123-4567',
      email: 'ewatson@email.com',
      source: 'Zillow',
      stage: 'qualified',
      notes: 'Relocating for work from out of state. Needs to find something sight-unseen or during one trip. Budget $475k. Wants 3-bed, 2-bath in safe neighborhood close to her new office.',
      lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      name: 'Chris & Nicole Johnson',
      phone: '(555) 234-5679',
      email: 'johnson.cn@email.com',
      source: 'Referral',
      stage: 'nurture',
      notes: 'Friends with the Patels. Not ready to buy yet but gathering information. Currently saving for down payment. Interested in first-time buyer programs. Want to buy next year.',
      lastContactDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    },
    {
      name: 'Patricia Martinez',
      phone: '(555) 345-6780',
      email: 'pmartinez@email.com',
      source: 'Open House',
      stage: 'hot',
      notes: 'Very motivated buyer. Just sold her current home and needs to find something within 30 days. Looking for single-story ranch for accessibility. Budget $425k. Loves gardening so wants nice yard.',
      lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];

  for (const leadData of sampleLeads) {
    const lead = leadDb.create({
      ...leadData,
      userId: user!.id,
    });

    // Add some activities
    if (leadData.lastContactDate) {
      activityDb.create({
        type: 'contact',
        message: 'Initial contact made',
        leadId: lead!.id,
        userId: user!.id,
      });
    }

    console.log(`✓ Created lead: ${lead!.name}`);
  }

  console.log('\n✓ Database seeded successfully!');
  console.log('\nDemo login:');
  console.log('  Email: demo@nexttouch.app');
  console.log('  Password: demo123');
}

seed().catch(console.error);
