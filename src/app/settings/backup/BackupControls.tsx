'use client';

import { useState } from 'react';
import { DownloadCloud, CheckCircle } from 'lucide-react';

export default function BackupControls({ tenantId }: { tenantId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/backup');
      
      if (!response.ok) throw new Error('Backup failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dacainsystems_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert('Failed to process backup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <button 
        onClick={handleDownload}
        disabled={loading}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 border border-black hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-xs disabled:opacity-50"
      >
        <DownloadCloud size={18} />
        {loading ? 'Generating Backup...' : 'Download JSON Snapshot'}
      </button>

      {success && (
        <span className="text-emerald-600 font-bold text-sm flex items-center gap-2">
          <CheckCircle size={16} /> Secure Backup Downloaded
        </span>
      )}
    </div>
  );
}
