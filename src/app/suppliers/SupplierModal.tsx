'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Package,
  Search,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { createSupplier, updateSupplier, linkProductsToSupplier } from './actions';
import { getInventoryData } from '../inventory/actions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any; // If editing
}

export default function SupplierModal({ isOpen, onClose, supplier }: Props) {
  const [tab, setTab] = useState<'info' | 'financials' | 'products'>('info');
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [name, setName] = useState(supplier?.name || '');
  const [contactName, setContactName] = useState(supplier?.contactName || '');
  const [isVatRegistered, setIsVatRegistered] = useState(!!supplier?.kraPin);
  const [kraPin, setKraPin] = useState(supplier?.kraPin || '');
  
  // Logistics
  const [phone, setPhone] = useState(supplier?.phone || '');
  const [email, setEmail] = useState(supplier?.email || '');
  const [address, setAddress] = useState(supplier?.address || '');
  
  // Financials
  const [paymentTerms, setPaymentTerms] = useState(supplier?.paymentTerms || 'Cash');
  const [openingBalance, setOpeningBalance] = useState(0);

  // Products Linkage
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [prodSearch, setProdSearch] = useState('');

  useEffect(() => {
    async function fetchProds() {
      const data = await getInventoryData();
      setAllProducts(data.products);
      if (supplier) {
        // Find products already linked to this supplier
        const linked = data.products.filter((p: any) => p.supplierId === supplier.id).map((p: any) => p.id);
        setSelectedProductIds(linked);
      }
    }
    if (isOpen) fetchProds();
  }, [isOpen, supplier]);

  if (!isOpen) return null;

  async function handleSubmit() {
    setLoading(true);
    try {
      const data = {
        name,
        contactName,
        kraPin: isVatRegistered ? kraPin : null,
        phone,
        email,
        address,
        paymentTerms,
        totalOwed: openingBalance || supplier?.totalOwed || 0
      };

      let currentSupplierId = supplier?.id;

      if (supplier) {
        await updateSupplier(supplier.id, data);
      } else {
        const result = await createSupplier(data);
        currentSupplierId = result.supplier.id;
      }

      // Link products
      await linkProductsToSupplier(currentSupplierId, selectedProductIds);

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
    p.sku?.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-none">{supplier ? 'Edit Supplier' : 'Register New Supplier'}</h2>
              <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Vendor Profile & Terms</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-900 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 py-2 bg-gray-50 border-b border-gray-100">
          {[
            { id: 'info', label: 'Basic Info', icon: Building2 },
            { id: 'financials', label: 'Financials', icon: CreditCard },
            { id: 'products', label: 'Supplied Items', icon: Package },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${tab === t.id ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400'}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {tab === 'info' && (
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Legal Company Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold transition-all" placeholder="Horizon Wholesale LTD" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Person</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold transition-all" placeholder="John Doe" />
                </div>
              </div>

              <div className="p-6 bg-teal-50/50 rounded-3xl border border-teal-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-teal-900">VAT Registered?</h4>
                  <p className="text-[10px] font-bold text-teal-600 mt-0.5">Required for Kenyan tax compliance</p>
                </div>
                <button onClick={() => setIsVatRegistered(!isVatRegistered)} className={`w-14 h-8 rounded-full transition-all relative ${isVatRegistered ? 'bg-teal-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isVatRegistered ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {isVatRegistered && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KRA PIN Number</label>
                   <input value={kraPin} onChange={e => setKraPin(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-orange-500 outline-none font-black text-orange-600 transition-all" placeholder="P051XXXXXXX" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold transition-all" placeholder="+254..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold transition-all" placeholder="orders@supplier.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Physical Address / Warehouse
                </label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold transition-all h-24" placeholder="Street name, Building, City..." />
              </div>
            </div>
          )}

          {tab === 'financials' && (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Terms</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Cash', 'Net 7', 'Net 30'].map(term => (
                      <button 
                        key={term}
                        onClick={() => setPaymentTerms(term)}
                        className={`py-4 rounded-2xl font-black text-xs uppercase transition-all border-2 ${paymentTerms === term ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="p-8 bg-rose-50/50 rounded-[2rem] border border-rose-100 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-black text-rose-900">Initial Opening Balance</h4>
                    <p className="text-[10px] font-bold text-rose-600 mt-1 uppercase tracking-widest">How much do you owe them right now?</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-rose-300">KES</span>
                    <input 
                      type="number"
                      value={openingBalance}
                      onChange={e => setOpeningBalance(Number(e.target.value))}
                      className="w-full pl-16 pr-5 py-5 bg-white rounded-2xl border-transparent focus:border-rose-300 outline-none font-black text-2xl text-rose-600 shadow-sm"
                      placeholder="0.00"
                    />
                  </div>
               </div>

               <div className="flex items-center gap-3 p-6 bg-gray-50 rounded-2xl">
                  <AlertCircle size={20} className="text-gray-400" />
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">Financial history and total debt will be updated automatically during "Receive Stock" workflows.</p>
               </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    value={prodSearch}
                    onChange={e => setProdSearch(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold transition-all" 
                    placeholder="Search your inventory to link items..." 
                  />
               </div>

               <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {filteredProducts.map(p => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <button 
                        key={p.id}
                        onClick={() => toggleProduct(p.id)}
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="text-left">
                          <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase">SKU: {p.sku || 'N/A'}</p>
                        </div>
                        {isSelected ? <CheckCircle2 className="text-teal-600" size={20} /> : <PlusCircle className="text-gray-200" size={20} />}
                      </button>
                    );
                  })}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all">Cancel</button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !name}
            className="px-12 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={18} />}
            {supplier ? 'Save Changes' : 'Complete Registration'}
          </button>
        </div>
      </div>
    </div>
  );
}
