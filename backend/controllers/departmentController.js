import Department from "../models/Department.js";

export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({
            isActive: true
        }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            departments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};