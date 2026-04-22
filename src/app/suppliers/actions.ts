'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from 'next/cache';

export async function getSuppliers() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return prisma.supplier.findMany({
    where: { tenantId: session.user.tenantId },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createSupplier(data: any) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const tenantId = session.user.tenantId;

  // Generate Code: SUP-1001
  const count = await prisma.supplier.count({ where: { tenantId } });
  const code = `SUP-${1001 + count}`;

  const supplier = await prisma.supplier.create({
    data: {
      ...data,
      code,
      tenantId
    }
  });

  revalidatePath('/suppliers');
  return { success: true, supplier };
}

export async function updateSupplier(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.supplier.update({
    where: { id, tenantId: session.user.tenantId },
    data
  });

  revalidatePath('/suppliers');
  return { success: true };
}

export async function linkProductsToSupplier(supplierId: string, productIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const tenantId = session.user.tenantId;

  // Transaction to update all products
  await prisma.$transaction(
    productIds.map(pid => 
      prisma.product.update({
        where: { id: pid, tenantId },
        data: { supplierId }
      })
    )
  );

  revalidatePath('/suppliers');
  revalidatePath('/inventory');
  return { success: true };
}

export async function deleteSupplier(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.supplier.delete({
    where: { id, tenantId: session.user.tenantId }
  });

  revalidatePath('/suppliers');
  return { success: true };
}

export async function recordSupplierPayment(supplierId: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const tenantId = session.user.tenantId;

  await prisma.supplier.update({
    where: { id: supplierId, tenantId },
    data: {
      totalOwed: { decrement: amount }
    }
  });

  revalidatePath('/suppliers');
  revalidatePath('/procurement');
  revalidatePath('/');
  return { success: true };
}
