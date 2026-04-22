'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ShoppingCart,
  BarChart2,
  FileText,
  Search,
  RefreshCw,
  Package,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Filter,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  price: number;
  stock: number;
}

interface Stats {
  totalItems: number;
  criticalStock: number;
  lowStock: number;
  overstock: number;
  stockValue: number;
}

interface Props {
  products: Product[];
  stats: Stats;
  lastSync: string;
}

export default function StockControlClient({ products, stats, lastSync }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Items');
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    router.refresh();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku?.toLowerCase().includes(search.toLowerCase())) ||
      (p.category?.toLowerCase().includes(search.toLowerCase()));

    if (filter === 'Critical') return matchesSearch && p.stock === 0;
    if (filter === 'Low Stock') return matchesSearch && p.stock > 0 && p.stock <= 10;
    if (filter === 'Overstock') return matchesSearch && p.stock > 100;
    return matchesSearch;
  });

  const kpiCards = [
    {
      label: 'Total Items',
      sub: 'In inventory',
      value: stats.totalItems,
      icon: Package,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      label: 'Critical Stock',
      sub: 'Immediate attention',
      value: stats.criticalStock,
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'Low Stock',
      sub: 'Need reordering',
      value: stats.lowStock,
      icon: TrendingDown,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Overstock',
      sub: 'Consider promotion',
      value: stats.overstock,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  const actionButtons = [
    { label: 'Critical Alerts', icon: AlertTriangle, color: 'border-red-200 text-red-600 hover:bg-red-50', onClick: () => setFilter('Critical') },
    { label: 'Pending Orders', icon: ShoppingCart, color: 'border-orange-200 text-orange-600 hover:bg-orange-50', onClick: () => setFilter('Low Stock') },
    { label: 'Stock Analytics', icon: BarChart2, color: 'border-teal-200 text-teal-600 hover:bg-teal-50', onClick: () => setFilter('All Items') },
    { label: 'Stock Report', icon: FileText, color: 'border-blue-200 text-blue-600 hover:bg-blue-50', onClick: () => setFilter('All Items') },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Stock Control Center</h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">Comprehensive inventory and stock management</p>
          <p className="text-xs font-bold text-gray-400 mt-1">Last synced: {lastSync}</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95 self-start md:self-auto disabled:opacity-75 disabled:cursor-wait"
        >
          <RefreshCw size={16} className={`transition-all duration-300 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Stock"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">{k.label}</p>
              <div className={`w-8 h-8 ${k.bg} rounded-lg flex items-center justify-center`}>
                <k.icon size={16} className={k.color} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{k.value}</p>
            <p className="text-[11px] font-medium text-gray-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Stock Value */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Stock Value</p>
          <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
            <DollarSign size={16} className="text-teal-600" />
          </div>
        </div>
        <p className="text-3xl font-black text-teal-600">
          KES {stats.stockValue.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-[11px] font-medium text-gray-400 mt-1">Total inventory</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actionButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${btn.color}`}
          >
            <btn.icon size={20} />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-black text-[#008080] uppercase tracking-widest">Stock Search & Filter</h2>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or supplier..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-bold text-sm appearance-none"
            >
              <option>All Items</option>
              <option>Critical</option>
              <option>Low Stock</option>
              <option>Overstock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Items Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="text-sm font-black text-[#008080] uppercase tracking-widest">
            Stock Items ({filtered.length})
          </h2>
          <p className="text-[11px] font-medium text-gray-400 mt-0.5">Detailed inventory management and control</p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No stock items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4 text-right">Price</th>
                  <th className="px-5 py-4 text-right">Stock</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const isCritical = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const isOver = p.stock > 100;

                  const statusLabel = isCritical
                    ? 'Out of Stock'
                    : isLow
                    ? 'Low Stock'
                    : isOver
                    ? 'Overstock'
                    : 'In Stock';

                  const statusColor = isCritical
                    ? 'bg-red-50 text-red-600'
                    : isLow
                    ? 'bg-orange-50 text-orange-600'
                    : isOver
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-emerald-50 text-emerald-600';

                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-black text-gray-900 text-sm">{p.name}</p>
                        {p.sku && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">SKU: {p.sku}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-2 py-1 rounded-lg uppercase">
                          {p.category || 'General'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-gray-800 text-sm">
                        KES {p.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right font-black text-gray-900 text-sm">{p.stock}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
