import { sendOrderConfirmationEmail, sendOrderShippedEmail } from './nodemailer.js';

export function scheduleOrderConfirmationEmail(order, user) {
  if (!order || !user?.email) return;

  sendOrderConfirmationEmail({
    to: user.email,
    name: [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Customer',
    orderNumber: order.order_number,
    total: order.total_amount,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    items: (order.items || []).map((item) => ({
      name: item.product_name,
      qty: item.quantity,
      total: item.total,
    })),
    address: order.shipping_address,
  }).catch((err) => {
    console.error('Order confirmation email failed:', err?.message || err);
  });
}

export function scheduleOrderShippedEmail(order, user) {
  if (!order || !user?.email) return;

  sendOrderShippedEmail({
    to: user.email,
    name: [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Customer',
    orderNumber: order.order_number,
    trackingNumber: order.tracking_number,
    carrier: order.carrier,
    items: (order.items || []).map((item) => ({
      name: item.product_name,
      qty: item.quantity,
    })),
  }).catch((err) => {
    console.error('Order shipped email failed:', err?.message || err);
  });
}
