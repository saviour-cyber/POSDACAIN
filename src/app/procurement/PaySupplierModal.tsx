'use client';

import { useState } from 'react';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  Loader2, 
  CreditCard,
  Building2,
  AlertCircle
} from 'lucide-react';
import { recordSupplierPayment } from '../suppliers/actions';

interface PaySupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: {
    id: string;
    name: string;
    totalOwed: number;
  } | null;
}

export default function PaySupplierModal({ isOpen, onClose, supplier }: PaySupplierModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState('MOBILE_MONEY');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !supplier) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) return alert('Please enter a valid amount');
    if (payAmount > supplier!.totalOwed) {
       if (!confirm(`You are paying more than the outstanding balance (KES ${supplier!.totalOwed}). Proceed?`)) return;
    }

    setLoading(true);
    try {
      await recordSupplierPayment(supplier!.id, payAmount);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onClose();
      }, 2000);
    } catch (err) {
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Wallet size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-gray-900 leading-tight">Record Vendor Payment</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Clearing outstanding debt</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-20 text-center animate-in zoom-in duration-500">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
                <CheckCircle2 size={40} />
             </div>
             <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Recorded!</h3>
             <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Updating supplier balances...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Supplier Quick Info */}
            <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
               <div className="flex items-center gap-3 mb-4 opacity-50 uppercase tracking-widest font-black text-[10px]">
                  <Building2 size={12} /> Supplier Profile
               </div>
               <h4 className="text-xl font-black mb-1">{supplier.name}</h4>
               <div className="flex items-center justify-between mt-4 p-4 bg-white/10 rounded-2xl">
                  <span className="text-xs font-bold opacity-80">Current Balance</span>
                  <span className="text-lg font-black tracking-tight">KES {supplier.totalOwed.toLocaleString()}</span>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Amount (KES)</label>
                  <input 
                    autoFocus
                    required
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter amount to pay..."
                    className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-white outline-none transition-all font-black text-xl text-gray-900"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'MOBILE_MONEY', label: 'M-Pesa / Mobile', icon: CreditCard, color: 'emerald' },
                    { id: 'CASH', label: 'Cash Payment', icon: Wallet, color: 'blue' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                        method === m.id 
                          ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                      }`}
                    >
                       <m.icon size={20} className={method === m.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
               <button 
                 disabled={loading}
                 className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
               >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                 Confirm Payment
               </button>
               <button 
                 type="button"
                 onClick={onClose}
                 className="w-full py-4 bg-white text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-all"
               >
                 Cancel / Go Back
               </button>
            </div>
            
            <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
               <AlertCircle size={12} /> This will reduce the outstanding balance in real-time
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
