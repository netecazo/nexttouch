"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  updatedAt: Date | null;
};

type Activity = {
  id: string;
  type: string;
  message: string | null;
  createdAt: Date | null;
};

export default function LeadDetails({ lead: initialLead, activities }: { lead: Lead, activities: Activity[] }) {
  const [lead, setLead] = useState(initialLead);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone || '',
    email: lead.email || '',
    source: lead.source || '',
    stage: lead.stage,
    notes: lead.notes || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setEditing(false);
        router.refresh();
      } else {
        alert('Error updating lead');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating lead');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/leads');
      } else {
        alert('Error deleting lead');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting lead');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="mb-6">
        <Link href="/leads" className="text-green-700 hover:text-green-900 font-medium">
          ← Back to all leads
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{lead.name}</h1>
            <span 
              className="inline-block px-3 py-1 text-sm font-semibold rounded-full text-white"
              style={{ backgroundColor: stageColors[lead.stage] || '#9e9e9e' }}
            >
              {lead.stage.toUpperCase()}
            </span>
          </div>

          <div className="flex gap-2">
            {!editing && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="hot">Hot</option>
                  <option value="qualified">Qualified</option>
                  <option value="warm">Warm</option>
                  <option value="nurture">Nurture</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#0b5d4b' }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: lead.name,
                    phone: lead.phone || '',
                    email: lead.email || '',
                    source: lead.source || '',
                    stage: lead.stage,
                    notes: lead.notes || '',
                  });
                }}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-500">Phone</label>
                <p className="text-gray-900">{lead.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <p className="text-gray-900">{lead.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Source</label>
                <p className="text-gray-900">{lead.source || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Last Contact</label>
                <p className="text-gray-900">
                  {lead.lastContactDate 
                    ? new Date(lead.lastContactDate).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>

            {lead.notes && (
              <div>
                <label className="text-sm font-semibold text-gray-500">Notes</label>
                <p className="text-gray-900 mt-1 p-4 bg-gray-50 rounded-lg">{lead.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Log</h2>
        
        {activities.length === 0 ? (
          <p className="text-gray-500">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {activities.map(activity => (
              <div key={activity.id} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{activity.type}</p>
                    {activity.message && <p className="text-sm text-gray-600 mt-1">{activity.message}</p>}
                  </div>
                  <p className="text-xs text-gray-500">
                    {activity.createdAt 
                      ? new Date(activity.createdAt).toLocaleString()
                      : ''
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Lead?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {lead.name}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
