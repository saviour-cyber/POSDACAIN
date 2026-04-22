'use client';

import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

interface InventoryKPIsProps {
  stats: {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    inventoryValue: number;
  };
}

export default function InventoryKPIs({ stats }: InventoryKPIsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      sub: 'Active products',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount,
      sub: 'Need restocking',
      icon: TrendingDown,
      color: 'amber'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockCount,
      sub: 'Urgent attention',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Inventory Value',
      value: `KES ${stats.inventoryValue.toLocaleString()}`,
      sub: 'Total stock value',
      icon: DollarSign,
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest text-${card.color}-600 bg-${card.color}-50 px-2 py-1 rounded-lg`}>
              Update
            </div>
          </div>
          <div>
            <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{card.title}</h3>
            <p className="text-2xl font-black text-gray-900 leading-none mb-1">{card.value}</p>
            <p className="text-[10px] font-bold text-gray-400">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
