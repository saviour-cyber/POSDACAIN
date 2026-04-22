import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { HardDrive } from "lucide-react";

export default async function BackupPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mb-6">
          <HardDrive size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Backup</h1>
        <p className="text-gray-500 font-medium max-w-sm">
          Backup settings are being reconfigured. Please check back shortly.
        </p>
      </div>
    </DashboardShell>
  );
}
