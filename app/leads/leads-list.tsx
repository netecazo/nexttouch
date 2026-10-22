"use client";

import { useState } from "react";
import Link from "next/link";

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
};

export default function LeadsList({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [sortBy, setSortBy] = useState<'name' | 'stage' | 'lastContactDate' | 'createdAt'>('lastContactDate');
  const [filterStage, setFilterStage] = useState<string>('all');

  const stages = ['all', 'new', 'hot', 'qualified', 'warm', 'nurture', 'cold'];

  const filteredLeads = leads.filter(lead => 
    filterStage === 'all' || lead.stage === filterStage
  );

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'stage') {
      return a.stage.localeCompare(b.stage);
    }
    if (sortBy === 'lastContactDate') {
      const aDate = a.lastContactDate?.getTime() || 0;
      const bDate = b.lastContactDate?.getTime() || 0;
      return bDate - aDate;
    }
    if (sortBy === 'createdAt') {
      const aDate = a.createdAt?.getTime() || 0;
      const bDate = b.createdAt?.getTime() || 0;
      return bDate - aDate;
    }
    return 0;
  });

  const stageColors: Record<string, string> = {
    new: '#2196f3',
    hot: '#f44336',
    qualified: '#ff9800',
    warm: '#ffc107',
    nurture: '#4caf50',
    cold: '#9e9e9e',
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter:</label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="lastContactDate">Last Contact</option>
              <option value="createdAt">Date Added</option>
              <option value="name">Name</option>
              <option value="stage">Stage</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            Showing {sortedLeads.length} of {leads.length} leads
          </div>
        </div>
      </div>

      {sortedLeads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-xl text-gray-600 mb-2">No leads found</p>
          <p className="text-gray-500">
            {filterStage === 'all' 
              ? 'Add your first lead to get started' 
              : `No leads in ${filterStage} stage`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/leads/${lead.id}`}
                      className="font-medium text-gray-900 hover:text-green-700"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.phone && <div>{lead.phone}</div>}
                    {lead.email && <div className="text-xs">{lead.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-block px-2 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: stageColors[lead.stage] || '#9e9e9e' }}
                    >
                      {lead.stage.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.source || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.lastContactDate 
                      ? new Date(lead.lastContactDate).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/leads/${lead.id}`}
                      className="text-sm font-medium text-green-700 hover:text-green-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
