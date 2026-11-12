
import express from "express";
const router = express.Router();
import {
    getAllGrievances,
    getDashboardStats,
    getGrievanceDetails,
    assignGrievance,
    updateGrievanceStatus,
    addGrievanceRemark
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

import { authorize } from "../middleware/roleMiddleware.js";
import {
    analyzeGrievanceWithAI,
} from "../controllers/adminController.js";
import {
    getDepartmentOfficers
} from "../controllers/adminController.js";



router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/grievances", getAllGrievances);
router.get("/grievances/:id", getGrievanceDetails);
router.put("/grievances/:id/assign", assignGrievance);
router.put("/grievances/:id/status", updateGrievanceStatus);
router.post("/grievances/:id/remarks", addGrievanceRemark);
router.post(
    "/grievances/:id/analyze",
    analyzeGrievanceWithAI
);
router.get("/officers", getDepartmentOfficers);

export default router;