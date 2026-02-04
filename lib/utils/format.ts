/**
 * Format currency in Sri Lankan Rupees
 */
export function formatCurrency(amount: number): string {
  return `LKR ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Format phone number for WhatsApp (remove + and spaces)
 */
export function formatWhatsAppPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '')
}

/**
 * Generate WhatsApp order message
 */
export function generateWhatsAppMessage(
  orderNumber: string,
  items: { name: string; quantity: number }[],
  total: number,
  fulfillmentType: 'pickup' | 'delivery'
): string {
  const itemsList = items
    .map((item) => `• ${item.name} x ${item.quantity}`)
    .join('\n')

  return encodeURIComponent(
    `🛒 New Order: ${orderNumber}\n\n${itemsList}\n\nTotal: ${formatCurrency(total)}\nFulfillment: ${fulfillmentType === 'pickup' ? '🛍️ Pickup' : '🏠 Delivery'}`
  )
}
