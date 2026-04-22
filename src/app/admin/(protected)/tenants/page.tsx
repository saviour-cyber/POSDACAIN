import prisma from "@/lib/prisma";
import TenantsClient from "./TenantsClient";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { users: true, sales: true, products: true }
      }
    }
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Platform Tenants</h1>
        <p className="text-gray-400 font-medium">Manage businesses, subscriptions, and system access.</p>
      </header>

      <TenantsClient initialTenants={tenants} />
    </div>
  );
}
