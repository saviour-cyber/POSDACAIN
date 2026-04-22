"use client";

import { useState } from "react";
import { Building2, MoreVertical, Search, ShieldAlert, CheckCircle2, Play, Pause, Loader2, Users, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toggleTenantSuspension } from "./actions";

export default function TenantsClient({ initialTenants }: { initialTenants: any[] }) {
  const [tenants, setTenants] = useState(initialTenants);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.businessType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (tenantId: string, currentStatus: string) => {
    setLoadingId(tenantId);
    
    const res = await toggleTenantSuspension(tenantId, currentStatus);
    
    if (res.success) {
      setTenants(tenants.map(t => {
        if (t.id === tenantId) {
          const m = t.metadata || {};
          const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return {
            ...t,
            metadata: { ...m, tenantStatus: newStatus }
          }
        }
        return t;
      }));
    } else {
      alert("Failed to toggle suspension: " + res.error);
    }
    
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by business name or vertical..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 focus:border-indigo-500 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-200 outline-none transition-all placeholder:text-gray-600 focus:ring-4 ring-indigo-500/10"
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2">
           <Building2 size={18} /> Register New Business
        </button>
      </div>

      {/* Tenants Cards (Responsive grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-4">
        {filteredTenants.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-gray-900 border border-gray-800 rounded-3xl">
              <Building2 size={32} className="mx-auto mb-4 text-gray-700" />
              <p className="font-bold text-gray-400">No matching tenants found.</p>
           </div>
        ) : (
          filteredTenants.map((t) => {
            const status = (t.metadata?.tenantStatus as string) || "ACTIVE";
            const isActive = status === "ACTIVE";

            return (
              <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative flex flex-col hover:border-gray-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-0.5">{t.name}</h3>
                      <div className="flex gap-2 items-center">
                         <span className="px-2 py-0.5 bg-gray-800 rounded border border-gray-700 text-[9px] font-black uppercase tracking-widest text-gray-400">
                           {t.businessType}
                         </span>
                         {!isActive && (
                            <span className="px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20 text-[9px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
                              <ShieldAlert size={10} /> SUSPENDED
                            </span>
                         )}
                         {isActive && (
                            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Active
                            </span>
                         )}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors bg-gray-800/50 p-2 rounded-xl">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6 bg-gray-950 p-4 rounded-2xl border border-gray-800/50">
                   <div>
                      <p className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-1">Users</p>
                      <p className="text-gray-300 font-black text-sm flex items-center gap-1.5"><Users size={12} className="text-gray-600" /> {t._count.users}</p>
                   </div>
                   <div>
                      <p className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-1">Sales</p>
                      <p className="text-gray-300 font-black text-sm flex items-center gap-1.5"><ShoppingCart size={12} className="text-gray-600" /> {t._count.sales}</p>
                   </div>
                   <div>
                      <p className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-1">Products</p>
                      <p className="text-gray-300 font-black text-sm">{t._count.products}</p>
                   </div>
                </div>

                <div className="mt-auto flex gap-3 pt-4 border-t border-gray-800">
                  <Link 
                    href={`/admin/tenants/${t.id}/settings`}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors text-xs flex items-center justify-center"
                  >
                    Manage Settings
                  </Link>
                  <button 
                    disabled={loadingId === t.id}
                    onClick={() => handleToggleStatus(t.id, status)}
                    className={`flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-bold text-xs transition-colors border ${
                      isActive 
                        ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' 
                        : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {loadingId === t.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isActive ? (
                      <><Pause size={14} className="fill-current" /> Suspend</>
                    ) : (
                      <><Play size={14} className="fill-current" /> Activate</>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
