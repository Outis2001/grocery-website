import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Fresh Groceries
            <br />
            <span className="text-accent-200">Delivered to You</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Quality essentials at your doorstep in Ambalangoda. 
            Order now for pickup or delivery within 5km.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#products"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-50 transition shadow-lg hover:shadow-xl text-center"
            >
              Shop Now 🛒
            </a>
            <Link
              href="/orders"
              className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-800 transition border-2 border-white/20 text-center"
            >
              Track Orders
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
