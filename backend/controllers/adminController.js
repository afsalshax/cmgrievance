import Grievance from "../models/Grievance.js";
import GrievanceHistory from "../models/GrievanceHistory.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { analyzeGrievance } from "../services/aiService.js";

// 1. Get all grievances with filters
export const getAllGrievances = async (req, res) => {
    try {
        const { status, district, category, priority, search } = req.query;

        const filter = {};

        if (status) filter.status = status;
        if (district) filter.district = district;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        if (search) {
            filter.$or = [
                { referenceNumber: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const grievances = await Grievance.find(filter)
            .populate("citizen", "name email mobile")
            .populate("department", "name")
            .populate("assignedOfficer", "name email")
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

// 2. Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const total = await Grievance.countDocuments();

        const pending = await Grievance.countDocuments({
            status: { $in: ["Submitted", "Under Review", "In Progress", "Reopened"] }
        });

        const resolved = await Grievance.countDocuments({
            status: "Resolved"
        });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const overdue = await Grievance.countDocuments({
            status: { $ne: "Resolved" },
            createdAt: { $lt: sevenDaysAgo }
        });

        res.status(200).json({
            success: true,
            stats: { total, pending, resolved, overdue }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get grievance details and history
export const getGrievanceDetails = async (req, res) => {
    try {
        const grievance = await Grievance.findById(req.params.id)
            .populate("citizen", "name email mobile")
            .populate("department", "name")
            .populate("assignedOfficer", "name email");

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
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

// 4. Assign department and officer
export const assignGrievance = async (req, res) => {
    try {
        const { departmentId, officerId } = req.body;

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        if (!departmentId) {
            return res.status(400).json({
                message: "Department is required"
            });
        }

        if (officerId) {
            const officer = await User.findOne({
                _id: officerId,
                role: "officer",
                department: departmentId,
                isActive: true
            });

            if (!officer) {
                return res.status(400).json({
                    message: "Invalid officer or officer does not belong to this department"
                });
            }
        }

        const previousStatus = grievance.status;

        grievance.department = departmentId;
        grievance.assignedOfficer = officerId || null;

        if (grievance.status === "Submitted") {
            grievance.status = "Under Review";
        }

        await grievance.save();

        await GrievanceHistory.create({
            grievance: grievance._id,
            previousStatus,
            newStatus: grievance.status,
            remarks: `Assigned to department ${departmentId}${officerId ? ` and officer ${officerId}` : ""}`,
            updatedBy: req.user.id
        });

        res.status(200).json({
            success: true,
            message: "Grievance assigned successfully",
            grievance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Update grievance status
export const updateGrievanceStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        const allowedStatuses = [
            "Submitted",
            "Under Review",
            "In Progress",
            "Resolved",
            "Reopened"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid grievance status"
            });
        }

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        const previousStatus = grievance.status;

        grievance.status = status;
        await grievance.save();

        await GrievanceHistory.create({
            grievance: grievance._id,
            previousStatus,
            newStatus: status,
            remarks: remarks || "",
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

// 6. Add internal remark
export const addGrievanceRemark = async (req, res) => {
    try {
        const { remarks } = req.body;

        if (!remarks || !remarks.trim()) {
            return res.status(400).json({
                message: "Remarks are required"
            });
        }

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        await GrievanceHistory.create({
            grievance: grievance._id,
            previousStatus: grievance.status,
            newStatus: grievance.status,
            remarks: remarks.trim(),
            updatedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Remark added successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const analyzeGrievanceWithAI = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate grievance ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid grievance ID",
            });
        }

        // Find grievance
        const grievance = await Grievance.findById(id);

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }

        // Analyze grievance using Gemini
        const aiResult = await analyzeGrievance({
            subject: grievance.subject,
            description: grievance.description,
            district: grievance.district,
        });

        // Save AI recommendations
        grievance.aiAnalysis = {
            suggestedDepartment: aiResult.suggestedDepartment,
            suggestedCategory: aiResult.suggestedCategory,
            priority: aiResult.priority,
            summary: aiResult.summary,
            possibleDuplicate: aiResult.possibleDuplicate,
        };

        await grievance.save();

        return res.status(200).json({
            success: true,
            message: "AI analysis completed successfully",
            aiAnalysis: grievance.aiAnalysis,
        });
    } catch (error) {
        console.error("AI re-analysis error:", error);

        const status = Number(error.status);

        if (status === 503 || status === 429) {
            return res.status(status).json({
                success: false,
                retryable: true,
                message:
                    status === 503
                        ? "AI service is currently busy. Please try again shortly."
                        : "AI request limit reached. Please try again later.",
            });
        }

        return res.status(500).json({
            success: false,
            retryable: false,
            message: "Unable to complete AI analysis.",
        });
    }
};

export const getDepartmentOfficers = async (req, res) => {
    try {
        const { departmentId } = req.query;

        const filter = {
            role: "officer",
            isActive: true
        };

        if (departmentId) {
            filter.department = departmentId;
        }

        const officers = await User.find(filter)
            .select("name email mobile department")
            .populate("department", "name")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            officers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};