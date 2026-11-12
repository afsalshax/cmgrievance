
import express from "express";

import {
    register,
    login,
    getProfile
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, getProfile);

// Logout is handled by clearing the JWT on the frontend.
router.post("/logout", protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logout successful. Please clear your session."
    });
});

export default router;