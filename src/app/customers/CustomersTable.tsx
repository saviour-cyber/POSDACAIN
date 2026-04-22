'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Building2, 
  Phone, 
  History as HistoryIcon,
  Star,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { getCustomers, deleteCustomer } from './actions';
import CustomerModal from './CustomerModal';
import CustomerHistoryModal from './CustomerHistoryModal';
import { useSession } from 'next-auth/react';

export default function CustomersTable() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Action Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Edit Modal State
  const [editCustomer, setEditCustomer] = useState<any>(null);
  
  // History Modal State
  const [historyCustomer, setHistoryCustomer] = useState<any>(null);

  // Delete Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, search]);

  // Handle outside clicks for the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const result = await getCustomers({ page, limit, search });
      setCustomers(result.customers);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this customer? This cannot be undone.")) return;
    
    try {
      const result = await deleteCustomer(id);
      if (result.success) {
        fetchCustomers();
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Failed to delete customer");
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, code, or phone..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium bg-gray-50/30"
            />
          </div>
        </div>
        <div className="lg:col-span-4 flex gap-2">
          <div className="flex-1 bg-white px-4 py-2 border border-gray-100 rounded-2xl flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase">Rows:</span>
            <select 
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="bg-transparent font-bold text-sm outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button className="px-6 bg-white border border-gray-100 rounded-2xl text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all font-black uppercase tracking-widest text-[10px]">
            Export
          </button>
        </div>
      </div>

      {/* Table Shell */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="hidden md:block overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer ID</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name & Company</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacts</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Financials</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loyalty</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="p-6">
                      <div className="h-12 bg-gray-50 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <User size={32} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black font-mono">
                        {customer.code || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm uppercase">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{customer.name}</p>
                          {customer.company && (
                            <div className="flex items-center gap-1 mt-1 text-gray-400">
                              <Building2 size={10} />
                              <span className="text-[10px] font-bold uppercase">{customer.company}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <Phone size={12} className="text-gray-300" />
                          {customer.phone || '-'}
                        </div>
                        {customer.kraPin && (
                          <div className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md inline-block">
                            PIN: {customer.kraPin}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Spent</p>
                          <p className="font-black text-gray-900">KES {customer.totalSpent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-orange-500 uppercase mb-1">Credit Bal.</p>
                          <p className={`font-black ${customer.creditBalance > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                            KES {customer.creditBalance.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">Deposit</p>
                          <p className="font-black text-emerald-600">KES {customer.depositBalance.toLocaleString()}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Limit</p>
                           <p className="font-black text-gray-600 text-xs">KES {customer.creditLimit.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-50 text-amber-600 p-2 rounded-xl">
                          <Star size={16} fill="currentColor" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900">{customer.loyaltyPts}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Points earned</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setHistoryCustomer(customer)}
                          className="w-10 h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <HistoryIcon size={18} />
                        </button>
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === customer.id ? null : customer.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeMenuId === customer.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Action Dropdown */}
                        {activeMenuId === customer.id && (
                          <div 
                            ref={menuRef}
                            className="absolute right-6 top-[20%] mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[70] py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                          >
                            <button 
                              onClick={() => { setEditCustomer(customer); setActiveMenuId(null); }}
                              className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-left"
                            >
                              <Edit size={16} />
                              Edit Profile
                            </button>
                            <button 
                              onClick={() => { setHistoryCustomer(customer); setActiveMenuId(null); }}
                              className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-left"
                            >
                              <HistoryIcon size={16} />
                              View History
                            </button>
                            <div className="h-px bg-gray-50 my-1 mx-4" />
                            <button 
                              onClick={() => { handleDelete(customer.id); setActiveMenuId(null); }}
                              className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
                            >
                              <Trash2 size={16} />
                              Delete Record
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse space-y-3">
                <div className="h-12 bg-gray-50 rounded-2xl w-full" />
                <div className="h-20 bg-gray-50 rounded-2xl w-full" />
              </div>
            ))
          ) : customers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                <User size={24} />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No customers found</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-3 relative">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm uppercase">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight text-sm">{customer.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-black font-mono">
                          {customer.code || 'PENDING'}
                        </span>
                        {customer.company && (
                          <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                            <Building2 size={10} /> {customer.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Dropdown for Mobile */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === customer.id ? null : customer.id)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${activeMenuId === customer.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenuId === customer.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-[70] py-2"
                      >
                        <button onClick={() => { setEditCustomer(customer); setActiveMenuId(null); }} className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-gray-700 hover:bg-blue-50 text-left">
                          <Edit size={16} /> Edit Profile
                        </button>
                        <button onClick={() => { setHistoryCustomer(customer); setActiveMenuId(null); }} className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-gray-700 hover:bg-blue-50 text-left">
                          <HistoryIcon size={16} /> View History
                        </button>
                        <div className="h-px bg-gray-50 my-1 mx-4" />
                        <button onClick={() => { handleDelete(customer.id); setActiveMenuId(null); }} className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-rose-600 hover:bg-rose-50 text-left">
                          <Trash2 size={16} /> Delete Record
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Phone size={12} className="text-gray-300" /> {customer.phone || '-'}
                  </div>
                  {customer.kraPin && (
                    <div className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md inline-block">
                      PIN: {customer.kraPin}
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-auto text-amber-500">
                    <Star size={12} fill="currentColor" /> {customer.loyaltyPts}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Total Spent</p>
                    <p className="font-black text-gray-900 text-xs">KES {customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-orange-500 uppercase mb-0.5">Credit Bal.</p>
                    <p className={`font-black text-xs ${customer.creditBalance > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                      KES {customer.creditBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-emerald-500 uppercase mb-0.5">Deposit</p>
                    <p className="font-black text-emerald-600 text-xs">KES {customer.depositBalance.toLocaleString()}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Limit</p>
                     <p className="font-black text-gray-600 text-xs">KES {customer.creditLimit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900 font-black">{customers.length}</span> of <span className="text-gray-900 font-black">{total}</span> customers
          </p>
          <div className="flex items-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-gray-900">{page}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">of {totalPages}</span>
            </div>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editCustomer && (
        <CustomerModal 
          isOpen={true}
          businessType={session?.user?.businessType || 'General'}
          customer={editCustomer}
          onClose={() => {
            setEditCustomer(null);
            fetchCustomers();
          }}
        />
      )}

      {/* History Modal Overlay */}
      {historyCustomer && (
        <CustomerHistoryModal 
          customerId={historyCustomer.id}
          customerName={historyCustomer.name}
          onClose={() => setHistoryCustomer(null)}
        />
      )}
    </div>
  );
}
