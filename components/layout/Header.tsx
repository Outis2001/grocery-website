'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AuthUser } from '@/lib/supabase/types';
import { cartStorage } from '@/lib/utils/cart';
import { CartDrawer } from '../cart/CartDrawer';

export function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Update cart count
    const updateCartCount = () => {
      setCartCount(cartStorage.getItemCount());
    };

    updateCartCount();

    // Listen for storage changes (cart updates from other tabs)
    window.addEventListener('storage', updateCartCount);

    // Custom event for same-tab cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-800">Ambalangoda Grocery</h1>
                <p className="text-xs text-gray-500">Fresh & Fast</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Products
              </Link>
              <Link
                href="/orders"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                My Orders
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-primary-50 rounded-lg transition"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition"
                >
                  <User className="w-6 h-6 text-gray-700" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    {user ? (
                      <>
                        <Link
                          href="/orders"
                          onClick={() => setShowMenu(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-primary-50"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/signin"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <button className="md:hidden p-2 hover:bg-primary-50 rounded-lg">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
