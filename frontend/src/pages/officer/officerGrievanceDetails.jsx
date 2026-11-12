import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Textarea,
    CircularProgress,
    Alert,
    Divider,
    Stack
} from "@mui/joy";

import { ArrowLeft, RefreshCw, Send, Download, FileText, Image as ImageIcon } from "lucide-react";
import api from "../../services/api";

const OfficerGrievanceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [grievance, setGrievance] = useState(null);
    const [history, setHistory] = useState([]);

    const [investigationRemarks, setInvestigationRemarks] = useState("");
    const [actionTakenReport, setActionTakenReport] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submittingReport, setSubmittingReport] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/officer/grievances/${id}`
            );

            setGrievance(response.data.grievance);
            setHistory(response.data.history || []);

            setInvestigationRemarks(
                response.data.grievance?.investigationRemarks || ""
            );

            setActionTakenReport(
                response.data.grievance?.actionTakenReport || ""
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load grievance details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDetails();
    }, [id]);

    // Update investigation status
    const handleStartInvestigation = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await api.put(`/officer/grievances/${id}/status`, {
                status: "In Progress",
                investigationRemarks,
            });

            setSuccess("Investigation status updated successfully.");

            await loadDetails();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update investigation status."
            );
        } finally {
            setSaving(false);
        }
    };

    // Submit action taken report
    const handleSubmitReport = async () => {
        if (!actionTakenReport.trim()) {
            setError("Please enter the action-taken report.");
            return;
        }

        try {
            setSubmittingReport(true);
            setError("");
            setSuccess("");

            await api.post(
                `/officer/grievances/${id}/action-report`,
                {
                    actionTakenReport,
                }
            );

            setSuccess("Action-taken report submitted to CMO successfully.");

            await loadDetails();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to submit action-taken report."
            );
        } finally {
            setSubmittingReport(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!grievance) {
        return (
            <Alert color="danger">
                {error || "Grievance not found."}
            </Alert>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                    variant="outlined"
                    color="neutral"
                    startDecorator={<ArrowLeft size={16} />}
                    onClick={() => navigate("/officer/dashboard")}
                >
                    Back
                </Button>

                <Box>
                    <Typography level="h3">
                        Grievance Details
                    </Typography>

                    <Typography level="body-sm" color="neutral">
                        Reference: {grievance.referenceNumber}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    color="neutral"
                    sx={{ ml: "auto" }}
                    startDecorator={<RefreshCw size={16} />}
                    onClick={loadDetails}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert color="danger">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert color="success">
                    {success}
                </Alert>
            )}

            {/* Complaint Information */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Complaint Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Subject
                            </Typography>
                            <Typography fontWeight="lg">
                                {grievance.subject}
                            </Typography>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Reference Number
                            </Typography>
                            <Typography fontWeight="lg">
                                {grievance.referenceNumber}
                            </Typography>
                        </Grid>

                        <Grid xs={12} md={4}>
                            <Typography level="body-sm" color="neutral">
                                District
                            </Typography>
                            <Typography>{grievance.district}</Typography>
                        </Grid>

                        <Grid xs={12} md={4}>
                            <Typography level="body-sm" color="neutral">
                                Category
                            </Typography>
                            <Typography>{grievance.category}</Typography>
                        </Grid>

                        <Grid xs={12} md={4}>
                            <Typography level="body-sm" color="neutral">
                                Priority
                            </Typography>
                            <Chip color="warning">
                                {grievance.priority}
                            </Chip>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Citizen
                            </Typography>
                            <Typography>
                                {grievance.citizen?.name || "Citizen"}
                            </Typography>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Department
                            </Typography>
                            <Typography>
                                {grievance.department?.name || "Not assigned"}
                            </Typography>
                        </Grid>

                        <Grid xs={12}>
                            <Divider />
                            <Typography level="body-sm" color="neutral" sx={{ mt: 1 }}>
                                Description
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                {grievance.description}
                            </Typography>
                        </Grid>

                        <Grid xs={12}>
                            <Typography level="body-sm" color="neutral">
                                Current Status
                            </Typography>
                            <Chip color="primary">
                                {grievance.status}
                            </Chip>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: "lg", mb: 2 }}>
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Citizen Attachments
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

                                            <Box>
                                                <Typography level="body-md">
                                                    {file.fileName}
                                                </Typography>
                                                <Typography level="body-xs" color="neutral">
                                                    {file.fileType}
                                                </Typography>
                                            </Box>
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
                                            View / Download
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

            {/* Investigation */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Investigation Details
                    </Typography>

                    <Textarea
                        minRows={4}
                        placeholder="Enter investigation findings and remarks..."
                        value={investigationRemarks}
                        onChange={(e) =>
                            setInvestigationRemarks(e.target.value)
                        }
                    />

                    <Button
                        sx={{ mt: 2 }}
                        loading={saving}
                        disabled={
                            grievance.status === "Resolved" ||
                            !investigationRemarks.trim()
                        }
                        onClick={handleStartInvestigation}
                    >
                        Update Investigation
                    </Button>
                </CardContent>
            </Card>

            {/* Action Taken Report */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Action-Taken Report
                    </Typography>

                    {grievance.actionTakenReport && (
                        <Alert color="success" sx={{ mb: 2 }}>
                            Previous action-taken report submitted on{" "}
                            {grievance.reportSubmittedAt
                                ? new Date(
                                    grievance.reportSubmittedAt
                                ).toLocaleString()
                                : "an earlier date"}.
                        </Alert>
                    )}

                    <Textarea
                        minRows={5}
                        placeholder="Describe the actions taken to resolve this grievance..."
                        value={actionTakenReport}
                        onChange={(e) =>
                            setActionTakenReport(e.target.value)
                        }
                    />

                    <Button
                        sx={{ mt: 2 }}
                        loading={submittingReport}
                        disabled={!actionTakenReport.trim()}
                        startDecorator={<Send size={16} />}
                        onClick={handleSubmitReport}
                    >
                        Submit Report to CMO
                    </Button>
                </CardContent>
            </Card>

            {/* History */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Grievance History
                    </Typography>

                    {history.length === 0 ? (
                        <Typography color="neutral">
                            No history available.
                        </Typography>
                    ) : (
                        history.map((item) => (
                            <Box
                                key={item._id}
                                sx={{
                                    py: 2,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Typography fontWeight="lg">
                                    {item.previousStatus || "Created"} →{" "}
                                    {item.newStatus}
                                </Typography>

                                {item.remarks && (
                                    <Typography level="body-sm">
                                        {item.remarks}
                                    </Typography>
                                )}

                                <Typography level="body-xs" color="neutral">
                                    {item.updatedBy?.name || "System"} ·{" "}
                                    {new Date(item.updatedAt).toLocaleString()}
                                </Typography>
                            </Box>
                        ))
                    )}
                </CardContent>
            </Card>

        </Box>
    );
};

export default OfficerGrievanceDetails;