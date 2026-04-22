'use client';

import { useEffect, useState } from 'react';
// import { getStockStats } from '@/app/inventory/actions';
import { Package, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export default function StockWidget() {
  const [stats, setStats] = useState<any>({
    totalItems: 0,
    stockValue: 0,
    criticalStock: 0,
    lowStock: 0,
    overstock: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getStockStats().then(data => {
    //   setStats(data);
    //   setLoading(false);
    // });
  }, []);

  if (loading) {
    return (
      <div className="mb-4 p-4 bg-gray-50 rounded-2xl animate-pulse flex flex-col gap-3 border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-gray-200 rounded-xl"></div>
          <div className="h-10 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="space-y-2 mt-1">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <a href="/inventory/dashboard" className="block mb-4 p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl shadow-sm hover:shadow-md hover:border-teal-200 transition-all group cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-teal-900 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-teal-700 transition-colors">
          <Activity size={14} className="text-teal-500" />
          Stock Control
        </h3>
        <span className="text-[9px] font-bold text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded uppercase">Sync</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white p-2.5 rounded-xl border border-teal-50 shadow-sm flex flex-col justify-center">
          <p className="text-[9px] font-bold text-gray-500 uppercase">Total Items</p>
          <p className="text-sm font-black text-gray-900">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-teal-50 shadow-sm flex flex-col justify-center">
          <p className="text-[9px] font-bold text-gray-500 uppercase">Stock Value</p>
          <p className="text-sm font-black text-teal-600 truncate" title={`KES ${stats.stockValue.toLocaleString()}`}>
            {stats.stockValue > 1000000 ? `${(stats.stockValue / 1000000).toFixed(1)}M` : stats.stockValue > 1000 ? `${(stats.stockValue / 1000).toFixed(1)}k` : stats.stockValue}
          </p>
        </div>
      </div>

      <div className="space-y-2 bg-white p-2.5 rounded-xl border border-teal-50 shadow-sm">
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-red-500 flex items-center gap-1.5"><AlertTriangle size={12} /> Critical Stock</span>
          <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100">{stats.criticalStock}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-orange-500 flex items-center gap-1.5"><TrendingUp size={12} className="rotate-180" /> Low Stock</span>
          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md border border-orange-100">{stats.lowStock}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-emerald-500 flex items-center gap-1.5"><TrendingUp size={12} /> Overstock</span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">{stats.overstock}</span>
        </div>
      </div>
    </a>
  );
}
