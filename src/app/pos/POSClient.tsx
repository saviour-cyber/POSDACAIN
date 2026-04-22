'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ScanLine,
  Search,
  Package,
  User,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  X,
  Stethoscope,
  Utensils,
  Receipt,
  FileText,
  Tag,
  Scale,
} from 'lucide-react';
import { processSale } from './actions';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  price: number;
  stock: number;
  unit: string;
  metadata?: any; // { wholesalePrice, minWholesaleQty, isPrescriptionRequired, ... }
}

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number; // For manual price overrides
}

interface Props {
  products: Product[];
  customers: Customer[];
  businessType?: string;
  settings?: any;
}

export default function POSClient({ products, customers, businessType = 'General Merchandise', settings = {} }: Props) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CREDIT'>('CASH');
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30); // Default to 30 days
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs for partial payment auto-focus
  const customerSectionRef = useRef<HTMLDivElement>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);

  function handlePartialToggle() {
    const next = !isPartialPayment;
    setIsPartialPayment(next);
    if (next && !selectedCustomer) {
      setTimeout(() => {
        customerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        customerInputRef.current?.focus();
      }, 100);
    }
  }

  // UI state
  const [showCashModal, setShowCashModal] = useState(false);
  const [amountTendered, setAmountTendered] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // M-Pesa state
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'initiating' | 'waiting' | 'success' | 'failed'>('idle');
  const [mpesaError, setMpesaError] = useState('');

  // Boutique / Fashion variants
  const [showVariantModal, setShowVariantModal] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Vertical specific state
  const [tableNumber, setTableNumber] = useState('');
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway'>('Dine-in');  // Medical / Professional
  const [technicianId, setTechnicianId] = useState(''); // For services
  const [isControlledDrug, setIsControlledDrug] = useState(false); // For pharmacy
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  // Filter products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.sku?.toLowerCase().includes(productSearch.toLowerCase())) ||
    (p.category?.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email?.toLowerCase().includes(customerSearch.toLowerCase())) ||
    (c.phone?.includes(customerSearch))
  );

  // Derived Values
  const getDisplayPrice = (item: CartItem) => {
    // 1. Check for manual override
    if (item.customPrice !== undefined) return item.customPrice;
    
    // 2. Check for Wholesale Tier
    const wholesalePrice = (item.product.metadata as any)?.wholesalePrice;
    const minQty = (item.product.metadata as any)?.minWholesaleQty;
    if (wholesalePrice && minQty && item.quantity >= minQty) {
      return wholesalePrice;
    }
    
    // 3. Fallback to standard price
    return item.product.price;
  };

  const totalAmount = cart.reduce((acc, item) => acc + getDisplayPrice(item) * item.quantity, 0);
  const requiresPrescription = cart.some(i => i.product.metadata?.isPrescriptionRequired);

  // Handlers
  function addToCart(product: Product, variant?: { size: string, color: string }) {
    if (product.stock <= 0 && businessType !== 'Wholesale & Distribution') return; 

    // Check if variant selection is needed
    const variants = (product.metadata as any)?.variants;
    if (variants && !variant && businessType === 'Boutique / Fashion') {
      setShowVariantModal(product);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && 
        (variant ? (i.metadata?.size === variant.size && i.metadata?.color === variant.color) : true)
      );
      if (existing) {
        const step = ['KG', 'LB', 'L'].includes(product.unit.toUpperCase()) ? 1 : 1;
        return prev.map((i) =>
          (i.product.id === product.id && (variant ? (i.metadata?.size === variant.size && i.metadata?.color === variant.color) : true))
            ? { ...i, quantity: i.quantity + step }
            : i
        );
      }
      return [...prev, { product, quantity: 1, metadata: variant }];
    });
    
    if (showVariantModal) {
      setShowVariantModal(null);
      setSelectedSize('');
      setSelectedColor('');
    }
  }

  function addByBarcode() {
    if (!barcodeInput.trim()) return;
    const product = products.find(
      (p) => 
        p.sku?.toLowerCase() === barcodeInput.toLowerCase() || 
        p.barcode === barcodeInput ||
        p.name.toLowerCase() === barcodeInput.toLowerCase()
    );
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    }
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.product.id !== productId) return i;
          const isWeighted = ['KG', 'LB', 'L'].includes(i.product.unit.toUpperCase());
          const step = isWeighted ? 0.5 : 1;
          const newQty = Math.max(0, i.quantity + (delta > 0 ? step : -step));
          return { ...i, quantity: newQty };
        })
        .filter((i) => i.quantity > 0)
    );
  }

  function togglePriceOverride(productId: string) {
    const newPrice = prompt("Enter custom price (override):");
    if (newPrice !== null && !isNaN(parseFloat(newPrice))) {
      setCart(prev => prev.map(item => 
        item.product.id === productId ? { ...item, customPrice: parseFloat(newPrice) } : item
      ));
    }
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  // Polling M-Pesa
  function startPolling(checkoutRequestId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
        const data = await res.json();
        if (data.status === 'SUCCESS') {
          clearInterval(interval);
          setMpesaStatus('success');
          completeSaleCleanup();
        } else if (data.status === 'FAILED') {
          clearInterval(interval);
          setMpesaStatus('failed');
          setMpesaError(data.message || 'Payment failed.');
          setLoading(false);
        }
      } catch { /* keep polling */ }
    }, 3000);
  }

  const completeSaleCleanup = () => {
    setReceiptData({ 
      receiptNumber: `RC-${Math.floor(Math.random() * 100000)}`,
      items: [...cart],
      totalAmount,
      paymentMode,
      amountTendered,
      isPartial: isPartialPayment,
      amountPaid: isPartialPayment ? parseFloat(amountTendered) || 0 : totalAmount
    });
    setShowSuccess(true);
    setCart([]);
    setSelectedCustomer(null);
    setAmountTendered('');
    setIsPartialPayment(false);
    setTableNumber('');
    setPrescriptionNotes('');
  };

  async function handleCheckout(isQuotation = false) {
    if (cart.length === 0) return;
    
    if (isPartialPayment && !selectedCustomer && !isQuotation) {
      // Scroll to customer field instead of blocking alert
      customerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      customerInputRef.current?.focus();
      return;
    }

    if (requiresPrescription && !prescriptionNotes.trim()) {
      alert("Doctor's notes required for this sale.");
      return;
    }

    if (!isQuotation) {
      if ((paymentMode === 'CASH' || isPartialPayment) && !showCashModal) {
        setShowCashModal(true);
        return;
      }
      
      if (paymentMode === 'MOBILE_MONEY') {
        if (!mpesaPhone.trim()) { alert("Enter phone number for M-Pesa"); return; }
        setShowCashModal(false);
        processMpesa();
        return;
      }
    }

    // Standard Sale or Quotation
    setLoading(true);
    const amountToCharge = isPartialPayment ? parseFloat(amountTendered) || 0 : totalAmount;
    
    const metadata: any = {
      amountTendered: amountTendered,
      changeAmount: isPartialPayment ? 0 : parseFloat(amountTendered) - totalAmount,
      tableNumber,
      orderType,
      prescriptionNotes,
      isQuotation
    };

    const result = await processSale({
      customerId: selectedCustomer?.id,
      items: cart.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        unitPrice: getDisplayPrice(i),
        isService: i.product.category?.toLowerCase() === 'service'
      })),
      totalAmount,
      amountPaid: amountToCharge,
      paymentMode,
      status: isQuotation ? 'PENDING' : (isPartialPayment ? 'PARTIAL' : 'COMPLETED'),
      metadata: { 
        ...metadata, 
        technicianId,
        isControlledDrug,
        businessType,
        dueDate: isPartialPayment ? dueDate : undefined
      }
    });

    setLoading(false);
    if (result.success) {
      setShowCashModal(false);
      completeSaleCleanup();
    } else {
      setError(result.error || "Checkout failed");
    }
  }

  async function processMpesa() {
    setLoading(true);
    setMpesaStatus('initiating');
    
    const amountToCharge = isPartialPayment ? parseFloat(amountTendered) || 0 : totalAmount;

    const saleResult: any = await processSale({
      customerId: selectedCustomer?.id,
      items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity, unitPrice: getDisplayPrice(i)})),
      totalAmount,
      amountPaid: amountToCharge,
      paymentMode: 'MOBILE_MONEY',
      status: isPartialPayment ? 'PARTIAL' : 'PENDING',
    });

    if (!saleResult.success) { setMpesaStatus('failed'); setLoading(false); return; }

    try {
      const res = await fetch('/api/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: mpesaPhone, amount: amountToCharge, saleId: saleResult.saleId })
      });
      const data = await res.json();
      if (data.success) {
        setMpesaStatus('waiting');
        startPolling(data.checkoutRequestId);
      } else {
        setMpesaStatus('failed');
        setMpesaError(data.error);
        setLoading(false);
      }
    } catch { setMpesaStatus('failed'); setLoading(false); }
  }

  // ── Success / Receipt ──────────────────────────────────────────────────
  useEffect(() => {
    if (showSuccess && receiptData && settings.autoPrint) {
       const timer = setTimeout(() => {
         window.print();
       }, 300);
       return () => clearTimeout(timer);
    }
  }, [showSuccess, receiptData, settings.autoPrint]);

  if (showSuccess && receiptData) {
    return (
      <>
        <style media="print">{`
          @page { margin: 0; size: auto; }
          body * { visibility: hidden !important; }
          .thermal-receipt, .thermal-receipt * { visibility: visible !important; }
          .thermal-receipt { position: absolute; left: 0; top: 0; }
        `}</style>
        
        <div className="max-w-[800px] mx-auto text-center p-10 bg-white rounded-3xl border border-gray-100 shadow-xl print:hidden">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Sale Completed!</h2>
          <p className="text-sm font-bold text-gray-400 mb-8">Receipt: {receiptData.receiptNumber}</p>
          <div className="flex gap-4 max-w-sm mx-auto">
            <button onClick={() => window.print()} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-2">
              <Printer size={18} /> Print
            </button>
            <button onClick={() => setShowSuccess(false)} className="flex-1 py-4 bg-[#008080] text-white rounded-2xl font-black transition-all active:scale-95">
              New Sale
            </button>
          </div>
        </div>

        {/* ── Hidden Thermal Receipt Area ──────────────────────────────────────── */}
        <div 
          className="hidden print:block thermal-receipt bg-white m-0 p-4 font-mono text-black text-xs" 
          style={{ width: settings.printerSpecs === '58mm' ? '58mm' : '80mm', fontFamily: settings.characterEncoding === 'UTF-8' ? 'inherit' : 'monospace' }}
        >
          <div className="text-center mb-4 space-y-1">
            {settings.receiptLogo && (
              <img src={settings.receiptLogo} alt="Logo" className="mx-auto max-h-16 mb-2 filter grayscale object-contain" />
            )}
            {settings.receiptBusinessName ? (
              <h1 className="text-lg font-black uppercase leading-tight">{settings.receiptBusinessName}</h1>
            ) : (
              <h1 className="text-lg font-black uppercase leading-tight">{businessType} Receipt</h1>
            )}
            
            {settings.receiptPhysicalAddress && <p className="text-[10px]">{settings.receiptPhysicalAddress}</p>}
            {settings.receiptPhoneNumber && <p className="text-[10px]">Tel: {settings.receiptPhoneNumber}</p>}
            {settings.receiptKraPin && <p className="text-[10px] uppercase font-bold">PIN: {settings.receiptKraPin}</p>}
            
            {settings.receiptHeader && (
              <div className="mt-2 text-[10px] border-b border-dashed border-black pb-2 whitespace-pre-wrap">
                {settings.receiptHeader}
              </div>
            )}
          </div>

          <div className="text-[10px] mb-3 space-y-1 border-b border-dashed border-black pb-2">
            <div className="flex justify-between">
               <span>Date:</span>
               <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
               <span>Receipt #:</span>
               <span>{receiptData.receiptNumber}</span>
            </div>
            {(settings.showCashierName ?? true) && (
               <div className="flex justify-between">
                 <span>Cashier:</span>
                 <span>Terminal 1</span>
               </div>
            )}
          </div>

          <table className="w-full text-left text-[10px] mb-2 border-collapse">
            <thead>
              <tr className="border-b border-dashed border-black">
                <th className="pb-1 font-bold w-1/2 break-words">ITEM</th>
                <th className="pb-1 font-bold w-1/4 text-center">QTY</th>
                <th className="pb-1 font-bold w-1/4 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items?.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-1 break-words pr-1">{item.product.name}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right">{(getDisplayPrice(item) * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-dashed border-black pt-2 space-y-1 text-[10px]">
             {receiptData.isPartial ? (
               <>
                 <div className="flex justify-between font-bold">
                    <span>TOTAL AMOUNT</span>
                    <span>{receiptData.totalAmount?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between font-bold">
                    <span>INITIAL DEPOSIT</span>
                    <span>{receiptData.amountPaid?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between font-bold text-sm mt-1">
                    <span>BALANCE DUE</span>
                    <span>KES {(receiptData.totalAmount - receiptData.amountPaid)?.toLocaleString()}</span>
                 </div>
               </>
             ) : (
               <>
                 <div className="flex justify-between font-bold">
                    <span>SUBTOTAL</span>
                    <span>{receiptData.totalAmount?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between font-bold text-sm mt-1">
                    <span>TOTAL</span>
                    <span>KES {receiptData.totalAmount?.toLocaleString()}</span>
                 </div>
               </>
             )}
          </div>

          <div className="border-t border-dashed border-black pt-2 mt-2 space-y-1 text-[10px]">
            <div className="flex justify-between">
               <span>Pay Mode:</span>
               <span>{receiptData.paymentMode}</span>
            </div>
            {receiptData.paymentMode === 'CASH' && receiptData.amountTendered && !receiptData.isPartial && (
               <>
                 <div className="flex justify-between">
                    <span>Tendered:</span>
                    <span>{parseFloat(receiptData.amountTendered).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between font-bold mt-1">
                    <span>Change:</span>
                    <span>{(parseFloat(receiptData.amountTendered) - receiptData.totalAmount).toLocaleString()}</span>
                 </div>
               </>
            )}
          </div>

          <div className="mt-4 text-center text-[10px] border-t border-dashed border-black pt-3">
             {settings.receiptFooter ? (
                <div className="mb-2 whitespace-pre-wrap italic">
                  {settings.receiptFooter}
                </div>
             ) : (
                <p className="mb-2 italic">Thank you for your business!</p>
             )}
             <p className="font-bold text-[9px]">Powered by NexaSync</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 px-4">
      
      {/* Left Column: Products & Search (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Header & Mode indicator */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">{businessType} POS</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Terminal Active</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-100">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase">Online</span>
          </div>
        </div>

        {/* Search & Scan */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex gap-3">
             <div className="flex-1 relative">
                <ScanLine size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addByBarcode()}
                  placeholder="Scan barcode or type and press Enter"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                />
             </div>
             <button onClick={addByBarcode} className="px-8 bg-gray-900 text-white font-black text-sm rounded-2xl transition-all active:scale-95">Add</button>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search by name, SKU or category..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-[#008080] focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(p => {
             const isOut = p.stock <= 0 && businessType !== 'Wholesale & Distribution';
             return (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={isOut}
                className={`group text-left p-4 bg-white rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative ${
                  isOut ? 'opacity-50 grayscale border-gray-100' : 'border-gray-50 hover:border-[#008080]'
                }`}
              >
                {/* Variant Indicator */}
                {(p.metadata as any)?.variants && (
                   <div className="absolute top-0 right-0 p-2">
                      <Tag size={12} className="text-blue-400 rotate-90" />
                   </div>
                )}
                <div className="flex justify-between items-start mb-3">
                   <div className="w-10 h-10 bg-teal-50 text-[#008080] rounded-xl flex items-center justify-center font-black">
                     {p.name.charAt(0)}
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      {p.unit.toUpperCase() === 'KG' && <Scale size={12} className="text-gray-400" />}
                      {(p.metadata as any)?.expiryDate && (
                        <div className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${new Date((p.metadata as any).expiryDate) < new Date() ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-700'}`}>
                          Exp: {new Date((p.metadata as any).expiryDate).toLocaleDateString()}
                        </div>
                      )}
                      {(p.metadata as any)?.isPrescriptionRequired && <Stethoscope size={12} className="text-red-400" />}
                   </div>
                </div>
                <p className="font-black text-gray-900 text-sm leading-tight mb-1">{p.name}</p>
                <div className="flex items-center justify-between mt-auto">
                   <p className="font-black text-[#008080] text-sm">KES {p.price.toLocaleString()}</p>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${p.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                     {p.stock} {p.unit}
                   </span>
                </div>
              </button>
             )
          })}
        </div>
      </div>

      {/* Right Column: Cart & Payment (5 cols) */}
      <div className={`lg:col-span-5 space-y-6 ${isMobileCartOpen ? 'fixed inset-0 z-50 bg-gray-50 flex flex-col p-4 pt-4 overflow-y-auto pb-24' : 'hidden lg:block'}`}>
        
        {/* Mobile Cart Header (Only visible when cart overlay is open) */}
        {isMobileCartOpen && (
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Checkout Screen</h2>
            <button onClick={() => setIsMobileCartOpen(false)} className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Customer Select */}
        <div ref={customerSectionRef} className={`bg-white p-6 rounded-3xl border shadow-sm transition-all ${isPartialPayment && !selectedCustomer ? 'border-orange-400 ring-2 ring-orange-300' : 'border-gray-100'}`}>
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <User size={18} className="text-gray-400" /> {businessType === 'School' ? 'Student' : 'Customer'}
              </h2>
              {isPartialPayment && !selectedCustomer && (
                <span className="text-[10px] font-black text-orange-500 uppercase animate-pulse">Required for Layaway</span>
              )}
              {selectedCustomer && (
                <button onClick={() => setSelectedCustomer(null)} className="text-red-500 font-bold text-[10px] uppercase">Clear</button>
              )}
           </div>
           {selectedCustomer ? (
             <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-teal-900">{selectedCustomer.name}</p>
                    <p className="text-xs text-teal-600 mt-0.5">{selectedCustomer.phone || selectedCustomer.email}</p>
                  </div>
                  {businessType === 'School' && (
                    <span className="text-[8px] bg-white px-1.5 py-0.5 rounded-full font-black text-teal-600 border border-teal-100">REGISTERED</span>
                  )}
               </div>
             </div>
           ) : (
             <div className="relative">
                <input 
                  ref={customerInputRef}
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)} // Fixed typo
                  placeholder={businessType === 'School' ? 'Enter Student ID or Name...' : 'Lookup customer by phone/name'}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl outline-none font-bold text-sm"
                />
                {customerSearch && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                    {filteredCustomers.slice(0, 5).map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => {setSelectedCustomer(c); setCustomerSearch('');}}
                        className="w-full text-left p-4 hover:bg-teal-50 transition-colors border-b border-gray-50 last:0"
                      >
                        <p className="font-black text-gray-900 text-xs">{c.name}</p>
                        <p className="text-[10px] text-gray-400">{c.phone}</p>
                      </button>
                    ))}
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Business Specific Inputs */}
        {(businessType === 'Restaurant' || businessType === 'Pharmacy' || businessType === 'Clinic' || businessType === 'Service-Based') && (
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              
              {/* Restaurant Logic */}
              {businessType === 'Restaurant' && (
                <div className="flex gap-3">
                   <div className="flex-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Table</label>
                      <input value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="T-1" className="w-full px-4 py-2 bg-gray-50 rounded-xl font-bold text-sm" />
                   </div>
                   <div className="flex-[2]">
                    <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Type</label>
                    <div className="flex p-1 bg-gray-50 rounded-xl">
                       {['Dine-in', 'Takeaway'].map(t => (
                         <button key={t} onClick={() => setOrderType(t as any)} className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black transition-all ${orderType === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>{t}</button>
                       ))}
                    </div>
                   </div>
                </div>
              )}

              {/* Service & Salon Logic */}
              {businessType === 'Service-Based' && (
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Assign Technician / Staff</label>
                  <select value={technicianId} onChange={e => setTechnicianId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl font-bold text-sm border-none outline-none">
                    <option value="">Select Staff member...</option>
                    <option value="ID-001">Sarah (Senior Stylist)</option>
                    <option value="ID-002">Michael (Technician)</option>
                  </select>
                </div>
              )}

              {/* Pharmacy & Medical Logic */}
              {(businessType === 'Pharmacy' || businessType === 'Clinic') && (
                <div className="space-y-4">
                   <div>
                      <label className="text-[9px] font-black text-red-500 uppercase mb-1 block">Clinical / Prescription Notes</label>
                      <textarea value={prescriptionNotes} onChange={e => setPrescriptionNotes(e.target.value)} rows={2} className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl font-bold text-sm text-red-900" placeholder="Dosage, Patient ID, or Rx Number..." />
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                      <input type="checkbox" id="controlled" checked={isControlledDrug} onChange={e => setIsControlledDrug(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      <label htmlFor="controlled" className="text-xs font-black text-gray-600 uppercase tracking-tight">Mark as Controlled Drug Transaction</label>
                   </div>
                </div>
              )}
           </div>
        )}

        {/* Cart Listing */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
           <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><ShoppingCart size={18} className="text-gray-400" /> Cart</span>
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{cart.length} items</span>
           </h2>

           <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] mb-6 pr-2">
             {cart.map(item => {
               const displayPrice = getDisplayPrice(item);
               const isWholesaleUsed = displayPrice < item.product.price && !item.customPrice;
               return (
                <div key={item.product.id} className="p-3 bg-gray-50 rounded-2xl group transition-all hover:bg-gray-100/50">
                   <div className="flex justify-between mb-2">
                      <p className="font-black text-gray-900 text-xs truncate max-w-[150px]">{item.product.name}</p>
                      <button onClick={() => togglePriceOverride(item.product.id)} className="text-[9px] font-black text-blue-500 uppercase hover:underline">Override</button>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
                        <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500"><Minus size={12} /></button>
                        <span className="text-xs font-black text-gray-900 w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#008080]"><Plus size={12} /></button>
                     </div>
                     <div className="text-right">
                       {item.metadata?.size && <p className="text-[8px] font-black text-gray-400 uppercase">{item.metadata.size} / {item.metadata.color}</p>}
                       <p className="text-[10px] font-bold text-gray-400">@{displayPrice.toLocaleString()} {isWholesaleUsed && <span className="text-emerald-500">(Bulk)</span>}</p>
                       <p className="font-black text-gray-900 text-sm">KES {(displayPrice * item.quantity).toLocaleString()}</p>
                     </div>
                   </div>
                </div>
               )
             })}
           </div>

           <div className="border-t border-gray-100 pt-6 space-y-2">
              <div className="flex justify-between text-gray-400 font-bold text-[10px] uppercase">
                <span>Subtotal</span>
                <span>KES {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-black text-lg uppercase tracking-tight">
                <span>Total</span>
                <span>KES {totalAmount.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Payment & Actions */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
           <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPaymentMode('CASH')} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentMode === 'CASH' ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-gray-50 border-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                <Banknote size={20} /> <span className="text-[10px] font-black uppercase">Cash</span>
              </button>
              <button onClick={() => setPaymentMode('MOBILE_MONEY')} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentMode === 'MOBILE_MONEY' ? 'bg-[#008080] text-white border-[#008080] shadow-lg' : 'bg-gray-50 border-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                <Smartphone size={20} /> <span className="text-[10px] font-black uppercase">M-Pesa</span>
              </button>
           </div>

           {paymentMode === 'MOBILE_MONEY' && (
             <div className="space-y-1 animation-slide-up">
                <label className="text-[9px] font-black text-emerald-600 uppercase mb-1 block">Phone Number</label>
                <input value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="0712 XXX XXX" className="w-full px-4 py-3 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-2xl font-black text-sm" />
             </div>
           )}

            {cart.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                  <div>
                    <p className="text-xs font-black text-gray-900">Partial / Layaway</p>
                    <p className="text-[10px] font-bold text-gray-400">Record deposit & tie debt to customer</p>
                  </div>
                  <button onClick={handlePartialToggle} className={`w-10 h-6 flex items-center rounded-full transition-colors ${isPartialPayment ? 'bg-[#008080]' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${isPartialPayment ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                {isPartialPayment && (
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 space-y-3 animation-slide-up">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-600" />
                      <span className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Collection Deadline</span>
                    </div>
                    <input 
                      type="date" 
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-orange-200 rounded-xl font-bold text-sm text-gray-700 outline-none focus:border-orange-400 font-mono"
                    />
                  </div>
                )}
              </div>
            )}

           <div className="flex gap-2 mt-2">
             <button onClick={() => handleCheckout(true)} disabled={loading || cart.length === 0} className="flex-1 py-4 bg-gray-100 text-gray-900 font-black rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                <FileText size={16} /> Quote
             </button>
             <button onClick={() => handleCheckout(false)} disabled={loading || cart.length === 0} className="flex-[3] py-4 bg-[#008080] text-white font-black rounded-2xl text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
                {loading ? 'Processing...' : (isPartialPayment ? 'Save & Print Receipt' : `Complete Sale · KES ${totalAmount.toLocaleString()}`)}
             </button>
           </div>
        </div>
      </div>

      {/* ── Cash Modal ─────────────────────────────────────────────────── */}
      {showCashModal && (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white max-w-sm w-full rounded-[40px] p-10 shadow-2xl space-y-8 animate-modal-up">
              <div className="text-center">
                 <div className="w-16 h-16 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                   {isPartialPayment ? <Receipt size={32} /> : <Banknote size={32} />}
                 </div>
                 <h3 className="text-xl font-black text-gray-900">{isPartialPayment ? 'Partial / Layaway' : 'Cash Payment'}</h3>
                 <p className="text-sm font-bold text-gray-400">Total Due: KES {totalAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{isPartialPayment ? 'Initial Deposit Amount' : 'Amount Tendered'}</label>
                    <input 
                      type="number" 
                      autoFocus
                      value={amountTendered}
                      onChange={e => setAmountTendered(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-center text-3xl font-black py-4 bg-gray-50 border-none rounded-3xl outline-none focus:ring-4 focus:ring-teal-100"
                    />
                 </div>
                 {parseFloat(amountTendered) >= totalAmount && !isPartialPayment && (
                    <div className="p-6 bg-[#008080] text-white rounded-[32px] flex justify-between items-center shadow-xl shadow-teal-500/30">
                       <span className="font-bold text-sm uppercase opacity-70">Give Change</span>
                       <span className="text-3xl font-black">KES {(parseFloat(amountTendered) - totalAmount).toLocaleString()}</span>
                    </div>
                 )}
                 {isPartialPayment && (
                    <div className="p-6 bg-orange-100 text-orange-900 rounded-[32px] flex justify-between items-center shadow-xl shadow-orange-500/10">
                       <span className="font-bold text-sm uppercase opacity-70">Balance Due</span>
                       <span className="text-3xl font-black">KES {(totalAmount - (parseFloat(amountTendered) || 0)).toLocaleString()}</span>
                    </div>
                 )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowCashModal(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-900">Cancel</button>
                <button 
                  onClick={() => handleCheckout(false)} 
                  disabled={ (!isPartialPayment && (parseFloat(amountTendered) || 0) < totalAmount) || (isPartialPayment && (!amountTendered || parseFloat(amountTendered) <= 0)) }
                  className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg shadow-black/20 active:scale-95 transition-all disabled:opacity-30"
                >{isPartialPayment ? 'Save Deposit & Print' : 'Process Sale'}</button>
              </div>
           </div>
        </div>
      )}

      {/* ── M-Pesa Status Modal ─────────────────────────────────────────── */}
      {mpesaStatus !== 'idle' && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-lg flex items-center justify-center p-4">
           <div className="bg-white max-w-sm w-full rounded-[40px] p-10 shadow-2xl text-center space-y-8">
              {mpesaStatus === 'initiating' && (
                <div className="animate-pulse">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Smartphone size={32} /></div>
                   <h3 className="text-xl font-black text-gray-900">Connecting...</h3>
                   <p className="text-sm font-bold text-gray-400">Initiating STK Push</p>
                </div>
              )}
              {mpesaStatus === 'waiting' && (
                <div className="space-y-6">
                   <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-emerald-500"><Smartphone size={24} className="animate-bounce" /></div>
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-gray-900">Enter PIN</h3>
                      <p className="text-sm font-bold text-emerald-600 mt-1">Check phone for popup</p>
                   </div>
                   <div className="text-[10px] text-gray-400 font-black uppercase">
                     {mpesaPhone} • KES {totalAmount.toLocaleString()}
                   </div>
                </div>
              )}
              {mpesaStatus === 'failed' && (
                 <div className="space-y-6">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto"><X size={32} /></div>
                    <h3 className="text-xl font-black text-gray-900">Payment Failed</h3>
                    <p className="text-sm font-medium text-red-500">{mpesaError || "Check balance or network"}</p>
                    <button onClick={() => {setMpesaStatus('idle'); setLoading(false);}} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black">Try Again</button>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* ── Boutique Variant Modal ────────────────────────────────────── */}
      {showVariantModal && (
        <div className="fixed inset-0 z-[110] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white max-w-sm w-full rounded-[40px] p-10 shadow-2xl space-y-8 animate-modal-up">
              <div className="text-center">
                 <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Tag size={32} /></div>
                 <h3 className="text-xl font-black text-gray-900">Select Variant</h3>
                 <p className="text-sm font-bold text-gray-400">{showVariantModal.name}</p>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Size</label>
                    <div className="flex flex-wrap gap-2">
                       {((showVariantModal.metadata as any)?.variants?.sizes || ['S', 'M', 'L', 'XL']).map((s: string) => (
                         <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-xl text-sm font-black border transition-all ${selectedSize === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{s}</button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Color</label>
                    <div className="flex flex-wrap gap-2">
                       {((showVariantModal.metadata as any)?.variants?.colors || ['Black', 'Navy', 'White']).map((c: string) => (
                         <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-xl text-sm font-black border transition-all ${selectedColor === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{c}</button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowVariantModal(null)} className="flex-1 py-4 font-black text-gray-400">Cancel</button>
                <button 
                  onClick={() => addToCart(showVariantModal, { size: selectedSize, color: selectedColor })} 
                  disabled={!selectedSize || !selectedColor}
                  className="flex-[2] py-4 bg-[#008080] text-white rounded-2xl font-black shadow-lg shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-30"
                >Add to Cart</button>
              </div>
           </div>
        </div>
      )}

      {/* Mobile Floating Cart Button */}
      {!isMobileCartOpen && cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40 lg:hidden animate-in slide-in-from-bottom-6">
          <button 
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-gray-900 text-white p-5 rounded-3xl shadow-2xl flex items-center justify-between active:scale-95 transition-transform border border-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white text-[11px] font-black flex items-center justify-center rounded-full border-2 border-gray-900 shadow-md">
                  {cart.length}
                </span>
              </div>
              <span className="font-black tracking-widest uppercase text-left text-sm">View Cart</span>
            </div>
            <span className="font-black text-lg bg-gray-800 px-4 py-1.5 rounded-xl">KES {totalAmount.toLocaleString()}</span>
          </button>
        </div>
      )}

    </div>
  );
}

