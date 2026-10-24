import Razorpay from "razorpay"

const KEY_ID = process.env.RAZORPAY_KEY_ID
const KEY_SECRET = process.env.RAZORPAY_SECRET

// Lazy-init: avoid crashing at import when env vars are not yet set
let _razorpay = null;

export const getRazorpay = () => {
  if (!_razorpay) {
    if (!KEY_ID && !KEY_SECRET) {
      console.warn('⚠️  RAZORPAY_KEY_ID / RAZORPAY_SECRET not set – Razorpay disabled');
      return null;
    }
    _razorpay = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET,
    });
  }
  return _razorpay;
};

// Keep backward-compat default export via a Proxy so existing
// code that does `razorpay.orders.create(...)` still works.
export const razorpay = new Proxy({}, {
  get(_target, prop) {
    const instance = getRazorpay();
    if (!instance) {
      throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_SECRET in .env');
    }
    return instance[prop];
  },
});