'use client';

import { useState } from 'react';
import { processStockAdjustment } from './actions';
import { useSession } from 'next-auth/react';
import { CheckCircle2 } from 'lucide-react';

export default function AdjustmentForm({ products, tenantId }: { products: any[], tenantId: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [productId, setProductId] = useState('');
  const [type, setType] = useState('ADD');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('Receiving');
  const [notes, setNotes] = useState('');

  const selectedProduct = products.find(p => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!productId || !quantity || Number(quantity) <= 0) {
      setError('Please select a product and enter a valid quantity.');
      setLoading(false);
      return;
    }

    const res = await processStockAdjustment(tenantId, {
      productId,
      type,
      quantity: Number(quantity),
      reason,
      notes,
      userId: session?.user?.id || 'unknown'
    });

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setQuantity('');
      setNotes('');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-emerald-50 text-emerald-700 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border border-emerald-100">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h3 className="text-xl font-black">Stock Adjusted Successfully</h3>
          <p className="text-sm font-medium opacity-80 mt-1">The inventory balances have been updated in real-time.</p>
        </div>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition"
        >
          Make Another Adjustment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold text-sm border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Product</label>
        <select 
          required
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-800"
        >
          <option value="" disabled>Search or select a product...</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} (Current: {p.stock} {p.unit})</option>
          ))}
        </select>
        {selectedProduct && (
          <p className="text-xs text-blue-600 font-bold mt-2">Current Stock: {selectedProduct.stock} {selectedProduct.unit}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Adjustment Type</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('ADD')}
              className={`py-2 rounded-xl font-bold text-sm transition-all ${type === 'ADD' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Add Stock (+)
            </button>
            <button
              type="button"
              onClick={() => setType('REMOVE')}
              className={`py-2 rounded-xl font-bold text-sm transition-all ${type === 'REMOVE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Remove Stock (-)
            </button>
          </div>
        </div>

        <div>
           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reason</label>
           <select 
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-800"
          >
            {type === 'ADD' ? (
              <>
                <option value="Receiving">New Shipment / Receiving</option>
                <option value="Return">Customer Return</option>
                <option value="Correction">Inventory Count Correction</option>
              </>
            ) : (
              <>
                <option value="Damage">Damaged Goods</option>
                <option value="Expiry">Expired Product</option>
                <option value="Theft">Shrinkage / Theft</option>
                <option value="Correction">Inventory Count Correction</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantity to Adjust</label>
        <div className="relative">
          <input 
            type="number"
            required
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-black text-2xl text-gray-900"
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
            {selectedProduct ? selectedProduct.unit : 'UNITS'}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Optional Notes</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-700"
          placeholder="e.g. Broken during transit from warehouse..."
          rows={3}
        />
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Confirm ${type === 'ADD' ? 'Addition' : 'Deduction'}`}
      </button>

    </form>
  );
}
