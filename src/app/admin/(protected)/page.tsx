import prisma from "@/lib/prisma";
import { Server, Users, Activity, BarChart4, DollarSign, Building } from "lucide-react";

export const revalidate = 60; // Refresh every minute

export default async function AnchorDashboard() {
  const [
    totalTenants,
    totalUsers,
    totalSales,
    totalProducts
  ] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.sale.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true }
    }),
    prisma.product.count()
  ]);

  const totalRevenue = totalSales._sum.totalAmount || 0;
  const transactionCount = totalSales._count.id;

  // Recent tenants
  const recentTenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      _count: {
        select: { users: true, sales: true }
      }
    }
  });

  // Fetch security/health metrics from logs
  const [securityIncidents, syncEvents] = await Promise.all([
    prisma.systemLog.count({
      where: {
        level: { in: ["ERROR", "CRITICAL"] },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.systemLog.count({
      where: {
        type: "Sync",
        status: "Success",
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-white mb-2">Global Overview</h1>
           <p className="text-gray-400 font-medium">Monitoring the health and metrics of all NexaSync tenants.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">System Online</span>
        </div>
      </header>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Network Revenue</p>
                  <p className="text-3xl font-black text-white">KES {(totalRevenue / 1000).toFixed(1)}k</p>
               </div>
               <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-2xl">
                  <DollarSign size={20} />
               </div>
            </div>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
               <span className="text-emerald-400">+12%</span> vs last month
            </p>
         </div>

         <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Tenants</p>
                  <p className="text-3xl font-black text-white">{totalTenants}</p>
               </div>
               <div className="bg-blue-500/10 text-blue-400 p-3 rounded-2xl">
                  <Building size={20} />
               </div>
            </div>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
               Across all verticals
            </p>
         </div>

         <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
                  <p className="text-3xl font-black text-white">{totalUsers}</p>
               </div>
               <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-2xl">
                  <Users size={20} />
               </div>
            </div>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
               Registered staff accounts
            </p>
         </div>

         <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transactions</p>
                  <p className="text-3xl font-black text-white">{transactionCount.toLocaleString()}</p>
               </div>
               <div className="bg-amber-500/10 text-amber-400 p-3 rounded-2xl">
                  <Activity size={20} />
               </div>
            </div>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
               Successfully processed
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tenants Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 lg:col-span-2">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <Building size={18} className="text-gray-400" /> Recently Onboarded
                </h2>
                <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300">View All</button>
             </div>
             <div className="space-y-4">
                {recentTenants.map((t) => (
                   <div key={t.id} className="flex items-center justify-between p-4 bg-gray-950/50 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-black text-gray-400">
                            {t.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-gray-200">{t.name}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{t.businessType}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-white">{t._count.users} Users</p>
                         <p className="text-[10px] font-bold text-gray-500">{t._count.sales} Sales processed</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* System Health / Secondary Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-6">
             <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Server size={18} className="text-gray-400" /> System Metrics
             </h2>
             
             <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="text-gray-400">Database Load</span>
                       <span className="text-emerald-400">Normal (12%)</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[12%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="text-gray-400">Storage Capacity</span>
                       <span className="text-blue-400">45GB / 100GB</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[45%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="text-gray-400">Products Indexed</span>
                       <span className="text-indigo-400">{totalProducts.toLocaleString()} items</span>
                    </div>
                 </div>
             </div>

             <div className="pt-6 border-t border-gray-800">
                 <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                    Run System Diagnostics
                 </button>
             </div>
          </div>
      </div>

      {/* Global Security & Audit Overview */}
      <div className="bg-gray-900 border border-red-500/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldAlert size={120} className="text-red-500" />
         </div>
         
         <div className="flex items-center justify-between mb-8 relative">
            <div className="flex items-center gap-3">
               <div className="bg-red-500/10 text-red-500 p-2.5 rounded-xl border border-red-500/20">
                  <ShieldAlert size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-white">System Security Registry</h2>
                  <p className="text-xs font-bold text-gray-500">Real-time critical events requiring supervisor attention.</p>
               </div>
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
               Clear Escalations
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-gray-950 border border-gray-800/50 p-6 rounded-3xl">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Critical Alerts (24h)</p>
               <div className="flex items-end gap-2">
                  <p className={`text-3xl font-black ${securityIncidents > 0 ? 'text-red-500' : 'text-white'}`}>
                     {securityIncidents}
                  </p>
                  <span className={`${securityIncidents > 0 ? 'text-red-400' : 'text-emerald-500'} text-[10px] font-bold pb-1`}>
                     {securityIncidents > 0 ? 'Action Reqd' : 'Stable'}
                  </span>
               </div>
            </div>
            <div className="bg-gray-950 border border-gray-800/50 p-6 rounded-3xl">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Network Syncs (24h)</p>
               <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-white">{syncEvents}</p>
                  <span className="text-indigo-500 text-[10px] font-bold pb-1">Nominal</span>
               </div>
            </div>
            <div className="bg-gray-950 border border-gray-800/50 p-6 rounded-3xl">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Cross-Tenant Latency</p>
               <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-white">42ms</p>
                  <span className="text-indigo-500 text-[10px] font-bold pb-1">Nominal</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
