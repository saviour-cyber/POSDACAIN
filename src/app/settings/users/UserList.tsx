'use client';

import { useState } from 'react';
import { User as UserIcon, Shield, MoreVertical, Plus } from 'lucide-react';
import UserModal from './UserModal';
import { deleteUser } from './actions';

export default function UserList({ initialUsers, tenantId }: { initialUsers: any[], tenantId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? They will immediately lose access to the system.')) {
      await deleteUser(userId, tenantId);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
            <UserIcon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Staff Accounts</h3>
            <p className="text-xs text-gray-500 font-medium">Manage who can access your POS</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-xs uppercase tracking-widest"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Role / Access</th>
              <th className="px-8 py-4">Joined</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase overflow-hidden">
                      {user.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                      : user.role === 'MANAGER'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-green-50 text-green-600 border border-green-100'
                  }`}>
                    <Shield size={10} />
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-xs text-gray-500 font-bold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tenantId={tenantId}
      />
    </div>
  );
}
