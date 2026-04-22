import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Anchor, ShieldAlert, LayoutDashboard, Building2, TerminalSquare, LogOut } from "lucide-react";

export default async function AnchorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Generic overarching process for SUPER_ADMIN role authentication
  if ((session.user as any).role !== "SUPER_ADMIN") {
    redirect("/pos");
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Anchor Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-xl border border-indigo-500/30">
              <Anchor size={24} />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight">Anchor Point</h1>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">God View Console</p>
            </div>
          </div>
          <nav className="px-4 mt-6 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
              <Building2 size={18} /> Platform Tenants
            </Link>
            <Link href="/admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
              <TerminalSquare size={18} /> System Logs
            </Link>
          </nav>
        </div>
        <div className="p-6">
           <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-800 mb-4">
              <div className="flex items-start gap-2 mb-2">
                 <ShieldAlert size={14} className="text-amber-400 mt-0.5" />
                 <p className="text-xs font-bold text-gray-300">Super Admin Session</p>
              </div>
              <p className="text-[10px] text-gray-500">You have full modification rights across all platform tenants.</p>
           </div>
           <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
             <LogOut size={18} /> Terminate Link
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-950 relative">
         <div className="absolute top-0 right-0 p-8 pt-6 z-10 pointers-events-none opacity-20">
            <div className="w-64 h-64 bg-indigo-500 blur-[120px] rounded-full"></div>
         </div>
         <div className="flex-1 overflow-y-auto z-20">
            {children}
         </div>
      </main>
    </div>
  );
}
