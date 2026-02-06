'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Phone, Home, Loader2 } from 'lucide-react';
import { formatCurrency, formatWhatsAppPhone, generateWhatsAppMessage } from '@/lib/utils/format';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link href="/" className="text-primary-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const whatsappPhone = formatWhatsAppPhone(process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '');
  const whatsappMessage = generateWhatsAppMessage(
    order.order_number,
    order.order_items.map((item: any) => ({
      name: item.product_name,
      quantity: item.quantity,
    })),
    order.total,
    order.fulfillment_type
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-primary-600 text-white p-8 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-green-100">Your order has been received and is being processed</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order #{order.order_number}</h2>
              <p className="text-gray-600">Thank you, {order.customer_name}!</p>
            </div>

            {/* Fulfillment Info */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                {order.fulfillment_type === 'pickup' ? (
                  <>
                    <Home className="w-6 h-6 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Pickup from Store</h3>
                  </>
                ) : (
                  <>
                    <Phone className="w-6 h-6 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Home Delivery</h3>
                  </>
                )}
              </div>
              <p className="text-gray-700">
                {order.fulfillment_type === 'pickup'
                  ? `We'll notify you when your order is ready for pickup at our store: ${process.env.NEXT_PUBLIC_SHOP_ADDRESS}`
                  : `Your order will be delivered to: ${order.delivery_address}`}
              </p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.delivery_fee > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{formatCurrency(order.delivery_fee)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Payment:</strong> Cash on{' '}
                {order.fulfillment_type === 'pickup' ? 'pickup' : 'delivery'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all text-center"
              >
                📱 Send Order Details via WhatsApp
              </a>

              <Link
                href="/orders"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all text-center"
              >
                View All Orders
              </Link>

              <Link
                href="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-all text-center"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Questions about your order?</p>
              <p className="font-medium text-primary-600 mt-1">
                Call us: {process.env.NEXT_PUBLIC_SHOP_PHONE}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
