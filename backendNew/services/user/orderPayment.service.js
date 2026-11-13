import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import { prisma } from '../../config/prisma.js';
import { razorpay } from '../../config/razorpay.js';
import ErrorWithStatus from '../../config/ErrorWithStatus.js';
import { HTTP_RES } from '../../utils/CONSTANTS.js';
import { scheduleOrderConfirmationEmail } from '../../utils/orderEmail.js';

export async function createRazorpayOrderForShopOrder(order, user) {
  const amountPaise = Math.round(Number(order.total_amount) * 100);
  if (amountPaise < 100) {
    throw new ErrorWithStatus('Order amount too low for online payment', HTTP_RES.BAD_REQUEST);
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: order.order_number,
    notes: {
      order_id: order.id,
      user_id: user.id,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpay_order_id: razorpayOrder.id },
  });

  return {
    razorpay_order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key_id: process.env.RAZORPAY_KEY_ID,
    order_id: order.id,
    order_number: order.order_number,
    prefill: {
      name: [user.first_name, user.last_name].filter(Boolean).join(' '),
      email: user.email,
      contact: user.phone || '',
    },
  };
}

export async function verifyShopOrderPayment(userEmail, {
  order_id,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ErrorWithStatus('Incomplete payment verification payload', HTTP_RES.BAD_REQUEST);
  }

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new ErrorWithStatus('Unauthorized', HTTP_RES.UNAUTHORIZED);

  const order = await prisma.order.findFirst({
    where: { id: order_id, user_id: user.id, deletedAt: null },
    include: { items: true, shipping_address: true },
  });

  if (!order) throw new ErrorWithStatus('Order not found', HTTP_RES.NOT_FOUND);
  if (order.razorpay_order_id !== razorpay_order_id) {
    throw new ErrorWithStatus('Payment does not match this order', HTTP_RES.BAD_REQUEST);
  }
  if (order.payment_status === 'PAID') {
    return order;
  }

  const secret = process.env.RAZORPAY_SECRET;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const valid = validateWebhookSignature(body, razorpay_signature, secret);
  if (!valid) {
    throw new ErrorWithStatus('Invalid payment signature', HTTP_RES.BAD_REQUEST);
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      payment_status: 'PAID',
      razorpay_payment_id,
      status: order.status === 'PLACED' ? 'CONFIRMED' : order.status,
      status_history: [
        ...(Array.isArray(order.status_history) ? order.status_history : []),
        {
          status: 'CONFIRMED',
          timestamp: new Date().toISOString(),
          note: 'Online payment received',
        },
      ],
    },
    include: { items: true, shipping_address: true },
  });

  scheduleOrderConfirmationEmail(updated, user);
  return updated;
}
