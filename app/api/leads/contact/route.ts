import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { leadDb, activityDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, message, type } = await req.json();
    
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const lead = await leadDb.findById(leadId);
    
    if (!lead || lead.userId !== session.user.id) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Update last contact date
    await leadDb.update(leadId, {
      lastContactDate: new Date(),
    });

    // Create activity record
    await activityDb.create({
      type: type || 'text',
      message: message || 'Contacted',
      leadId,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking contact:', error);
    return NextResponse.json({ error: 'Failed to mark as contacted' }, { status: 500 });
  }
}
