import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId }
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // This month's sales
  const salesThisMonth = await prisma.sale.findMany({
    where: {
      tenantId: session.user.tenantId,
      createdAt: { gte: startOfMonth },
      status: "COMPLETED",
    },
    include: { customer: true },
    orderBy: { createdAt: "asc" },
  });

  // Last month's sales for comparison
  const salesLastMonth = await prisma.sale.findMany({
    where: {
      tenantId: session.user.tenantId,
      createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      status: "COMPLETED",
    },
  });

  // KPI calculations - this month
  const totalRevenue = salesThisMonth.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalTransactions = salesThisMonth.length;
  const uniqueCustomers = new Set(salesThisMonth.map((s) => s.customerId).filter(Boolean)).size;
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // KPI calculations - last month
  const lastRevenue = salesLastMonth.reduce((acc, s) => acc + s.totalAmount, 0);
  const lastTransactions = salesLastMonth.length;
  const lastUniqueCustomers = new Set(salesLastMonth.map((s) => s.customerId).filter(Boolean)).size;
  const lastAvg = lastTransactions > 0 ? lastRevenue / lastTransactions : 0;

  const pctChange = (cur: number, prev: number) => {
    if (prev === 0) return cur > 0 ? 100 : 0;
    return ((cur - prev) / prev) * 100;
  };

  const kpis = [
    {
      label: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
      change: pctChange(totalRevenue, lastRevenue),
      iconName: "DollarSign",
      color: "green",
    },
    {
      label: "Total Transactions",
      value: totalTransactions.toString(),
      change: pctChange(totalTransactions, lastTransactions),
      iconName: "ShoppingCart",
      color: "blue",
    },
    {
      label: "Unique Customers",
      value: uniqueCustomers.toString(),
      change: pctChange(uniqueCustomers, lastUniqueCustomers),
      iconName: "Users",
      color: "purple",
    },
    {
      label: "Avg Order Value",
      value: `KES ${avgOrderValue.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
      change: pctChange(avgOrderValue, lastAvg),
      iconName: "TrendingUp",
      color: "orange",
    },
  ];

  // Group sales by day for daily report
  const dailyMap: Record<string, { revenue: number; count: number }> = {};
  for (const sale of salesThisMonth) {
    const day = new Date(sale.createdAt).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
    });
    if (!dailyMap[day]) dailyMap[day] = { revenue: 0, count: 0 };
    dailyMap[day].revenue += sale.totalAmount;
    dailyMap[day].count += 1;
  }
  const dailyRows = Object.entries(dailyMap).slice(-14); // last 14 days

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-gray-900">Reports & Analytics</h1>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Zap size={10} /> Auto-Generated
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            Generate detailed business reports and insights
          </p>
        </div>
      </div>

      <ReportsClient 
        initialSales={JSON.parse(JSON.stringify(salesThisMonth))} 
        kpis={kpis} 
        dailyRows={dailyRows}
        tenantName={tenant?.name || 'NexaSync POS'}
      />
    </DashboardShell>
  );
}
