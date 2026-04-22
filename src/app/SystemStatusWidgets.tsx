'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, Clock, Calendar, Activity, Terminal, DatabaseBackup } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SystemStatusWidgets() {
  const router = useRouter();
  const [uptime, setUptime] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastBackup, setLastBackup] = useState('');

  // Start time recorded when the component mounts (simulating server uptime for the demo, 
  // or tracking real browser session uptime)
  const [startTime] = useState(Date.now() - (142 * 60 * 60 * 1000)); // Mocking 142 hours ago as initial boot

  useEffect(() => {
    // Generate a random recent backup time between 1 and 4 hours ago on mount
    const randomBackupHours = Math.floor(Math.random() * 3) + 1;
    setLastBackup(`${randomBackupHours} hour${randomBackupHours > 1 ? 's' : ''} ago`);

    const updateTime = () => {
      const now = new Date();
      
      // Format current date & ticking time
      setCurrentTime(now.toLocaleString('en-KE', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));

      // Calculate dynamic uptime
      const diffMs = now.getTime() - startTime;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setUptime(`${hours}h ${minutes}m`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate network sync request
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.refresh();
    setIsSyncing(false);
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">System Online</span>
          </div>
          
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          
          <div className="flex items-center gap-2 text-gray-500 font-mono">
            <Clock size={16} />
            <span className="text-sm font-bold tracking-tight">Uptime: {uptime}</span>
          </div>
          
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          
          <div className="flex items-center gap-2 text-gray-500 font-mono">
            <Calendar size={16} />
            <span className="text-sm font-bold tracking-tight">{currentTime}</span>
          </div>
        </div>

        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-black text-sm transition-all active:scale-95 ${isSyncing ? 'opacity-70 pointer-events-none' : ''}`}
        >
          <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync System'}
        </button>
      </div>

    </>
  );
}
