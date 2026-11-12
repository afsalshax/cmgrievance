import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Department from "./models/Department.js";
// const Department = require("./models/Department");

const createOfficer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const {
            OFFICER_NAME,
            OFFICER_EMAIL,
            OFFICER_PASSWORD,
            OFFICER_MOBILE,
            OFFICER_DEPARTMENT
        } = process.env;

        if (
            !OFFICER_NAME ||
            !OFFICER_EMAIL ||
            !OFFICER_MOBILE ||
            !OFFICER_PASSWORD ||
            !OFFICER_DEPARTMENT
        ) {
            throw new Error("Please provide all officer environment variables.");
        }

        // Find the department
        const department = await Department.findOne({
            name: OFFICER_DEPARTMENT
        });

        if (!department) {
            throw new Error(
                `Department "${OFFICER_DEPARTMENT}" not found. Check the department name.`
            );
        }

        // Check whether the email already exists
        const existingUser = await User.findOne({
            email: OFFICER_EMAIL
        });

        if (existingUser) {
            throw new Error("An account with this email already exists.");
        }

        const hashedPassword = await bcrypt.hash(OFFICER_PASSWORD, 10);

        const officer = await User.create({
            name: OFFICER_NAME,
            email: OFFICER_EMAIL,
            password: hashedPassword,
            role: "officer",
            mobile: OFFICER_MOBILE,
            department: department._id,
            isActive: true
        });

        console.log("Officer account created successfully!");
        console.log("Officer:", officer.name);
        console.log("Department:", department.name);
        console.log("Email:", officer.email);

    } catch (error) {
        console.error("Officer creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

createOfficer();