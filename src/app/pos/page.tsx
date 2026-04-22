import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import POSClient from "./POSClient";

export default async function POSPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [products, customers, tenant] = await Promise.all([
    prisma.product.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { name: 'asc' },
    }),
    prisma.customer.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { name: 'asc' },
    }),
    prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      select: { businessType: true, metadata: true },
    }),
  ]);

  return (
    <DashboardShell>
      <POSClient
        products={products}
        customers={customers}
        businessType={tenant?.businessType || 'General Merchandise'}
        settings={tenant?.metadata || {}}
      />
    </DashboardShell>
  );
}

