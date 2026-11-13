import { api } from './apiClient';

export const FREE_SHIPPING_THRESHOLD = 2000;
export const BASE_DELIVERY_FEE = 99;

export function estimateDeliveryFee(subtotal, extraFee = 0) {
  const sub = Number(subtotal) || 0;
  const base =
    sub >= FREE_SHIPPING_THRESHOLD || sub === 0 ? 0 : BASE_DELIVERY_FEE;
  return base + (Number(extraFee) || 0);
}

export async function fetchPincodeDelivery(pin, subtotal = 0) {
  const normalized = String(pin || '').replace(/\D/g, '').slice(0, 6);
  if (normalized.length !== 6) {
    return { serviceable: false, message: 'Enter a valid 6-digit pincode' };
  }
  const data = await api.get(
    `/api/shipping/pincode/${normalized}?subtotal=${Number(subtotal) || 0}`
  );
  return data.data;
}
