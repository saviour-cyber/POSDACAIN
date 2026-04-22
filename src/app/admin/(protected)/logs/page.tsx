import prisma from "@/lib/prisma";
import LogsClient from "./LogsClient";

export const dynamic = "force-dynamic";

export default async function GlobalLogsPage() {
  // Fetch initial batch of logs (Last 100)
  const logs = await prisma.systemLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      tenant: {
        select: { name: true }
      }
    }
  });

  // Fetch tenants for the filter dropdown
  const tenants = await prisma.tenant.findMany({
    select: { id: true, name: true }
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">System Audit Forge</h1>
          <p className="text-gray-400 font-medium">Cross-tenant event stream and security oversight.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl">
           <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
           <span className="text-xs font-bold text-gray-300 uppercase tracking-widest text-[10px]">Live Stream</span>
        </div>
      </header>

      <LogsClient initialLogs={logs} tenants={tenants} />
    </div>
  );
}
