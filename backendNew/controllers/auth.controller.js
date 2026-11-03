import client from "../config/redisClient.js";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import { OTP_TYPES, OTP_INVALID_TIME, OTP_EXPIRY_TIME, OTP_VERIFY_LIMIT, HTTP_RES } from "../utils/CONSTANTS.js";
import { oauth2Client } from "../utils/googleClient.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { sendOTPMail } from "../utils/nodemailer.js";
import { generateOtp } from "../utils/otp.js";
import axios from "axios";
import { userValidator } from "../validators/userValidator.js";
import cloudinary from "../utils/cloudinary.js";
import { registerService } from "../services/auth.service.js";
import ErrorWithStatus from "../config/ErrorWithStatus.js";

// Handles user registration
export const registerUser = async (req, res, next) => {
    try {
        const { value, error } = userValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }
        const { email } = req.body;

        await registerService(email, value);
        return res.status(200).json({
            message: "OTP sent successfully",
            status:  "success",
            data:    { otp_timer: Date.now() + Number(OTP_INVALID_TIME * 1000) },
        });
    } catch (error) {
        return next(error);
    }
};

// Handles user login
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ErrorWithStatus("Email and password are required", HTTP_RES.BAD_REQUEST);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.is_verified) {
            throw new ErrorWithStatus("User not found or unverified", HTTP_RES.NOT_FOUND);
        }
        if (!user.active) {
            res.cookie("jwt", "", { maxAge: 0, sameSite: "None", secure: true });
            throw new ErrorWithStatus("User is blocked", HTTP_RES.FORBIDDEN);
        }
        if (user.is_google_login && !user.password) {
            res.cookie("jwt", "", { maxAge: 0, sameSite: "None", secure: true });
            throw new ErrorWithStatus("Please log in using Google authentication", HTTP_RES.BAD_REQUEST);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
        if (!isPasswordCorrect) {
            throw new ErrorWithStatus("Incorrect credentials", HTTP_RES.BAD_REQUEST);
        }

        await prisma.user.update({
            where: { id: user.id },
            data:  { last_login: new Date() },
        });

        const token = generateToken(email);
        return res
            .cookie("jwt", token, {
                httpOnly: true,
                secure:   process.env.NODE_ENV === "production",
                maxAge:   24 * 60 * 60 * 1000,
                path:     "/",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            })
            .status(200)
            .json({
                message: "Logged In successfully",
                token,
                data: {
                    id:         user.id,
                    first_name: user.first_name,
                    last_name:  user.last_name,
                    email:      user.email,
                    role:       user.role,
                    avatar_url: user?.avatar_url ? (user.avatar_url.startsWith("http") ? user.avatar_url : cloudinary.url(user.avatar_url, { secure: true })) : null,
                },
            });
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (_req, res, next) => {
    try {
        res.cookie("jwt", "", { maxAge: 0, sameSite: "None", secure: true });
        res.status(200).json({
            message: "Logged out successfully",
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp_code, type } = req.body;
        let cache_data = null;
        try {
            cache_data = await client.get(`OTP:${email}`);
        } catch {
            cache_data = null;
        }

        if (cache_data) {
            const { otp, otp_count, otp_type, otp_invalid_time } = JSON.parse(cache_data);

            if (type !== otp_type) {
                throw new ErrorWithStatus("Invalid OTP verification attempt", HTTP_RES.BAD_REQUEST);
            }
            if (Date.now() > otp_invalid_time) {
                throw new ErrorWithStatus("OTP Timeout", HTTP_RES.BAD_REQUEST);
            }
            if (otp_count >= OTP_VERIFY_LIMIT) {
                throw new ErrorWithStatus("OTP verification limit reached", HTTP_RES.BAD_REQUEST);
            }
            if (otp !== otp_code) {
                throw new ErrorWithStatus("Incorrect OTP code", HTTP_RES.BAD_REQUEST);
            }
        }

        // Mark user verified and ensure wallet
        const updatedUser = await prisma.user.update({
            where: { email },
            data:  { is_verified: true },
        });

        await prisma.wallet.upsert({
            where:  { user_id: updatedUser.id },
            update: {},
            create: { user_id: updatedUser.id, balance: 0 },
        });

        try {
            await client.del(`OTP:${email}`);
            await client.set(`otp_verified:${email}`, "true", { EX: 600 });
        } catch {}

        return res.status(200).json({
            message: "OTP Verified successfully",
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const resendOTP = async (req, res, next) => {
    try {
        const { email, type } = req.body;
        const otp_code = generateOtp();

        try {
            await Promise.all([
                client.setEx(
                    `OTP:${email}`,
                    OTP_EXPIRY_TIME,
                    JSON.stringify({
                        otp:              otp_code,
                        otp_count:        0,
                        otp_type:         type || OTP_TYPES.SIGN_UP,
                        otp_invalid_time: Date.now() + OTP_INVALID_TIME * 1000,
                    })
                ),
                sendOTPMail(email, otp_code),
            ]);
        } catch (err) {
            console.warn("Resend OTP notification skipped:", err.message);
        }

        return res.status(200).json({
            message: "OTP sent successfully",
            status:  "success",
            data:    { otp_timer: Date.now() + Number(OTP_INVALID_TIME * 1000) },
        });
    } catch (error) {
        next(error);
    }
};

export const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findFirst({ where: { email, is_verified: true } });
        if (!user) {
            throw new ErrorWithStatus("No user found with this email address", HTTP_RES.BAD_REQUEST);
        }

        const otp_code = generateOtp();
        try {
            await Promise.all([
                client.setEx(
                    `OTP:${email}`,
                    OTP_EXPIRY_TIME,
                    JSON.stringify({
                        otp:              otp_code,
                        otp_count:        0,
                        otp_type:         OTP_TYPES.FORGET_PASSWORD,
                        otp_invalid_time: Date.now() + OTP_INVALID_TIME * 1000,
                    })
                ),
                sendOTPMail(email, otp_code),
            ]);
        } catch {}

        res.status(200).json({
            message: "OTP sent successfully",
            status:  "success",
            data:    { otp_timer: Date.now() + Number(OTP_INVALID_TIME * 1000) },
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email, password, confirm_password } = req.body;
        if (password !== confirm_password) {
            throw new ErrorWithStatus("Passwords do not match", HTTP_RES.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { email },
            data:  { password: hashedPassword, is_google_login: false },
        });

        try {
            await client.del(`otp_verified:${email}`);
        } catch {}

        return res.status(200).json({
            status:  "success",
            message: "Password reset successful",
        });
    } catch (error) {
        next(error);
    }
};

export const getUserDetails = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt || req.headers.authorization?.replace(/^Bearer\s+/i, "");
        if (!token) {
            throw new ErrorWithStatus("Access denied: No token provided", HTTP_RES.UNAUTHORIZED);
        }

        const data = verifyToken(token);
        const user = await prisma.user.findUnique({ where: { email: data.email } });

        if (!user || !user.active) {
            throw new ErrorWithStatus("User not found or access blocked", HTTP_RES.FORBIDDEN);
        }

        const cartCount = await prisma.cartItem.count({
            where: { cart: { user_id: user.id } },
        });

        return res.status(200).json({
            status:  "success",
            message: "User details retrieved successfully",
            data: {
                id:          user.id,
                first_name:  user.first_name,
                last_name:   user.last_name,
                email:       user.email,
                phone:       user.phone,
                role:        user.role,
                active:      user.active,
                cart:        cartCount,
                refferal_id: user.refferal_id,
                avatar_url:  user.avatar_url || null,
            },
        });
    } catch (error) {
        res.cookie("jwt", "", { maxAge: 0, sameSite: "None", secure: true });
        next(error);
    }
};

export const googleAuth = async (req, res, next) => {
    const { code } = req.query;
    try {
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name } = userRes.data;
        const [first_name = "User", ...restName] = (name || "").split(" ");
        const last_name = restName.join(" ") || "";

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    is_verified:     true,
                    is_google_login: true,
                    role:            "USER",
                },
            });

            await prisma.wallet.create({
                data: { user_id: user.id, balance: 0 },
            });
        }

        if (!user.active) {
            return res.status(403).json({ message: "User is blocked", status: "error" });
        }

        const token = generateToken(email);
        return res
            .status(200)
            .cookie("jwt", token, {
                httpOnly: true,
                secure:   process.env.NODE_ENV === "production",
                maxAge:   24 * 60 * 60 * 1000,
                path:     "/",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            })
            .json({
                message: "Google login successful",
                token,
                data: {
                    id:         user.id,
                    first_name: user.first_name,
                    last_name:  user.last_name,
                    email:      user.email,
                    role:       user.role,
                },
            });
    } catch (error) {
        next(error);
    }
};
