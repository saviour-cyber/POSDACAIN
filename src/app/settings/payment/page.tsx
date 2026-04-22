import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import PaymentSettingsClient from "./PaymentSettingsClient";

export default async function PaymentSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    redirect("/");
  }

  // Fetch existing M-Pesa gateway settings
  const gateway = await prisma.paymentGateway.findUnique({
    where: {
      tenantId_type: {
        tenantId: session.user.tenantId,
        type: 'mpesa'
      }
    }
  });

  return (
    <DashboardShell>
      <PaymentSettingsClient initialData={gateway} />
    </DashboardShell>
  );
}
