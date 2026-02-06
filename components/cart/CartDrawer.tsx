'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cartStorage, Cart } from '@/lib/utils/cart';
import { formatCurrency } from '@/lib/utils/format';
import { createClient } from '@/lib/supabase/client';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setCart(cartStorage.getCart());

      // Check auth
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
      });
    }
  }, [isOpen]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = cartStorage.updateQuantity(productId, newQuantity);
    setCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartStorage.removeItem(productId);
    setCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = () => {
    if (!user) {
      // Redirect to sign in
      router.push('/auth/signin?redirect=/checkout');
      onClose();
    } else {
      // Go to checkout
      router.push('/checkout');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary-600" />
              Your Cart
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          {cart.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add items to get started</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 cart-scroll">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">🛒</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-primary-600 font-bold text-sm mb-2">
                          {formatCurrency(item.product.price)}
                        </p>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(cart.total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  {cart.total >= 5000
                    ? '🎉 You qualify for FREE delivery!'
                    : `Add ${formatCurrency(5000 - cart.total)} more for free delivery`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
