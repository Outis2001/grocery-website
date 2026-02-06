'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cartStorage } from '@/lib/utils/cart';
import { calculateDeliveryFee, isWithinDeliveryRadius } from '@/lib/utils/distance';
import { formatCurrency } from '@/lib/utils/format';
import { Loader2, MapPin, Store, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import map component (client-side only)
const LocationPicker = dynamic(() => import('@/components/checkout/LocationPicker'), {
  ssr: false,
});

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState(cartStorage.getCart());

  // Form state
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLat, setDeliveryLat] = useState<number | null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number | null>(null);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  // Calculated state
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [withinRadius, setWithinRadius] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shopLat = parseFloat(process.env.NEXT_PUBLIC_SHOP_LAT || '6.2357');
  const shopLng = parseFloat(process.env.NEXT_PUBLIC_SHOP_LNG || '80.0534');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setCustomerEmail(data.user.email || '');
        setCustomerPhone(data.user.phone || '');
      }
    });

    // Check if cart is empty
    if (cart.items.length === 0) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (fulfillmentType === 'delivery' && deliveryLat && deliveryLng) {
      const result = isWithinDeliveryRadius(shopLat, shopLng, deliveryLat, deliveryLng);
      setWithinRadius(result.withinRadius);
      setDeliveryDistance(result.distance);

      if (result.withinRadius) {
        const fee = calculateDeliveryFee(result.distance, cart.total, expressDelivery);
        setDeliveryFee(fee);
      }
    } else {
      setDeliveryFee(0);
      setDeliveryDistance(0);
      setWithinRadius(true);
    }
  }, [fulfillmentType, deliveryLat, deliveryLng, cart.total, expressDelivery, shopLat, shopLng]);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setDeliveryLat(lat);
    setDeliveryLng(lng);
    setDeliveryAddress(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (fulfillmentType === 'delivery' && !withinRadius) {
        throw new Error('Selected location is outside our delivery radius');
      }

      if (fulfillmentType === 'delivery' && (!deliveryLat || !deliveryLng)) {
        throw new Error('Please select a delivery location on the map');
      }

      const orderData = {
        user_id: user.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        fulfillment_type: fulfillmentType,
        delivery_address: fulfillmentType === 'delivery' ? deliveryAddress : null,
        delivery_lat: fulfillmentType === 'delivery' ? deliveryLat : null,
        delivery_lng: fulfillmentType === 'delivery' ? deliveryLng : null,
        delivery_distance_km: fulfillmentType === 'delivery' ? deliveryDistance : null,
        subtotal: cart.total,
        delivery_fee: deliveryFee,
        express_delivery: expressDelivery,
        total: cart.total + deliveryFee,
        customer_notes: customerNotes || null,
        items: cart.items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
          subtotal: item.product.price * item.quantity,
        })),
      };

      // Submit order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const { order } = await response.json();

      // Clear cart
      cartStorage.clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      // Redirect to success page
      router.push(`/orders/success?orderId=${order.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  const total = cart.total + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fulfillment Type */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  How would you like to receive your order?
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      fulfillmentType === 'delivery'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin
                      className={`w-8 h-8 mx-auto mb-2 ${
                        fulfillmentType === 'delivery' ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    />
                    <div className="font-semibold">Delivery</div>
                    <div className="text-sm text-gray-500">To your address</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      fulfillmentType === 'pickup'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Store
                      className={`w-8 h-8 mx-auto mb-2 ${
                        fulfillmentType === 'pickup' ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    />
                    <div className="font-semibold">Pickup</div>
                    <div className="text-sm text-gray-500">From our store</div>
                  </button>
                </div>

                {fulfillmentType === 'delivery' && (
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="express"
                      checked={expressDelivery}
                      onChange={(e) => setExpressDelivery(e.target.checked)}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <label htmlFor="express" className="ml-3 flex items-center">
                      <Zap className="w-5 h-5 text-accent-500 mr-1" />
                      <span className="font-medium">Express Delivery</span>
                      <span className="text-sm text-gray-500 ml-2">
                        (+{formatCurrency(parseFloat(process.env.NEXT_PUBLIC_EXPRESS_FEE || '150'))}
                        )
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Any special instructions?"
                    />
                  </div>
                </div>
              </div>

              {/* Location Picker */}
              {fulfillmentType === 'delivery' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Select Delivery Location
                  </h2>

                  <div className="h-96 rounded-lg overflow-hidden">
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      shopLat={shopLat}
                      shopLng={shopLng}
                    />
                  </div>

                  {deliveryAddress && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Selected Address:</p>
                      <p className="text-gray-600">{deliveryAddress}</p>
                      {!withinRadius && (
                        <p className="text-red-600 text-sm mt-2">
                          ⚠️ This location is outside our 5km delivery radius
                        </p>
                      )}
                      {withinRadius && deliveryDistance > 0 && (
                        <p className="text-green-600 text-sm mt-2">
                          ✓ Distance: {deliveryDistance.toFixed(2)} km
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(cart.total)}</span>
                  </div>

                  {fulfillmentType === 'delivery' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        {deliveryFee === 0 && cart.total >= 5000 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          formatCurrency(deliveryFee)
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">{formatCurrency(total)}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (fulfillmentType === 'delivery' && !withinRadius)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  No payment required. Pay on {fulfillmentType === 'pickup' ? 'pickup' : 'delivery'}
                  .
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
