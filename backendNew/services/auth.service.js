import ErrorWithStatus from "../config/ErrorWithStatus.js";
import client from "../config/redisClient.js";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { HTTP_RES, OTP_EXPIRY_TIME, OTP_INVALID_TIME, OTP_TYPES } from "../utils/CONSTANTS.js";
import { sendOTPMail } from "../utils/nodemailer.js";
import { generateOtp } from "../utils/otp.js";

export const registerService = async (email, data) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.is_verified) {
        throw new ErrorWithStatus("User already exists", HTTP_RES.BAD_REQUEST);
    } else if (existing) {
        await prisma.user.delete({ where: { email } });
    }

    if (data.refferal_code) {
        const referredUser = await prisma.user.findFirst({ where: { refferal_id: data.refferal_code } });
        if (!referredUser) {
            throw new ErrorWithStatus("Invalid Referral Code", HTTP_RES.BAD_REQUEST);
        }
        data.reffered_by = referredUser.refferal_id;
    }

    const { refferal_code, password, ...rest } = data;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const generatedReferralId = nanoid(8);

    await prisma.user.create({
        data: {
            ...rest,
            password:    hashedPassword,
            refferal_id: generatedReferralId,
            is_verified: false,
            role:        "USER",
        },
    });

    const otp = generateOtp();
    try {
        await Promise.all([
            client.setEx(
                `OTP:${email}`,
                OTP_EXPIRY_TIME,
                JSON.stringify({
                    otp:              otp,
                    otp_count:        0,
                    otp_invalid_time: Date.now() + OTP_INVALID_TIME * 1000,
                    otp_type:         OTP_TYPES.SIGN_UP,
                })
            ),
            sendOTPMail(email, otp),
        ]);
    } catch (err) {
        console.warn("OTP / Redis notification skipped in dev:", err.message);
    }
};
