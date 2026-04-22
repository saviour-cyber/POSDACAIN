import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SystemAdminClient from "./SystemAdminClient";

export default async function SystemAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Role Based Access Control
  if (session.user.role === "CASHIER") {
    redirect("/"); // Block access to cashiers
  }

  // 1. Log Rotation Policy: Delete logs older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  await prisma.systemLog.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo
      }
    }
  });

  // Seed initial realistic logs if the database is empty (for demo purposes)
  const logCount = await prisma.systemLog.count({ where: { tenantId: session.user.tenantId } });
  if (logCount === 0) {
    await prisma.systemLog.createMany({
      data: [
        { tenantId: session.user.tenantId, level: 'ERROR', type: 'Transaction', event: 'Payment gateway timeout', status: 'Failed', terminalId: 'POS-003' },
        { tenantId: session.user.tenantId, level: 'WARNING', type: 'System', event: 'Printer slow response', status: 'Success', terminalId: 'POS-003' },
        { tenantId: session.user.tenantId, level: 'INFO', type: 'System', event: 'POS started', status: 'Success', terminalId: 'POS-003' },
        { tenantId: session.user.tenantId, level: 'CRITICAL', type: 'System', event: 'Database connection lost', status: 'Failed', terminalId: 'POS-SERVER' },
        { tenantId: session.user.tenantId, level: 'INFO', type: 'Transaction', event: 'Sale completed (INV-841)', status: 'Success', terminalId: 'POS-003' },
        { tenantId: session.user.tenantId, level: 'INFO', type: 'Security', event: 'Admin User login', status: 'Success', terminalId: 'POS-001' },
      ]
    });
  }

  // Fetch Live Logs ordered by newest first
  const logs = await prisma.systemLog.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: 'desc' },
    take: 200
  });

  const initialLogs = logs.map((log: any) => ({
    id: log.id,
    time: log.createdAt.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
    type: log.type,
    level: log.level, // e.g., INFO, WARNING, ERROR, CRITICAL
    event: log.event,
    status: log.status,
    terminalId: log.terminalId
  }));

  return (
    <DashboardShell>
      <SystemAdminClient initialLogs={initialLogs} />
    </DashboardShell>
  );
}
