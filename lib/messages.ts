import OpenAI from 'openai';

type Lead = {
  name: string;
  notes: string | null;
  stage: string;
  source: string | null;
  lastContactDate: Date | null;
};

// Template-based fallback messages when no API key is available
function generateFallbackMessage(lead: Lead): string {
  const firstName = lead.name.split(' ')[0];
  const daysSince = lead.lastContactDate 
    ? Math.ceil((Date.now() - lead.lastContactDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  // Extract key details from notes if available
  const notes = lead.notes?.toLowerCase() || '';
  const mentionsBudget = notes.match(/\$[\d,]+k?/);
  const mentionsBedrooms = notes.match(/(\d+)[-\s]bed/);
  const mentionsTimeline = notes.includes('month') || notes.includes('spring') || notes.includes('summer');
  
  // Generate context-aware message based on stage and available info
  if (lead.stage === 'hot') {
    if (mentionsTimeline) {
      return `Hi ${firstName}! Just wanted to check in on your timeline. Are you still looking to move soon? I have some great options that just came on the market.`;
    }
    return `Hi ${firstName}! Wanted to touch base - have you had a chance to think about the properties we discussed? I'd love to help you move forward.`;
  }
  
  if (lead.stage === 'new') {
    return `Hi ${firstName}! Thanks for your interest. I'd love to learn more about what you're looking for. When would be a good time for a quick call this week?`;
  }
  
  if (daysSince && daysSince > 14) {
    if (mentionsBedrooms) {
      const beds = mentionsBedrooms[1];
      return `Hi ${firstName}! I know it's been a while. Just wanted to let you know several new ${beds}-bedroom properties hit the market this week. Would you like me to send over details?`;
    }
    return `Hi ${firstName}! Haven't heard from you in a bit. Checking in to see if you're still in the market? Happy to send over some new listings.`;
  }
  
  if (lead.stage === 'qualified' || lead.stage === 'warm') {
    if (mentionsBudget) {
      return `Hi ${firstName}! Quick update - saw a property in your price range that might be perfect. Want me to send you the details?`;
    }
    return `Hi ${firstName}! Just checking in. Let me know if you'd like to see any new listings or have questions about the market.`;
  }
  
  if (lead.stage === 'nurture') {
    return `Hi ${firstName}! Hope you're doing well. Just wanted to check if your timeline has firmed up at all? The market has been interesting lately - happy to catch you up anytime.`;
  }
  
  // Default message
  return `Hi ${firstName}! Hope you're doing well. Just wanted to check in and see how your home search is going. Let me know if I can help!`;
}

// AI-powered message generation
async function generateAIMessage(lead: Lead, apiKey: string): Promise<string> {
  try {
    const openai = new OpenAI({ apiKey });
    
    const prompt = `You are a professional real estate agent writing a brief, friendly follow-up text message to a lead.

Lead Details:
- Name: ${lead.name}
- Stage: ${lead.stage}
- Source: ${lead.source || 'Unknown'}
- Last contact: ${lead.lastContactDate ? `${Math.ceil((Date.now() - lead.lastContactDate.getTime()) / (1000 * 60 * 60 * 24))} days ago` : 'Never contacted'}
- Notes: ${lead.notes || 'No notes available'}

Write a personal, conversational text message (2-3 sentences max) that:
1. Uses their first name
2. References specific details from their notes when possible
3. Has a clear, easy next step
4. Feels genuine, not salesy
5. Is appropriate for their stage in the buying process

Keep it brief and casual - this is a text message, not an email. Do NOT use formal greetings or signatures. Just the message content.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a successful real estate agent known for authentic, personal communication. Write brief, friendly text messages.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content?.trim() || generateFallbackMessage(lead);
  } catch (error) {
    console.error('Error generating AI message:', error);
    return generateFallbackMessage(lead);
  }
}

export async function generateMessage(lead: Lead): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return generateFallbackMessage(lead);
  }
  
  return generateAIMessage(lead, apiKey);
}

export function isAIEnabled(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
