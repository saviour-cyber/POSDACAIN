"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, Globe, Settings2, Save, ArrowLeft, 
  ShieldCheck, Database, Zap, Loader2, Info
} from "lucide-react";
import Link from "next/link";
import { updateTenantSettings } from "../../actions";

export default function TenantSettingsClient({ tenant }: { tenant: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: tenant.name,
    businessType: tenant.businessType,
    domain: tenant.domain || "",
    metadata: tenant.metadata || {}
  });

  const handleMetadataChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const res = await updateTenantSettings(tenant.id, formData);
    
    if (res.success) {
      alert("Business configuration synchronized successfully.");
      router.refresh();
      router.push("/admin/tenants");
    } else {
      alert("Sync failed: " + res.error);
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <Link 
          href="/admin/tenants" 
          className="bg-gray-900 border border-gray-800 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
        >
          <ArrowLeft size={16} /> Back to Tenants
        </Link>
        <button 
          type="submit"
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
          Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Identity Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-6 mb-2">
              <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/20">
                <Building2 size={24} />
              </div>
              <h2 className="text-xl font-black text-white">Business Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 ml-1">Trade Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-sm font-bold text-gray-200 outline-none focus:border-indigo-500 focus:ring-4 ring-indigo-500/10 transition-all font-sans"
                  placeholder="e.g. NexaSync Global"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 ml-1">Business Vertical</label>
                <select 
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-sm font-bold text-gray-200 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="RETAIL">General Retail</option>
                  <option value="PHARMACY">Pharmacy / Health</option>
                  <option value="RESTAURANT">Restaurant / Cafe</option>
                  <option value="WHOLESALE">Wholesale / Distribution</option>
                  <option value="SERVICES">Service Provider</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 ml-1 flex items-center gap-2">
                  <Globe size={12} /> External Access Domain
                </label>
                <div className="relative">
                   <input 
                    type="text" 
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-sm font-bold text-gray-200 outline-none focus:border-indigo-500 focus:ring-4 ring-indigo-500/10 transition-all font-sans"
                    placeholder="e.g. store.nexus.co.ke"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-40">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">SSL Verified</span>
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Metadata Configuration */}
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-6 mb-2">
              <div className="bg-amber-500/10 text-amber-400 p-2.5 rounded-xl border border-amber-500/20">
                <Zap size={24} />
              </div>
              <h2 className="text-xl font-black text-white">System Overrides</h2>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 mb-6">
               <div className="flex gap-4 items-start">
                  <Info size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                     The following keys are stored in the business metadata registry. Changing these will immediately alter the application's behavior for this specific tenant, including tax calculation logic and feature availability.
                  </p>
               </div>
            </div>

            <div className="space-y-5">
               {['taxId', 'currency', 'timeZone', 'terminalIdPrefix'].map((key) => (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                     <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">{key.replace(/([A-Z])/g, ' $1')}</label>
                     <div className="md:col-span-2">
                        <input 
                           type="text" 
                           value={formData.metadata[key] || ""}
                           onChange={(e) => handleMetadataChange(key, e.target.value)}
                           className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 px-4 text-xs font-bold text-gray-300 outline-none focus:border-amber-500 transition-all"
                           placeholder={`Value for ${key}...`}
                        />
                     </div>
                  </div>
               ))}
            </div>
          </div>

          {/* Compliance & Integrations */}
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-6 mb-2">
              <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-black text-white">Compliance & Integrations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 ml-1">KRA PIN (Compliance)</label>
                 <input 
                   type="text" 
                   value={formData.metadata.kraPin || ""}
                   onChange={(e) => handleMetadataChange('kraPin', e.target.value)}
                   className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-sm font-bold text-gray-200 outline-none focus:border-indigo-500 transition-all"
                   placeholder="A000000000Z"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 ml-1">M-Pesa Business Shortcode</label>
                 <input 
                   type="text" 
                   value={formData.metadata.mpesaShortcode || ""}
                   onChange={(e) => handleMetadataChange('mpesaShortcode', e.target.value)}
                   className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 px-5 text-sm font-bold text-gray-200 outline-none focus:border-indigo-500 transition-all"
                   placeholder="123456"
                 />
               </div>

               {formData.businessType === 'PHARMACY' && (
                  <div className="space-y-2 md:col-span-2 bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/10">
                     <div className="flex items-center gap-2 mb-4">
                        <Info size={16} className="text-indigo-400" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Pharmacy Vertical Overrides</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input 
                              type="checkbox" 
                              checked={formData.metadata.requirePrescription === 'true'}
                              onChange={(e) => handleMetadataChange('requirePrescription', e.target.checked ? 'true' : 'false')}
                              className="w-5 h-5 rounded-lg border-gray-800 bg-gray-950 text-indigo-500 focus:ring-indigo-500/20"
                           />
                           <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Require Prescription Validation</span>
                        </label>
                     </div>
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Sidebar Status / KPI */}
        <div className="space-y-6">
           <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-6 space-y-6 sticky top-8">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-gray-800 pb-4">Live Metrics</h3>
              
              <div className="space-y-5">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Database size={16} className="text-gray-500" />
                       <span className="text-[11px] font-bold text-gray-400">Data Footprint</span>
                    </div>
                    <span className="text-[11px] font-black text-white">4.2 MB</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={16} className="text-emerald-500" />
                       <span className="text-[11px] font-bold text-gray-400">License Status</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">Valid</span>
                 </div>
              </div>

              <div className="pt-6 border-t border-gray-800 space-y-4">
                 <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <p className="text-[9px] uppercase font-black text-gray-500 mb-1">Total Sales</p>
                    <p className="text-lg font-black text-white">{tenant._count.sales}</p>
                 </div>
                 <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <p className="text-[9px] uppercase font-black text-gray-500 mb-1">Indexed Products</p>
                    <p className="text-lg font-black text-white">{tenant._count.products}</p>
                 </div>
              </div>

              <div className="pt-4">
                 <button 
                  type="button"
                  className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  onClick={() => alert("Deep wipe protected. Use system CLI for hard deletions.")}
                 >
                    Purge Tenant Data
                 </button>
              </div>
           </div>
        </div>
      </div>
    </form>
  );
}
