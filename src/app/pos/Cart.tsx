'use client';

import { useState } from 'react';
import { 
  Trash2, 
  Minus, 
  Plus, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2,
  Receipt,
  ShoppingCart,
  X,
  Stethoscope,
  Utensils
} from 'lucide-react';
import { processSale } from './actions';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  metadata?: any;
}

export default function Cart({ items, onUpdateQty, onRemove, customerId, businessType, isMobile, onClose, onUpdateMetadata }: { 
  items: CartItem[], 
  onUpdateQty: (id: string, delta: number) => void,
  onRemove: (id: string) => void,
  customerId: string | null,
  businessType: string,
  isMobile?: boolean,
  onClose?: () => void,
  onUpdateMetadata?: (id: string, metadata: any) => void
}) {
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CREDIT'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  
  // Service-Based State
  const [technicianName, setTechnicianName] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  
  // Restaurant State
  const [tableNumber, setTableNumber] = useState('');
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway' | 'Delivery'>('Dine-in');

  // M-Pesa State
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'initiating' | 'waiting' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [mpesaError, setMpesaError] = useState('');

  // Checkout Modal State
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [receiptData, setReceiptData] = useState<any>(null);

  // Polling for M-Pesa status
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const startPolling = (requestId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mpesa/status?checkoutRequestId=${requestId}`);
        const data = await res.json();
        
        if (data.status === 'SUCCESS') {
          setMpesaStatus('success');
          setSuccess(true);
          if (interval) clearInterval(interval);
        } else if (data.status === 'FAILED') {
          setMpesaStatus('failed');
          setMpesaError(data.message || 'Payment failed');
          if (interval) clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
    setPollInterval(interval);
  };


  const getItemPrice = (item: CartItem) => {
    if (businessType === 'Wholesale & Distribution' && item.metadata?.wholesalePrice && item.metadata?.minWholesaleQty) {
      return item.quantity >= item.metadata.minWholesaleQty ? item.metadata.wholesalePrice : item.price;
    }
    return item.price;
  };

  const total = items.reduce((acc, item) => acc + (getItemPrice(item) * item.quantity), 0);
  const requiresPrescription = items.some(item => item.metadata?.isPrescriptionRequired);

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (requiresPrescription && !prescriptionNotes.trim()) {
      alert("Please provide the Prescription ID or Doctor's Notes before checkout.");
      return;
    }
    if (paymentMode === 'CREDIT' && !customerId) {
       alert("A customer must be selected to process a Credit transaction.");
       return;
    }
    if (paymentMode === 'MOBILE_MONEY' && (!mpesaPhone.trim() || mpesaPhone.length < 10)) {
      alert("Please enter a valid M-Pesa phone number.");
      return;
    }
    setAmountTendered('');
    setShowPromptModal(true);
  };

  const processCheckout = async () => {
    setShowPromptModal(false);
    setIsProcessing(true);
    setMpesaError('');
    
    let metadata: any = {
      amountTendered: paymentMode === 'CASH' ? amountTendered : undefined,
      changeAmount: paymentMode === 'CASH' ? Math.max(0, parseFloat(amountTendered || '0') - total) : undefined
    };
    
    // Save receipt data
    const rd = {
      receiptNumber: `RC-${(Math.random() * 100000).toFixed(0)}`,
      amountTendered: metadata.amountTendered,
      changeAmount: metadata.changeAmount
    };
    setReceiptData(rd);
    
    if (requiresPrescription) {
      metadata = { ...metadata, prescriptionNotes, hasRestrictedDrugs: true };
    }
    
    if (businessType === 'Service-Based') {
      metadata = { ...metadata, technicianName, serviceNotes };
    }
    
    if (businessType === 'Restaurant') {
      metadata = { ...metadata, tableNumber, orderType };
    }
    
    // Pass along line-item variations in the items payload
    const mappedItems = items.map(i => ({ 
      productId: i.id, 
      quantity: i.quantity, 
      unitPrice: getItemPrice(i), 
      isService: i.metadata?.isService,
      metadata: (i.metadata?.selectedSize || i.metadata?.selectedColor) 
        ? { selectedSize: i.metadata.selectedSize, selectedColor: i.metadata.selectedColor } 
        : undefined
    }));
    
    // M-Pesa Flow
    if (paymentMode === 'MOBILE_MONEY') {
      setMpesaStatus('initiating');
      
      // 1. Create a PENDING sale
      const saleResult = await processSale({
        items: mappedItems,
        totalAmount: total,
        paymentMode,
        customerId: customerId || undefined,
        status: 'PENDING',
        metadata,
      });

      const res: any = saleResult;
      if (!res.success || !res.saleId) {
        alert("Failed to pre-register sale: " + (res.error || "Unknown error"));
        setIsProcessing(false);
        setMpesaStatus('idle');
        return;
      }

      // 2. Initiate STK Push
      try {
        const mpesaRes = await fetch('/api/mpesa/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: mpesaPhone,
            amount: total,
            saleId: res.saleId
          })
        });

        const mpesaData = await mpesaRes.json();
        if (mpesaData.success) {
          setMpesaStatus('waiting');
          setCheckoutRequestId(mpesaData.checkoutRequestId);
          startPolling(mpesaData.checkoutRequestId);
        } else {
          setMpesaStatus('failed');
          setMpesaError(mpesaData.error || "STK Push failed");
          setIsProcessing(false);
        }
      } catch (err) {
        setMpesaStatus('failed');
        setMpesaError("Network error initiating M-Pesa");
        setIsProcessing(false);
      }
      return;
    }

    // Standard Flow (Cash/Card/Credit)
    const result = await processSale({
      items: mappedItems,
      totalAmount: total,
      paymentMode,
      customerId: customerId || undefined,
      metadata,
    });

    if (result.success) {
      setSuccess(true);
    } else {
      if ('error' in result) {
        alert(result.error);
      } else {
        alert("An unknown error occurred.");
      }
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="h-full bg-white rounded-t-3xl lg:rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-gray-100 shadow-xl shadow-gray-200/50">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Completed!</h2>
        <p className="text-gray-500 mb-8 font-medium font-mono text-xs uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl">{receiptData?.receiptNumber || 'N/A'}</p>
        <div className="flex gap-4 w-full mb-4 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95"
          >
            <Receipt size={20} />
            Print Receipt
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
          >
            New Sale
          </button>
        </div>

        {businessType === 'Wholesale & Distribution' && (
          <button 
            onClick={() => window.location.reload()} // would normally trigger a PDF print/download
            className="w-full bg-indigo-50 text-indigo-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all active:scale-95 print:hidden"
          >
            <Banknote size={20} />
            Generate Waybill/Invoice
          </button>
        )}

        {/* The Printable Receipt (hidden on screen, visible on print) */}
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-4 text-black font-mono text-xs w-[80mm] mx-auto m-0 outline-none">
          <div className="text-center mb-4">
            <h2 className="text-lg font-black uppercase">{businessType} Receipts</h2>
            <p>Thank you for your business!</p>
            <p className="mt-2 text-[10px]">Receipt: {receiptData?.receiptNumber || 'N/A'}</p>
            <p className="text-[10px]">Date: {new Date().toLocaleString()}</p>
          </div>
          <div className="border-t-2 border-b-2 border-dashed border-black py-2 mb-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="font-bold border-b border-dashed border-black pb-1 w-1/2">Item</th>
                  <th className="font-bold border-b border-dashed border-black pb-1 w-1/4 text-center">Qty</th>
                  <th className="font-bold border-b border-dashed border-black pb-1 w-1/4 text-right">Amt</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-1 line-clamp-2">{item.name}</td>
                    <td className="py-1 text-center">{item.quantity}</td>
                    <td className="py-1 text-right">{getItemPrice(item) * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between font-bold mb-1 text-sm">
            <span>TOTAL:</span>
            <span>KES {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-1 mt-2">
            <span>Payment Mode:</span>
            <span>{paymentMode}</span>
          </div>
          {paymentMode === 'CASH' && receiptData?.amountTendered && (
            <>
              <div className="flex justify-between mb-1">
                <span>Tendered:</span>
                <span>KES {parseFloat(receiptData.amountTendered).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold mt-1 text-sm">
                <span>Change:</span>
                <span>KES {receiptData.changeAmount?.toLocaleString()}</span>
              </div>
            </>
          )}
          <div className="text-center mt-6 border-t border-dashed border-black pt-4">
            <p>Powered by NexaSync POS</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl shadow-gray-300 flex flex-col overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <ShoppingCart size={20} />
          </div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Order Details</h2>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 min-h-[150px]">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20 grayscale opacity-40">
            <ShoppingCart size={64} className="mb-4" />
            <p className="font-black italic uppercase tracking-widest text-xs">Awaiting Items...</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between group animate-in slide-in-from-right duration-200">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2">
                  <p className="font-black text-gray-900 text-sm line-clamp-1">{item.name}</p>
                  {item.metadata?.isPrescriptionRequired && (
                    <span className="bg-red-100 text-red-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest" title="Prescription Required">Rx</span>
                  )}
                  {businessType === 'Wholesale & Distribution' && getItemPrice(item) < item.price && (
                    <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest" title="Wholesale Discount Applied">Bulk Offer</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-blue-600 font-black">
                    KES {getItemPrice(item).toLocaleString()}
                    {getItemPrice(item) < item.price && (
                      <span className="text-[10px] text-gray-400 font-medium line-through ml-1.5">KES {item.price.toLocaleString()}</span>
                    )}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total: KES {(getItemPrice(item) * item.quantity).toLocaleString()}</p>
                </div>
                
                {/* Fashion Variant Selectors */}
                {businessType === 'Boutique / Fashion' && (item.metadata?.sizes?.length > 0 || item.metadata?.colors?.length > 0) && (
                  <div className="flex items-center gap-2 mt-2">
                    {item.metadata?.sizes?.length > 0 && (
                      <select 
                        className="text-[10px] bg-pink-50 text-pink-700 border border-pink-100 rounded px-1.5 py-0.5 outline-none cursor-pointer font-bold appearance-none"
                        value={item.metadata?.selectedSize || ''}
                        onChange={(e) => onUpdateMetadata && onUpdateMetadata(item.id, { selectedSize: e.target.value })}
                      >
                        <option value="" disabled>Size</option>
                        {item.metadata.sizes.map((s: string) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                    {item.metadata?.colors?.length > 0 && (
                      <select 
                        className="text-[10px] bg-pink-50 text-pink-700 border border-pink-100 rounded px-1.5 py-0.5 outline-none cursor-pointer font-bold appearance-none"
                        value={item.metadata?.selectedColor || ''}
                        onChange={(e) => onUpdateMetadata && onUpdateMetadata(item.id, { selectedColor: e.target.value })}
                      >
                        <option value="" disabled>Color</option>
                        {item.metadata.colors.map((c: string) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center bg-gray-100/50 rounded-2xl px-2 py-1.5 border border-gray-100 shadow-sm">
                <button 
                  onClick={() => onUpdateQty(item.id, -1)}
                  className="p-1.5 bg-white hover:bg-gray-50 rounded-xl text-gray-500 hover:text-blue-600 transition-all shadow-sm active:scale-90"
                >
                  <Minus size={14} />
                </button>
                <input 
                  type="number"
                  step={businessType === 'Grocery' ? '0.01' : '1'}
                  min="0"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    onUpdateQty(item.id, val - item.quantity);
                  }}
                  className="w-12 text-center font-black text-sm text-gray-900 bg-transparent outline-none focus:ring-2 focus:ring-blue-100 rounded no-spinners"
                />
                <button 
                  onClick={() => onUpdateQty(item.id, 1)}
                  className="p-1.5 bg-white hover:bg-gray-50 rounded-xl text-gray-500 hover:text-blue-600 transition-all shadow-sm active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="ml-4 p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-8 bg-gray-50/50 border-t border-gray-100 mt-auto">
        {requiresPrescription && (
          <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope size={16} className="text-red-500" />
              <h4 className="text-xs font-black text-red-700 uppercase tracking-widest">Prescription Required</h4>
            </div>
            <input 
              type="text" 
              placeholder="Enter Rx ID or Doctor Details..."
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm font-bold bg-white"
            />
          </div>
        )}

        {businessType === 'Service-Based' && (
          <div className="mb-6 bg-purple-50 border border-purple-100 rounded-2xl p-4 animate-in fade-in duration-300 space-y-3">
            <h4 className="text-xs font-black text-purple-700 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Service Details
            </h4>
            <input 
              type="text" 
              placeholder="Staff / Technician Name..."
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-bold bg-white text-purple-900"
            />
            <textarea 
              placeholder="Service Notes or Client Instructions..."
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium bg-white resize-none h-20 text-purple-900"
            />
          </div>
        )}

        {businessType === 'Restaurant' && (
          <div className="mb-6 bg-orange-50 border border-orange-100 rounded-2xl p-4 animate-in fade-in duration-300 space-y-4">
            <h4 className="text-xs font-black text-orange-700 uppercase tracking-widest flex items-center gap-2">
              <Utensils size={16} />
              Dine & Order Details
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOrderType('Dine-in')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${orderType === 'Dine-in' ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20' : 'bg-white text-gray-500 border-orange-200 hover:bg-orange-100'}`}
              >
                Dine-in
              </button>
              <button
                onClick={() => setOrderType('Takeaway')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${orderType === 'Takeaway' ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20' : 'bg-white text-gray-500 border-orange-200 hover:bg-orange-100'}`}
              >
                Takeaway
              </button>
            </div>

            {orderType === 'Dine-in' && (
              <input 
                type="text" 
                placeholder="Table Number (e.g. T-12)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-sm font-bold bg-white text-orange-900"
              />
            )}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-gray-500 text-xs font-black uppercase tracking-widest">
            <span>Bill Summary</span>
            <span className="text-gray-900">KES {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <span className="font-black text-gray-900 uppercase tracking-tighter">Amount to Pay</span>
            <div className="text-right">
              <span className="font-black text-3xl text-blue-600">KES {total.toLocaleString()}</span>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Inclusive of Taxes</p>
            </div>
          </div>
        </div>

        <div className={`grid ${businessType === 'Wholesale & Distribution' ? 'grid-cols-4' : 'grid-cols-3'} gap-3 mb-8`}>
          <button 
            onClick={() => setPaymentMode('CASH')}
            className={`p-4 rounded-3xl flex flex-col items-center gap-3 border-2 transition-all ${
              paymentMode === 'CASH' ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-xl shadow-blue-500/10' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
            }`}
          >
            <Banknote size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Cash</span>
          </button>
          <button 
            onClick={() => setPaymentMode('CARD')}
            className={`p-4 rounded-3xl flex flex-col items-center gap-3 border-2 transition-all ${
              paymentMode === 'CARD' ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-xl shadow-blue-500/10' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
            }`}
          >
            <CreditCard size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Card</span>
          </button>
          <button 
            onClick={() => setPaymentMode('MOBILE_MONEY')}
            className={`p-4 rounded-3xl flex flex-col items-center gap-3 border-2 transition-all ${
              paymentMode === 'MOBILE_MONEY' ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-xl shadow-blue-500/10' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
            }`}
          >
            <Smartphone size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">M-Pesa</span>
          </button>
          {businessType === 'Wholesale & Distribution' && (
            <button 
              onClick={() => setPaymentMode('CREDIT')}
              className={`p-4 rounded-3xl flex flex-col items-center gap-3 border-2 transition-all ${
                paymentMode === 'CREDIT' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-105 shadow-xl shadow-indigo-500/10' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
              }`}
            >
              <div className="relative">
                <Banknote size={24} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">Credit</span>
            </button>
          )}
        </div>

        {paymentMode === 'MOBILE_MONEY' && (
          <div className="mb-8 space-y-2 animate-in slide-in-from-bottom duration-300">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Customer Phone (M-Pesa)</label>
            <input 
              type="text"
              placeholder="e.g. 0712345678"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
              className="w-full px-5 py-4 bg-white border-2 border-emerald-100 rounded-2xl text-lg font-black text-emerald-900 focus:border-emerald-500 outline-none placeholder:text-emerald-100"
            />
          </div>
        )}

        <button 
          onClick={handleCheckout}
          disabled={items.length === 0 || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-2xl shadow-blue-600/40 transition-all disabled:opacity-50 uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-95"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <CheckCircle2 size={20} />
              {paymentMode === 'MOBILE_MONEY' ? 'Send STK Push' : 'Confirm & Finalize Bill'}
            </>
          )}
        </button>

        {/* Checkout Prompt Overlay */}
        {showPromptModal && (
          <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden">
              <h3 className="text-2xl font-black text-gray-900 mb-4">Confirm Checkout</h3>
              <p className="text-sm font-medium text-gray-500 mb-6">Payment Method: <strong className="text-gray-900 border-b-2 border-blue-500">{paymentMode}</strong></p>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Total Due</span>
                  <span className="text-2xl font-black text-blue-600">KES {total.toLocaleString()}</span>
                </div>
                
                {paymentMode === 'CASH' && (
                  <div className="mt-6 text-left">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Amount Tendered</label>
                    <input 
                      type="number"
                      placeholder="Enter amount given"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      className="w-full mt-2 px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-xl font-black text-gray-900 focus:border-blue-500 outline-none"
                    />
                    {parseFloat(amountTendered) >= total && (
                      <div className="flex justify-between items-center mt-4 bg-green-50 p-4 rounded-xl text-green-700 border border-green-200">
                        <span className="text-xs font-black uppercase tracking-widest">Change Due</span>
                        <span className="text-lg font-black">KES {(parseFloat(amountTendered) - total).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPromptModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={processCheckout}
                  disabled={paymentMode === 'CASH' && (parseFloat(amountTendered) || 0) < total}
                  className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentMode === 'CASH' && (parseFloat(amountTendered) || 0) < total ? 'Enter Valid Amount' : 'Confirm & Process'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* M-Pesa Status Overlay */}
        {mpesaStatus !== 'idle' && (
          <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden">
              {/* Decorative backgrounds */}
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              
              {mpesaStatus === 'initiating' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                    <Smartphone size={40} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Initiating Push...</h3>
                    <p className="text-sm font-medium text-gray-400 mt-2">Connecting to Safaricom Daraja</p>
                  </div>
                </div>
              )}

              {mpesaStatus === 'waiting' && (
                <div className="space-y-6">
                  <div className="w-24 h-24 relative mx-auto">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Smartphone size={32} className="text-emerald-500 animate-bounce" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">Waiting for Customer...</h3>
                    <p className="text-sm font-bold text-emerald-600 mt-2 uppercase tracking-widest italic">Check Phone PIN Prompt</p>
                    <div className="mt-6 flex flex-col gap-2">
                       <p className="text-[10px] font-black text-gray-300 uppercase">Phone: {mpesaPhone}</p>
                       <p className="text-[10px] font-black text-gray-300 uppercase">Amount: KES {total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {mpesaStatus === 'failed' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                    <X size={40} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Payment Failed</h3>
                    <p className="text-sm font-medium text-red-500 mt-2">{mpesaError || "The transaction was cancelled or timed out."}</p>
                  </div>
                  <button 
                    onClick={() => { setMpesaStatus('idle'); setIsProcessing(false); }}
                    className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {mpesaStatus === 'success' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Payment Received!</h3>
                    <p className="text-sm font-medium text-emerald-500 mt-2">Sale successfully recorded.</p>
                  </div>
                  <div className="animate-pulse flex items-center justify-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    <span>Finalizing</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                      <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

