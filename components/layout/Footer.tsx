import Link from 'next/link'
import { MapPin, Phone, Clock } from 'lucide-react'

export function Footer() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || 'Ambalangoda Grocery'
  const shopAddress = process.env.NEXT_PUBLIC_SHOP_ADDRESS || 'City Center, Ambalangoda'
  const shopPhone = process.env.NEXT_PUBLIC_SHOP_PHONE || '+94 77 123 4567'

  return (
    <footer className="bg-gradient-to-br from-primary-800 to-primary-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🛒</span>
              {shopName}
            </h3>
            <p className="text-primary-100 mb-4">
              Fresh grocery essentials delivered to your doorstep. Quality products at affordable prices.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-primary-100">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{shopAddress}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href={`tel:${shopPhone}`} className="hover:text-white">
                  {shopPhone}
                </a>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Open Daily: 8:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-100">
              <li>
                <Link href="/" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-6 text-center text-primary-200 text-sm">
          <p>© {new Date().getFullYear()} {shopName}. All rights reserved.</p>
          <p className="mt-2">Serving Ambalangoda and surrounding areas within 5km radius</p>
        </div>
      </div>
    </footer>
  )
}
