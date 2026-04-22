'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processStockAdjustment(tenantId: string, data: {
  productId: string,
  type: string,
  quantity: number,
  reason: string,
  notes: string,
  userId: string 
}) {
  try {
    const { productId, type, quantity, reason, notes, userId } = data;

    if (quantity <= 0) {
      return { error: 'Quantity must be greater than 0' };
    }

    // Wrap in a transaction to update stock and log the adjustment
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error('Product not found');

      let newStock = product.stock;
      if (type === 'ADD') {
        newStock += quantity;
      } else {
        newStock -= quantity;
        if (newStock < 0) newStock = 0; // Prevent negative stock
      }

      // Update the product
      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock }
      });

      // We don't have a dedicated ActivityLog table in the schema currently, 
      // but in a full enterprise deployment we would insert a record here:
      // await tx.activityLog.create({ ... })
    });

    revalidatePath('/inventory');
    revalidatePath('/inventory/adjustments');
    revalidatePath('/inventory/dashboard');

    return { success: true };
  } catch (error: any) {
    console.error('Stock Adjustment Error:', error);
    return { error: error.message || 'Failed to process adjustment' };
  }
}
