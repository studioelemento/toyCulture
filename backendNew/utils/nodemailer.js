import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host : 'smtp.gmail.com',
  port : 587,
  secure : false,
  auth : {
    user : process.env.EMAIL,
    pass : process.env.PASS
  }
})


export const sendOTPMail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: `"Toy Culture" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Your Toy Culture verification code',
    text: `Your OTP is ${otp}. It expires shortly — do not share this code.`,
  });

  console.log(`OTP email sent: ${info.messageId}`);
};

function formatInr(amount) {
  const n = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
}

export async function sendOrderConfirmationEmail({
  to,
  name,
  orderNumber,
  total,
  paymentMethod,
  paymentStatus,
  items = [],
  address,
}) {
  if (!process.env.EMAIL || !process.env.PASS) {
    console.warn('EMAIL/PASS not configured — skipping order confirmation email');
    return null;
  }

  const lines = items
    .map((item) => `  • ${item.name} × ${item.qty} — ${formatInr(item.total)}`)
    .join('\n');

  const addressBlock = address
    ? `${address.first_name || ''} ${address.last_name || ''}\n${address.address || ''}\n${address.place || ''}, ${address.state || ''} ${address.pincode || ''}\nPhone: ${address.phone || ''}`
    : 'Address on file';

  const text = `Hi ${name},

Thank you for your order at Toy Culture!

Order: ${orderNumber}
Payment: ${paymentMethod} (${paymentStatus})
Total: ${formatInr(total)}

Items:
${lines || '  (see your account for details)'}

Deliver to:
${addressBlock}

We'll notify you when your order ships. Track orders anytime in My Account.

— Toy Culture Team`;

  const info = await transporter.sendMail({
    from: `"Toy Culture" <${process.env.EMAIL}>`,
    to,
    subject: `Order confirmed — ${orderNumber}`,
    text,
  });

  console.log(`Order confirmation email sent: ${info.messageId}`);
  return info;
}

export async function sendOrderShippedEmail({
  to,
  name,
  orderNumber,
  trackingNumber,
  carrier,
  items = [],
}) {
  if (!process.env.EMAIL || !process.env.PASS) {
    console.warn('EMAIL/PASS not configured — skipping shipped email');
    return null;
  }

  const lines = items
    .map((item) => `  • ${item.name} × ${item.qty}`)
    .join('\n');

  const text = `Hi ${name},

Your Toy Culture order has shipped!

Order: ${orderNumber}
${carrier ? `Carrier: ${carrier}` : ''}
Tracking: ${trackingNumber || '— (see My Account for updates)'}

Items:
${lines || '  (see your account)'}

Track your order anytime in My Account → My Orders.

— Toy Culture Team`;

  const info = await transporter.sendMail({
    from: `"Toy Culture" <${process.env.EMAIL}>`,
    to,
    subject: `Your order has shipped — ${orderNumber}`,
    text,
  });

  console.log(`Order shipped email sent: ${info.messageId}`);
  return info;
}