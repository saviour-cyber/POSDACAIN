'use client';

import Sidebar from './Sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Menu, AlertCircle, HardHat, LogOut } from 'lucide-react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Maintenance & Session Configuration
  const systemConfig = (session?.user as any)?.systemConfig;
  const isMaintenanceMode = systemConfig?.maintenance?.enabled;
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
  const showMaintenance = isMaintenanceMode && !isAdmin;

  // Session Timeout Logic
  useEffect(() => {
    if (status !== 'authenticated' || !systemConfig?.security?.sessionTimeout) return;

    const timeoutMs = systemConfig.security.sessionTimeout * 60 * 1000;

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        signOut({ callbackUrl: '/login?reason=timeout' });
      }, timeoutMs);
    };

    // Activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    
    resetTimer(); // Initialize

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [status, systemConfig]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  // Render Maintenance Screen
  if (showMaintenance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-amber-100">
              <HardHat size={48} />
           </div>
           <div className="space-y-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Maintenance Mode</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                {systemConfig?.maintenance?.message || "The system is currently undergoing scheduled maintenance. We'll be back online shortly."}
              </p>
           </div>
           <div className="pt-4">
              <button 
                onClick={() => signOut()}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Log Out
              </button>
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact support for urgent issues</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 min-h-screen relative flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-xl text-gray-500"
            >
              <Menu size={24} />
            </button>
            <div className="lg:hidden font-black text-gray-900 tracking-tight text-lg">
              NexaSync
            </div>
            <div className="hidden sm:block">
              <h2 className="text-xl font-bold text-gray-800 line-clamp-1">Welcome Back, {session.user?.name}</h2>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {session.user?.role || 'Staff'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-2">
              <p className="text-[10px] text-gray-400 font-medium leading-none mb-1">Terminal ID</p>
              <p className="text-sm font-bold text-gray-700 uppercase">POS-001-A</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm ring-1 ring-blue-50 cursor-pointer">
              {session.user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
