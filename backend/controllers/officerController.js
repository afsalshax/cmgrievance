import Grievance from "../models/Grievance.js";
import GrievanceHistory from "../models/GrievanceHistory.js";

// 1. Get grievances assigned to logged-in officer
export const getAssignedGrievances = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {
            assignedOfficer: req.user.id
        };

        if (status) {
            filter.status = status;
        }

        const grievances = await Grievance.find(filter)
            .populate("citizen", "name email mobile")
            .populate("department", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: grievances.length,
            grievances
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get assigned grievance details
export const getOfficerGrievanceDetails = async (req, res) => {
    try {
        const grievance = await Grievance.findOne({
            _id: req.params.id,
            assignedOfficer: req.user.id
        })
            .populate("citizen", "name email mobile")
            .populate("department", "name");

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found or not assigned to you"
            });
        }

        const history = await GrievanceHistory.find({
            grievance: grievance._id
        })
            .populate("updatedBy", "name role")
            .sort({ updatedAt: 1 });

        res.status(200).json({
            success: true,
            grievance,
            history
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update grievance status
export const updateOfficerStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        const allowedStatuses = ["In Progress"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Officer can only update status to In Progress"
            });
        }

        const grievance = await Grievance.findOne({
            _id: req.params.id,
            assignedOfficer: req.user.id
        });

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found or not assigned to you"
            });
        }

        if (grievance.status === "Resolved") {
            return res.status(400).json({
                message: "Resolved grievances cannot be updated by the officer"
            });
        }

        const previousStatus = grievance.status;

        grievance.status = status;

        if (remarks) {
            grievance.investigationRemarks = remarks.trim();
        }

        await grievance.save();

        await GrievanceHistory.create({
            grievance: grievance._id,
            previousStatus,
            newStatus: status,
            remarks: remarks || "Investigation started",
            updatedBy: req.user.id
        });

        res.status(200).json({
            success: true,
            message: "Grievance status updated successfully",
            grievance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Submit action-taken report to CMO
export const submitActionTakenReport = async (req, res) => {
    try {
        const { actionTakenReport } = req.body;

        if (!actionTakenReport || !actionTakenReport.trim()) {
            return res.status(400).json({
                message: "Action-taken report is required"
            });
        }

        const grievance = await Grievance.findOne({
            _id: req.params.id,
            assignedOfficer: req.user.id
        });

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found or not assigned to you"
            });
        }

        if (grievance.status === "Resolved") {
            return res.status(400).json({
                message: "This grievance is already resolved"
            });
        }

        grievance.actionTakenReport = actionTakenReport.trim();
        grievance.reportSubmittedAt = new Date();

        await grievance.save();

        await GrievanceHistory.create({
            grievance: grievance._id,
            previousStatus: grievance.status,
            newStatus: grievance.status,
            remarks: "Action-taken report submitted to CMO for review",
            updatedBy: req.user.id
        });

        res.status(200).json({
            success: true,
            message: "Action-taken report submitted successfully",
            grievance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};