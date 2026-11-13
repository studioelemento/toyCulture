import cloudinary from "./cloudinary.js";

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function formatAuthUser(user) {
  if (!user) return null;

  const avatarUrl =
    user.avatar_url &&
    (user.avatar_url.startsWith("http")
      ? user.avatar_url
      : cloudinary.url(user.avatar_url, { secure: true }));

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone ?? null,
    role: user.role,
    active: user.active,
    avatar_url: avatarUrl ?? null,
    referral_id: user.referral_id ?? null,
  };
}
