const DAY_MS = 24 * 60 * 60 * 1000;

export const JWT_COOKIE_NAME = "jwt";

export function getJwtCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    maxAge: DAY_MS,
    path: "/",
    sameSite: isProd ? "None" : "Lax",
  };
}

export function clearJwtCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(JWT_COOKIE_NAME, "", {
    maxAge: 0,
    path: "/",
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
  });
}

export function setJwtCookie(res, token) {
  res.cookie(JWT_COOKIE_NAME, token, getJwtCookieOptions());
}
