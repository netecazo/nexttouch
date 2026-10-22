import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { leadDb } from '@/lib/db';
import { generateMessage } from '@/lib/messages';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId } = await req.json();
    
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const lead = leadDb.findById(leadId);
    
    if (!lead || lead.userId !== session.user.id) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const message = await generateMessage({
      name: lead.name,
      notes: lead.notes,
      stage: lead.stage,
      source: lead.source,
      lastContactDate: lead.lastContactDate,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json({ error: 'Failed to generate message' }, { status: 500 });
  }
}
