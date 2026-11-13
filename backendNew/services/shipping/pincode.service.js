import { prisma } from "../../config/prisma.js";
import {
  isValidPincodeFormat,
  normalizePincode,
} from "../../utils/shipping.js";

const DEFAULT_OPEN = {
  cod_allowed: true,
  delivery_days_min: 3,
  delivery_days_max: 7,
  extra_delivery_fee: 0,
  city: null,
  state: null,
};

/**
 * Pan-India by default: any valid pincode can checkout.
 * Admin rows only override ETA, extra fee, or COD for matching pincodes.
 * Set SHIPPING_ENFORCE_WHITELIST=true to restrict to listed pincodes only (later).
 */
export async function getPincodeServiceability(pincode) {
  const normalized = normalizePincode(pincode);

  if (!isValidPincodeFormat(normalized)) {
    return {
      serviceable: false,
      pincode: normalized,
      message: "Enter a valid 6-digit delivery pincode",
    };
  }

  const enforceWhitelist =
    String(process.env.SHIPPING_ENFORCE_WHITELIST || "").toLowerCase() === "true";

  const record = await prisma.serviceablePincode.findFirst({
    where: { pincode: normalized, is_active: true },
  });

  if (record) {
    return {
      serviceable: true,
      pincode: normalized,
      cod_allowed: record.cod_allowed,
      delivery_days_min: record.delivery_days_min,
      delivery_days_max: record.delivery_days_max,
      extra_delivery_fee: record.extra_delivery_fee,
      city: record.city,
      state: record.state,
      open_network: false,
      matched_rule: true,
    };
  }

  if (enforceWhitelist) {
    const activeCount = await prisma.serviceablePincode.count({
      where: { is_active: true },
    });
    if (activeCount > 0) {
      return {
        serviceable: false,
        pincode: normalized,
        message:
          "We don't deliver to this pincode yet — try another address or contact support",
      };
    }
  }

  return {
    serviceable: true,
    pincode: normalized,
    ...DEFAULT_OPEN,
    open_network: true,
    matched_rule: false,
  };
}
