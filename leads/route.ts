import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { leadDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const lead = leadDb.create({
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      source: data.source || null,
      stage: data.stage || 'new',
      notes: data.notes || null,
      lastContactDate: data.lastContactDate || null,
      userId: session.user.id,
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
