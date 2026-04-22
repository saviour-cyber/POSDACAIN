import prisma from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserMinus,
  Filter
} from "lucide-react";

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const users = await prisma.user.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: 'desc' }
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE' || !u.status).length;
  const admins = users.filter(u => u.role === 'ADMIN').length;
  const staff = users.filter(u => u.role === 'STAFF').length;

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Users", value: activeUsers, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Admin Users", value: admins, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Staff Users", value: staff, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">User Management</h1>
            <p className="text-sm text-gray-500 font-medium">Manage system users, roles, and access permissions</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#008080] text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-700/20">
            <UserPlus size={18} />
            Add New User
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search users by name, email, or role..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all">
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-y border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm uppercase">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 group-hover:text-[#008080] transition-colors">{user.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {user.role === 'ADMIN' ? <ShieldCheck size={12} /> : <Users size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        user.status === 'INACTIVE' ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${user.status === 'INACTIVE' ? 'bg-red-600' : 'bg-emerald-600'}`} />
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit User">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete User">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400">
            <p>Showing {users.length} of {users.length} users</p>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 rounded border border-gray-100 opacity-50">Prev</button>
              <button disabled className="px-3 py-1 rounded border border-gray-100 opacity-50">Next</button>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="text-center mt-12 pt-8 border-t border-gray-50">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Developed by <span className="text-[#008080]">DACAIN SYSTEMS, Turning Ideas Into Reality</span>
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
