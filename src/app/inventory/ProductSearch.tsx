'use client';

import { Search } from 'lucide-react';

interface ProductSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Product Search</h3>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, SKU, or category..."
          className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-900"
        />
      </div>
    </div>
  );
}
