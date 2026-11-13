export const FREE_SHIPPING_THRESHOLD = 2000;
export const BASE_DELIVERY_FEE = 99;

export function normalizePincode(pin) {
  return String(pin || "").replace(/\D/g, "").slice(0, 6);
}

export function isValidPincodeFormat(pin) {
  const normalized = normalizePincode(pin);
  return /^[1-9]\d{5}$/.test(normalized);
}

export function calculateDeliveryFee(subtotal, extraFee = 0) {
  const sub = Number(subtotal) || 0;
  const base =
    sub >= FREE_SHIPPING_THRESHOLD || sub === 0 ? 0 : BASE_DELIVERY_FEE;
  return base + (Number(extraFee) || 0);
}
