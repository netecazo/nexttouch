type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  stage: string;
  notes: string | null;
  lastContactDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
};

export type ScoredLead = Lead & {
  score: number;
  reason: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
};

const STAGE_WEIGHTS = {
  hot: 100,
  qualified: 80,
  warm: 60,
  nurture: 40,
  new: 50,
  cold: 20,
};

const SOURCE_WEIGHTS = {
  'Referral': 15,
  'Open House': 10,
  'Zillow': 5,
  'Facebook Ad': 5,
  'Website': 5,
};

function getDaysSince(date: Date | null): number {
  if (!date) return 999; // Very high number for never contacted
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateScore(lead: Lead): { score: number; reason: string; priority: 'urgent' | 'high' | 'medium' | 'low' } {
  let score = 0;
  const reasons: string[] = [];
  
  // Stage weight (base score)
  const stageWeight = STAGE_WEIGHTS[lead.stage as keyof typeof STAGE_WEIGHTS] || 30;
  score += stageWeight;
  
  // Days since last contact (most important factor)
  const daysSince = getDaysSince(lead.lastContactDate);
  
  if (lead.stage === 'hot' || lead.stage === 'qualified') {
    // Hot and qualified leads need frequent contact
    if (daysSince > 7) {
      score += 50;
      reasons.push(`Went quiet ${daysSince} days ago`);
    } else if (daysSince > 3) {
      score += 30;
      reasons.push(`${daysSince} days since contact`);
    } else if (daysSince <= 2) {
      score += 20;
      reasons.push('Keep momentum going');
    }
  } else if (lead.stage === 'warm') {
    // Warm leads should be contacted weekly
    if (daysSince > 10) {
      score += 40;
      reasons.push(`No contact in ${daysSince} days`);
    } else if (daysSince > 5) {
      score += 25;
      reasons.push('Good time for follow-up');
    }
  } else if (lead.stage === 'nurture') {
    // Nurture leads need monthly check-ins
    if (daysSince > 60) {
      score += 35;
      reasons.push('Long-term nurture check-in');
    } else if (daysSince > 30) {
      score += 20;
      reasons.push('Monthly touchpoint');
    }
  } else if (lead.stage === 'new') {
    // New leads should be contacted ASAP
    if (daysSince <= 1) {
      score += 60;
      reasons.push('New lead - strike while hot!');
    } else if (daysSince <= 3) {
      score += 40;
      reasons.push('Recent inquiry');
    }
  } else if (lead.stage === 'cold') {
    // Cold leads get occasional check-ins
    if (daysSince > 180) {
      score += 15;
      reasons.push('Re-engagement attempt');
    }
  }
  
  // Source weight
  const sourceWeight = SOURCE_WEIGHTS[lead.source as keyof typeof SOURCE_WEIGHTS] || 0;
  score += sourceWeight;
  
  // Recency of inquiry (created date)
  if (lead.createdAt) {
    const daysSinceCreated = getDaysSince(lead.createdAt);
    if (daysSinceCreated <= 7 && lead.stage !== 'new') {
      score += 15;
      if (reasons.length === 0) {
        reasons.push('Recent lead');
      }
    }
  }
  
  // Has notes (shows engagement)
  if (lead.notes && lead.notes.length > 50) {
    score += 5;
  }
  
  // Determine priority
  let priority: 'urgent' | 'high' | 'medium' | 'low';
  if (score >= 120) {
    priority = 'urgent';
  } else if (score >= 90) {
    priority = 'high';
  } else if (score >= 60) {
    priority = 'medium';
  } else {
    priority = 'low';
  }
  
  // Generate reason
  let reason = reasons.length > 0 ? reasons[0] : '';
  
  if (!reason) {
    if (lead.stage === 'hot') {
      reason = 'Hot lead - stay engaged';
    } else if (lead.stage === 'qualified') {
      reason = 'Qualified buyer';
    } else if (lead.stage === 'warm') {
      reason = 'Warm lead - build relationship';
    } else if (lead.source === 'Referral') {
      reason = 'Referral - high trust';
    } else {
      reason = `${lead.stage} lead`;
    }
  }
  
  return { score, reason, priority };
}

export function scoreAndRankLeads(leads: Lead[], limit: number = 10): ScoredLead[] {
  const scoredLeads = leads.map(lead => {
    const { score, reason, priority } = calculateScore(lead);
    return {
      ...lead,
      score,
      reason,
      priority,
    };
  });
  
  // Sort by score (highest first) and take top N
  return scoredLeads
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function estimateContactTime(leadCount: number): string {
  const minutesPerLead = 1.2; // Average time to review and send
  const totalMinutes = Math.ceil(leadCount * minutesPerLead);
  
  if (totalMinutes < 60) {
    return `~${totalMinutes} min`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `~${hours}h ${minutes}m` : `~${hours}h`;
  }
}
