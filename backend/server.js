import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import path from "path";
import contactRoutes from "./routes/contactRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/officer", officerRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;


// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

// Test Route
app.get("/", (req, res) => {
    res.send("CM Kerala Grievance Portal API is running!");
});

// Start Server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();