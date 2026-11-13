import express from "express";
import { checkPincodeController } from "../controllers/shipping.controller.js";

const router = express.Router();

router.get("/pincode/:pincode", checkPincodeController);
router.get("/check", checkPincodeController);

export default router;
