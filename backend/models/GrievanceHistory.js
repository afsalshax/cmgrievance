
import mongoose from "mongoose";

const grievanceHistorySchema = new mongoose.Schema(
    {
        grievance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grievance",
            required: true
        },

        previousStatus: {
            type: String,
            default: null
        },

        newStatus: {
            type: String,
            required: true
        },

        remarks: {
            type: String,
            default: ""
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

const GrievanceHistory = mongoose.model(
    "GrievanceHistory",
    grievanceHistorySchema
);

export default GrievanceHistory;