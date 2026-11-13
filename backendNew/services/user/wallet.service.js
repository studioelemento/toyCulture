import { razorpay } from "../../config/razorpay.js";
import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

export const addMoneyService = async (user, amount) => {
  const razorpay_option = {
    amount: amount * 100,
    currency: "INR",
    receipt: user.email,
  };

  const razorpay_order = await razorpay.orders.create(razorpay_option);

  let wallet = await prisma.wallet.findUnique({ where: { user_id: user.id } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { user_id: user.id, balance: 0 } });
  }

  await prisma.transaction.create({
    data: {
      wallet_id: wallet.id,
      type: "CREDIT",
      reason: "WALLET_TOPUP",
      amount,
      balanceAfter: wallet.balance,
      status: "PENDING",
      razorpay_order_id: razorpay_order.id,
      description: `Crediting amount : ${amount}`,
    },
  });

  return razorpay_order;
};

export const getWalletDataService = async (userId) => {
  let wallet = await prisma.wallet.findUnique({ where: { user_id: userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { user_id: userId, balance: 0 } });
  }

  const transactions = await prisma.transaction.findMany({
    where: { wallet_id: wallet.id },
    orderBy: { createdAt: "desc" },
  });

  return { wallet, transactions };
};

export const creditWalletAfterPaymentService = async (userId, razorpay_order_id) => {
  const wallet = await prisma.wallet.findUnique({ where: { user_id: userId } });
  if (!wallet) throw new ErrorWithStatus("Wallet not found", HTTP_RES.NOT_FOUND);

  const transaction = await prisma.transaction.findFirst({
    where: { razorpay_order_id, wallet_id: wallet.id },
  });
  if (!transaction) throw new ErrorWithStatus("No transaction found", HTTP_RES.NOT_FOUND);

  if (transaction.status === "SUCCESS") {
    return { wallet, transaction };
  }

  const updated = await prisma.$transaction(async (tx) => {
    const nextBalance = wallet.balance + transaction.amount;
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: nextBalance },
    });
    const updatedTxn = await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "SUCCESS",
        balanceAfter: nextBalance,
      },
    });
    return { wallet: updatedWallet, transaction: updatedTxn };
  });

  return updated;
};
