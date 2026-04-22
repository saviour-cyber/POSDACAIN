import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  DollarSign, ShoppingCart, Users, TrendingUp,
  ArrowUpRight, Target
} from "lucide-react";
import AnalyticsRefreshButton from "./AnalyticsRefreshButton";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Current month sales
  const salesNow = await prisma.sale.findMany({
    where: { tenantId: session.user.tenantId, createdAt: { gte: startOfMonth }, status: "COMPLETED" },
    include: { items: { include: { product: true } }, customer: true },
    orderBy: { createdAt: "asc" },
  });

  // Last month for delta
  const salesLast = await prisma.sale.findMany({
    where: { tenantId: session.user.tenantId, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, status: "COMPLETED" },
  });

  // Last 6 months aggregation for trend
  const trendData: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const s = await prisma.sale.findMany({
      where: { tenantId: session.user.tenantId, createdAt: { gte: d, lte: end }, status: "COMPLETED" },
    });
    trendData.push({
      month: d.toLocaleString("en-KE", { month: "short" }),
      revenue: s.reduce((a, x) => a + x.totalAmount, 0),
    });
  }

  // KPIs
  const revenue = salesNow.reduce((a, s) => a + s.totalAmount, 0);
  const lastRevenue = salesLast.reduce((a, s) => a + s.totalAmount, 0);
  const transactions = salesNow.length;
  const newCustomers = new Set(salesNow.map(s => s.customerId).filter(Boolean)).size;
  const avgTxValue = transactions > 0 ? revenue / transactions : 0;
  const lastAvg = salesLast.length > 0 ? lastRevenue / salesLast.length : 0;

  const pct = (a: number, b: number) => b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100;

  const kpis = [
    { label: "Monthly Revenue", value: `KES ${revenue.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`, change: pct(revenue, lastRevenue), target: `KES ${(lastRevenue * 1.1).toFixed(0)}`, icon: DollarSign, color: "green" },
    { label: "Total Transactions", value: transactions.toString(), change: pct(transactions, salesLast.length), target: (salesLast.length + 10).toString(), icon: ShoppingCart, color: "blue" },
    { label: "New Customers", value: newCustomers.toString(), change: 0, target: "50", icon: Users, color: "purple" },
    { label: "Avg Transaction Value", value: `KES ${avgTxValue.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`, change: pct(avgTxValue, lastAvg), target: `KES ${(lastAvg * 1.1).toFixed(0)}`, icon: TrendingUp, color: "orange" },
  ];

  // Sales by category
  const categoryMap: Record<string, number> = {};
  for (const sale of salesNow) {
    for (const item of sale.items) {
      const cat = (item.product as any).category || "General";
      categoryMap[cat] = (categoryMap[cat] || 0) + item.totalPrice;
    }
  }
  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const totalCatRevenue = categories.reduce((a, [, v]) => a + v, 0);

  // SVG Trend chart
  const maxRevenue = Math.max(...trendData.map(d => d.revenue), 1);
  const chartW = 500;
  const chartH = 160;
  const padL = 50; const padR = 20; const padT = 10; const padB = 30;
  const drawW = chartW - padL - padR;
  const drawH = chartH - padT - padB;
  const points = trendData.map((d, i) => {
    const x = padL + (i / (trendData.length - 1)) * drawW;
    const y = padT + drawH - (d.revenue / maxRevenue) * drawH;
    return `${x},${y}`;
  });
  const targetRevenue = lastRevenue * 1.1 / trendData.length;
  const targetY = padT + drawH - (targetRevenue / maxRevenue) * drawH;

  const DONUT_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  // Build donut segments
  let donutSegments: { color: string; label: string; pct: number; dashArray: string; dashOffset: number }[] = [];
  const r = 60; const circ = 2 * Math.PI * r;
  let cumOffset = 0;
  if (categories.length > 0) {
    donutSegments = categories.slice(0, 6).map(([label, val], i) => {
      const p = val / totalCatRevenue;
      const dash = p * circ;
      const gap = circ - dash;
      const offset = -cumOffset;
      cumOffset += dash;
      return { color: DONUT_COLORS[i % DONUT_COLORS.length], label, pct: Math.round(p * 100), dashArray: `${dash} ${gap}`, dashOffset: offset };
    });
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white focus:outline-none appearance-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <select className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white focus:outline-none appearance-none">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
          </select>
          <AnalyticsRefreshButton />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const isUp = k.change >= 0;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{k.label}</p>
                <k.icon size={15} className={`text-${k.color}-500`} />
              </div>
              <p className="text-xl font-black text-gray-900 mb-1 leading-tight">{k.value}</p>
              <div className={`flex items-center gap-1 text-[11px] font-bold mb-2 ${isUp ? "text-green-500" : "text-red-500"}`}>
                <ArrowUpRight size={12} className={isUp ? "" : "rotate-90"} />
                {isUp ? "+" : ""}{k.change.toFixed(1)}%
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <Target size={10} /> Target: {k.target}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-black text-gray-800 mb-0.5">Revenue Trend</h2>
        <p className="text-xs text-gray-400 font-medium mb-4">Monthly revenue performance</p>

        <div className="flex items-center gap-4 mb-3 text-xs font-bold text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-blue-500 rounded inline-block"></span> Revenue</span>
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 border-t-2 border-dashed border-red-300 inline-block"></span> Target</span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ minWidth: "280px", height: "auto" }}>
            {/* Y-axis gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => {
              const y = padT + drawH - p * drawH;
              return (
                <g key={p}>
                  <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                  <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="8" fill="#9ca3af">
                    KES {Math.round(maxRevenue * p).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Target dashed line */}
            <line
              x1={padL} y1={Math.max(padT, targetY)}
              x2={chartW - padR} y2={Math.max(padT, targetY)}
              stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4 4"
            />

            {/* Revenue area fill */}
            {trendData.length > 1 && (
              <polygon
                points={[
                  `${padL},${padT + drawH}`,
                  ...points,
                  `${padL + drawW},${padT + drawH}`,
                ].join(" ")}
                fill="#3b82f620"
              />
            )}

            {/* Revenue line */}
            {trendData.length > 1 && (
              <polyline
                points={points.join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points + labels */}
            {trendData.map((d, i) => {
              const x = padL + (i / (trendData.length - 1)) * drawW;
              const y = padT + drawH - (d.revenue / maxRevenue) * drawH;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={4} fill="#3b82f6" stroke="white" strokeWidth="2" />
                  <text x={x} y={padT + drawH + 18} textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="bold">
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-black text-gray-800 mb-0.5">Sales by Category</h2>
        <p className="text-xs text-gray-400 font-medium mb-4">Revenue distribution across product categories</p>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Donut Chart */}
          <div className="flex-shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none" stroke="#f3f4f6" strokeWidth="28" />
              {donutSegments.length === 0 ? (
                <circle cx="80" cy="80" r={r} fill="none" stroke="#e5e7eb" strokeWidth="28" />
              ) : (
                donutSegments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="80" cy="80" r={r}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="28"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    transform="rotate(-90 80 80)"
                  />
                ))
              )}
              <text x="80" y="75" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="900">
                {categories.length > 0 ? categories.length : "No"}
              </text>
              <text x="80" y="89" textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="bold">
                {categories.length > 0 ? "categories" : "Data"}
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2 w-full">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium">No category sales data yet.</p>
            ) : (
              categories.slice(0, 6).map(([label, val], i) => {
                const pctVal = totalCatRevenue > 0 ? Math.round((val / totalCatRevenue) * 100) : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}></span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-gray-700 truncate">{label}</span>
                        <span className="text-xs font-black text-gray-900 ml-2">{pctVal}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pctVal}%`, background: DONUT_COLORS[i % DONUT_COLORS.length] }}></div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                      KES {val.toLocaleString("en-KE", { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
