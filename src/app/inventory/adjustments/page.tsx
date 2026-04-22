import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import StockControlClient from "./StockControlClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function StockControlPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const products = await prisma.product.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: 'asc' },
  });

  const stats = {
    totalItems: products.length,
    criticalStock: products.filter((p) => p.stock === 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    overstock: products.filter((p) => p.stock > 100).length,
    stockValue: products.reduce((acc, p) => acc + p.stock * p.price, 0),
  };

  const now = new Date();
  const lastSync = now.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <DashboardShell>
      <StockControlClient
        products={products}
        stats={stats}
        lastSync={lastSync}
      />
    </DashboardShell>
  );
}
