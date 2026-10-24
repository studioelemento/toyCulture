// src/middleware/adminAuth.js
// Simple admin guard – for now just passes through.
// TODO: Replace with real auth (JWT, session, role check, etc.) when ready.

const ApiError = require("../utils/apiError");

module.exports = (req, res, next) => {
  // For development: allow all requests through.
  // In production, uncomment and implement proper auth:
  //
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) {
  //   return next(new ApiError(403, "Admin access required"));
  // }
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   if (decoded.role !== 'admin') throw new Error();
  //   req.admin = decoded;
  // } catch {
  //   return next(new ApiError(403, "Invalid or expired admin token"));
  // }

  next();
};
