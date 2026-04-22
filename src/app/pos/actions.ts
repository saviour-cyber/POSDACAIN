'use server';

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { sendSMS, SMSTemplates } from "@/lib/sms";
import { logAuditEvent } from "../settings/system/actions";

export async function processSale(data: {
  customerId?: string;
  items: { productId: string; quantity: number; unitPrice: number; isService?: boolean }[];
  totalAmount: number;
  amountPaid?: number;
  paymentMode: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CREDIT';
  status?: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'PARTIAL';
  metadata?: any;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Create the Sale record
      const sale = await tx.sale.create({
        data: {
          tenantId: session.user.tenantId,
          userId: session.user.id,
          customerId: data.customerId,
          totalAmount: data.totalAmount,
          paymentMode: data.paymentMode as any,
          status: data.status || 'COMPLETED',
          dueDate: data.metadata?.dueDate ? new Date(data.metadata.dueDate) : null,
          metadata: data.metadata,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            }))
          },
          // Create the payment row immediately
          payments: {
            create: [
              {
                method: data.paymentMode,
                amount: data.amountPaid ?? data.totalAmount,
                status: 'SUCCESS'
              }
            ]
          }
        },
        include: {
          customer: true
        }
      });

      // 1.5 Send SMS Confirmation if Partial
      if (sale.status === 'PARTIAL' && sale.customer?.phone) {
        const balance = sale.totalAmount - (data.amountPaid || 0);
        const message = SMSTemplates.PARTIAL_PAYMENT_CONFIRMATION(
          sale.customer.name,
          data.amountPaid || 0,
          balance,
          sale.dueDate || undefined
        );
        
        // This is async but we don't necessarily want to block the transaction 
        // to finish to ensure checkout speed. However, for reliability, we'll try it.
        try {
          await sendSMS({
            to: sale.customer.phone,
            message,
            tenantId: session.user.tenantId
          });
        } catch (smsErr) {
          console.error("SMS Confirmation failed:", smsErr);
        }
      }

      // Update Inventory levels (skip services, allow stock drop on COMPLETED and PARTIAL layaways)
      if (sale.status === 'COMPLETED' || sale.status === 'PARTIAL') {
        for (const item of data.items) {
          if (!item.isService) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity
                }
              }
            });
          }
        }
      }

      // Update Loyalty Points if customer is linked
      if (data.customerId) {
        const pointsToAdd = Math.floor(data.totalAmount / 100);
        if (pointsToAdd > 0) {
          await tx.customer.update({
            where: { id: data.customerId },
            data: {
              loyaltyPts: {
                increment: pointsToAdd
              }
            }
          });
        }
      }

      await logAuditEvent({
        type: 'Transaction',
        event: `Sale Completed: ${sale.id}`,
        status: 'Success',
        metadata: { customerId: data.customerId, total: data.totalAmount, paymentMode: data.paymentMode }
      });

      return { success: true, saleId: sale.id };
    });
  } catch (error) {
    console.error("Sale processing failed:", error);
    return { success: false, error: "Payment failed or stock unavailable" };
  }
}
