import { createServerClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = createServerClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('category', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Fresh Essentials
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our selection of quality grocery items. Add to cart and choose pickup or delivery.
          </p>
        </div>

        {products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  )
}
