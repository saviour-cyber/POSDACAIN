'use client';

import { useState } from 'react';
import { CreditCard, ShieldCheck, Key, Save, AlertCircle } from 'lucide-react';

interface Props {
  initialData: any;
}

export default function PaymentSettingsClient({ initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    shortcode: initialData?.shortcode || '',
    passkey: initialData?.passkey || '',
    consumerKey: initialData?.consumerKey || '',
    consumerSecret: initialData?.consumerSecret || '',
    isActive: initialData?.isActive ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payment Gateways</h1>
        <p className="text-sm font-medium text-gray-400 mt-0.5">Configure your external payment processing credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* M-Pesa STK Push Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-black text-gray-900">M-Pesa Daraja (STK Push)</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Mobile Money Integration</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Business Shortcode</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <ShieldCheck size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 174379"
                    value={formData.shortcode}
                    onChange={e => setFormData({...formData, shortcode: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">PassKey</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Key size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Encryption Passkey"
                    value={formData.passkey}
                    onChange={e => setFormData({...formData, passkey: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consumer Key</label>
              <input
                type="text"
                required
                placeholder="Daraja App Consumer Key"
                value={formData.consumerKey}
                onChange={e => setFormData({...formData, consumerKey: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consumer Secret</label>
              <input
                type="password"
                required
                placeholder="Daraja App Consumer Secret"
                value={formData.consumerSecret}
                onChange={e => setFormData({...formData, consumerSecret: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-700">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">
                Ensure you are using Sandbox credentials for testing. Switch to Production keys only after applying for "Go Live" on the Safaricom Developer Portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col">
            {success && <p className="text-emerald-600 font-black text-sm flex items-center gap-2"><ShieldCheck size={16} /> Configuration Saved Successfully</p>}
            {error && <p className="text-red-600 font-black text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</p>}
            {!success && !error && <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Unsaved Changes Will be Lost</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 border border-transparent text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
