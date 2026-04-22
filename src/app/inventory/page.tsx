import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import InventoryClient from "./InventoryClient";

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const products = await prisma.product.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: 'asc' },
  });

  const stats = {
    totalProducts: products.length,
    lowStockCount: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStockCount: products.filter((p) => p.stock <= 0).length,
    inventoryValue: products.reduce((acc, p) => acc + p.stock * p.price, 0),
  };

  return (
    <DashboardShell>
      <InventoryClient products={products} stats={stats} />
    </DashboardShell>
  );
}
