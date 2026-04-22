'use server';

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { sendSMS, SMSTemplates } from "@/lib/sms";

export async function recordInstallment(data: {
  saleId: string;
  amount: number;
  method: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  return await prisma.$transaction(async (tx) => {
    // Create new payment row
    await tx.payment.create({
      data: {
        saleId: data.saleId,
        method: data.method,
        amount: data.amount,
        status: 'SUCCESS',
      }
    });

    // Check if fully paid
    const sale = await tx.sale.findUnique({
      where: { id: data.saleId },
      include: { payments: true }
    });
    if (!sale) throw new Error("Sale not found");

    const totalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= sale.totalAmount) {
      await tx.sale.update({
        where: { id: data.saleId },
        data: { status: 'COMPLETED' }
      });
    }

    revalidatePath('/collections');
    revalidatePath('/');
    return { success: true, fullyPaid: totalPaid >= sale.totalAmount };
  });
}

export async function sendCollectionReminder(saleId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: { 
      customer: true,
      payments: true
    }
  });

  if (!sale || !sale.customer?.phone) {
    return { success: false, error: "No customer phone found" };
  }

  const totalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = sale.totalAmount - totalPaid;
  const message = SMSTemplates.DEBT_REMINDER(
    sale.customer.name,
    balance,
    sale.dueDate || undefined
  );

  const result = await sendSMS({
    to: sale.customer.phone,
    message,
    tenantId: session.user.tenantId
  });

  if (result.success) {
    await prisma.sale.update({
      where: { id: saleId },
      data: { lastReminderSentAt: new Date() }
    });
  }

  return result;
}
