'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerTenant } from './actions';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const businessTypes = [
    "General Merchandise",
    "Pharmacy",
    "Clinic",
    "Wholesale & Distribution",
    "Service-Based",
    "Restaurant",
    "Grocery",
    "Hardware",
    "Boutique / Fashion",
    "School"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await registerTenant(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Auto-login after successful registration
      const loginRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        // If auto-login fails for some reason, push to login page
        router.push('/login?registered=true');
      } else {
        router.push('/pos'); // Go straight to POS on success
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 text-sm">
      <div className="max-w-2xl w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="DACAIN SYSTEMS" 
            className="h-20 mx-auto mb-2 object-contain"
          />
          <p className="text-gray-500 mt-2">Get started with DACAIN SYSTEMS in seconds.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-50 space-y-4">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">1. Administrator Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="adminName"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                  placeholder="jsmith@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-50 space-y-4">
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">2. Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Business / Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-sm"
                  placeholder="DACAIN SYSTEMS Main Store"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Business Type (Vertical)</label>
                <select
                  name="businessType"
                  required
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-xl border border-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-sm appearance-none font-bold text-gray-700"
                >
                  <option value="" disabled>Select your industry...</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-wide">This customizes your POS interface.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-black hover:underline">
              Sign in Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
