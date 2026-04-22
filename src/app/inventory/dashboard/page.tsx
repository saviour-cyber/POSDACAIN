import DashboardShell from "@/components/layout/DashboardShell";
import { getInventoryData } from "../actions";
import InventoryKPIs from "../InventoryKPIs";
import ProductTable from "../ProductTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function InventoryDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const data = await getInventoryData();

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stock Management</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Detailed inventory dashboard and oversight
          </p>
        </div>

        <InventoryKPIs stats={data.stats} />
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Inventory Snapshot</h3>
          </div>
          <ProductTable products={data.products} />
        </div>
      </div>
    </DashboardShell>
  );
}
