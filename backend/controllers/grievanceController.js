
import Grievance from "../models/Grievance.js";
import GrievanceHistory from "../models/GrievanceHistory.js";
import { analyzeGrievance } from "../services/aiService.js";

// SUBMIT GRIEVANCE
// SUBMIT GRIEVANCE
export const submitGrievance = async (req, res) => {
    try {
        const {
            district,
            category,
            subject,
            description
        } = req.body;

        if (
            !district ||
            !category ||
            !subject?.trim() ||
            !description?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required grievance details."
            });
        }

        let aiAnalysis;

        try {
            aiAnalysis = await analyzeGrievance({
                subject,
                description,
                district
            });
        } catch (aiError) {
            console.error("AI analysis unavailable:", aiError.message);

            aiAnalysis = {
                suggestedDepartment: "Pending manual review",
                suggestedCategory: "",
                priority: "Medium",
                summary: "AI analysis unavailable. Manual review required.",
                possibleDuplicate: false
            };
        }

        const attachments = (req.files || []).map((file) => ({
            fileName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileType: file.mimetype
        }));

        const grievance = new Grievance({
            citizen: req.user.id,
            district,
            category,
            subject: subject.trim(),
            description: description.trim(),
            department: null,
            assignedOfficer: null,
            priority: aiAnalysis.priority || "Medium",
            attachments,
            aiAnalysis: {
                suggestedDepartment: aiAnalysis.suggestedDepartment,
                suggestedCategory: aiAnalysis.suggestedCategory,
                priority: aiAnalysis.priority,
                summary: aiAnalysis.summary,
                possibleDuplicate: aiAnalysis.possibleDuplicate
            }
        });

        await grievance.save();

        await GrievanceHistory.create({
            grievance: grievance._id,
            previousStatus: "",
            newStatus: "Submitted",
            remarks: "Grievance submitted by citizen",
            updatedBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Grievance submitted successfully",
            grievance: {
                id: grievance._id,
                referenceNumber: grievance.referenceNumber,
                subject: grievance.subject,
                category: grievance.category,
                priority: grievance.priority,
                status: grievance.status,
                attachments: grievance.attachments,
                aiAnalysis: grievance.aiAnalysis
            }
        });

    } catch (error) {
        console.error("Submit grievance error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Unable to submit grievance."
        });
    }
};


// GET CITIZEN GRIEVANCES
export const getMyGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find({
            citizen: req.user.id
        })
            .populate("department", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: grievances.length,
            grievances
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// TRACK GRIEVANCE
export const trackGrievance = async (req, res) => {
    try {
        const { referenceNumber } = req.params;

        const grievance = await Grievance.findOne({
            referenceNumber
        })
            .populate("department", "name")
            .select("-citizen");

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found"
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const submitGrievanceFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        const grievance = await Grievance.findOne({
            _id: req.params.id,
            citizen: req.user.id
        });

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found."
            });
        }

        if (grievance.status !== "Resolved") {
            return res.status(400).json({
                success: false,
                message: "Feedback can only be submitted for resolved grievances."
            });
        }

        if (grievance.feedback?.submittedAt) {
            return res.status(400).json({
                success: false,
                message: "Feedback has already been submitted."
            });
        }

        grievance.feedback = {
            rating,
            comment: comment?.trim() || "",
            submittedAt: new Date()
        };

        await grievance.save();

        return res.status(200).json({
            success: true,
            message: "Feedback submitted successfully.",
            feedback: grievance.feedback
        });

    } catch (error) {
        console.error("Feedback error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit feedback."
        });
    }
};