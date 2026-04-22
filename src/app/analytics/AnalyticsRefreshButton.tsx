'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyticsRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <button 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> 
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}
