import ContactEnquiry from "../models/ContactEnquiry.js";

export const submitContactEnquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address."
            });
        }

        const enquiry = await ContactEnquiry.create({
            name,
            email,
            subject,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Your enquiry has been submitted successfully.",
            enquiryId: enquiry._id
        });

    } catch (error) {
        console.error("Contact enquiry error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit your enquiry."
        });
    }
};