'use client';

import { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, XCircle, DollarSign, Truck } from 'lucide-react';
import InventoryModal from './InventoryModal';
import ReceiveStockModal from './ReceiveStockModal';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  price: number;
  stock: number;
}

interface Stats {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  inventoryValue: number;
}

interface Props {
  products: Product[];
  stats: Stats;
}

export default function InventoryClient({ products, stats }: Props) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku?.toLowerCase().includes(search.toLowerCase())) ||
    (p.category?.toLowerCase().includes(search.toLowerCase()))
  );

  const kpis = [
    {
      label: 'Total Products',
      sub: 'Active products',
      value: stats.totalProducts,
      icon: Package,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
    },
    {
      label: 'Low Stock Alerts',
      sub: 'Need restocking',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'Out of Stock',
      sub: 'Urgent attention',
      value: stats.outOfStockCount,
      icon: XCircle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
    },
    {
      label: 'Inventory Value',
      sub: 'Total stock value',
      value: `KES ${stats.inventoryValue.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      large: true,
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">Manage your products and stock levels</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setIsReceiveModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-sm transition-all shadow-lg active:scale-95"
          >
            <Truck size={18} />
            Receive Stock
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500">{k.label}</p>
              <div className={`w-8 h-8 ${k.iconBg} rounded-lg flex items-center justify-center`}>
                <k.icon size={16} className={k.iconColor} />
              </div>
            </div>
            <p className={`font-black text-gray-900 leading-tight ${k.large ? 'text-xl' : 'text-2xl'}`}>
              {k.value}
            </p>
            <p className="text-[11px] font-medium text-gray-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Product Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="text-base font-black text-gray-900">Product Search</h2>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or category..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-medium text-sm"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="text-base font-black text-gray-900">Products ({filtered.length})</h2>
          <p className="text-[11px] font-medium text-gray-400 mt-0.5">Manage your inventory and stock levels</p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm font-bold text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4 text-right">Price (KES)</th>
                  <th className="px-5 py-4 text-right">Stock</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const isOut = p.stock <= 0;
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const status = isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock';
                  const statusColor = isOut
                    ? 'bg-red-50 text-red-600'
                    : isLow
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-emerald-50 text-emerald-600';

                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-black text-gray-900 text-sm">{p.name}</p>
                        {p.sku && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase">SKU: {p.sku}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-2 py-1 rounded-lg uppercase">
                          {p.category || 'General'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-gray-800 text-sm">
                        {p.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right font-black text-gray-900 text-sm">{p.stock}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${statusColor}`}>
                          {status}
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

      <InventoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {isReceiveModalOpen && <ReceiveStockModal onClose={() => setIsReceiveModalOpen(false)} />}
    </div>
  );
}
