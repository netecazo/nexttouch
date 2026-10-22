import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { leadDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const lead = await leadDb.findById(id);
    
    if (!lead || lead.userId !== session.user.id) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const data = await req.json();

    const updatedLead = await leadDb.update(id, {
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      source: data.source || null,
      stage: data.stage,
      notes: data.notes || null,
    });

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const lead = await leadDb.findById(id);
    
    if (!lead || lead.userId !== session.user.id) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await leadDb.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
