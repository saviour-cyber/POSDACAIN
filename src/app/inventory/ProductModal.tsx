'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { addProduct } from './actions';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ isOpen, onClose }: ProductModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addProduct(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Add New Product</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Enter the details of the new item</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Product Name</label>
              <input 
                name="name"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                placeholder="e.g. Premium Coffee Beans"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">SKU / Barcode</label>
              <input 
                name="sku"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                placeholder="SKU-001"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
              <select 
                name="category"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-bold text-sm appearance-none"
              >
                <option value="General">General</option>
                <option value="Food">Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Price (KES)</label>
              <input 
                name="price"
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Initial Stock</label>
              <input 
                name="stock"
                type="number"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-bold text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 bg-[#008080] text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-teal-500/20 hover:bg-[#006666] active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? 'Adding...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
