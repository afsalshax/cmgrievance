import dotenv from "dotenv";
import mongoose from "mongoose";
import Department from "./models/Department.js";

dotenv.config();

const departments = [
    {
        name: "Public Works Department",
        description: "Handles roads, bridges and public infrastructure.",
        category: "Infrastructure"
    },
    {
        name: "Health Department",
        description: "Handles public healthcare and hospital-related issues.",
        category: "Healthcare"
    },
    {
        name: "Education Department",
        description: "Handles government schools and educational facilities.",
        category: "Education"
    },
    {
        name: "Police Department",
        description: "Handles public safety and law enforcement concerns.",
        category: "Public Safety"
    },
    {
        name: "Water Resources Department",
        description: "Handles water supply and irrigation-related issues.",
        category: "Water Resources"
    },
    {
        name: "Electricity Department",
        description: "Handles electricity supply and power-related issues.",
        category: "Utilities"
    },
    {
        name: "Transport Department",
        description: "Handles public transportation-related issues.",
        category: "Transport"
    },
    {
        name: "Local Self Government Department",
        description: "Handles local governance and municipal services.",
        category: "Local Governance"
    }
];

const seedDepartments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        for (const department of departments) {
            await Department.findOneAndUpdate(
                { name: department.name },
                department,
                { upsert: true, new: true }
            );
        }

        console.log("Departments seeded successfully");

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error(error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedDepartments();