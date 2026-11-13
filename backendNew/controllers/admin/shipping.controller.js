import {
  createServiceablePincode,
  listServiceablePincodes,
  toggleServiceablePincode,
  updateServiceablePincode,
} from "../../services/admin/shipping.service.js";

export async function listPincodesController(req, res, next) {
  try {
    const result = await listServiceablePincodes(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createPincodeController(req, res, next) {
  try {
    const row = await createServiceablePincode(req.body);
    return res.status(201).json({ success: true, data: row });
  } catch (error) {
    next(error);
  }
}

export async function updatePincodeController(req, res, next) {
  try {
    const row = await updateServiceablePincode(req.params.id, req.body);
    return res.status(200).json({ success: true, data: row });
  } catch (error) {
    next(error);
  }
}

export async function togglePincodeController(req, res, next) {
  try {
    const row = await toggleServiceablePincode(req.params.id);
    return res.status(200).json({ success: true, data: row });
  } catch (error) {
    next(error);
  }
}
