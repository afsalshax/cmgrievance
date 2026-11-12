import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Input,
    Button,
    Alert,
    Chip,
    Divider,
    Textarea,
    Select,
    Option,
    CircularProgress,
    Sheet,
    Stack
} from "@mui/joy";
import {
    Search,
    FileText,
    Clock,
    CheckCircle,
    Building2,
    Send,
    Download, Image as ImageIcon
} from "lucide-react";

import {
    trackGrievance,
    submitGrievanceFeedback
} from "../../services/citizenService";

function TrackGrievance() {
    const [referenceNumber, setReferenceNumber] = useState("");
    const [grievance, setGrievance] = useState(null);
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!referenceNumber.trim()) {
            setError("Please enter a reference number.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            setGrievance(null);
            setHistory([]);

            const response = await trackGrievance(
                referenceNumber.trim()
            );

            setGrievance(response.grievance);
            setHistory(response.history || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to find this grievance."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFeedback = async (event) => {
        event.preventDefault();

        try {
            setFeedbackLoading(true);
            setError("");
            setSuccess("");

            const response = await submitGrievanceFeedback(
                grievance._id,
                {
                    rating,
                    comment
                }
            );

            setSuccess(response.message);

            setGrievance((previous) => ({
                ...previous,
                feedback: response.feedback
            }));

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to submit feedback."
            );
        } finally {
            setFeedbackLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Resolved":
                return "success";
            case "In Progress":
                return "primary";
            case "Reopened":
                return "danger";
            case "Under Review":
                return "warning";
            default:
                return "neutral";
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f8fafc",
                p: { xs: 2, md: 4 }
            }}
        >
            <Box sx={{ maxWidth: 950, mx: "auto" }}>

                <Typography level="h2" fontWeight="bold">
                    Track Your Grievance
                </Typography>

                <Typography
                    level="body-md"
                    color="neutral"
                    sx={{ mt: 1, mb: 3 }}
                >
                    Enter your grievance reference number to
                    view its current status and progress.
                </Typography>

                {/* Search */}
                <Card variant="outlined" sx={{ borderRadius: "lg", mb: 3 }}>
                    <CardContent>
                        <form onSubmit={handleSearch}>
                            <Typography level="title-md" sx={{ mb: 1 }}>
                                Reference Number
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexDirection: { xs: "column", sm: "row" }
                                }}
                            >
                                <Input
                                    fullWidth
                                    placeholder="Example: CMK-2026-6FCB258B"
                                    value={referenceNumber}
                                    onChange={(e) =>
                                        setReferenceNumber(e.target.value)
                                    }
                                />

                                <Button
                                    type="submit"
                                    loading={loading}
                                    startDecorator={<Search size={18} />}
                                >
                                    Track
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>

                {error && (
                    <Alert color="danger" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert color="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {grievance && !loading && (
                    <>
                        {/* Grievance details */}
                        <Card variant="outlined" sx={{ borderRadius: "lg", mb: 3 }}>
                            <CardContent sx={{ gap: 2 }}>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: 2
                                    }}
                                >
                                    <Box>
                                        <Typography level="body-sm" color="neutral">
                                            Reference Number
                                        </Typography>

                                        <Typography level="h4">
                                            {grievance.referenceNumber}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        color={getStatusColor(grievance.status)}
                                        size="lg"
                                    >
                                        {grievance.status}
                                    </Chip>
                                </Box>

                                <Divider />

                                <Typography level="h3">
                                    {grievance.subject}
                                </Typography>

                                <Typography level="body-md" color="neutral">
                                    {grievance.description}
                                </Typography>

                                <Divider />

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr"
                                        },
                                        gap: 2
                                    }}
                                >
                                    <Box>
                                        <Typography level="body-xs" color="neutral">
                                            District
                                        </Typography>
                                        <Typography level="title-md">
                                            {grievance.district}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography level="body-xs" color="neutral">
                                            Category
                                        </Typography>
                                        <Typography level="title-md">
                                            {grievance.category}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography level="body-xs" color="neutral">
                                            Priority
                                        </Typography>
                                        <Typography level="title-md">
                                            {grievance.priority}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography level="body-xs" color="neutral">
                                            Department
                                        </Typography>
                                        <Typography level="title-md">
                                            {grievance.department?.name || "Not assigned yet"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {grievance.resolutionDetails && (
                                    <>
                                        <Divider />
                                        <Alert color="success">
                                            <Box>
                                                <Typography level="title-md">
                                                    Resolution Details
                                                </Typography>
                                                {grievance.resolutionDetails}
                                            </Box>
                                        </Alert>
                                    </>
                                )}

                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: "lg", mb: 2 }}>
                            <CardContent>
                                <Typography level="title-lg" sx={{ mb: 2 }}>
                                    Submitted Attachments
                                </Typography>

                                {grievance.attachments?.length > 0 ? (
                                    <Stack spacing={2}>
                                        {grievance.attachments.map((file, index) => {
                                            const fileUrl = `http://localhost:5000${file.fileUrl}`;
                                            const isImage = file.fileType?.startsWith("image/");

                                            return (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        gap: 2,
                                                        p: 2,
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        borderRadius: "md"
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {isImage ? <ImageIcon /> : <FileText />}

                                                        <Typography level="body-md">
                                                            {file.fileName}
                                                        </Typography>
                                                    </Stack>

                                                    <Button
                                                        component="a"
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        variant="outlined"
                                                        size="sm"
                                                        startDecorator={<Download size={16} />}
                                                    >
                                                        View
                                                    </Button>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Typography level="body-sm" color="neutral">
                                        No attachments submitted.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status history */}
                        <Card variant="outlined" sx={{ borderRadius: "lg", mb: 3 }}>
                            <CardContent>
                                <Typography level="h3" sx={{ mb: 3 }}>
                                    <Clock
                                        size={20}
                                        style={{
                                            display: "inline",
                                            marginRight: 8
                                        }}
                                    />
                                    Status History
                                </Typography>

                                {history.length === 0 ? (
                                    <Typography color="neutral">
                                        No status history available.
                                    </Typography>
                                ) : (
                                    <Box>
                                        {history.map((item, index) => (
                                            <Box
                                                key={item._id || index}
                                                sx={{
                                                    display: "flex",
                                                    gap: 2,
                                                    pb: 3
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        color: "success.500",
                                                        pt: 0.5
                                                    }}
                                                >
                                                    <CheckCircle size={20} />
                                                </Box>

                                                <Box sx={{ flex: 1 }}>
                                                    <Typography level="title-md">
                                                        {item.newStatus}
                                                    </Typography>

                                                    {item.previousStatus && (
                                                        <Typography
                                                            level="body-sm"
                                                            color="neutral"
                                                        >
                                                            Previous status: {item.previousStatus}
                                                        </Typography>
                                                    )}

                                                    {item.updatedAt && (
                                                        <Typography
                                                            level="body-xs"
                                                            color="neutral"
                                                        >
                                                            {new Date(
                                                                item.updatedAt
                                                            ).toLocaleString("en-IN")}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Feedback */}
                        {grievance.status === "Resolved" && (
                            <Card variant="outlined" sx={{ borderRadius: "lg" }}>
                                <CardContent>
                                    <Typography level="h3">
                                        Citizen Feedback
                                    </Typography>

                                    {grievance.feedback?.submittedAt ? (
                                        <Alert color="success">
                                            <Box>
                                                <Typography level="title-md">
                                                    Feedback Submitted
                                                </Typography>

                                                Rating: {grievance.feedback.rating}/5

                                                {grievance.feedback.comment && (
                                                    <Typography level="body-sm">
                                                        {grievance.feedback.comment}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Alert>
                                    ) : (
                                        <form onSubmit={handleFeedback}>
                                            <Typography
                                                level="body-sm"
                                                sx={{ mt: 2, mb: 1 }}
                                            >
                                                How satisfied are you with the resolution?
                                            </Typography>

                                            <Select
                                                value={rating}
                                                onChange={(_, value) =>
                                                    setRating(value)
                                                }
                                            >
                                                {[5, 4, 3, 2, 1].map((value) => (
                                                    <Option key={value} value={value}>
                                                        {value} - {
                                                            value === 5
                                                                ? "Excellent"
                                                                : value === 4
                                                                    ? "Good"
                                                                    : value === 3
                                                                        ? "Average"
                                                                        : value === 2
                                                                            ? "Poor"
                                                                            : "Very Poor"
                                                        }
                                                    </Option>
                                                ))}
                                            </Select>

                                            <Typography
                                                level="body-sm"
                                                sx={{ mt: 2, mb: 1 }}
                                            >
                                                Comments
                                            </Typography>

                                            <Textarea
                                                minRows={3}
                                                placeholder="Share your feedback..."
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                            />

                                            <Button
                                                type="submit"
                                                loading={feedbackLoading}
                                                startDecorator={<Send size={17} />}
                                                sx={{ mt: 2 }}
                                            >
                                                Submit Feedback
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}

export default TrackGrievance;