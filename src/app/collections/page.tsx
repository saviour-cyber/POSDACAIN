import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import CollectionsClient from "./CollectionsClient";

export default async function CollectionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  // Fetch all partial sales with related customer and payments
  const partialSales = await prisma.sale.findMany({
    where: {
      tenantId: session.user.tenantId,
      status: 'PARTIAL',
    },
    include: {
      customer: true,
      payments: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'asc' }, // Oldest first (priority)
  });

  const debtors = partialSales.map(sale => {
    const totalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = sale.totalAmount - totalPaid;
    const lastPayment = sale.payments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    return {
      saleId: sale.id,
      customerName: sale.customer?.name || 'Unknown',
      customerPhone: sale.customer?.phone || '-',
      totalAmount: sale.totalAmount,
      totalPaid,
      balance,
      lastPaymentDate: lastPayment?.createdAt?.toISOString() || sale.createdAt.toISOString(),
      createdAt: sale.createdAt.toISOString(),
      dueDate: sale.dueDate?.toISOString() || null,
      lastReminderSentAt: sale.lastReminderSentAt?.toISOString() || null,
    };
  });

  const totalOutstanding = debtors.reduce((sum, d) => sum + d.balance, 0);

  return (
    <DashboardShell>
      <CollectionsClient debtors={debtors} totalOutstanding={totalOutstanding} />
    </DashboardShell>
  );
}
