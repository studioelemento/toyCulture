import { getPincodeServiceability } from "../services/shipping/pincode.service.js";
import { calculateDeliveryFee, FREE_SHIPPING_THRESHOLD, BASE_DELIVERY_FEE } from "../utils/shipping.js";

export async function checkPincodeController(req, res, next) {
  try {
    const pin = req.params.pincode || req.query.pin;
    const subtotal = Number(req.query.subtotal) || 0;

    const info = await getPincodeServiceability(pin);
    const delivery_fee = info.serviceable
      ? calculateDeliveryFee(subtotal, info.extra_delivery_fee)
      : null;

    return res.status(200).json({
      success: true,
      data: {
        ...info,
        delivery_fee,
        free_shipping_threshold: FREE_SHIPPING_THRESHOLD,
        base_delivery_fee: BASE_DELIVERY_FEE,
      },
    });
  } catch (error) {
    next(error);
  }
}
