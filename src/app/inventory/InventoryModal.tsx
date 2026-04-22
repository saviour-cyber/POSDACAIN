'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { addProduct, updateProduct } from './actions';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  price: number;
  stock: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function InventoryModal({ isOpen, onClose, product }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await addProduct(formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-gray-900">{product ? "Edit Product" : "Add New Product"}</h3>
            <p className="text-[11px] font-medium text-gray-400 mt-0.5">{product ? "Update product details below" : "Enter product details below"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name *</label>
            <input
              name="name"
              required
              defaultValue={product?.name || ''}
              placeholder="e.g. Premium Coffee Beans"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-medium text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</label>
              <input
                name="sku"
                defaultValue={product?.sku || ''}
                placeholder="SKU-001"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
              <select
                name="category"
                defaultValue={product?.category || 'General'}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-medium text-sm appearance-none"
              >
                <option value="General">General</option>
                <option value="Food">Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (KES) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product?.price || ''}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Qty *</label>
              <input
                name="stock"
                type="number"
                required
                defaultValue={product?.stock || ''}
                placeholder="0"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-xl outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all border border-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 bg-[#008080] text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-teal-500/20 hover:bg-[#006666] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
