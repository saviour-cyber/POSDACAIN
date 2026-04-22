'use client';

import { useState } from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import { deleteProduct } from './actions';
import InventoryModal from './InventoryModal';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  price: number;
  stock: number;
}

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      setIsDeleting(id);
      await deleteProduct(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Products ({products.length})</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Manage your inventory and stock levels</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock Level</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                      <Package size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No products found</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{product.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">
                      {product.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock <= 5 ? 'bg-red-500' : product.stock <= 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-gray-900">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-gray-900">KES {product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                      product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={isDeleting === product.id}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-red-600 transition-all disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <InventoryModal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        product={editingProduct}
      />
    </div>
  );
}
