'use client';

import { useState, useRef } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download,
  Eye,
  Calendar,
  Zap,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp
};

interface ReportsClientProps {
  initialSales: any[];
  kpis: any[];
  dailyRows: [string, { revenue: number; count: number }][];
  tenantName?: string;
}

export default function ReportsClient({ initialSales, kpis, dailyRows, tenantName = 'NexaSync POS' }: ReportsClientProps) {
  const [reportType, setReportType] = useState('Sales Summary');
  const [timePeriod, setTimePeriod] = useState('This Month');
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleQuickAction = (action: string) => {
    // In a real app, these would fetch different data.
    // For now, we simulate by opening the print dialog with a clear header for the specific report.
    alert(`Generating ${action}...`);
    setTimeout(() => {
        window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-print-area, #report-print-area * {
            visibility: visible;
          }
          #report-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Report Configuration Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 no-print">
        <h2 className="text-sm font-black text-gray-800 mb-1 flex items-center gap-2">
          <FileText size={16} className="text-gray-400" /> Report Configuration
        </h2>
        <p className="text-xs text-gray-400 font-medium mb-4">
          Select report type and time period
        </p>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Report Type
            </label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-300 appearance-none min-w-[160px]"
            >
              <option>Sales Summary</option>
              <option>Stock Report</option>
              <option>Customer Report</option>
              <option>Tax Report</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Time Period
            </label>
            <select 
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-300 appearance-none min-w-[140px]"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Week</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Actions
            </label>
            <div className="flex gap-2">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                <Eye size={15} /> Preview
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-200 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors"
              >
                <FileText size={15} /> PDF
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 rounded-xl text-white text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="report-print-area" className="space-y-6">
        
        {/* Hidden Print Header */}
        <div className="hidden print:block text-center border-b pb-6 mb-8">
            <h1 className="text-2xl font-black">{tenantName.toUpperCase()}</h1>
            <p className="text-sm font-bold text-gray-500 mt-1">{reportType} - {timePeriod}</p>
            <div className="flex justify-between items-center mt-6 px-10">
                <span className="text-[10px] font-black text-gray-400">GEN DATE: {new Date().toLocaleDateString()}</span>
                <span className="text-[10px] font-black text-gray-400">STATUS: OFFICIAL</span>
            </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((k) => {
            const isUp = k.change >= 0;
            const Icon = ICON_MAP[k.iconName] || FileText;
            return (
              <div
                key={k.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {k.label}
                  </p>
                  <Icon size={16} className={`text-${k.color}-500`} />
                </div>
                <p className="text-xl font-black text-gray-900 mb-2 leading-tight">
                  {k.value}
                </p>
                <div
                  className={`flex items-center gap-1 text-[11px] font-bold no-print ${
                    isUp ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(k.change).toFixed(1)}% from last period
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily Sales Report */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" /> {reportType}
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-medium mb-5">
            Detailed breakdown of performance for {timePeriod}
          </p>

          {dailyRows.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <ShoppingCart size={36} className="mx-auto mb-3 opacity-20" />
              <p className="font-bold text-sm">No sales data available for the selected period</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-3 pr-8">Date</th>
                      <th className="pb-3 pr-8">Transactions</th>
                      <th className="pb-3 pr-8">Revenue</th>
                      <th className="pb-3">Avg. Sale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {dailyRows.map(([day, data]) => (
                      <tr key={day} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-8 text-sm font-bold text-gray-700">{day}</td>
                        <td className="py-3 pr-8 text-sm font-bold text-gray-900">{data.count}</td>
                        <td className="py-3 pr-8 text-sm font-bold text-green-600">
                          KES {data.revenue.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-sm font-bold text-gray-500">
                          KES {(data.revenue / data.count).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-50 border-t border-gray-50">
                {dailyRows.map(([day, data]) => (
                  <div key={day} className="py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-black text-gray-900 text-sm">{day}</span>
                      </div>
                      <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {data.count} TXNs
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Revenue</p>
                        <p className="font-black text-green-600 text-xs">
                          KES {data.revenue.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Avg. Sale</p>
                        <p className="font-black text-gray-700 text-xs">
                          KES {(data.revenue / data.count).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Report Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 no-print">
        <h2 className="text-sm font-black text-gray-800 mb-1">Quick Report Actions</h2>
        <p className="text-xs text-gray-400 font-medium mb-5">
          Generate common reports instantly
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "End of Day Report", type: 'EOD', icon: FileText, color: "blue" },
            { label: "Weekly Summary", type: 'WEEKLY', icon: Calendar, color: "purple" },
            { label: "Tax Report", type: 'TAX', icon: FileText, color: "green" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className={`flex flex-col items-center justify-center gap-2 px-6 py-5 rounded-2xl border-2 border-${action.color}-100 bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors text-${action.color}-700 min-w-[120px] transition-all active:scale-95`}
            >
              <action.icon size={22} />
              <span className="text-xs font-bold text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
