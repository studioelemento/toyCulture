import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import {
  addMoneyService,
  creditWalletAfterPaymentService,
  getWalletDataService,
} from "../../services/user/wallet.service.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";
import { verifyPaymentService } from "../../utils/helpers.js";

export const getWalletController = async (req, res, next) => {
  try {
    const user = req.user;
    const data = await getWalletDataService(user.id);
    return res.status(HTTP_RES.OK).json({
      message: "Wallet data received successfully",
      data,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const addMoneyController = async (req, res, next) => {
  try {
    const user = req.user;
    const { amount } = req.body;
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      throw new ErrorWithStatus("Invalid Amount", HTTP_RES.BAD_REQUEST);
    }
    const response = await addMoneyService(user, numericAmount);
    return res.status(HTTP_RES.OK).json({
      message: "Amount requested successfully",
      data: response,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAddMoneyController = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const user = req.user;

    const isValid = await verifyPaymentService(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(HTTP_RES.BAD_REQUEST).json({
        status: "error",
        message: "Transaction not verified",
      });
    }

    await creditWalletAfterPaymentService(user.id, razorpay_order_id);

    return res.status(HTTP_RES.OK).json({
      status: "success",
      message: "Transaction verified, Amount Credited",
    });
  } catch (error) {
    next(error);
  }
};
