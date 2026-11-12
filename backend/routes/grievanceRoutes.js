import express from "express";

import {
    submitGrievance,
    getMyGrievances,
    trackGrievance,
    submitGrievanceFeedback
} from "../controllers/grievanceController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Submit grievance with optional attachments
router.post(
    "/",
    protect,
    authorize("citizen"),
    upload.array("attachments", 3),
    submitGrievance
);

// Get citizen's grievances
router.get(
    "/my",
    protect,
    authorize("citizen"),
    getMyGrievances
);

// Track grievance using reference number
router.get(
    "/track/:referenceNumber",
    trackGrievance
);

// Submit feedback
router.post(
    "/:id/feedback",
    protect,
    authorize("citizen"),
    submitGrievanceFeedback
);

export default router;