'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Store,
  X,
  LineChart,
  Activity,
  CreditCard,
  Building2,
  Truck,
  Anchor
} from 'lucide-react';

const mainItems = [
  { icon: LayoutDashboard, label: 'General Dashboard', href: '/' },
  { icon: ShoppingCart, label: 'Sales & Checkout', href: '/pos' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: BarChart3, label: 'Sales Reports', href: '/reports' },
  { icon: CreditCard, label: 'Pending Collections', href: '/collections' },
  { icon: BarChart3, label: 'Stock Reports', href: '/reports/stock' },
  { icon: Package, label: 'Inventory Management', href: '/inventory' },
  { icon: Building2, label: 'Supplier Registry', href: '/suppliers' },
  { icon: Truck, label: 'Procurement Center', href: '/procurement' },
  { icon: Package, label: 'Stock Dashboard', href: '/inventory/dashboard' },
  { icon: Package, label: 'Stock Control', href: '/inventory/adjustments' },
  { icon: LineChart, label: 'Analytics', href: '/analytics' },
];

const adminItems = [
  { icon: Settings, label: 'System Settings', href: '/settings' },
  { icon: Users, label: 'User Management', href: '/settings/users' },
  { icon: Package, label: 'Backup', href: '/settings/backup' },
  { icon: BarChart3, label: 'Billing & Plans', href: '/settings/billing' },
  { icon: CreditCard, label: 'Payment Gateways', href: '/settings/payment' },
  { icon: Activity, label: 'System Admin', href: '/settings/system' },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const renderNavItems = (items: typeof mainItems) => (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
              isActive 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
            <span className="font-semibold text-[13px] flex-1">{item.label}</span>
            {isActive && <div className="w-1 h-1 rounded-full bg-blue-600" />}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0 w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center w-full">
              <img 
                src="/logo.png" 
                alt="DACAIN SYSTEMS" 
                className="h-12 w-auto mb-1 object-contain"
              />
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-2 overflow-y-auto space-y-6 scrollbar-hide">
          <section>
            <h2 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Main Menu</h2>
            {renderNavItems(mainItems)}
          </section>

          <section>
            <h2 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Administration</h2>
            {renderNavItems(adminItems)}
          </section>
        </div>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
          >
            <LogOut size={20} className="text-gray-400 group-hover:text-red-500" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
