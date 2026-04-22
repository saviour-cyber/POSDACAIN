import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import ExportCsvButton from "./ExportCsvButton";

export default async function StockReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const products = await prisma.product.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: 'asc' }
  });

  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stock Reports</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
              Inventory valuation and status summaries
            </p>
          </div>
          
          <ExportCsvButton products={products.map(p => ({
            name: p.name,
            sku: p.sku,
            price: p.price,
            stock: p.stock
          }))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Package size={20} />
              </div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Valuation</h3>
            </div>
            <p className="text-2xl font-black text-gray-900">KES {totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4 text-right">Price (KES)</th>
                  <th className="px-6 py-4 text-right">Stock</th>
                  <th className="px-6 py-4 text-right">Valuation (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                      No stock data available
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-black text-gray-900 text-sm">{p.name}</td>
                      <td className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{p.sku || 'N/A'}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-600 text-sm">{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-black text-gray-900 text-sm">{p.stock}</td>
                      <td className="px-6 py-4 text-right font-black text-blue-600 text-sm">{(p.stock * p.price).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
