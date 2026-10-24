// services/account.service.js
import client from "../config/redisClient.js";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import {
    OTP_EXPIRY_TIME,
    OTP_INVALID_TIME,
    OTP_TYPES,
} from "../utils/CONSTANTS.js";
import { sendOTPMail } from "../utils/nodemailer.js";
import { generateOtp } from "../utils/otp.js";

/**
 * Update a user's profile information.
 */
export const editProfileService = async (data, email, url) => {
    const updatedUser = await prisma.user.update({
        where: { email },
        data: {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            avatar_url: url ? url : undefined,
        },
    });
    return updatedUser;
};

/**
 * Initiate a change‑email flow: generate OTP, store it in Redis and send mail.
 */
export const changeEmailService = async (email, currentUser) => {
    const user = await prisma.user.findUnique({ where: { email: currentUser } });
    if (!user) {
        throw new Error("User Not exists");
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error("User Exists with the same email");
    }
    const otp = generateOtp();
    await Promise.all([
        client.setEx(
            `OTP:${email}`,
            OTP_EXPIRY_TIME,
            JSON.stringify({
                otp: otp,
                otp_count: 0,
                otp_invalid_time: Date.now() + OTP_INVALID_TIME * 1000,
                otp_type: OTP_TYPES.CHANGE_EMAIL,
            })
        ),
        client.setEx(`CHANGE_PASSWORD:${email}`, OTP_EXPIRY_TIME, currentUser),
        sendOTPMail(email, otp),
    ]);
    return { otp_timer: Date.now() + OTP_INVALID_TIME * 1000 };
};

/**
 * Change user password after verifying old password.
 */
export const changePasswordService = async (newPassword, oldPassword, currentUser) => {
    const user = await prisma.user.findUnique({ where: { email: currentUser } });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.is_google_login) {
        throw new Error("Incorrect Password");
    }
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password || "");
    if (!isPasswordCorrect) {
        throw new Error("Incorrect Password");
    }
    await prisma.user.update({
        where: { email: currentUser },
        data: { password: newPassword },
    });
};

/**
 * Add a new address for a user, respecting limits and uniqueness.
 */
export const addAddressService = async (data, currentUser) => {
    const user = await prisma.user.findUnique({ where: { email: currentUser } });
    if (!user) {
        throw new Error("Invalid User");
    }
    const existingAddresses = await prisma.address.findMany({ where: { user_id: user.id } });
    if (existingAddresses.some((a) => a.address_type.toUpperCase() === data.address_type.toUpperCase())) {
        throw new Error("Address Type already exists");
    }
    if (existingAddresses.length >= 3) {
        throw new Error("Maximum number of addresses created, remove or edit existing ones");
    }
    const address = await prisma.address.create({
        data: {
            ...data,
            user_id: user.id,
            is_primary: existingAddresses.length === 0,
        },
    });
    return address;
};

/**
 * Edit an existing address.
 */
export const editAddressService = async (addressId, currentUser, value) => {
    const user = await prisma.user.findUnique({ where: { email: currentUser } });
    if (!user) throw new Error("Invalid User");
    const address = await prisma.address.findFirst({
        where: { id: addressId, user_id: user.id },
    });
    if (!address) throw new Error("Address not found");
    const allAddresses = await prisma.address.findMany({ where: { user_id: user.id } });
    if (
        allAddresses.some(
            (a) => a.id !== addressId && a.address_type === value.address_type
        )
    ) {
        throw new Error("Address Type already exists");
    }
    const updated = await prisma.address.update({
        where: { id: addressId },
        data: value,
    });
    return updated;
};

/**
 * Set a specific address as the primary one, using a transaction.
 */
export const setToPrimaryAddressService = async (currentUser, id) => {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { email: currentUser } });
        if (!user) throw new Error("User Not found");
        const address = await tx.address.findFirst({
            where: { id, user_id: user.id },
        });
        if (!address) throw new Error("Address Not found");
        if (address.is_primary) {
            throw new Error("Address is already set to primary");
        }
        await tx.address.updateMany({
            where: { user_id: user.id, is_primary: true },
            data: { is_primary: false },
        });
        const updated = await tx.address.update({
            where: { id },
            data: { is_primary: true },
        });
        return updated;
    });
};
