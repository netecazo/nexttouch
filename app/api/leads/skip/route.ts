import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { leadDb, activityDb } from '@/lib/db';

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

    const lead = await leadDb.findById(leadId);
    
    if (!lead || lead.userId !== session.user.id) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Create activity record for skip
    await activityDb.create({
      type: 'skipped',
      message: 'Skipped in daily list',
      leadId,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error skipping lead:', error);
    return NextResponse.json({ error: 'Failed to skip lead' }, { status: 500 });
  }
}
