import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";
import { isValidPincodeFormat, normalizePincode } from "../../utils/shipping.js";

export async function listServiceablePincodes(query = {}) {
  const limit = Math.min(Number(query.limit) || 50, 200);
  const page = Math.max(Number(query.page) || 1, 1);
  const search = query.q?.trim() || "";

  const where = {};
  if (search) {
    where.OR = [
      { pincode: { contains: search } },
      { city: { contains: search, mode: "insensitive" } },
      { state: { contains: search, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.serviceablePincode.findMany({
      where,
      orderBy: { pincode: "asc" },
      skip: limit * (page - 1),
      take: limit,
    }),
    prisma.serviceablePincode.count({ where }),
  ]);

  return {
    pincodes: rows,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  };
}

export async function createServiceablePincode(data) {
  const pincode = normalizePincode(data.pincode);
  if (!isValidPincodeFormat(pincode)) {
    throw new ErrorWithStatus("Invalid pincode", HTTP_RES.BAD_REQUEST);
  }

  const existing = await prisma.serviceablePincode.findUnique({ where: { pincode } });
  if (existing) {
    throw new ErrorWithStatus("Pincode already exists", HTTP_RES.CONFLICT);
  }

  return prisma.serviceablePincode.create({
    data: {
      pincode,
      city: data.city?.trim() || null,
      state: data.state?.trim() || null,
      cod_allowed: data.cod_allowed !== false,
      delivery_days_min: Number(data.delivery_days_min) || 3,
      delivery_days_max: Number(data.delivery_days_max) || 7,
      extra_delivery_fee: Number(data.extra_delivery_fee) || 0,
      is_active: data.is_active !== false,
    },
  });
}

export async function updateServiceablePincode(id, data) {
  const existing = await prisma.serviceablePincode.findUnique({ where: { id } });
  if (!existing) {
    throw new ErrorWithStatus("Pincode not found", HTTP_RES.NOT_FOUND);
  }

  const payload = {};
  if (data.city !== undefined) payload.city = data.city?.trim() || null;
  if (data.state !== undefined) payload.state = data.state?.trim() || null;
  if (data.cod_allowed !== undefined) payload.cod_allowed = Boolean(data.cod_allowed);
  if (data.delivery_days_min !== undefined) {
    payload.delivery_days_min = Number(data.delivery_days_min) || 3;
  }
  if (data.delivery_days_max !== undefined) {
    payload.delivery_days_max = Number(data.delivery_days_max) || 7;
  }
  if (data.extra_delivery_fee !== undefined) {
    payload.extra_delivery_fee = Number(data.extra_delivery_fee) || 0;
  }
  if (data.is_active !== undefined) payload.is_active = Boolean(data.is_active);

  return prisma.serviceablePincode.update({ where: { id }, data: payload });
}

export async function toggleServiceablePincode(id) {
  const row = await prisma.serviceablePincode.findUnique({ where: { id } });
  if (!row) throw new ErrorWithStatus("Pincode not found", HTTP_RES.NOT_FOUND);
  return prisma.serviceablePincode.update({
    where: { id },
    data: { is_active: !row.is_active },
  });
}
