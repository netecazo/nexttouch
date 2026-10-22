import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { leadDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leads } = await req.json();
    
    if (!Array.isArray(leads)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    let imported = 0;

    for (const leadData of leads) {
      if (!leadData.name) continue;

      // Map CSV column names (case-insensitive)
      const name = leadData.name || leadData.Name;
      const phone = leadData.phone || leadData.Phone;
      const email = leadData.email || leadData.Email;
      const source = leadData.source || leadData.Source;
      const stage = (leadData.stage || leadData.Stage || 'new').toLowerCase();
      const notes = leadData.notes || leadData.Notes;
      const lastContactDate = leadData.lastContactDate || leadData.LastContactDate || leadData.last_contact_date;

      try {
        await leadDb.create({
          name,
          phone: phone || null,
          email: email || null,
          source: source || null,
          stage,
          notes: notes || null,
          lastContactDate: lastContactDate ? new Date(lastContactDate) : undefined,
          userId: session.user.id,
        });
        imported++;
      } catch (error) {
        console.error('Error importing lead:', error);
      }
    }

    return NextResponse.json({ count: imported });
  } catch (error) {
    console.error('Error importing leads:', error);
    return NextResponse.json({ error: 'Failed to import leads' }, { status: 500 });
  }
}
