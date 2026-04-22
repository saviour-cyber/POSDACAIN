'use client';

import { useState } from 'react';
import { AlertCircle, Phone, Calendar, CreditCard, CheckCircle2, X, Banknote, Smartphone, TrendingDown, Bell, BellRing, Clock, RefreshCw } from 'lucide-react';
import { recordInstallment, sendCollectionReminder } from './actions';

interface Debtor {
  saleId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  totalPaid: number;
  balance: number;
  lastPaymentDate: string;
  createdAt: string;
  dueDate: string | null;
  lastReminderSentAt: string | null;
}

interface Props {
  debtors: Debtor[];
  totalOutstanding: number;
}

export default function CollectionsClient({ debtors, totalOutstanding }: Props) {
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);
  const [successSaleId, setSuccessSaleId] = useState<string | null>(null);
  const [localDebtors, setLocalDebtors] = useState<Debtor[]>(debtors);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  async function handleSendReminder(debtor: Debtor) {
    if (!debtor.customerPhone || debtor.customerPhone === '-') {
      alert("No phone number available for this customer.");
      return;
    }

    setSendingReminder(debtor.saleId);
    try {
      const result = await sendCollectionReminder(debtor.saleId);
      if (result.success) {
        setLocalDebtors(prev => prev.map(d => 
          d.saleId === debtor.saleId ? { ...d, lastReminderSentAt: new Date().toISOString() } : d
        ));
      } else {
        alert("Failed to send SMS: " + result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReminder(null);
    }
  }

  async function handleRecordPayment() {
    if (!selectedDebtor || !paymentAmount || parseFloat(paymentAmount) <= 0) return;

    const amount = Math.min(parseFloat(paymentAmount), selectedDebtor.balance);
    setLoading(true);
    try {
      const result = await recordInstallment({
        saleId: selectedDebtor.saleId,
        amount,
        method: paymentMethod,
      });

      if (result.success) {
        setSuccessSaleId(selectedDebtor.saleId);
        // Update local state to reflect payment
        setLocalDebtors(prev => {
          const updated = prev.map(d => {
            if (d.saleId === selectedDebtor.saleId) {
              const newPaid = d.totalPaid + amount;
              const newBalance = d.totalAmount - newPaid;
              return { ...d, totalPaid: newPaid, balance: newBalance, lastPaymentDate: new Date().toISOString() };
            }
            return d;
          }).filter(d => d.balance > 0); // Remove fully paid
          return updated;
        });
        setTimeout(() => {
          setSuccessSaleId(null);
          setSelectedDebtor(null);
          setPaymentAmount('');
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const totalOutstandingLive = localDebtors.reduce((sum, d) => sum + d.balance, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pending Collections</h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">Track and collect outstanding installment balances</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-2xl">
          <AlertCircle size={16} className="text-orange-500" />
          <span className="text-sm font-black text-orange-700">{localDebtors.length} active debts</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl text-white shadow-xl shadow-orange-200">
          <p className="text-orange-100 text-xs font-black uppercase tracking-widest mb-2">Total Outstanding</p>
          <h2 className="text-3xl font-black">KES {totalOutstandingLive.toLocaleString()}</h2>
          <p className="text-orange-100 text-xs mt-2 font-medium">Across {localDebtors.length} customer{localDebtors.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Oldest Unpaid</p>
          {localDebtors.length > 0 ? (
            <>
              <h2 className="text-xl font-black text-gray-900">{localDebtors[0].customerName}</h2>
              <p className="text-gray-400 text-xs mt-1 font-bold">
                Since {new Date(localDebtors[0].createdAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm font-bold">No outstanding debts 🎉</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Average Balance</p>
          <h2 className="text-2xl font-black text-gray-900">
            KES {localDebtors.length > 0 ? Math.round(totalOutstandingLive / localDebtors.length).toLocaleString() : '0'}
          </h2>
          <p className="text-gray-400 text-xs mt-1 font-bold">Per customer</p>
        </div>
      </div>

      {/* Debtors Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingDown size={20} className="text-orange-500" />
            <h3 className="font-black text-gray-900">Outstanding Balances</h3>
            <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Oldest First</span>
          </div>
        </div>

        {localDebtors.length === 0 ? (
          <div className="p-20 text-center">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="font-black text-gray-800 text-lg">All balances cleared!</h3>
            <p className="text-gray-400 text-sm mt-1">No outstanding installment payments.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="text-right p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="text-right p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid</th>
                    <th className="text-right p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance</th>
                    <th className="text-right p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Payment</th>
                    <th className="text-right p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</th>
                    <th className="text-right p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {localDebtors.map((debtor) => {
                    const paidPct = Math.round((debtor.totalPaid / debtor.totalAmount) * 100);
                    const isSuccess = successSaleId === debtor.saleId;
                    return (
                      <tr key={debtor.saleId} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isSuccess ? 'bg-emerald-50' : ''}`}>
                        <td className="p-5">
                          <p className="font-black text-gray-900">{debtor.customerName}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Phone size={10} className="text-gray-400" />
                            <p className="text-[11px] text-gray-400 font-bold">{debtor.customerPhone}</p>
                          </div>
                          {/* Progress bar */}
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${paidPct}%` }} />
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold mt-0.5">{paidPct}% paid</p>
                        </td>
                        <td className="p-5 text-right font-bold text-gray-700">KES {debtor.totalAmount.toLocaleString()}</td>
                        <td className="p-5 text-right font-bold text-emerald-600">KES {debtor.totalPaid.toLocaleString()}</td>
                        <td className="p-5 text-right">
                          <span className="font-black text-orange-600 text-base">KES {debtor.balance.toLocaleString()}</span>
                        </td>
                        <td className="p-5 text-right">
                          {debtor.dueDate ? (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1 text-gray-900">
                                <Clock size={10} className={new Date(debtor.dueDate) < new Date() ? "text-red-500" : "text-gray-400"} />
                                <span className={`text-[11px] font-black ${new Date(debtor.dueDate) < new Date() ? "text-red-600 animate-pulse" : ""}`}>
                                  {new Date(debtor.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              {debtor.lastReminderSentAt && (
                                <span className="text-[8px] font-black text-gray-400 uppercase">
                                  Reminder: {new Date(debtor.lastReminderSentAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1 text-gray-300">
                               <Calendar size={10} />
                               <span className="text-[11px] font-bold">{new Date(debtor.lastPaymentDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 mb-2">
                             <button
                                onClick={() => handleSendReminder(debtor)}
                                disabled={sendingReminder === debtor.saleId}
                                title="Send SMS Nudge"
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                                  debtor.lastReminderSentAt 
                                    ? 'bg-blue-50 text-blue-500 hover:bg-blue-100' 
                                    : 'bg-orange-50 text-orange-500 hover:bg-orange-100 shadow-sm shadow-orange-100'
                                }`}
                             >
                                {sendingReminder === debtor.saleId ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                  debtor.lastReminderSentAt ? <BellRing size={14} /> : <Bell size={14} />
                                )}
                             </button>
                          </div>
                          {isSuccess ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-xs">
                              <CheckCircle2 size={14} /> Recorded!
                            </span>
                          ) : (
                            <button
                              onClick={() => { setSelectedDebtor(debtor); setPaymentAmount(''); }}
                              className="px-4 py-2 bg-[#008080] text-white text-xs font-black rounded-xl hover:bg-teal-700 transition-all active:scale-95 shadow-sm shadow-teal-200"
                            >
                              Record Payment
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-50 border-t border-gray-50">
              {localDebtors.map((debtor) => {
                const paidPct = Math.round((debtor.totalPaid / debtor.totalAmount) * 100);
                const isSuccess = successSaleId === debtor.saleId;
                return (
                  <div key={debtor.saleId} className={`p-4 hover:bg-gray-50/50 transition-colors ${isSuccess ? 'bg-emerald-50' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-gray-900 leading-tight">{debtor.customerName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Phone size={10} className="text-gray-400" />
                          <p className="text-xs text-gray-400 font-bold">{debtor.customerPhone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendReminder(debtor)}
                        disabled={sendingReminder === debtor.saleId}
                        title="Send SMS Nudge"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                          debtor.lastReminderSentAt 
                            ? 'bg-blue-50 text-blue-500 hover:bg-blue-100' 
                            : 'bg-orange-50 text-orange-500 hover:bg-orange-100 shadow-sm shadow-orange-100'
                        }`}
                      >
                        {sendingReminder === debtor.saleId ? <RefreshCw size={14} className="animate-spin" /> : (debtor.lastReminderSentAt ? <BellRing size={14} /> : <Bell size={14} />)}
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Paid</p>
                        <p className="text-sm font-bold text-emerald-600">KES {debtor.totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Balance</p>
                        <p className="text-sm font-black text-orange-600">KES {debtor.balance.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                       <div className="w-1/2">
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${paidPct}%` }} />
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold mt-1">{paidPct}% paid of {debtor.totalAmount.toLocaleString()}</p>
                       </div>
                       <div className="text-right">
                         {debtor.dueDate ? (
                           <div className="flex items-center justify-end gap-1 text-gray-900">
                             <Clock size={12} className={new Date(debtor.dueDate) < new Date() ? "text-red-500" : "text-gray-400"} />
                             <span className={`text-xs font-black ${new Date(debtor.dueDate) < new Date() ? "text-red-600 animate-pulse" : ""}`}>
                               {new Date(debtor.dueDate).toLocaleDateString()}
                             </span>
                           </div>
                         ) : (
                           <div className="flex items-center justify-end gap-1 text-gray-400">
                              <Calendar size={12} />
                              <span className="text-xs font-bold">{new Date(debtor.lastPaymentDate).toLocaleDateString()}</span>
                           </div>
                         )}
                       </div>
                    </div>
                    
                    {isSuccess ? (
                      <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-sm bg-emerald-100 rounded-xl py-3">
                        <CheckCircle2 size={16} /> Payment Recorded!
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSelectedDebtor(debtor); setPaymentAmount(''); }}
                        className="w-full py-3 bg-[#008080] text-white text-sm font-black rounded-xl hover:bg-teal-700 transition-all active:scale-95 shadow-lg shadow-teal-200"
                      >
                        Record Payment
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Record Payment Modal */}
      {selectedDebtor && !successSaleId && (
        <div className="fixed inset-0 z-[200] bg-gray-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-[40px] p-10 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900">Record Payment</h3>
                <p className="text-sm font-bold text-gray-400 mt-0.5">{selectedDebtor.customerName}</p>
              </div>
              <button onClick={() => setSelectedDebtor(null)} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>

            {/* Balance summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase">Total</p>
                <p className="font-black text-gray-900 mt-1">KES {selectedDebtor.totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-2xl">
                <p className="text-[10px] text-orange-500 font-black uppercase">Remaining</p>
                <p className="font-black text-orange-600 mt-1">KES {selectedDebtor.balance.toLocaleString()}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setPaymentMethod('CASH')} className={`p-3 rounded-2xl border flex items-center gap-2 font-black text-xs transition-all ${paymentMethod === 'CASH' ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                  <Banknote size={16} /> Cash
                </button>
                <button onClick={() => setPaymentMethod('MOBILE_MONEY')} className={`p-3 rounded-2xl border flex items-center gap-2 font-black text-xs transition-all ${paymentMethod === 'MOBILE_MONEY' ? 'bg-[#008080] text-white border-[#008080]' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                  <Smartphone size={16} /> M-Pesa
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Amount to Collect</label>
              <input
                type="number"
                autoFocus
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                max={selectedDebtor.balance}
                className="w-full text-center text-3xl font-black py-4 bg-gray-50 border-none rounded-3xl outline-none focus:ring-4 focus:ring-teal-100"
              />
              {parseFloat(paymentAmount) > 0 && (
                <div className="mt-3 p-4 bg-teal-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-black text-teal-600">New Balance After</span>
                  <span className="font-black text-teal-800">
                    KES {Math.max(0, selectedDebtor.balance - (parseFloat(paymentAmount) || 0)).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="flex gap-4 pt-2">
              <button onClick={() => setSelectedDebtor(null)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-700">Cancel</button>
              <button
                onClick={handleRecordPayment}
                disabled={loading || !paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-[2] py-4 bg-[#008080] text-white rounded-2xl font-black shadow-lg shadow-teal-200 active:scale-95 transition-all disabled:opacity-30"
              >
                {loading ? 'Recording...' : `Confirm KES ${parseFloat(paymentAmount || '0').toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
