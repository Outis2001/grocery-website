'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils/format'
import { Loader2, Printer, Search, Filter } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      
      if (!data.user) {
        router.push('/auth/signin?redirect=/admin')
        return
      }

      // Check if user is admin
      if (data.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        // Not admin, redirect
        router.push('/')
        return
      }

      setUser(data.user)
      fetchOrders()
    }

    checkAuth()
  }, [router])

  const fetchOrders = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            price_at_purchase,
            subtotal
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders(data || [])
      setFilteredOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = orders

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(query) ||
          order.customer_name.toLowerCase().includes(query) ||
          order.customer_phone.includes(query)
      )
    }

    setFilteredOrders(filtered)
  }, [orders, statusFilter, searchQuery])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus as 'pending' | 'confirmed' | 'packing' | 'ready' | 'dispatched' | 'completed' | 'cancelled'
        })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const printInvoice = (order: any) => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .info { margin-bottom: 20px; }
          .info div { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f3f4f6; font-weight: bold; }
          .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${process.env.NEXT_PUBLIC_SHOP_NAME || 'Ambalangoda Grocery'}</h1>
          <p>${process.env.NEXT_PUBLIC_SHOP_ADDRESS || 'Ambalangoda'}</p>
          <p>Phone: ${process.env.NEXT_PUBLIC_SHOP_PHONE || ''}</p>
        </div>

        <div class="info">
          <h2>Invoice #${order.order_number}</h2>
          <div><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</div>
          <div><strong>Customer:</strong> ${order.customer_name}</div>
          <div><strong>Phone:</strong> ${order.customer_phone}</div>
          <div><strong>Type:</strong> ${order.fulfillment_type === 'pickup' ? 'Pickup' : 'Delivery'}</div>
          ${order.delivery_address ? `<div><strong>Address:</strong> ${order.delivery_address}</div>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.order_items.map((item: any) => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price_at_purchase)}</td>
                <td>${formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
              <td><strong>${formatCurrency(order.subtotal)}</strong></td>
            </tr>
            ${order.delivery_fee > 0 ? `
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Delivery Fee:</strong></td>
                <td><strong>${formatCurrency(order.delivery_fee)}</strong></td>
              </tr>
            ` : ''}
          </tbody>
        </table>

        <div class="total">
          TOTAL: ${formatCurrency(order.total)}
        </div>

        ${order.customer_notes ? `
          <div style="margin-top: 20px;">
            <strong>Customer Notes:</strong>
            <p>${order.customer_notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Payment: Cash on ${order.fulfillment_type === 'pickup' ? 'Pickup' : 'Delivery'}</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const statuses = ['all', 'pending', 'confirmed', 'packing', 'ready', 'dispatched', 'completed', 'cancelled']
  const statusLabels: Record<string, string> = {
    all: 'All Orders',
    pending: 'Pending',
    confirmed: 'Confirmed',
    packing: 'Packing',
    ready: 'Ready',
    dispatched: 'Dispatched',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage orders and track fulfillment</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search Orders
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order #, name, or phone..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {order.order_number}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => printInvoice(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Customer:</strong> {order.customer_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Phone:</strong> {order.customer_phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Type:</strong> {order.fulfillment_type === 'pickup' ? '🛍️ Pickup' : '🏠 Delivery'}
                    </p>
                    {order.delivery_address && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Address:</strong> {order.delivery_address}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Items:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.order_items.map((item: any) => (
                        <li key={item.id}>
                          {item.product_name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">
                      Status:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✓ Confirmed</option>
                      <option value="packing">📦 Packing</option>
                      <option value="ready">✅ Ready</option>
                      <option value="dispatched">🚚 Dispatched</option>
                      <option value="completed">🎉 Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                {order.customer_notes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm">
                      <strong>Customer Notes:</strong> {order.customer_notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
