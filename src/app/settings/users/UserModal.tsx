'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createUser } from './actions';

export default function UserModal({ isOpen, onClose, tenantId }: { isOpen: boolean, onClose: () => void, tenantId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    };

    const res = await createUser(tenantId, data);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-gray-100">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8 border-b border-gray-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <span className="font-bold text-xl">+</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Add Staff Account</h2>
            <p className="text-xs font-medium text-gray-500">Grant access to your POS terminal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              name="name" 
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-800 bg-gray-50/50"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              name="email" 
              type="email"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-800 bg-gray-50/50"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Temporary Password</label>
            <input 
              name="password" 
              type="password"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-800 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Access Role</label>
            <select 
              name="role" 
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-800 bg-gray-50/50 appearance-none"
            >
              <option value="CASHIER">CASHIER (POS Only)</option>
              <option value="MANAGER">MANAGER (POS + Inventory)</option>
              <option value="ADMIN">ADMIN (Full System Access)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
