"use client";

import React, { useState } from "react";
import {
  Building,
  Settings,
  Shield,
  Bell,
  FileText,
  CreditCard,
  Save,
  RefreshCw,
  Box,
  Truck,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  DollarSign,
  Smartphone,
  Info,
} from "lucide-react";
import { saveSystemSettings } from "@/app/settings/actions";

interface SystemSettingsProps {
  initialSettings: any;
}

export default function SystemSettingsTabs({ initialSettings }: SystemSettingsProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(initialSettings || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "system", label: "System", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "sms", label: "SMS Marketing", icon: Smartphone },
    { id: "receipt", label: "Receipt", icon: FileText },
    { id: "tax", label: "Tax & Payment", icon: CreditCard },
  ];

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const result = await saveSystemSettings(settings);
      if (result.success) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save settings." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            {/* Business Type */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Box className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Business Type</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">
                Select your business type to enable specialized features
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    Business Type *
                  </label>
                  <div className="relative">
                    <select 
                      value={settings.businessType || "Wholesale/Distribution"}
                      onChange={(e) => updateSetting("businessType", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-emerald-300 appearance-none pl-12"
                    >
                      <option>Wholesale/Distribution</option>
                      <option>Retail/Shop</option>
                      <option>Restaurant/Cafe</option>
                      <option>General Merchandise</option>
                    </select>
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                       <Box className="text-amber-700" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-blue-900 mb-3">Wholesale/Distribution Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                        {[
                          "Bulk inventory management", "Minimum order quantities",
                          "B2B customer management", "Order management",
                          "Delivery scheduling", "Pallet tracking",
                          "Volume pricing tiers", "Distributor network"
                        ].map(feat => (
                          <div key={feat} className="flex items-center gap-2 text-[11px] font-bold text-blue-700">
                            <CheckCircle2 size={12} /> {feat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Store Information</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">
                Basic store details and contact information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Store Name *</label>
                  <input 
                    type="text" 
                    value={settings.storeName || ""}
                    onChange={(e) => updateSetting("storeName", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-300 text-sm font-bold text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={settings.phoneNumber || ""}
                    onChange={(e) => updateSetting("phoneNumber", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-300 text-sm font-bold text-gray-700"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Address</label>
                  <textarea 
                    rows={3}
                    value={settings.address || ""}
                    onChange={(e) => updateSetting("address", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-300 text-sm font-bold text-gray-700"
                  ></textarea>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={settings.email || ""}
                    onChange={(e) => updateSetting("email", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-300 text-sm font-bold text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Regional Settings</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Configure locale, timezone, and currency</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Timezone</label>
                  <select 
                    value={settings.timezone || "Eastern Time (ET)"}
                    onChange={(e) => updateSetting("timezone", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none"
                  >
                    <option>Eastern Time (ET)</option>
                    <option>East Africa Time (EAT)</option>
                    <option>Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Currency</label>
                  <select 
                    value={settings.currency || "KES - Kenyan Shilling"}
                    onChange={(e) => updateSetting("currency", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none"
                  >
                    <option>KES - Kenyan Shilling</option>
                    <option>USD - US Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Date Format</label>
                  <select 
                    value={settings.dateFormat || "MM/DD/YYYY"}
                    onChange={(e) => updateSetting("dateFormat", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none"
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Language</label>
                  <select 
                    value={settings.language || "English"}
                    onChange={(e) => updateSetting("language", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none"
                  >
                    <option>English</option>
                    <option>Swahili</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case "system":
        return (
          <div className="space-y-6">
            {/* Backup & Maintenance */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Backup & Maintenance</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Configure automatic backups and system maintenance</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Automatic Backup</p>
                    <p className="text-[11px] text-gray-400 font-medium">Automatically backup database at scheduled intervals</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.autoBackup || false} onChange={e => updateSetting("autoBackup", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Backup Frequency</label>
                  <select 
                    value={settings.backupFreq || "Daily"}
                    onChange={e => updateSetting("backupFreq", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none"
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Maintenance Mode</p>
                    <p className="text-[11px] text-gray-400 font-medium">Enable maintenance mode to restrict system access</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.maintMode || false} onChange={e => updateSetting("maintMode", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Session & Security */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Session & Security</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Configure session timeout and login security</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    value={settings.sessionTimeout || 30}
                    onChange={e => updateSetting("sessionTimeout", parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Max Login Attempts</label>
                  <input 
                    type="number" 
                    value={settings.maxLoginAttempts || 5}
                    onChange={e => updateSetting("maxLoginAttempts", parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-700">Enable Audit Log</p>
                  <p className="text-[11px] text-gray-400 font-medium">Log all system activities and user actions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.enableAuditLog || false} onChange={e => updateSetting("enableAuditLog", e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Password Policy</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Configure password requirements and policies</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Require Strong Password</p>
                    <p className="text-[11px] text-gray-400 font-medium">Enforce complex password requirements (min 8 chars, uppercase, lowercase, numbers)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.strongPass || false} onChange={e => updateSetting("strongPass", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Password Expiry (days)</label>
                  <input 
                    type="number" 
                    value={settings.passExpiry || 90}
                    onChange={e => updateSetting("passExpiry", parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                  />
                  <p className="text-[10px] text-gray-400 font-medium mt-2">Users will be required to change password after this period</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Authentication</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Configure authentication methods</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Two-Factor Authentication</p>
                    <p className="text-[11px] text-gray-400 font-medium">Require 2FA for all user accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.enable2FA || false} onChange={e => updateSetting("enable2FA", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Single Sign-On (SSO)</p>
                    <p className="text-[11px] text-gray-400 font-medium">Enable SSO integration for enterprise authentication</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.enableSSO || false} onChange={e => updateSetting("enableSSO", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return <div className="p-10 text-center text-gray-400 font-bold">Notification settings coming soon.</div>;
      case "sms":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">SMS Gateway Configuration</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Configure your SMS provider to enable automated customer reminders</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Enable SMS Features</p>
                    <p className="text-[11px] text-gray-400 font-medium">Activate automated reminders and notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.sms?.enabled || false} 
                      onChange={e => updateSetting("sms", { ...settings.sms, enabled: e.target.checked })} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">SMS Provider</label>
                    <select 
                      value={settings.sms?.provider || "AFRICAS_TALKING"}
                      onChange={e => updateSetting("sms", { ...settings.sms, provider: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none"
                    >
                      <option value="AFRICAS_TALKING">Africa's Talking (Kenya)</option>
                      <option value="ADVANTA">Advanta SMS</option>
                      <option value="MOVESMS">Move SMS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Sender ID (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DACAIN"
                      value={settings.sms?.senderId || ""}
                      onChange={e => updateSetting("sms", { ...settings.sms, senderId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">API Username</label>
                    <input 
                      type="text" 
                      placeholder="Username (e.g. sandbox)"
                      value={settings.sms?.username || ""}
                      onChange={e => updateSetting("sms", { ...settings.sms, username: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">API Key</label>
                    <input 
                      type="password" 
                      placeholder="At_Akey_..."
                      value={settings.sms?.apiKey || ""}
                      onChange={e => updateSetting("sms", { ...settings.sms, apiKey: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                  <Info className="text-amber-500 shrink-0" size={18} />
                  <div>
                    <p className="text-xs font-black text-amber-800">Africa's Talking Integration</p>
                    <p className="text-[10px] text-amber-600 font-bold mt-1">Use 'sandbox' as username for testing. Real environment requires a valid API key and registered Sender ID from Africa's Talking dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
               <p className="text-sm font-bold text-gray-400 mb-4 italic">"Automating your collections increases recovery rate by up to 40%."</p>
               <div className="flex justify-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Immediate</span>
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Scheduled</span>
                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Manual</span>
                     <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
               </div>
            </div>
          </div>
        );
      case "receipt":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Receipt Configuration</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Customize receipt appearance and delivery</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Business Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DACAIN SYSTEMS"
                      value={settings.receiptBusinessName || ""}
                      onChange={e => updateSetting("receiptBusinessName", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Physical Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123 Main St, Nairobi"
                      value={settings.receiptPhysicalAddress || ""}
                      onChange={e => updateSetting("receiptPhysicalAddress", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +254 712 345 678"
                      value={settings.receiptPhoneNumber || ""}
                      onChange={e => updateSetting("receiptPhoneNumber", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">KRA PIN</label>
                    <input 
                      type="text" 
                      placeholder="e.g. P123456789A"
                      value={settings.receiptKraPin || ""}
                      onChange={e => updateSetting("receiptKraPin", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Logo Upload (Monochrome .png or .bmp)</label>
                  <input 
                    type="file" 
                    accept=".png,.bmp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateSetting("receiptLogo", reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                  />
                  {settings.receiptLogo && (
                    <div className="mt-4 flex flex-col items-center gap-2 border border-dashed border-gray-200 p-4 rounded-xl w-max">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logo Preview</span>
                       <img src={settings.receiptLogo} alt="Receipt Logo" className="max-h-20 w-auto filter grayscale" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Welcome Message / Receipt Header</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Welcome to DACAIN SYSTEMS"
                    value={settings.receiptHeader || ""}
                    onChange={e => updateSetting("receiptHeader", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                  ></textarea>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Return Policy / Thank You Note / Receipt Footer</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Thank you for your business. Goods once sold are not returnable."
                    value={settings.receiptFooter || ""}
                    onChange={e => updateSetting("receiptFooter", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Printer Specs</label>
                    <select 
                      value={settings.printerSpecs || "80mm"}
                      onChange={e => updateSetting("printerSpecs", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none"
                    >
                      <option value="58mm">58mm Thermal Printer</option>
                      <option value="80mm">80mm Thermal Printer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Character Encoding</label>
                    <div className="flex items-center gap-4 mt-3">
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="radio" 
                           name="characterEncoding" 
                           value="Standard" 
                           checked={(settings.characterEncoding || "Standard") === "Standard"}
                           onChange={e => updateSetting("characterEncoding", e.target.value)}
                           className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                         />
                         <span className="text-sm font-bold text-gray-700">Standard</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="radio" 
                           name="characterEncoding" 
                           value="UTF-8" 
                           checked={(settings.characterEncoding || "Standard") === "UTF-8"}
                           onChange={e => updateSetting("characterEncoding", e.target.value)}
                           className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                         />
                         <span className="text-sm font-bold text-gray-700">UTF-8</span>
                       </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-700">Auto Print Receipt</p>
                      <p className="text-[11px] text-gray-400 font-medium">Auto print after transaction</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.autoPrint || false} onChange={e => updateSetting("autoPrint", e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-700">Show Cashier Name</p>
                      <p className="text-[11px] text-gray-400 font-medium">Display cashier identity on receipt</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.showCashierName ?? true} onChange={e => updateSetting("showCashierName", e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "tax":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">VAT / Tax Configuration</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Configure VAT (16% default) and tax settings</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Enable VAT / Tax</p>
                    <p className="text-[11px] text-gray-400 font-medium">Apply VAT to all transactions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.enableTax || false} onChange={e => updateSetting("enableTax", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">VAT Rate (%)</label>
                    <input 
                      type="number" 
                      value={settings.taxRate || 16}
                      onChange={e => updateSetting("taxRate", parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-bold text-gray-700"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs font-black text-gray-700">VAT Inclusive Pricing</p>
                      <p className="text-[10px] text-gray-400 font-medium">Include VAT in displayed prices</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.taxInclusive || false} onChange={e => updateSetting("taxInclusive", e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-gray-400" size={20} />
                <h2 className="text-lg font-black text-gray-800">Payment Methods</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-6">Enable or disable payment methods</p>
              
              <div className="space-y-6">
                {[
                  { id: "methodCash", label: "Cash Payment", desc: "Allow cash payments at checkout" },
                  { id: "methodCard", label: "Card Payment", desc: "Allow credit/debit card payments" },
                  { id: "methodMobile", label: "Mobile Payment", desc: "Allow mobile payment methods (Apple Pay, Google Pay, etc.)" }
                ].map(method => (
                  <div key={method.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-700">{method.label}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{method.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings[method.id] ?? true} onChange={e => updateSetting(method.id, e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-700">Allow Partial Payment</p>
                    <p className="text-[11px] text-gray-400 font-medium">Allow customers to pay in installments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.allowPartial || false} onChange={e => updateSetting("allowPartial", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">System Settings</h1>
          <p className="text-sm text-gray-500 font-medium">Configure system parameters and preferences</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => window.location.reload()}
             className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
           >
             <RefreshCw size={15} /> Reload
           </button>
           <button 
             onClick={handleSave}
             disabled={saving}
             className="flex items-center gap-1.5 px-6 py-2.5 bg-[#008080] text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-700/20 disabled:opacity-50"
           >
              {saving ? <RefreshCw className="animate-spin" size={15} /> : <Save size={15} />}
              Save Changes
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
        }`}>
           <Info size={18} />
           {message.text}
        </div>
      )}

      {/* Tab Content */}
      <div className="pb-20">
        {renderTabContent()}
      </div>

      {/* Footer Branding */}
      <div className="border-t border-gray-50 pt-8 mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-400 font-bold">
          <p>© 2026 DACAIN SYSTEMS. All rights reserved.</p>
          <p>Developed by <span className="text-emerald-600">DACAIN SYSTEMS, Turning Ideas Into Reality</span></p>
        </div>
      </div>
    </div>
  );
}
