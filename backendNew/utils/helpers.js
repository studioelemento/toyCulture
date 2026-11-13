import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import ErrorWithStatus from "../config/ErrorWithStatus.js";
import { prisma } from "../config/prisma.js";
import { razorpay } from "../config/razorpay.js";
import { HTTP_RES } from "./CONSTANTS.js";

export const createWallet = async (user_id) => {
  await prisma.wallet.upsert({
    where: { user_id },
    update: {},
    create: { user_id, balance: 0 },
  });
};

export const verifyPaymentService = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  const secret = process.env.RAZORPAY_SECRET;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

  const transaction = await prisma.transaction.findFirst({
    where: { razorpay_order_id },
  });
  if (!transaction) {
    throw new ErrorWithStatus("No transaction found", HTTP_RES.NOT_FOUND);
  }

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: isValidSignature ? "SUCCESS" : "FAILED",
      razorpay_payment_id: razorpay_payment_id || null,
    },
  });

  return isValidSignature;
};
