"use client";

import { useState, useEffect } from "react";
import type { ScoredLead } from "@/lib/scoring";

type LeadWithMessage = ScoredLead & {
  draftMessage?: string;
  loading?: boolean;
};

export default function TodaysList({ leads, userId }: { leads: ScoredLead[], userId: string }) {
  const [leadsWithMessages, setLeadsWithMessages] = useState<LeadWithMessage[]>(
    leads.map(lead => ({ ...lead, loading: true }))
  );

  useEffect(() => {
    // Fetch draft messages for all leads
    async function fetchMessages() {
      const promises = leads.map(async (lead) => {
        try {
          const res = await fetch('/api/generate-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId: lead.id }),
          });
          const data = await res.json();
          return { ...lead, draftMessage: data.message, loading: false };
        } catch (error) {
          console.error('Error fetching message:', error);
          return { ...lead, draftMessage: `Hi ${lead.name.split(' ')[0]}! Just checking in - how can I help with your home search?`, loading: false };
        }
      });

      const results = await Promise.all(promises);
      setLeadsWithMessages(results);
    }

    fetchMessages();
  }, [leads]);

  return (
    <div className="space-y-4">
      {leadsWithMessages.map((lead, index) => (
        <LeadCard 
          key={lead.id} 
          lead={lead} 
          index={index} 
          userId={userId}
          onUpdate={(updatedLead) => {
            setLeadsWithMessages(prev => 
              prev.filter(l => l.id !== lead.id)
            );
          }}
        />
      ))}
    </div>
  );
}

function LeadCard({ 
  lead, 
  index, 
  userId,
  onUpdate 
}: { 
  lead: LeadWithMessage, 
  index: number, 
  userId: string,
  onUpdate: (lead: LeadWithMessage) => void 
}) {
  const [message, setMessage] = useState(lead.draftMessage || '');
  const [editing, setEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (lead.draftMessage && !message) {
      setMessage(lead.draftMessage);
    }
  }, [lead.draftMessage, message]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      // Mark as contacted
      await fetch('/api/leads/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leadId: lead.id, 
          message,
          type: 'text'
        }),
      });

      // Try to open SMS link if phone available
      if (lead.phone) {
        const phoneDigits = lead.phone.replace(/\D/g, '');
        const smsLink = `sms:${phoneDigits}?body=${encodeURIComponent(message)}`;
        window.open(smsLink, '_blank');
      } else {
        // Copy to clipboard
        navigator.clipboard.writeText(message);
        alert('Message copied to clipboard!');
      }

      onUpdate(lead);
    } catch (error) {
      console.error('Error approving message:', error);
      alert('Error processing approval. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/leads/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      });
      onUpdate(lead);
    } catch (error) {
      console.error('Error skipping lead:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const priorityColors = {
    urgent: { bg: '#fee', border: '#f44336', text: '#d32f2f' },
    high: { bg: '#fef3cd', border: '#f2994a', text: '#e67e22' },
    medium: { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' },
    low: { bg: '#f5f5f5', border: '#9e9e9e', text: '#616161' },
  };

  const colors = priorityColors[lead.priority];

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border-l-4 p-6 transition-all hover:shadow-md"
      style={{ borderLeftColor: colors.border }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-gray-400 font-medium">#{index + 1}</span>
            <h3 className="text-xl font-bold text-gray-900">{lead.name}</h3>
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.bg, 
                color: colors.text 
              }}
            >
              {lead.stage.toUpperCase()}
            </span>
          </div>
          
          <div className="flex gap-4 text-sm text-gray-600 mb-2">
            {lead.phone && <span>📱 {lead.phone}</span>}
            {lead.email && <span>📧 {lead.email}</span>}
            {lead.source && <span>🔗 {lead.source}</span>}
          </div>

          <div 
            className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {lead.reason}
          </div>

          {lead.notes && (
            <details className="mt-3">
              <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                View notes
              </summary>
              <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded-lg">
                {lead.notes}
              </p>
            </details>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-gray-700">
            {editing ? 'Edit your message:' : 'Draft message:'}
          </label>
          {!lead.loading && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
          )}
        </div>
        
        {lead.loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            <span className="text-sm">Drafting message...</span>
          </div>
        ) : editing ? (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
          />
        ) : (
          <p className="text-gray-900 italic">&ldquo;{message}&rdquo;</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={actionLoading || lead.loading}
          className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0b5d4b' }}
        >
          {actionLoading ? 'Processing...' : lead.phone ? '✓ Approve & Send' : '✓ Approve & Copy'}
        </button>
        
        {editing && (
          <button
            onClick={() => {
              setEditing(false);
              setMessage(lead.draftMessage || '');
            }}
            className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        
        <button
          onClick={handleSkip}
          disabled={actionLoading}
          className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
