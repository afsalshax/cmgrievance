import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
dotenv.config();


const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const mobile = process.env.ADMIN_MOBILE

        if (!email || !password) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
        }

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name: process.env.ADMIN_NAME || "CMO Administrator",
            email,
            password: hashedPassword,
            mobile,
            role: "admin",
            isActive: true
        });

        console.log("Admin account created successfully!");
    } catch (error) {
        console.error("Admin creation failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();