import { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

/**
 * Cart management using localStorage
 */
export const cartStorage = {
  getCart: (): Cart => {
    if (typeof window === 'undefined') return { items: [], total: 0 }
    
    const stored = localStorage.getItem('cart')
    if (!stored) return { items: [], total: 0 }
    
    try {
      return JSON.parse(stored)
    } catch {
      return { items: [], total: 0 }
    }
  },

  setCart: (cart: Cart) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('cart', JSON.stringify(cart))
  },

  addItem: (product: Product, quantity: number = 1): Cart => {
    const cart = cartStorage.getCart()
    const existingIndex = cart.items.findIndex(
      (item) => item.product.id === product.id
    )

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity
    } else {
      cart.items.push({ product, quantity })
    }

    cart.total = cartStorage.calculateTotal(cart.items)
    cartStorage.setCart(cart)
    return cart
  },

  updateQuantity: (productId: string, quantity: number): Cart => {
    const cart = cartStorage.getCart()
    
    if (quantity <= 0) {
      return cartStorage.removeItem(productId)
    }

    const item = cart.items.find((item) => item.product.id === productId)
    if (item) {
      item.quantity = quantity
      cart.total = cartStorage.calculateTotal(cart.items)
      cartStorage.setCart(cart)
    }
    
    return cart
  },

  removeItem: (productId: string): Cart => {
    const cart = cartStorage.getCart()
    cart.items = cart.items.filter((item) => item.product.id !== productId)
    cart.total = cartStorage.calculateTotal(cart.items)
    cartStorage.setCart(cart)
    return cart
  },

  clearCart: (): Cart => {
    const emptyCart = { items: [], total: 0 }
    cartStorage.setCart(emptyCart)
    return emptyCart
  },

  calculateTotal: (items: CartItem[]): number => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  },

  getItemCount: (): number => {
    const cart = cartStorage.getCart()
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  },
}
