
import mongoose from "mongoose";
import crypto from "crypto";

const grievanceSchema = new mongoose.Schema(
    {
        referenceNumber: {
            type: String,
            unique: true,
            required: true
        },

        citizen: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        district: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null
        },

        assignedOfficer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "In Progress",
                "Resolved",
                "Reopened"
            ],
            default: "Submitted"
        },

        aiAnalysis: {
            suggestedDepartment: {
                type: String,
                default: ""
            },

            suggestedCategory: {
                type: String,
                default: ""
            },

            priority: {
                type: String,
                enum: ["Low", "Medium", "High"],
                default: "Medium"
            },

            summary: {
                type: String,
                default: ""
            },

            possibleDuplicate: {
                type: Boolean,
                default: false
            }
        },

        attachments: [
            {
                fileName: String,
                fileUrl: String,
                fileType: String
            }
        ],

        resolutionDetails: {
            type: String,
            default: ""
        },
        actionTakenReport: {
            type: String,
            default: ""
        },

        investigationRemarks: {
            type: String,
            default: ""
        },

        reportSubmittedAt: {
            type: Date,
            default: null
        },
        feedback: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
                default: null
            },
            comment: {
                type: String,
                default: ""
            },
            submittedAt: {
                type: Date,
                default: null
            }
        },
    },

    {
        timestamps: true
    }
);

// Generate unique reference number
grievanceSchema.pre("validate", function () {
    if (!this.referenceNumber) {
        const year = new Date().getFullYear();

        const randomId = crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase();

        this.referenceNumber = `CMK-${year}-${randomId}`;
    }
});

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;