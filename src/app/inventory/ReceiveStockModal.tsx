'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Search, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  CreditCard,
  Building2,
  Receipt
} from 'lucide-react';
import { getSuppliers, receiveStockBatch, getInventoryData } from './actions';

interface Item {
  productId: string;
  name: string;
  quantity: number;
  cost: number;
}

export default function ReceiveStockModal({ onClose }: { onClose: () => void }) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [totalBill, setTotalBill] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [payInFull, setPayInFull] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function init() {
      const [sData, pData] = await Promise.all([getSuppliers(), getInventoryData()]);
      setSuppliers(sData);
      setProducts(pData.products);
    }
    init();
  }, []);

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + (item.quantity * item.cost), 0);
    setTotalBill(total);
    if (payInFull) setPaidAmount(total);
  }, [items, payInFull]);

  function addItem(product: any) {
    if (items.find(i => i.productId === product.id)) return;
    setItems([...items, { productId: product.id, name: product.name, quantity: 1, cost: product.cost || 0 }]);
  }

  function removeItem(id: string) {
    setItems(items.filter(i => i.productId !== id));
  }

  function updateItem(id: string, field: 'quantity' | 'cost', value: number) {
    setItems(items.map(i => i.productId === id ? { ...i, [field]: value } : i));
  }

  async function handleSubmit() {
    if (!selectedSupplier) return setError('Please select a supplier');
    if (items.length === 0) return setError('Please add at least one item');
    
    setLoading(true);
    setError('');

    try {
      const result = await receiveStockBatch({
        supplierId: selectedSupplier,
        items,
        totalBill,
        paidAmount: payInFull ? totalBill : paidAmount
      });

      if (result.success) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process restock');
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-none">Receive New Stock</h2>
              <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Inward Goods & Supply Management</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">1. Select Supplier</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-3xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-teal-50 outline-none transition-all font-bold appearance-none"
                >
                  <option value="">Choose Supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">2. Find Products</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Scan barcode or search name..."
                  className="w-full pl-12 pr-4 py-4 rounded-3xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-teal-50 outline-none transition-all font-bold"
                />
              </div>

              {search && (
                <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {filteredProducts.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => { addItem(p); setSearch(''); }}
                      className="w-full p-4 flex items-center justify-between hover:bg-teal-50 transition-all border-b border-gray-50 last:border-0"
                    >
                      <div className="text-left">
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.sku || 'No SKU'}</p>
                      </div>
                      <Plus size={18} className="text-teal-500" />
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm font-bold">No items found</div>
                  ) }
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
          </div>

          {/* Right Column: List & Totals */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gray-50 rounded-[2rem] p-6 min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Stocking List</h3>
                <span className="text-[10px] font-black bg-teal-100 text-teal-700 px-2 py-1 rounded-md">{items.length} Items</span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50 space-y-4 py-12">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="font-bold uppercase tracking-widest text-xs">Waiting for items...</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.productId} className="bg-white p-4 rounded-2xl flex items-center gap-4 group">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-black text-gray-400">QTY</span>
                            <input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.productId, 'quantity', Number(e.target.value))}
                              className="w-12 bg-transparent text-xs font-black text-gray-900 outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-black text-gray-400">COST</span>
                            <input 
                              type="number"
                              value={item.cost}
                              onChange={(e) => updateItem(item.productId, 'cost', Number(e.target.value))}
                              className="w-16 bg-transparent text-xs font-black text-gray-900 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <p className="font-black text-gray-900 text-sm">KES {(item.quantity * item.cost).toLocaleString()}</p>
                        <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-500 font-bold">Total Bill Amount</p>
                  <p className="text-2xl font-black text-gray-900 underline decoration-teal-500 decoration-4">KES {totalBill.toLocaleString()}</p>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-teal-600" size={20} />
                    <div>
                      <h4 className="text-sm font-bold">Paid in Full?</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Add to your supplier debt if partial</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPayInFull(!payInFull)}
                    className={`w-14 h-8 rounded-full transition-all relative ${payInFull ? 'bg-teal-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${payInFull ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {!payInFull && (
                  <div className="mt-4 animate-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount Paid to Supplier</label>
                    <div className="relative">
                      <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="number"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-100 bg-orange-50/20 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-black text-orange-600"
                        placeholder="0.00"
                      />
                    </div>
                    {totalBill - paidAmount > 0 && (
                      <p className="mt-2 text-xs font-bold text-orange-600 flex items-center gap-2">
                        <AlertCircle size={14} /> Debt to be added: KES {(totalBill - paidAmount).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
            className="px-12 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <CheckCircle2 size={18} />}
            Process Reception
          </button>
        </div>
      </div>
    </div>
  );
}
