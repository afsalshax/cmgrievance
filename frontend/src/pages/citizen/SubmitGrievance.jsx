import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Input,
    Textarea,
    Select,
    Option,
    FormControl,
    FormLabel,
    Button,
    Alert,
    Divider,
    Chip,
} from "@mui/joy";

import {
    ArrowLeft,
    Send,
    FileText,
    CheckCircle,
    Upload, X,
    AlertCircle,
} from "lucide-react";

import { submitGrievance } from "../../services/citizenService";

const districts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
];

const categories = [
    "Road",
    "Water Supply",
    "Electricity",
    "Health",
    "Education",
    "Police",
    "Transportation",
    "Sanitation",
    "Public Services",
    "Other",
];

function SubmitGrievance() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        district: "",
        category: "",
        subject: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [successData, setSuccessData] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((previous) => ({
            ...previous,
            [name]: value || "",
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !formData.district ||
            !formData.category ||
            !formData.subject.trim() ||
            !formData.description.trim()
        ) {
            setError("Please complete all required fields.");
            return;
        }

        try {
            setLoading(true);

            const submissionData = new FormData();

            submissionData.append("district", formData.district);
            submissionData.append("category", formData.category);
            submissionData.append("subject", formData.subject);
            submissionData.append("description", formData.description);

            attachments.forEach((file) => {
                submissionData.append("attachments", file);
            });

            const response = await submitGrievance(submissionData);

            if (!response.success) {
                throw new Error(
                    response.message || "Unable to submit grievance."
                );
            }

            setSuccessData(response.grievance);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        if (attachments.length + selectedFiles.length > 3) {
            setError("You can upload a maximum of 3 files.");
            event.target.value = "";
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        for (const file of selectedFiles) {
            if (!allowedTypes.includes(file.type)) {
                setError("Only JPG, PNG, WEBP, PDF and Word documents are allowed.");
                event.target.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(`${file.name} exceeds the 5 MB file size limit.`);
                event.target.value = "";
                return;
            }
        }

        setError("");

        setAttachments((previous) => [
            ...previous,
            ...selectedFiles
        ]);

        event.target.value = "";
    };
    const removeAttachment = (index) => {
        setAttachments((previous) =>
            previous.filter((_, i) => i !== index)
        );
    };


    if (successData) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#f8fafc",
                    p: 2,
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        width: "100%",
                        maxWidth: 550,
                        borderRadius: "lg",
                        textAlign: "center",
                        p: 3,
                    }}
                >
                    <CardContent sx={{ alignItems: "center", gap: 2 }}>
                        <CheckCircle size={60} color="#16a34a" />

                        <Typography level="h2">
                            Grievance Submitted!
                        </Typography>

                        <Typography level="body-md" color="neutral">
                            Your grievance has been successfully submitted.
                            Save your reference number to track its progress.
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                bgcolor: "#f0fdf4",
                                border: "1px dashed #16a34a",
                                borderRadius: "md",
                                p: 2,
                                mt: 1,
                            }}
                        >
                            <Typography level="body-sm" color="success">
                                Your Reference Number
                            </Typography>

                            <Typography level="h3" color="success">
                                {successData.referenceNumber}
                            </Typography>
                        </Box>

                        {successData.aiAnalysis && (
                            <Box sx={{ width: "100%", textAlign: "left", mt: 1 }}>
                                <Divider sx={{ mb: 2 }} />

                                <Typography level="title-md">
                                    AI Preliminary Analysis
                                </Typography>

                                <Typography level="body-sm" sx={{ mt: 1 }}>
                                    Suggested Department:{" "}
                                    {successData.aiAnalysis.suggestedDepartment ||
                                        "Pending manual review"}
                                </Typography>

                                <Typography level="body-sm">
                                    Suggested Priority:{" "}
                                    {successData.aiAnalysis.priority || "Medium"}
                                </Typography>

                                <Typography level="body-sm" sx={{ mt: 1 }}>
                                    {successData.aiAnalysis.summary}
                                </Typography>

                                <Alert color="warning" sx={{ mt: 2 }}>
                                    AI suggestions are preliminary. The department
                                    and priority will be reviewed by the CMO.
                                </Alert>
                            </Box>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <Button
                                onClick={() => navigate("/citizen/dashboard")}
                            >
                                Go to Dashboard
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => navigate("/citizen/track")}
                            >
                                Track Grievance
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f8fafc",
                p: { xs: 2, md: 4 },
            }}
        >
            <Box sx={{ maxWidth: 900, mx: "auto" }}>
                <Button
                    variant="plain"
                    color="neutral"
                    startDecorator={<ArrowLeft size={18} />}
                    onClick={() => navigate("/citizen/dashboard")}
                    sx={{ mb: 2 }}
                >
                    Back to Dashboard
                </Button>

                <Box sx={{ mb: 3 }}>
                    <Typography level="h2" fontWeight="bold">
                        Submit a Grievance
                    </Typography>

                    <Typography level="body-md" color="neutral" sx={{ mt: 1 }}>
                        Provide the details of your issue. Your complaint will
                        be reviewed by the concerned authorities.
                    </Typography>
                </Box>

                <Card
                    variant="outlined"
                    sx={{ borderRadius: "lg", bgcolor: "white" }}
                >
                    <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 3 }}>
                            <FileText size={22} color="#155eef" />

                            <Typography level="h4">
                                Grievance Information
                            </Typography>
                        </Box>

                        {error && (
                            <Alert color="danger" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },
                                    gap: 2.5,
                                }}
                            >
                                <FormControl required>
                                    <FormLabel>District</FormLabel>

                                    <Select
                                        placeholder="Select your district"
                                        value={formData.district || null}
                                        onChange={(_, value) =>
                                            handleSelectChange("district", value)
                                        }
                                    >
                                        {districts.map((district) => (
                                            <Option key={district} value={district}>
                                                {district}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Grievance Category</FormLabel>

                                    <Select
                                        placeholder="Select category"
                                        value={formData.category || null}
                                        onChange={(_, value) =>
                                            handleSelectChange("category", value)
                                        }
                                    >
                                        {categories.map((category) => (
                                            <Option key={category} value={category}>
                                                {category}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ gridColumn: "1 / -1" }} required>
                                    <FormLabel>Grievance Subject</FormLabel>

                                    <Input
                                        name="subject"
                                        placeholder="Briefly describe your issue"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        slotProps={{ input: { maxLength: 150 } }}
                                    />

                                    <Typography level="body-xs" color="neutral">
                                        {formData.subject.length}/150 characters
                                    </Typography>
                                </FormControl>

                                <FormControl sx={{ gridColumn: "1 / -1" }} required>
                                    <FormLabel>Detailed Description</FormLabel>

                                    <Textarea
                                        name="description"
                                        minRows={6}
                                        placeholder="Explain your issue, including the location, date and other relevant details..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        slotProps={{ textarea: { maxLength: 3000 } }}
                                    />

                                    <Typography level="body-xs" color="neutral">
                                        {formData.description.length}/3000 characters
                                    </Typography>
                                </FormControl>
                            </Box>

                            <FormControl sx={{ gridColumn: "1 / -1" }}>
                                <FormLabel>Supporting Documents / Images (Optional)</FormLabel>

                                <Button
                                    component="label"
                                    variant="outlined"
                                    color="neutral"
                                    startDecorator={<Upload size={18} />}
                                    sx={{
                                        alignSelf: "flex-start",
                                        borderStyle: "dashed"
                                    }}
                                >
                                    Choose Files

                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                </Button>

                                <Typography level="body-xs" color="neutral">
                                    Maximum 3 files, 5 MB each. JPG, PNG, WEBP, PDF and Word documents.
                                </Typography>

                                {attachments.map((file, index) => (
                                    <Box
                                        key={`${file.name}-${index}`}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            p: 1.5,
                                            mt: 1,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: "md"
                                        }}
                                    >
                                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            <FileText size={18} />

                                            <Box>
                                                <Typography level="body-sm">
                                                    {file.name}
                                                </Typography>

                                                <Typography level="body-xs" color="neutral">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Button
                                            size="sm"
                                            variant="plain"
                                            color="danger"
                                            onClick={() => removeAttachment(index)}
                                        >
                                            <X size={17} />
                                        </Button>
                                    </Box>
                                ))}
                            </FormControl>

                            <Alert
                                color="primary"
                                startDecorator={<AlertCircle size={18} />}
                                sx={{ mt: 3 }}
                            >
                                Please provide accurate information. Your grievance
                                will receive a unique reference number after submission.
                            </Alert>

                            <Divider sx={{ my: 3 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                    onClick={() => navigate("/citizen/dashboard")}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    loading={loading}
                                    startDecorator={<Send size={17} />}
                                    sx={{ bgcolor: "#155eef" }}
                                >
                                    Submit Grievance
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default SubmitGrievance;