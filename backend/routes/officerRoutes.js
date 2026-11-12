import express from "express";
const router = express.Router();

import {
    getAssignedGrievances,
    getOfficerGrievanceDetails,
    updateOfficerStatus,
    submitActionTakenReport
} from "../controllers/officerController.js";
import { protect } from "../middleware/authMiddleware.js";

import { authorize } from "../middleware/roleMiddleware.js";

router.use(protect, authorize("officer"));

router.get("/grievances", getAssignedGrievances);
router.get("/grievances/:id", getOfficerGrievanceDetails);

router.put(
    "/grievances/:id/status",
    updateOfficerStatus
);

router.post(
    "/grievances/:id/action-report",
    submitActionTakenReport
);

export default router;