import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:    process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

/**
 * Upload an array of files (from multer req.files) to Cloudinary.
 * @param {import("express").Request} req  - Express request with req.files
 * @param {string}  folder                 - Target Cloudinary folder
 * @returns {Promise<string[]>}            - Array of Cloudinary public_ids
 */
export const uploadImages = async (req, folder) => {
    const files = req?.files ?? [];
    const results = await Promise.all(
        files.map((file) =>
            cloudinary.uploader.upload(file.path, { folder })
        )
    );
    return results.map((r) => r.public_id);
};

/**
 * Extract the Cloudinary public_id from a full URL.
 * @param {string} url
 * @returns {string|null}
 */
export const getPublicIdFromUrl = (url) => {
    if (typeof url !== "string") return null;
    try {
        const cleanUrl         = url.split("?")[0];
        let publicIdWithExt    = cleanUrl.split("/upload/")[1];
        if (!publicIdWithExt)  return null;
        publicIdWithExt        = publicIdWithExt.replace(/^v[0-9]+\/+/, "");
        return publicIdWithExt.replace(/\.[^/.]+$/, "");
    } catch {
        return null;
    }
};

export default cloudinary;
