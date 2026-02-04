import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { formatCurrency } from '../utils/format'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// SMTP transporter (fallback)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface OrderEmailData {
  order: {
    order_number: string
    customer_name: string
    customer_phone: string
    fulfillment_type: string
    delivery_address?: string | null
    subtotal: number
    delivery_fee: number
    total: number
    items: Array<{
      product_name: string
      quantity: number
      price_at_purchase: number
      subtotal: number
    }>
    customer_notes?: string | null
  }
  to: string
  toAdmin: boolean
}

function generateOrderEmailHTML(data: OrderEmailData): string {
  const { order, toAdmin } = data
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || 'Ambalangoda Grocery'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .order-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          background: #f3f4f6;
          padding: 10px;
          text-align: left;
          border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row {
          font-weight: bold;
          font-size: 1.1em;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 ${toAdmin ? 'New Order Received' : 'Order Confirmation'}</h1>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h2>Order #${order.order_number}</h2>
            
            <p><strong>Customer:</strong> ${order.customer_name}</p>
            <p><strong>Phone:</strong> ${order.customer_phone}</p>
            <p><strong>Fulfillment:</strong> ${order.fulfillment_type === 'pickup' ? '🛍️ Pickup' : '🏠 Delivery'}</p>
            ${order.delivery_address ? `<p><strong>Delivery Address:</strong> ${order.delivery_address}</p>` : ''}
            ${order.customer_notes ? `<p><strong>Notes:</strong> ${order.customer_notes}</p>` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item) => `
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
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">TOTAL:</td>
                <td>${formatCurrency(order.total)}</td>
              </tr>
            </tbody>
          </table>

          ${!toAdmin ? `
            <p style="margin-top: 20px;">
              <strong>Thank you for your order!</strong><br>
              We'll prepare your items and ${order.fulfillment_type === 'pickup' ? 'notify you when ready for pickup' : 'deliver them to your address'}.
            </p>
            <p>Payment: Cash on ${order.fulfillment_type === 'pickup' ? 'pickup' : 'delivery'}</p>
          ` : ''}
        </div>

        <div class="footer">
          <p>${shopName}</p>
          <p>${process.env.NEXT_PUBLIC_SHOP_ADDRESS}</p>
          <p>${process.env.NEXT_PUBLIC_SHOP_PHONE}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendOrderEmail(data: OrderEmailData): Promise<void> {
  const { order, to, toAdmin } = data
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || 'Ambalangoda Grocery'
  const subject = toAdmin
    ? `New Order #${order.order_number} - ${shopName}`
    : `Order Confirmation #${order.order_number}`

  const html = generateOrderEmailHTML(data)

  try {
    // Try Resend first (if configured)
    if (resend && process.env.SMTP_FROM) {
      await resend.emails.send({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      })
      console.log('Email sent via Resend')
      return
    }

    // Fallback to SMTP
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      })
      console.log('Email sent via SMTP')
      return
    }

    console.warn('No email service configured')
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}
