'use client';

import { useState } from 'react';
import { Database } from '@/lib/supabase/database.types';
import { cartStorage } from '@/lib/utils/cart';
import { formatCurrency } from '@/lib/utils/format';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    setAdding(true);
    cartStorage.addItem(product, quantity);

    // Dispatch custom event for cart update
    window.dispatchEvent(new Event('cartUpdated'));

    // Show feedback
    setTimeout(() => {
      setAdding(false);
      setQuantity(1);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden product-card">
      {/* Product Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">🛒</span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>

        {product.name_si && <p className="text-sm text-gray-500 mb-2">{product.name_si}</p>}

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center border-2 border-gray-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="px-4 font-semibold text-gray-800 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all ${
              adding ? 'bg-green-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {adding ? (
              <>✓ Added</>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
