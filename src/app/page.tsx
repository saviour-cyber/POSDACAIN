import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import { 
  Users, 
  Package, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SystemStatusWidgets from "./SystemStatusWidgets";
import { getProcurementStats } from "./inventory/actions";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [productCount, customerCount] = await Promise.all([
    prisma.product.count({ where: { tenantId: session.user.tenantId } }),
    prisma.customer.count({ where: { tenantId: session.user.tenantId } }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [todaySales, yesterdaySales] = await Promise.all([
    prisma.sale.aggregate({
      where: { tenantId: session.user.tenantId, createdAt: { gte: today }, status: 'COMPLETED' },
      _sum: { totalAmount: true },
      _count: { id: true }
    }),
    prisma.sale.aggregate({
      where: { tenantId: session.user.tenantId, createdAt: { gte: yesterday, lt: today }, status: 'COMPLETED' },
      _sum: { totalAmount: true },
      _count: { id: true }
    }),
  ]);

  const partialSales = await prisma.sale.findMany({
    where: { tenantId: session.user.tenantId, status: 'PARTIAL' },
    include: { customer: true, payments: true },
    orderBy: { createdAt: 'asc' },
    take: 5,
  });

  const debtors = partialSales.map(sale => {
    const totalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
    return {
      saleId: sale.id,
      customerName: sale.customer?.name || 'Unknown',
      customerPhone: sale.customer?.phone || '-',
      totalAmount: sale.totalAmount,
      totalPaid,
      balance: sale.totalAmount - totalPaid,
    };
  });

  const totalOutstanding = debtors.reduce((sum, d) => sum + d.balance, 0);
  const totalPartialCount = await prisma.sale.count({ where: { tenantId: session.user.tenantId, status: 'PARTIAL' } });

  const dailyRevenue = todaySales._sum.totalAmount || 0;
  const prevRevenue = yesterdaySales._sum.totalAmount || 0;
  const revenueChange = prevRevenue === 0 ? (dailyRevenue > 0 ? 100 : 0) : ((dailyRevenue - prevRevenue) / prevRevenue) * 100;
  const salesChange = yesterdaySales._count.id === 0 ? (todaySales._count.id > 0 ? 100 : 0) : ((todaySales._count.id - yesterdaySales._count.id) / yesterdaySales._count.id) * 100;

  const procurement = await getProcurementStats();

  const statCards = [
    { label: 'Inventory Items', value: productCount.toLocaleString(), icon: Package, color: 'blue', change: 'Active', isPositive: true, href: '/inventory' },
    { label: 'Total Customers', value: customerCount.toLocaleString(), icon: Users, color: 'purple', change: 'Active', isPositive: true, href: '/customers' },
    { label: "Today's Sales", value: todaySales._count.id.toLocaleString(), icon: TrendingUp, color: 'green', change: `${salesChange > 0 ? '+' : ''}${salesChange.toFixed(1)}%`, isPositive: salesChange >= 0, href: '/reports' },
    { label: 'Daily Revenue', value: `KES ${dailyRevenue.toLocaleString()}`, icon: Wallet, color: 'orange', change: `${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}%`, isPositive: revenueChange >= 0, href: '/reports' },
  ];

  return (
    <DashboardShell>
      <SystemStatusWidgets />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 mt-8">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.href} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </Link>
        ))}

        {/* Outstanding Debt Card */}
        <Link href="/collections" className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/20 text-white"><AlertCircle size={24} /></div>
            <span className="text-xs font-black text-white/80 bg-white/20 px-2 py-1 rounded-full">{totalPartialCount} open</span>
          </div>
          <p className="text-sm font-bold text-orange-100 mb-1">Outstanding Debt</p>
          <h3 className="text-2xl font-black text-white">KES {totalOutstanding.toLocaleString()}</h3>
          <p className="text-xs text-orange-100 mt-2 font-bold underline underline-offset-2">Click to manage →</p>
        </Link>
      </div>

      {/* Procurement & Supply Summary Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
           <div className="p-8 border-r border-gray-50 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                  <Package size={20} />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Restock Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Items Below Min</p>
                    <p className="text-2xl font-black text-gray-900">{procurement.itemsLow}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Items suggest.</p>
                    <p className="text-2xl font-black text-teal-600">KES {procurement.suggestedInvestment.toLocaleString()}</p>
                 </div>
              </div>
              <div className="mt-8">
                 <Link href="/inventory" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                    Generate Restock List <ArrowUpRight size={14} />
                 </Link>
              </div>
           </div>
           <div className="p-8 bg-gray-50/50 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Supplier Debt</p>
                <h4 className="text-3xl font-black text-gray-900">KES {procurement.supplierDebt.toLocaleString()}</h4>
                <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">Total outstanding balances across all your active suppliers.</p>
              </div>
              <div className="mt-6 flex gap-3">
                 <Link href="/suppliers" className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all text-center">
                    Pay Suppliers
                 </Link>
              </div>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              { href: '/pos', title: 'New Sale', desc: 'Open register and process orders' },
              { href: '/inventory', title: 'Inventory Restock', desc: 'Add or update stock levels' },
              { href: '/customers', title: 'Add Customer', desc: 'Register for loyalty & credit' },
              { href: '/reports', title: 'Daily Report', desc: 'Generate summary & export PDF' },
            ].map(a => (
              <Link key={a.href} href={a.href} className="p-5 border border-gray-50 rounded-2xl hover:border-teal-100 hover:bg-teal-50/30 transition-all group">
                <h4 className="font-bold text-gray-800 mb-1 group-hover:text-[#008080]">{a.title}</h4>
                <p className="text-xs text-gray-500">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Debtors */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900">Recent Partial Payments</h3>
            </div>
            <Link href="/collections" className="text-sm font-black text-[#008080] hover:underline">View All</Link>
          </div>
          {debtors.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <p className="font-bold">No outstanding balances 🎉</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="w-full text-sm hidden md:table">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left p-4 text-[10px] font-black text-gray-400 uppercase">Customer</th>
                    <th className="text-right p-4 text-[10px] font-black text-gray-400 uppercase">Paid</th>
                    <th className="text-right p-4 text-[10px] font-black text-gray-400 uppercase">Balance</th>
                    <th className="text-right p-4 text-[10px] font-black text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {debtors.map(d => (
                    <tr key={d.saleId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="p-4">
                        <p className="font-black text-gray-900 text-xs">{d.customerName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Phone size={9} className="text-gray-400" />
                          <p className="text-[10px] text-gray-400">{d.customerPhone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-right text-xs font-bold text-emerald-600">KES {d.totalPaid.toLocaleString()}</td>
                      <td className="p-4 text-right text-xs font-black text-orange-600">KES {d.balance.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <Link href="/collections" className="px-3 py-1.5 bg-[#008080] text-white text-[10px] font-black rounded-lg hover:bg-teal-700 transition-all">
                          Pay
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-50">
                {debtors.map(d => (
                  <div key={d.saleId} className="p-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-black text-gray-900 text-sm">{d.customerName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Phone size={10} className="text-gray-400" />
                          <p className="text-xs text-gray-400">{d.customerPhone}</p>
                        </div>
                      </div>
                      <Link href="/collections" className="px-4 py-2 bg-[#008080] text-white text-[10px] font-black rounded-lg shadow-md hover:bg-teal-700 transition-all">
                        Pay
                      </Link>
                    </div>
                    <div className="flex items-center justify-between mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Paid</p>
                        <p className="text-xs font-bold text-emerald-600">KES {d.totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Balance</p>
                        <p className="text-xs font-black text-orange-600">KES {d.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
