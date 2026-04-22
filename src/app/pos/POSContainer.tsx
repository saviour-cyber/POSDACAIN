'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import Cart from './Cart';
import { Package, Search, Users, ChevronUp, ChevronDown, Barcode } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
  barcode: string | null;
  category: string | null;
  unit: string;
  lowStockThreshold: number;
  metadata?: any;
}

interface Customer {
  id: string;
  name: string;
  loyaltyPts: number;
}

export default function POSContainer({ products, customers, businessType }: { products: Product[], customers: Customer[], businessType: string }) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase())) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  // Barcode specific handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl+F or just allow barcode scanner to input
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-add if exact barcode match is found and it's unique
  useEffect(() => {
    if (search.length >= 4) {
      const exactMatch = products.find(p => p.barcode === search);
      if (exactMatch && exactMatch.stock > 0) {
        addToCart(exactMatch);
        setSearch(''); // Clear search after auto-add
      }
    }
  }, [search, products]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Auto open cart on mobile when adding first item
    if (cartItems.length === 0) setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItemMetadata = (id: string, newMetadata: any) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, metadata: { ...item.metadata, ...newMetadata } };
      }
      return item;
    }));
  };

  return (
    <DashboardShell>
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 -mt-2 h-[calc(100vh-140px)] relative">
        {/* Product Selection Area */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-2">
                  <Search size={18} />
                  <div className="hidden md:block w-[1px] h-4 bg-gray-200"></div>
                  <Barcode size={16} className="hidden md:block text-blue-300" />
                </div>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Scan barcode or type name..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 md:pl-20 pr-4 py-3 rounded-xl border-none bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700"
                />
              </div>
            </div>

            {/* Customer Selector */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-full md:w-64">
              <div className="relative flex-1">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <select 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-sm text-gray-700 appearance-none cursor-pointer"
                  value={selectedCustomerId || ''}
                  onChange={(e) => setSelectedCustomerId(e.target.value || null)}
                >
                  <option value="">{businessType === 'School' ? 'Walk-in Student' : businessType === 'Clinic' ? 'Walk-in Patient' : 'Walk-in Customer'}</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar pb-24 md:pb-0">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className={`bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group flex flex-col h-full active:scale-95 ${
                  product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''
                }`}
              >
                <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors relative">
                  <Package size={32} />
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{product.category || 'General'}</p>
                    {product.metadata?.isPrescriptionRequired && (
                      <span className="bg-red-100 text-red-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest" title="Prescription Required">Rx</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 text-sm">{product.name}</h3>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{product.unit}</p>
                    <p className="font-black text-gray-900">KES {product.price.toLocaleString()}</p>
                  </div>
                  <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                    product.stock > 10 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {product.stock}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart/Checkout Area - Mobile Switchable */}
        <div className={`
          lg:col-span-4 fixed inset-x-0 bottom-0 z-50 transition-all duration-500 lg:static lg:block
          ${isCartOpen ? 'h-[85vh] translate-y-0' : 'h-16 translate-y-0 lg:h-full'}
        `}>
          {/* Mobile Handle */}
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="w-full h-16 bg-blue-600 text-white flex items-center justify-between px-6 lg:hidden rounded-t-3xl shadow-2xl shadow-blue-500/50"
          >
            <div className="flex items-center gap-2">
              <ShoppingCartIcon size={20} />
              <span className="font-black uppercase tracking-widest text-xs">View Order ({cartItems.length})</span>
            </div>
            <div className="flex items-center gap-4 font-black">
              <span>KES {cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
              {isCartOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
          </button>

          <div className={`h-full ${isCartOpen ? 'block' : 'hidden lg:block'}`}>
            <Cart 
              items={cartItems} 
              onUpdateQty={updateQty} 
              onRemove={removeItem} 
              customerId={selectedCustomerId}
              businessType={businessType}
              isMobile={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              onUpdateMetadata={updateItemMetadata}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ShoppingCartIcon({ size }: { size: number }) {
  return <div className="p-1"><Package size={size} /></div>;
}
