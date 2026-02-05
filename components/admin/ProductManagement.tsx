'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils/format'
import { Search, Loader2, Package } from 'lucide-react'
import { ProductImageUpload } from './ProductImageUpload'
import type { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.name_si?.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [products, categoryFilter, searchQuery])

  const fetchProducts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error

      const list = (data || []) as Product[]
      setProducts(list)
      setFilteredProducts(list)

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(list.map((p) => p.category))
      ).sort()
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpdated = (productId: string, newImageUrl: string | null) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, image_url: newImageUrl } : product
      )
    )
  }

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        // @ts-ignore - Supabase .update() infers 'never' in strict builds
        .update({ is_available: !currentStatus })
        .eq('id', productId)

      if (error) throw error

      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, is_available: !currentStatus }
            : product
        )
      )
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Failed to update product availability')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Management</h2>
        <p className="text-gray-600">Upload and manage product images</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search Products
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Product name or category..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                {/* Product Info */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAvailability(product.id, product.is_available)}
                      className={`text-xs font-medium px-3 py-1 rounded-full transition ${
                        product.is_available
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {product.is_available ? '✓ Available' : '✗ Unavailable'}
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  {product.name_si && (
                    <p className="text-sm text-gray-500 mb-2">{product.name_si}</p>
                  )}

                  <p className="text-xl font-bold text-primary-600">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                {/* Image Upload Component */}
                <ProductImageUpload
                  productId={product.id}
                  productName={product.name}
                  currentImageUrl={product.image_url}
                  onImageUpdated={(newImageUrl) =>
                    handleImageUpdated(product.id, newImageUrl)
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <p className="text-sm text-primary-800">
          <strong>{filteredProducts.length}</strong> products •{' '}
          <strong>
            {filteredProducts.filter((p) => p.image_url).length}
          </strong>{' '}
          with images •{' '}
          <strong>
            {filteredProducts.filter((p) => !p.image_url).length}
          </strong>{' '}
          without images
        </p>
      </div>
    </div>
  )
}
