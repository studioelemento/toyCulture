import { prisma } from "../config/prisma.js";
import {
    addAddressService,
    changeEmailService,
    changePasswordService,
    editAddressService,
    editProfileService,
    setToPrimaryAddressService,
} from "../services/account.service.js";
import { uploadImages } from "../utils/cloudinary.js";
import { addressValidator } from "../validators/account/addressValidator.js";
import { editProfileValidator } from "../validators/account/editProfileValidator.js";
import {
    changePasswordValidator,
    emailValidator,
} from "../validators/userValidator.js";
import { HTTP_RES } from "../utils/CONSTANTS.js";
import ErrorWithStatus from "../config/ErrorWithStatus.js";

export const editPrfileController = async (req, res, next) => {
    try {
        const { value, error } = editProfileValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }
        const email = req.email || req.user?.email;
        let uploadUrl = [];
        if (req.files && req.files.length > 0) {
            uploadUrl = await uploadImages(req, "user");
        }
        const result = await editProfileService(value, email, uploadUrl[0]);

        res.status(200).json({
            status:  "success",
            data:    result,
            message: "Profile updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const changeEmailController = async (req, res, next) => {
    try {
        const { value, error } = emailValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }
        const currentUser = req.email || req.user?.email;
        const result = await changeEmailService(value.email, currentUser);

        return res.status(200).json({
            message: "OTP sent successfully",
            status:  "success",
            data:    result,
        });
    } catch (error) {
        next(error);
    }
};

export const changePasswordController = async (req, res, next) => {
    try {
        const { value, error } = changePasswordValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }
        const currentUser = req.email || req.user?.email;
        await changePasswordService(
            value.password,
            value.old_password,
            currentUser
        );

        return res.status(200).json({
            message: "Password changed successfully",
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const addAddressController = async (req, res, next) => {
    try {
        const { value, error } = addressValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }
        const currentUser = req.email || req.user?.email;
        const result = await addAddressService(value, currentUser);

        return res.status(201).json({
            data:    result,
            message: "Address created successfully",
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllAddressController = async (req, res, next) => {
    try {
        const currentUser = req.email || req.user?.email;
        const user = await prisma.user.findUnique({ where: { email: currentUser } });
        if (!user) {
            throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);
        }

        const addresses = await prisma.address.findMany({
            where:   { user_id: user.id },
            orderBy: [{ is_primary: "desc" }, { createdAt: "desc" }],
        });

        return res.status(200).json({
            data:    addresses,
            message: "Addresses retrieved successfully",
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const getAddressController = async (req, res, next) => {
    try {
        const currentUser = req.email || req.user?.email;
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { email: currentUser } });
        if (!user) {
            throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);
        }

        const address = await prisma.address.findFirst({
            where: { id, user_id: user.id },
        });

        if (!address) {
            throw new ErrorWithStatus("Address not found", HTTP_RES.NOT_FOUND);
        }

        return res.status(200).json({
            message: "Address retrieved successfully",
            data:    address,
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAddressController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUser = req.email || req.user?.email;
        const user = await prisma.user.findUnique({ where: { email: currentUser } });
        if (!user) {
            throw new ErrorWithStatus("User not found", HTTP_RES.NOT_FOUND);
        }

        const address = await prisma.address.findFirst({
            where: { id, user_id: user.id },
        });

        if (!address) {
            throw new ErrorWithStatus("Address not found", HTTP_RES.NOT_FOUND);
        }

        await prisma.address.delete({ where: { id } });

        return res.status(200).json({
            message: "Address deleted successfully",
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const editAddressController = async (req, res, next) => {
    try {
        const { value, error } = addressValidator(req.body);
        if (error) {
            throw new ErrorWithStatus(error.message, HTTP_RES.BAD_REQUEST);
        }
        const currentUser = req.email || req.user?.email;
        const { id } = req.params;
        const address = await editAddressService(id, currentUser, value);

        return res.status(200).json({
            message: "Address updated successfully",
            data:    address,
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const setToPrimaryAddressController = async (req, res, next) => {
    try {
        const currentUser = req.email || req.user?.email;
        const { id } = req.params;
        const address = await setToPrimaryAddressService(currentUser, id);

        return res.status(200).json({
            message: "Address set as primary successfully",
            data:    address,
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};

export const getCouponsController = async (_req, res, next) => {
    try {
        const coupons = await prisma.coupon.findMany({
            where:   { is_active: true, valid_until: { gt: new Date() } },
            orderBy: { value: "desc" },
        });

        return res.status(HTTP_RES.OK).json({
            message: "Coupons retrieved successfully",
            data:    coupons,
            status:  "success",
        });
    } catch (error) {
        next(error);
    }
};
