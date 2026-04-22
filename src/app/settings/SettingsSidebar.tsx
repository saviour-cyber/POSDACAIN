'use client';

import { 
  Building, 
  User, 
  Shield, 
  Bell,
  Cloud,
  ChevronRight,
  Users,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsSidebar({ activeTab }: { activeTab: string }) {
  const navItems = [
    { label: 'Business Profile', icon: Building, href: '/settings', id: 'profile' },
    { label: 'User Management', icon: Users, href: '/settings/users', id: 'users' },
    { label: 'Payment Gateways', icon: CreditCard, href: '/settings/payment', id: 'payment' },
    { label: 'Security & Access', icon: Shield, href: '/settings', id: 'security' },
    { label: 'Notifications', icon: Bell, href: '/settings', id: 'notifications' },
    { label: 'Backup & Cloud', icon: Cloud, href: '/settings/backup', id: 'backup' },
  ];

  return (
    <div className="lg:col-span-1 space-y-2">
      {navItems.map((item, idx) => {
        const isActive = activeTab === item.id;
        return (
          <Link href={item.href} key={idx} className="block w-full">
            <button 
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} />
                <span className="font-bold text-sm tracking-wide uppercase">{item.label}</span>
              </div>
              <ChevronRight size={18} opacity={isActive ? 1 : 0.4} />
            </button>
          </Link>
        );
      })}
    </div>
  );
}
