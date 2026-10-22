import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to generate CUID-like IDs
function cuid(): string {
  return randomBytes(16).toString('hex');
}

// User operations
export const userDb = {
  create: async (data: { email: string; password?: string; name?: string }) => {
    const id = cuid();
    const now = new Date().toISOString();
    
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        id,
        email: data.email,
        password: data.password || null,
        name: data.name || null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...user,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  },

  findByEmail: async (email: string) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return {
      ...user,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  },

  findById: async (id: string) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...user,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  },
};

// Lead operations
export const leadDb = {
  create: async (data: {
    name: string;
    phone?: string;
    email?: string;
    source?: string;
    stage?: string;
    notes?: string;
    lastContactDate?: Date | string;
    userId: string;
  }) => {
    const id = cuid();
    const now = new Date().toISOString();

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        id,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        source: data.source || null,
        stage: data.stage || 'new',
        notes: data.notes || null,
        last_contact_date: data.lastContactDate ? new Date(data.lastContactDate).toISOString() : null,
        created_at: now,
        updated_at: now,
        user_id: data.userId,
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      stage: lead.stage,
      notes: lead.notes,
      lastContactDate: lead.last_contact_date ? new Date(lead.last_contact_date) : null,
      createdAt: new Date(lead.created_at),
      updatedAt: new Date(lead.updated_at),
      userId: lead.user_id,
    };
  },

  findById: async (id: string) => {
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      stage: lead.stage,
      notes: lead.notes,
      lastContactDate: lead.last_contact_date ? new Date(lead.last_contact_date) : null,
      createdAt: new Date(lead.created_at),
      updatedAt: new Date(lead.updated_at),
      userId: lead.user_id,
    };
  },

  findMany: async (where: { userId: string }) => {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', where.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return leads.map(lead => ({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      stage: lead.stage,
      notes: lead.notes,
      lastContactDate: lead.last_contact_date ? new Date(lead.last_contact_date) : null,
      createdAt: new Date(lead.created_at),
      updatedAt: new Date(lead.updated_at),
      userId: lead.user_id,
    }));
  },

  update: async (id: string, data: Partial<{
    name: string;
    phone: string;
    email: string;
    source: string;
    stage: string;
    notes: string;
    lastContactDate: Date | string | null;
  }>) => {
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updates.name = data.name;
    if (data.phone !== undefined) updates.phone = data.phone || null;
    if (data.email !== undefined) updates.email = data.email || null;
    if (data.source !== undefined) updates.source = data.source || null;
    if (data.stage !== undefined) updates.stage = data.stage;
    if (data.notes !== undefined) updates.notes = data.notes || null;
    if (data.lastContactDate !== undefined) {
      updates.last_contact_date = data.lastContactDate ? new Date(data.lastContactDate).toISOString() : null;
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      stage: lead.stage,
      notes: lead.notes,
      lastContactDate: lead.last_contact_date ? new Date(lead.last_contact_date) : null,
      createdAt: new Date(lead.created_at),
      updatedAt: new Date(lead.updated_at),
      userId: lead.user_id,
    };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Activity operations
export const activityDb = {
  create: async (data: {
    type: string;
    message?: string;
    leadId: string;
    userId: string;
  }) => {
    const id = cuid();
    const now = new Date().toISOString();

    const { data: activity, error } = await supabase
      .from('activities')
      .insert({
        id,
        type: data.type,
        message: data.message || null,
        created_at: now,
        lead_id: data.leadId,
        user_id: data.userId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: activity.id,
      type: activity.type,
      message: activity.message,
      createdAt: new Date(activity.created_at),
      leadId: activity.lead_id,
      userId: activity.user_id,
    };
  },

  findById: async (id: string) => {
    const { data: activity, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      id: activity.id,
      type: activity.type,
      message: activity.message,
      createdAt: new Date(activity.created_at),
      leadId: activity.lead_id,
      userId: activity.user_id,
    };
  },

  findMany: async (where: { leadId: string }) => {
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .eq('lead_id', where.leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      message: activity.message,
      createdAt: new Date(activity.created_at),
      leadId: activity.lead_id,
      userId: activity.user_id,
    }));
  },
};

export { supabase };
