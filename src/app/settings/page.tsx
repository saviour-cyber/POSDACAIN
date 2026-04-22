import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SystemSettingsTabs from "@/components/layout/SystemSettingsTabs";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  return (
    <DashboardShell>
      <SystemSettingsTabs initialSettings={tenant?.metadata || {}} />
    </DashboardShell>
  );
}
