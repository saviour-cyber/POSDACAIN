'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Wallet,
  ShoppingBag,
  ArrowUpRight,
  PackageCheck,
  ChevronRight,
  Loader2,
  XCircle,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { getSmartRestockList, getSuppliers, processBulkRestock } from '../inventory/actions';
import DashboardShell from '@/components/layout/DashboardShell';
import Link from 'next/link';
import PaySupplierModal from './PaySupplierModal';

export default function ProcurementPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Modal State
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const [aData, sData] = await Promise.all([getSmartRestockList(), getSuppliers()]);
      setAlerts(aData);
      setSuppliers(sData);
      setLoading(false);
    }
    init();
  }, [isPayModalOpen]);

  const totalInvestment = alerts.reduce((acc, a) => acc + a.estimatedCost, 0);
  const totalOwed = suppliers.reduce((acc, s) => acc + s.totalOwed, 0);

  async function handleAcceptAll() {
    if (alerts.length === 0) return;
    
    // Filter items with suppliers
    const validItems = alerts.filter(a => !!a.supplierId);
    if (validItems.length === 0) {
       return alert('No items found with linked suppliers. Please link products to vendors in the Supplier Registry first.');
    }

    if (!confirm(`Process ALL suggestions? \n\nTotal Items: ${alerts.length}\nItems to Process: ${validItems.length}\nSkipped (No Supplier): ${alerts.length - validItems.length}\n\nEstimated investment of KES ${totalInvestment.toLocaleString()} will be added to your account balances.`)) {
       return;
    }
    
    setProcessing(true);
    try {
      const result = await processBulkRestock(validItems);
      
      if (result.success) {
        // Force refresh data
        const [aData, sData] = await Promise.all([getSmartRestockList(), getSuppliers()]);
        setAlerts(aData);
        setSuppliers(sData);
        
        alert(`Procurement Complete! \n✅ Processed: ${result.processed}\n⚠️ Skipped: ${result.skipped}\n❌ Errors: ${result.errors}`);
      }
    } catch (err) {
      alert('A critical error occurred while communicating with the server.');
    } finally {
      setProcessing(false);
    }
  }

  const openPayModal = (s: any) => {
    setSelectedSupplier(s);
    setIsPayModalOpen(true);
  };

  return (
    <DashboardShell>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-gray-200">
                <ShoppingBag size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Procurement Console</h1>
                <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                   Digital Supply Chain Hub <span className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" />
                </p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleAcceptAll}
               disabled={alerts.length === 0 || processing}
               className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center gap-3 active:scale-95 group"
             >
               {processing ? <Loader2 size={18} className="animate-spin" /> : <PackageCheck size={20} className="group-hover:rotate-12 transition-transform" />}
               Accept All Suggestions
             </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-gray-900 group-hover:scale-110 transition-transform"><AlertTriangle size={80} /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-orange-500" /> Stock Alerts
              </p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{alerts.length} <span className="text-sm font-bold text-gray-400">Items</span></h3>
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-teal-600 group-hover:scale-110 transition-transform"><TrendingUp size={80} /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <TrendingUp size={14} className="text-teal-500" /> Capital Needed
              </p>
              <h3 className="text-4xl font-black text-teal-600 tracking-tighter">
                <span className="text-xl mr-1">KES</span>{totalInvestment.toLocaleString()}
              </h3>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-rose-600 group-hover:scale-110 transition-transform"><Wallet size={80} /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Wallet size={14} className="text-rose-500" /> Supplier Balances
              </p>
              <h3 className="text-4xl font-black text-rose-600 tracking-tighter">
                <span className="text-xl mr-1">KES</span>{totalOwed.toLocaleString()}
              </h3>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Runway Alerts Table */}
           <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-fit">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <ShoppingBag size={20} className="text-gray-900" />
                    <h3 className="text-lg font-black text-gray-900">Purchase Suggestions</h3>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-3 py-1 rounded-full uppercase">Near Out-of-stock</span>
                    <HelpCircle size={14} className="text-gray-300" />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50/50">
                          <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product & Supplier</th>
                          <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                          <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Order Qty</th>
                          <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Est. Cost</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {loading ? (
                         Array.from({ length: 3 }).map((_, i) => (
                           <tr key={i} className="animate-pulse">
                              <td colSpan={4} className="p-6"><div className="h-10 bg-gray-50 rounded-2xl w-full" /></td>
                           </tr>
                         ))
                       ) : alerts.length === 0 ? (
                         <tr>
                            <td colSpan={4} className="p-24 text-center">
                               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <CheckCircle2 size={40} />
                               </div>
                               <h4 className="text-xl font-black text-gray-900">Everything is in Stock!</h4>
                               <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Check back later for replenishment alerts</p>
                            </td>
                         </tr>
                       ) : (
                         alerts.map(a => (
                           <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="p-6">
                                 <p className="font-black text-gray-900 text-sm group-hover:text-teal-600 transition-colors">{a.name}</p>
                                 <div className="flex items-center gap-2 mt-1.5">
                                    {a.supplier ? (
                                       <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                          <Building2 size={10} /> {a.supplier.name}
                                       </div>
                                    ) : (
                                       <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-black text-rose-500 uppercase tracking-tighter">
                                          <XCircle size={10} /> No Supplier Linked
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="p-6 text-center">
                                 <div className="inline-flex items-center justify-center p-2 bg-gray-50 rounded-xl gap-2 font-black text-[10px]">
                                    <span className="text-orange-600">{a.stock}</span>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-gray-400">{a.targetStockLevel}</span>
                                 </div>
                              </td>
                              <td className="p-6 text-right">
                                 <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-xs font-black ring-1 ring-teal-100">
                                    +{a.suggestedOrder} <span className="opacity-50 ml-0.5">{a.unit || 'PCS'}</span>
                                 </span>
                              </td>
                              <td className="p-6 text-right text-sm font-black text-gray-900">
                                 KES {a.estimatedCost.toLocaleString()}
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Supplier Balances List */}
           <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                 <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-lg font-black text-gray-900">Direct Settlement</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Vendor Credit Management</p>
                 </div>
                 <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
                    {suppliers.filter(s => s.totalOwed > 0).length === 0 ? (
                      <div className="py-20 text-center text-gray-300">
                         <Wallet size={48} className="mx-auto mb-4 opacity-20" strokeWidth={1} />
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Account balances are cleared</p>
                      </div>
                    ) : (
                      suppliers.filter(s => s.totalOwed > 0).map(s => (
                        <div key={s.id} className="bg-white p-6 rounded-3xl group shadow-sm hover:shadow-xl transition-all border border-gray-50 hover:border-gray-200">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                 <div className="flex items-center gap-2">
                                    <p className="font-black text-gray-900 text-sm leading-tight group-hover:text-teal-600 transition-colors">{s.name}</p>
                                    <span className="text-[8px] font-black bg-gray-900 text-white px-1 rounded">{s.code}</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{s.phone || 'Contact Missing'}</p>
                              </div>
                              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                 <ArrowUpRight size={18} />
                              </div>
                           </div>
                           <div className="flex items-end justify-between pt-4 border-t border-gray-50/50">
                              <div>
                                 <p className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1"><Wallet size={10} /> Bal. Due</p>
                                 <p className="text-xl font-black text-rose-600 tracking-tighter">KES {s.totalOwed.toLocaleString()}</p>
                              </div>
                              <button 
                                onClick={() => openPayModal(s)}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-100 flex items-center gap-2 active:scale-95"
                              >
                                 Pay now
                              </button>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
                 
                 <div className="p-8 border-t border-gray-50 bg-teal-50 mt-auto">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2 flex items-center gap-2"><CreditCard size={14} /> Total Payables</p>
                    <h4 className="text-3xl font-black text-teal-900">KES {totalOwed.toLocaleString()}</h4>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <PaySupplierModal 
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        supplier={selectedSupplier}
      />
    </DashboardShell>
  );
}
