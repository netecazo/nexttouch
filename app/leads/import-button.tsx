"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

export default function ImportButton({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreview(results.data.slice(0, 5));
      },
      error: (error) => {
        alert('Error parsing CSV: ' + error.message);
      }
    });
  };

  const handleImport = async () => {
    const fileInput = document.getElementById('csv-file') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch('/api/leads/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leads: results.data }),
          });

          if (res.ok) {
            const data = await res.json();
            alert(`Successfully imported ${data.count} leads!`);
            setIsOpen(false);
            setPreview([]);
            router.refresh();
          } else {
            alert('Error importing leads');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error importing leads');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        alert('Error parsing CSV: ' + error.message);
        setLoading(false);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-lg font-semibold border-2 text-gray-700 hover:bg-gray-50 transition-colors"
        style={{ borderColor: '#0b5d4b', color: '#0b5d4b' }}
      >
        📁 Import CSV
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Leads from CSV</h2>
          <p className="text-sm text-gray-600">
            Expected columns: name, phone, email, source, stage, notes, lastContactDate
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose CSV file
            </label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Preview (first 5 rows):
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0]).slice(0, 7).map((key) => (
                        <th
                          key={key}
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).slice(0, 7).map((value: any, i) => (
                          <td key={i} className="px-3 py-2 text-sm text-gray-600">
                            {String(value).slice(0, 30)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleImport}
              disabled={loading || preview.length === 0}
              className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0b5d4b' }}
            >
              {loading ? 'Importing...' : `Import ${preview.length > 0 ? 'Leads' : ''}`}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setPreview([]);
              }}
              className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
