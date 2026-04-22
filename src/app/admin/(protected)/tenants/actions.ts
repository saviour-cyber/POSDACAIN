"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTenantSuspension(tenantId: string, currentStatus: string) {
  try {
    const isSuspending = currentStatus === "ACTIVE";
    const newStatus = isSuspending ? "SUSPENDED" : "ACTIVE";

    // 1. Update the metadata on the tenant
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error("Tenant not found");

    const metadata = (tenant.metadata || {}) as any;
    
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        metadata: {
          ...metadata,
          tenantStatus: newStatus
        }
      }
    });

    // 2. Cascade status to all users under this tenant
    // (This ensures existing auth logic blocks suspended users)
    await prisma.user.updateMany({
      where: { tenantId },
      data: {
        status: newStatus
      }
    });

    revalidatePath("/admin/tenants");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
export async function updateTenantSettings(tenantId: string, data: { name: string, businessType: string, domain: string, metadata: any }) {
  try {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: data.name,
        businessType: data.businessType,
        domain: data.domain || null,
        metadata: data.metadata
      }
    });

    revalidatePath("/admin/tenants");
    revalidatePath(`/admin/tenants/${tenantId}/settings`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
