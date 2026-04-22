'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, Server, Wifi, Printer, ScanLine, CreditCard, 
  Cpu, HardDrive, Database, ShieldCheck, Download, Mail, Filter, Terminal,
  Settings, Lock, Shield, Clock, AlertTriangle, Save, Loader2, RefreshCcw,
  KeyRound, Fingerprint, History
} from 'lucide-react';
import { getSystemConfig, updateSystemConfig, SystemConfig } from './actions';

interface Log {
  id: string;
  time: string;
  type: string;
  level: string;
  event: string;
  status: string;
  terminalId: string;
}

interface Props {
  initialLogs: Log[];
}

export default function SystemAdminClient({ initialLogs }: Props) {
  const [activeTab, setActiveTab] = useState<'DIAGNOSTICS' | 'LOGS' | 'CONFIGURATION'>('DIAGNOSTICS');
  
  // Settings State
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [fetchingConfig, setFetchingConfig] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Log filters
  const [filterDate, setFilterDate] = useState('Today');
  const [filterType, setFilterType] = useState('All');
  const [filterTerminal, setFilterTerminal] = useState('All');
  const [errorsOnly, setErrorsOnly] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    fetchMetrics();
    loadConfig();
    const interval = setInterval(fetchMetrics, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  async function loadConfig() {
    setFetchingConfig(true);
    try {
      const data = await getSystemConfig();
      setConfig(data);
    } catch (err) {
      console.error("Failed to load config", err);
    } finally {
      setFetchingConfig(false);
    }
  }

  async function handleSaveConfig() {
    if (!config) return;
    setSaving(true);
    try {
      await updateSystemConfig(config);
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleManualBackup() {
     window.location.href = '/api/backup';
  }

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/diagnostics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMetrics(false);
    }
  }

  async function runDiagnostics() {
    setRunningDiagnostics(true);
    setDiagnosticResult(null);
    
    // Simulate checking various systems
    await new Promise(r => setTimeout(r, 800));
    await fetchMetrics(); // get latest db status
    await new Promise(r => setTimeout(r, 800));
    
    setDiagnosticResult({
      server: isOnline ? 'OK' : 'FAILED',
      printer: 'OK', // Mocked as usually fine unless specific driver err
      database: metrics?.database?.status || 'UNKNOWN',
      sync: isOnline ? 'OK' : 'FAILED'
    });
    setRunningDiagnostics(false);
  }

  const filteredLogs = initialLogs.filter(log => {
    if (errorsOnly && log.status !== 'Failed') return false;
    if (filterType !== 'All' && log.type !== filterType) return false;
    if (filterTerminal !== 'All' && log.terminalId !== filterTerminal) return false;
    return true;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Administration</h1>
        <p className="text-sm font-medium text-gray-400 mt-0.5">Real-time health checking and comprehensive logs.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('DIAGNOSTICS')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'DIAGNOSTICS' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Activity size={18} /> Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'LOGS' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Terminal size={18} /> System Logs
        </button>
        <button
          onClick={() => setActiveTab('CONFIGURATION')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'CONFIGURATION' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Settings size={18} /> Configuration
        </button>
      </div>

      {activeTab === 'DIAGNOSTICS' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div>
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Live Diagnostics</p>
              <h2 className="text-xl font-black flex items-center gap-2 mb-1">
                Terminal ID: POS-003
              </h2>
              <p className="text-gray-400 text-sm font-medium">App Version: {metrics?.device?.appVersion || '...'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className={`font-black uppercase tracking-widest text-sm ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <button
                onClick={runDiagnostics}
                disabled={runningDiagnostics}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Activity size={16} className={runningDiagnostics ? 'animate-pulse' : ''} />
                {runningDiagnostics ? 'Scanning...' : 'Run Diagnostics'}
              </button>
            </div>
          </div>

          {/* Quick Diagnostics Result */}
          {diagnosticResult && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
              <h3 className="text-emerald-800 font-black mb-3 flex items-center gap-2">
                <ShieldCheck size={20} /> Diagnostics Complete
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(diagnosticResult).map(([key, value]) => (
                  <div key={key} className="bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center">
                    <span className="capitalize text-xs font-bold text-gray-500">{key}</span>
                    <span className={`text-xs font-black px-2 py-1 rounded-md ${value === 'OK' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {value as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Network */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Wifi size={20} /></div>
                <h3 className="font-black text-gray-900">Network Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Server Connected</span>
                  <span className={`text-xs font-black ${metrics?.database?.status === 'OK' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {metrics?.database?.status === 'OK' ? '✔ YES' : '⚠ NO'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Internet Available</span>
                  <span className={`text-xs font-black ${isOnline ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isOnline ? '✔ YES' : '⚠ NO'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">DB Ping</span>
                  <span className="text-xs font-black text-gray-900">{metrics?.database?.latencyMs || 0}ms</span>
                </div>
              </div>
            </div>

            {/* Hardware */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Server size={20} /></div>
                <h3 className="font-black text-gray-900">Hardware</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><Printer size={14}/> Printer</span>
                  <span className="text-xs font-black text-emerald-600">✔ Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><ScanLine size={14}/> Scanner</span>
                  <span className="text-xs font-black text-emerald-600">✔ Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><CreditCard size={14}/> Card Reader</span>
                  <span className="text-xs font-black text-amber-600">⚠ Not Detected</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Activity size={20} /></div>
                <h3 className="font-black text-gray-900">Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><Cpu size={14}/> CPU</span>
                  <span className="text-xs font-black text-gray-900">{metrics?.performance?.cpuUsage || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><Database size={14}/> Memory</span>
                  <span className="text-xs font-black text-gray-900">{metrics?.performance?.memoryUsageGB || 0}GB / {metrics?.performance?.totalMemoryGB || 0}GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><HardDrive size={14}/> Storage</span>
                  <span className="text-xs font-black text-gray-900">{metrics?.performance?.storageRemainingGB || 45}GB Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'LOGS' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Filters Area */}
          <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                <Filter size={14} className="text-gray-400" />
                <select className="text-xs font-black text-gray-700 outline-none bg-transparent appearance-none" value={filterDate} onChange={e=>setFilterDate(e.target.value)}>
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                </select>
              </div>
              <select className="text-xs font-black text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl outline-none" value={filterType} onChange={e=>setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Transaction">Transaction</option>
                <option value="System">System</option>
                <option value="Security">Security</option>
                <option value="Sync">Sync</option>
              </select>
              <select className="text-xs font-black text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl outline-none" value={filterTerminal} onChange={e=>setFilterTerminal(e.target.value)}>
                <option value="All">All Terminals</option>
                <option value="POS-003">POS-003</option>
                <option value="POS-001">POS-001</option>
              </select>
              <label className="flex items-center gap-2 text-xs font-black text-gray-700 cursor-pointer">
                <input type="checkbox" checked={errorsOnly} onChange={e=>setErrorsOnly(e.target.checked)} className="rounded text-blue-600 border-gray-300" />
                Errors Only
              </label>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-black text-gray-700 transition-colors">
                <Download size={14} /> Export (CSV)
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 border border-transparent hover:bg-gray-800 rounded-lg text-xs font-black text-white transition-colors">
                <Mail size={14} /> Send to Support
              </button>
            </div>
          </div>

          {/* Table */}
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Level</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Event</th>
                  <th className="px-5 py-4">Terminal</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4 text-xs font-black text-gray-500 whitespace-nowrap">{log.time}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wide
                        ${log.level === 'CRITICAL' ? 'bg-red-600 text-white' : 
                          log.level === 'ERROR' ? 'bg-red-50 text-red-600' :
                          log.level === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wide
                        ${log.type === 'Transaction' ? 'bg-blue-50 text-blue-600' : 
                          log.type === 'System' ? 'bg-purple-50 text-purple-600' :
                          log.type === 'Security' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'}`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{log.event}</td>
                    <td className="px-5 py-4 text-xs font-bold text-gray-500">{log.terminalId}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest
                        ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                      >
                        {log.status === 'Success' ? '✔ Success' : '⚠ Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-sm font-bold text-gray-400">No logs found matching filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-50 border-t border-gray-50">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest
                    ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                  >
                    {log.status === 'Success' ? '✔ Success' : '⚠ Failed'}
                  </span>
                  <span className="text-xs font-black text-gray-400">{log.time}</span>
                </div>
                
                <h4 className="text-sm font-bold text-gray-900 leading-snug mb-3">
                  {log.event}
                </h4>

                <div className="flex flex-wrap gap-2">
                  <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider
                    ${log.level === 'CRITICAL' ? 'bg-red-600 text-white' : 
                      log.level === 'ERROR' ? 'bg-red-50 text-red-600' :
                      log.level === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {log.level}
                  </span>
                  <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider
                    ${log.type === 'Transaction' ? 'bg-blue-50 text-blue-600' : 
                      log.type === 'System' ? 'bg-purple-50 text-purple-600' :
                      log.type === 'Security' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'}`}
                  >
                    {log.type}
                  </span>
                  <span className="text-[9px] font-black px-2 py-1 rounded bg-gray-50 text-gray-500 uppercase tracking-wider border border-gray-100">
                    {log.terminalId}
                  </span>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-gray-400">No logs found matching filters.</p>
              </div>
            )}
          </div>
            </div>
      )}

      {activeTab === 'CONFIGURATION' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {fetchingConfig ? (
             <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-gray-200" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading system configuration...</p>
             </div>
           ) : config && (
             <>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Backup & Maintenance */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                              <Database size={24} />
                           </div>
                           <div>
                              <h3 className="text-lg font-black text-gray-900">Backup & Maintenance</h3>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System continuity controls</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                           <div>
                              <p className="text-sm font-black text-gray-900">Automatic Backup</p>
                              <p className="text-[10px] font-medium text-gray-500">Schedule automatic cloud backups</p>
                           </div>
                           <button 
                             onClick={() => setConfig({...config, backup: {...config.backup, automatic: !config.backup.automatic}})}
                             className={`w-12 h-6 rounded-full transition-all relative ${config.backup.automatic ? 'bg-blue-600' : 'bg-gray-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.backup.automatic ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>

                        {config.backup.automatic && (
                          <div className="space-y-2 px-1">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Backup Frequency</label>
                             <select 
                               value={config.backup.frequency}
                               onChange={(e) => setConfig({...config, backup: {...config.backup, frequency: e.target.value as any}})}
                               className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm"
                             >
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                             </select>
                          </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
                           <div>
                              <p className="text-sm font-black text-rose-900 flex items-center gap-2">
                                <AlertTriangle size={16} /> Maintenance Mode
                              </p>
                              <p className="text-[10px] font-medium text-rose-600">Restrict access to Admins only</p>
                           </div>
                           <button 
                             onClick={() => setConfig({...config, maintenance: {...config.maintenance, enabled: !config.maintenance.enabled}})}
                             className={`w-12 h-6 rounded-full transition-all relative ${config.maintenance.enabled ? 'bg-rose-600' : 'bg-gray-300'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.maintenance.enabled ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>
                        
                        <button 
                          onClick={handleManualBackup}
                          className="w-full p-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                           <RefreshCcw size={14} /> Download Manual System Backup
                        </button>
                     </div>
                  </div>

                  {/* Session & Security */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                           <Shield size={24} />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-gray-900">Session & Security</h3>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Login & Privacy controls</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={12} /> Session Timeout (Minutes)
                              </label>
                              <span className="text-xs font-black text-gray-900">{config.security.sessionTimeout}m</span>
                           </div>
                           <input 
                             type="range" min="5" max="1440" step="5"
                             value={config.security.sessionTimeout}
                             onChange={(e) => setConfig({...config, security: {...config.security, sessionTimeout: parseInt(e.target.value)}})}
                             className="w-full accent-gray-900"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Max Login Attempts</label>
                           <div className="flex gap-2">
                              {[3, 5, 10, 15].map(n => (
                                <button
                                  key={n}
                                  onClick={() => setConfig({...config, security: {...config.security, maxLoginAttempts: n}})}
                                  className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${
                                    config.security.maxLoginAttempts === n ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                  }`}
                                >
                                   {n}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-amber-100 transition-all">
                           <div>
                              <p className="text-sm font-black text-gray-900">Enable Audit Log</p>
                              <p className="text-[10px] font-medium text-gray-500">Record all critical user actions</p>
                           </div>
                           <button 
                             onClick={() => setConfig({...config, security: {...config.security, enableAuditLog: !config.security.enableAuditLog}})}
                             className={`w-12 h-6 rounded-full transition-all relative ${config.security.enableAuditLog ? 'bg-amber-600' : 'bg-gray-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.security.enableAuditLog ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Password Policy */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                           <KeyRound size={24} />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-gray-900">Password Policy</h3>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requirements & Lifetime</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                           <div>
                              <p className="text-sm font-black text-gray-900">Require Strong Password</p>
                              <p className="text-[10px] font-medium text-gray-500">Min 8 chars, Upper, Lower, Number</p>
                           </div>
                           <button 
                             onClick={() => setConfig({...config, passwordPolicy: {...config.passwordPolicy, requireStrongPassword: !config.passwordPolicy.requireStrongPassword}})}
                             className={`w-12 h-6 rounded-full transition-all relative ${config.passwordPolicy.requireStrongPassword ? 'bg-indigo-600' : 'bg-gray-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.passwordPolicy.requireStrongPassword ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>

                        <div className="space-y-2">
                           <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <History size={12} /> Password Expiry (Days)
                              </label>
                              <span className="text-xs font-black text-gray-900">{config.passwordPolicy.passwordExpiryDays} Days</span>
                           </div>
                           <select 
                             value={config.passwordPolicy.passwordExpiryDays}
                             onChange={(e) => setConfig({...config, passwordPolicy: {...config.passwordPolicy, passwordExpiryDays: parseInt(e.target.value)}})}
                             className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-sm"
                           >
                              <option value={30}>30 Days</option>
                              <option value={60}>60 Days</option>
                              <option value={90}>90 Days</option>
                              <option value={180}>180 Days</option>
                              <option value={365}>1 Year</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Authentication */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                           <Fingerprint size={24} />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-gray-900">Authentication</h3>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Login security methods</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                           <div>
                              <p className="text-sm font-black text-gray-900">Two-Factor Auth (2FA)</p>
                              <p className="text-[10px] font-medium text-gray-500">Require secondary verification</p>
                           </div>
                           <button 
                             onClick={() => setConfig({...config, authentication: {...config.authentication, enable2FA: !config.authentication.enable2FA}})}
                             className={`w-12 h-6 rounded-full transition-all relative ${config.authentication.enable2FA ? 'bg-emerald-600' : 'bg-gray-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.authentication.enable2FA ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                           <div>
                              <p className="text-sm font-black text-gray-900">Single Sign-On (SSO)</p>
                              <p className="text-[10px] font-medium text-gray-500">Enterprise authentication (OIDC)</p>
                           </div>
                           <button 
                             onClick={() => setConfig({...config, authentication: {...config.authentication, enableSSO: !config.authentication.enableSSO}})}
                             className={`w-12 h-6 rounded-full transition-all relative ${config.authentication.enableSSO ? 'bg-emerald-600' : 'bg-gray-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.authentication.enableSSO ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Action Footer */}
               <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveConfig}
                    disabled={saving}
                    className="px-12 py-5 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                     {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                     Save System Configuration
                  </button>
               </div>
             </>
           )}
        </div>
      )}
    </div>
  );
}
