"use client";

import { useState } from "react";
import { 
  Search, Filter, Calendar, Activity, Shield, Terminal, 
  Trash2, RefreshCcw, Download, ChevronRight, AlertTriangle,
  Info, ShieldAlert, Zap, Loader2
} from "lucide-react";

export default function LogsClient({ initialLogs, tenants }: { initialLogs: any[], tenants: any[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [filterType, setFilterType] = useState("ALL");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterTenant, setFilterTenant] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPruning, setIsPruning] = useState(false);

  const filteredLogs = logs.filter(log => {
     if (filterType !== "ALL" && log.type !== filterType) return false;
     if (filterLevel !== "ALL" && log.level !== filterLevel) return false;
     if (filterTenant !== "ALL" && log.tenantId !== filterTenant) return false;
     if (searchQuery && !log.event.toLowerCase().includes(searchQuery.toLowerCase())) return false;
     return true;
  });

  const handlePrune = async () => {
    if (!confirm("Are you sure you want to execute tiered pruning? This will permanently delete old technical logs.")) return;
    
    setIsPruning(true);
    try {
      const res = await fetch("/api/admin/logs/cleanup", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Refresh local view by removing pruned items (simplistic)
        // In a real app, we'd refetch from the server actions
      } else {
        alert("Cleanup failed: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setIsPruning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <div className="lg:col-span-2 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by event description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-200 outline-none focus:border-indigo-500 focus:ring-4 ring-indigo-500/10 placeholder:text-gray-600 transition-all font-sans"
            />
         </div>
         
         <div className="relative">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <select 
               value={filterTenant}
               onChange={(e) => setFilterTenant(e.target.value)}
               className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-200 outline-none appearance-none cursor-pointer focus:border-indigo-500 transition-all"
            >
               <option value="ALL">All Tenants</option>
               {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
         </div>

         <div className="flex gap-2">
            <button 
              onClick={handlePrune}
              disabled={isPruning}
              className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-red-400 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
            >
               {isPruning ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} className="group-hover:scale-110 transition-transform" />} Prune
            </button>
            <button className="w-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
               <RefreshCcw size={18} />
            </button>
         </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 pb-2">
         {["ALL", "Transaction", "Security", "System", "SMS", "Diagnostic"].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterType === type 
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" 
                  : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
              }`}
            >
              {type}
            </button>
         ))}
      </div>

      {/* Logs Table Area */}
      <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-gray-800 bg-gray-950/30">
                     <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Timestamp</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tenant</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Log Tier</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Event Description</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-800/50">
                  {filteredLogs.map((log) => (
                     <tr key={log.id} className="hover:bg-indigo-500/[0.02] group transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-gray-600" />
                              <span className="text-xs font-bold text-gray-400 tabular-nums">
                                 {new Date(log.createdAt).toLocaleString()}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-[10px] font-black text-gray-300 uppercase tracking-widest">
                              {log.tenantId === "SYSTEM" ? "CORE" : log.tenant?.name || "Global"}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider
                                 ${log.level === 'CRITICAL' ? 'bg-red-500 text-white' : 
                                   log.level === 'ERROR' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                   log.level === 'WARNING' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-800 text-gray-400'}`}>
                                 {log.level}
                              </span>
                              <span className="text-[10px] font-medium text-gray-600">{log.type}</span>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                           <p className="text-[13px] font-bold text-gray-200 leading-tight">
                              {log.event}
                           </p>
                           {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <p className="text-[10px] text-gray-600 font-medium truncate mt-1">
                                 {JSON.stringify(log.metadata)}
                              </p>
                           )}
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${log.status === "Success" ? "bg-emerald-500" : "bg-red-500"}`} />
                              <span className={`text-[11px] font-black uppercase tracking-widest ${log.status === "Success" ? "text-emerald-500" : "text-red-500"}`}>
                                 {log.status === "Success" ? "OK" : "Error"}
                              </span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {filteredLogs.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
               <Terminal size={48} className="mb-4 text-gray-600" />
               <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Static Silence</p>
               <p className="text-xs font-bold text-gray-600">No signals detected matching your current frequency.</p>
            </div>
         )}
      </div>

      {/* Quick Status / Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
         <div className="bg-gray-900 border border-gray-800 px-6 py-5 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
               <Shield size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Retention</p>
               <p className="text-sm font-bold text-white">Tiered Cleanup Engine [On]</p>
            </div>
         </div>
         <div className="bg-gray-900 border border-gray-800 px-6 py-5 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
               <Zap size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Latency</p>
               <p className="text-sm font-bold text-white">Prisma Edge Ops [12ms]</p>
            </div>
         </div>
         <div className="bg-gray-900 border border-gray-800 px-6 py-5 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
               <Download size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Export Engine</p>
               <p className="text-sm font-bold text-white">Structured JSON/CSV Ready</p>
            </div>
         </div>
      </div>
    </div>
  );
}
