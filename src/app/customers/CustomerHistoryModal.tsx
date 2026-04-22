'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  CreditCard, 
  Receipt,
  ChevronDown,
  ChevronUp,
  User,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getCustomerHistory } from './actions';

interface CustomerHistoryModalProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
}

export default function CustomerHistoryModal({ customerId, customerName, onClose }: CustomerHistoryModalProps) {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [customerId]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const data = await getCustomerHistory(customerId);
      setSales(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalBalance = sales.reduce((sum, s) => {
    const paid = s.payments.reduce((pSum: number, p: any) => pSum + p.amount, 0);
    return sum + (s.totalAmount - paid);
  }, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <History size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-none">Transaction History</h2>
                <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
                   <User size={12} className="text-blue-500" /> {customerName}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 p-8 bg-gray-50/50">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingUp size={12} className="text-emerald-500" /> Lifetime Spent
            </p>
            <p className="text-2xl font-black text-gray-900">KES {totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <AlertCircle size={12} className="text-orange-500" /> Outstanding Debt
            </p>
            <p className={`text-2xl font-black ${totalBalance > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
              KES {totalBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 h-32 rounded-3xl" />
            ))
          ) : sales.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Transactions Found</h3>
              <p className="text-gray-500 font-medium">This customer hasn't made any purchases yet.</p>
            </div>
          ) : (
            sales.map((sale) => {
              const paid = sale.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
              const balance = sale.totalAmount - paid;
              const isExpanded = expandedSaleId === sale.id;

              return (
                <div 
                  key={sale.id}
                  className={`border border-gray-100 rounded-3xl overflow-hidden transition-all ${isExpanded ? 'shadow-xl border-blue-100' : 'bg-white shadow-sm hover:shadow-md'}`}
                >
                  <div 
                    className="p-6 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedSaleId(isExpanded ? null : sale.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${balance > 0 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Receipt size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">
                          Invoice #{sale.id.slice(0, 8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                            <Calendar size={10} /> {new Date(sale.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                            <Clock size={10} /> {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <p className="text-lg font-black text-gray-900">KES {sale.totalAmount.toLocaleString()}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${balance > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {balance > 0 ? `Unpaid: KES ${balance.toLocaleString()}` : 'Fully Paid'}
                        </p>
                      </div>
                      <div className="text-gray-300">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                       <div className="bg-gray-50 rounded-2xl p-4 overflow-hidden">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                <th className="pb-2">Product</th>
                                <th className="pb-2 text-center">Qty</th>
                                <th className="pb-2 text-right">Price</th>
                                <th className="pb-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {sale.items.map((item: any) => (
                                <tr key={item.id} className="text-xs font-bold text-gray-600">
                                  <td className="py-3">{item.product.name}</td>
                                  <td className="py-3 text-center">{item.quantity} {item.product.unit}</td>
                                  <td className="py-3 text-right">KES {item.unitPrice.toLocaleString()}</td>
                                  <td className="py-3 text-right text-gray-900">KES {item.totalPrice.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-[10px]">
                            <p className="text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                              Processed by: <span className="text-gray-900">{sale.user.name}</span>
                            </p>
                            <div className="flex gap-2">
                               <span className="px-2 py-1 bg-white rounded-md border border-gray-200 font-bold text-gray-500">
                                 {sale.paymentMode.replace('_', ' ')}
                               </span>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
           <button 
             onClick={onClose}
             className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
           >
             Close View
           </button>
        </div>
      </div>
    </div>
  );
}
