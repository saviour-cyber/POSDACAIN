import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TenantSettingsClient from "./TenantSettingsClient";

export default async function TenantSettingsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      _count: {
        select: { users: true, sales: true, products: true }
      }
    }
  });

  if (!tenant) notFound();

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Configure Business</h1>
        <p className="text-gray-400 font-medium">Fine-tuning the parameters for <span className="text-white font-bold">{tenant.name}</span>.</p>
      </header>

      <TenantSettingsClient tenant={tenant} />
    </div>
  );
}
