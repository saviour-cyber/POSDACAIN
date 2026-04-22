'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Package,
  Wallet,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { getSuppliers, deleteSupplier } from './actions';
import SupplierModal from './SupplierModal';
import DashboardShell from '@/components/layout/DashboardShell';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const data = await getSuppliers();
      setSuppliers(data);
      setLoading(false);
    }
    init();
  }, [isModalOpen]);

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.contactName?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
      await deleteSupplier(id);
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center shadow-sm">
                <Building2 size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Supplier Registry</h1>
                <p className="text-sm font-medium text-gray-400 mt-1">Manage your supply chain and vendor financial balances</p>
             </div>
          </div>
          <button 
            onClick={() => { setSelectedSupplier(null); setIsModalOpen(true); }}
            className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center gap-2 active:scale-95"
          >
            <Plus size={18} />
            Register Supplier
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: 'Total Suppliers', value: suppliers.length, sub: 'Active partners', color: 'gray' },
             { label: 'Total Debt', value: `KES ${suppliers.reduce((acc, s) => acc + s.totalOwed, 0).toLocaleString()}`, sub: 'Outstanding credits', color: 'rose' },
             { label: 'VAT Compliant', value: suppliers.filter(s => !!s.kraPin).length, sub: 'KRA PIN verified', color: 'teal' },
             { label: 'Items Linked', value: suppliers.reduce((acc, s) => acc + s._count.products, 0), sub: 'Associated items', color: 'blue' },
           ].map(stat => (
             <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <h4 className={`text-xl font-black ${stat.color === 'rose' ? 'text-rose-600' : stat.color === 'teal' ? 'text-teal-600' : 'text-gray-900'}`}>
                  {stat.value}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{stat.sub}</p>
             </div>
           ))}
        </div>

        {/* Search & Bulk Actions */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-transparent focus:bg-white focus:border-teal-500 outline-none font-bold transition-all" 
                placeholder="Search by code, company name, or contact person..." 
              />
           </div>
        </div>

        {/* Registry Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier Details</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Terms</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Items</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Current Debt</th>
                       <th className="px-8 py-6 text-right"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                           <td colSpan={5} className="px-8 py-8"><div className="h-12 bg-gray-50 rounded-2xl w-full" /></td>
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-32 text-center text-gray-300">
                           <Building2 size={64} className="mx-auto mb-6 opacity-20" strokeWidth={1} />
                           <p className="font-black uppercase tracking-widest text-sm">No vendors registered yet</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map(s => (
                        <tr key={s.id} className="group hover:bg-gray-50/30 transition-all">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-black text-xs group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
                                    {s.name.substring(0, 2).toUpperCase()}
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-2">
                                       <p className="font-black text-gray-900 text-sm">{s.name}</p>
                                       <span className="text-[9px] font-black bg-gray-900 text-white px-1.5 py-0.5 rounded leading-none">{s.code}</span>
                                       {s.kraPin && <ShieldCheck size={14} className="text-teal-500" title="VAT Registered" />}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1">
                                       <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                          <Phone size={10} /> {s.phone || 'No Phone'}
                                       </div>
                                       <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                          <Mail size={10} /> {s.email || 'No Email'}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-white border border-gray-100 text-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                 {s.paymentTerms}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-center">
                              <div className="flex flex-col items-center">
                                 <p className="font-black text-gray-900 text-sm">{s._count.products}</p>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Products</p>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex flex-col items-end">
                                 <p className={`font-black text-sm ${s.totalOwed > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    KES {s.totalOwed.toLocaleString()}
                                 </p>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Balance Due</p>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                 <button 
                                   onClick={() => { setSelectedSupplier(s); setIsModalOpen(true); }}
                                   className="p-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl shadow-sm border border-blue-100 transition-all"
                                 >
                                    <Edit size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(s.id)}
                                   className="p-2 bg-white text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl shadow-sm border border-rose-100 transition-all"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      <SupplierModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        supplier={selectedSupplier}
      />
    </DashboardShell>
  );
}
