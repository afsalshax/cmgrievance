
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
    Select,
    Option,
    Textarea,
    CircularProgress,
    Alert,
    Divider,
    Sheet,
    FormControl,
    FormLabel,
    Stack
} from "@mui/joy";

import { ArrowLeft, RefreshCw, Brain, Download, FileText, Image as ImageIcon } from "lucide-react";

import {
    getGrievanceDetails,
    analyzeGrievance,
    updateGrievanceStatus,
    addGrievanceRemark,
    getDepartments,
    getDepartmentOfficers,
    assignGrievance,
} from "../../services/adminService";

const GrievanceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [grievance, setGrievance] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [remark, setRemark] = useState("");
    const [saving, setSaving] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedOfficer, setSelectedOfficer] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);
    const [reviewRemark, setReviewRemark] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const loadDepartments = async () => {
        try {
            const response = await getDepartments();
            setDepartments(response.departments || []);
        } catch (error) {
            console.error("Failed to load departments:", error);
        }
    };

    const loadDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getGrievanceDetails(id);
            const currentGrievance = response.grievance;

            setGrievance(currentGrievance);
            setHistory(response.history || []);
            setStatus(currentGrievance?.status || "");

            // Initialize department and officer selections
            const departmentId =
                currentGrievance?.department?._id || "";

            const officerId =
                currentGrievance?.assignedOfficer?._id || "";

            setSelectedDepartment(departmentId);
            setSelectedOfficer(officerId);

            // Load officers belonging to the assigned department
            if (departmentId) {
                const officerResponse =
                    await getDepartmentOfficers(departmentId);

                setOfficers(officerResponse.officers || []);
            } else {
                setOfficers([]);
            }

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
        loadDepartments();
    }, [id]);


    const handleReportReview = async (decision) => {
        if (!grievance.actionTakenReport) {
            setError("No action-taken report has been submitted.");
            return;
        }

        try {
            setReviewLoading(true);
            setError("");

            const reviewMessage =
                decision === "Resolved"
                    ? "CMO reviewed and approved the action-taken report. Grievance resolved."
                    : "CMO reviewed the action-taken report. Further action is required.";

            // Update grievance status
            await updateGrievanceStatus(id, {
                status: decision,
            });

            // Record CMO review remarks
            await addGrievanceRemark(id, {
                remarks: reviewRemark.trim() || reviewMessage,
            });

            setReviewRemark("");

            await loadDetails();

            alert(
                decision === "Resolved"
                    ? "Report approved. Grievance resolved."
                    : "Further action requested."
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to complete report review."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    const handleDepartmentChange = async (departmentId) => {
        setSelectedDepartment(departmentId);
        setSelectedOfficer("");
        setOfficers([]);

        if (!departmentId) return;

        try {
            const response = await getDepartmentOfficers(departmentId);
            setOfficers(response.officers || []);
        } catch (error) {
            console.error("Failed to load officers:", error);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            setSaving(true);
            setError("");

            await updateGrievanceStatus(id, { status });

            await loadDetails();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to update status."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAddRemark = async () => {
        if (!remark.trim()) return;

        try {
            setSaving(true);
            setError("");

            await addGrievanceRemark(id, { remarks: remark });

            setRemark("");
            await loadDetails();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to add remark."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAIAnalysis = async () => {
        try {
            setAnalyzing(true);
            setError("");

            await analyzeGrievance(id);
            await loadDetails();
        } catch (err) {
            setError(
                err.response?.data?.message || "AI analysis is currently unavailable."
            );
        } finally {
            setAnalyzing(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedDepartment) {
            setError("Please select a department");
            return;
        }

        try {
            setAssignLoading(true);
            setError("");

            await assignGrievance(id, {
                departmentId: selectedDepartment,
                officerId: selectedOfficer || null,
            });

            await loadDetails();

            alert("Grievance assigned successfully");

        } catch (error) {
            console.error("Assignment failed:", error);

            setError(
                error.response?.data?.message ||
                "Failed to assign grievance"
            );
        } finally {
            setAssignLoading(false);
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

    const ai = grievance.aiAnalysis || {};

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => navigate("/admin/grievances")}
                    startDecorator={<ArrowLeft size={16} />}
                >
                    Back
                </Button>

                <Box>
                    <Typography level="h3">Grievance Details</Typography>
                    <Typography level="body-sm" color="neutral">
                        Reference: {grievance.referenceNumber}
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert color="danger" variant="soft">
                    {error}
                </Alert>
            )}

            {/* Grievance information */}
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
                            <Chip color="warning">{grievance.priority}</Chip>
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




            {/* AI Analysis */}
            <Card variant="outlined">
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography level="title-lg">
                            AI Analysis
                        </Typography>

                        <Button
                            size="sm"
                            loading={analyzing}
                            onClick={handleAIAnalysis}
                            startDecorator={<Brain size={16} />}
                        >
                            Run AI Analysis
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Suggested Department
                            </Typography>
                            <Typography fontWeight="lg">
                                {ai.suggestedDepartment || "Pending"}
                            </Typography>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Suggested Category
                            </Typography>
                            <Typography fontWeight="lg">
                                {ai.suggestedCategory || "Pending"}
                            </Typography>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Suggested Priority
                            </Typography>
                            <Chip color="warning">
                                {ai.priority || "Pending"}
                            </Chip>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Typography level="body-sm" color="neutral">
                                Possible Duplicate
                            </Typography>
                            <Chip color={ai.possibleDuplicate ? "danger" : "success"}>
                                {ai.possibleDuplicate ? "Possible Duplicate" : "No Duplicate Flag"}
                            </Chip>
                        </Grid>

                        <Grid xs={12}>
                            <Typography level="body-sm" color="neutral">
                                AI Summary
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                {ai.summary || "AI analysis not available yet."}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Alert color="warning" variant="soft" sx={{ mt: 2 }}>
                        AI recommendations are advisory only. The CMO must review and
                        make the final decision.
                    </Alert>
                </CardContent>
            </Card>

            {/* Department & Officer Assignment */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Department & Officer Assignment
                    </Typography>

                    <FormControl sx={{ mb: 2 }}>
                        <FormLabel>Select Department</FormLabel>

                        <Select
                            placeholder="Choose department"
                            value={selectedDepartment || null}
                            onChange={(_, value) =>
                                handleDepartmentChange(value || "")
                            }
                        >
                            {departments.map((department) => (
                                <Option
                                    key={department._id}
                                    value={department._id}
                                >
                                    {department.name}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ mb: 2 }}>
                        <FormLabel>Select Officer</FormLabel>

                        <Select
                            placeholder="Choose officer"
                            value={selectedOfficer || null}
                            disabled={!selectedDepartment || officers.length === 0}
                            onChange={(_, value) =>
                                setSelectedOfficer(value || "")
                            }
                        >
                            {officers.map((officer) => (
                                <Option
                                    key={officer._id}
                                    value={officer._id}
                                >
                                    {officer.name} ({officer.email})
                                </Option>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedDepartment && officers.length === 0 && (
                        <Alert color="warning" sx={{ mb: 2 }}>
                            No active officers found for this department.
                        </Alert>
                    )}

                    <Button
                        loading={assignLoading}
                        disabled={!selectedDepartment}
                        onClick={handleAssign}
                    >
                        Assign Grievance
                    </Button>
                </CardContent>
            </Card>

            {/* CMO Action Taken Report Review */}
            <Card variant="outlined">
                <CardContent>

                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Officer Action-Taken Report
                    </Typography>

                    {grievance.actionTakenReport ? (
                        <>
                            <Alert color="success" sx={{ mb: 2 }}>
                                Action-taken report submitted by the department officer.
                            </Alert>

                            <Typography level="body-sm" color="neutral">
                                Submitted Date
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                {grievance.reportSubmittedAt
                                    ? new Date(
                                        grievance.reportSubmittedAt
                                    ).toLocaleString()
                                    : "Date unavailable"}
                            </Typography>

                            <Typography level="body-sm" color="neutral">
                                Investigation Remarks
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                {grievance.investigationRemarks || "No investigation remarks."}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography level="body-sm" color="neutral">
                                Action Taken Report
                            </Typography>

                            <Sheet
                                variant="soft"
                                sx={{ p: 2, borderRadius: "md", mt: 1, mb: 2 }}
                            >
                                <Typography>
                                    {grievance.actionTakenReport}
                                </Typography>
                            </Sheet>

                            <Typography level="title-md" sx={{ mb: 1 }}>
                                CMO Review Remarks
                            </Typography>

                            <Textarea
                                minRows={3}
                                placeholder="Enter your review remarks..."
                                value={reviewRemark}
                                onChange={(e) => setReviewRemark(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            {grievance.status !== "Resolved" && (
                                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

                                    <Button
                                        color="success"
                                        loading={reviewLoading}
                                        onClick={() => handleReportReview("Resolved")}
                                    >
                                        Approve & Resolve
                                    </Button>

                                    <Button
                                        color="danger"
                                        variant="outlined"
                                        loading={reviewLoading}
                                        onClick={() => handleReportReview("Reopened")}
                                    >
                                        Request Further Action
                                    </Button>

                                </Box>
                            )}

                            {grievance.status === "Resolved" && (
                                <Chip color="success">
                                    Grievance Resolved
                                </Chip>
                            )}
                        </>
                    ) : (
                        <Alert color="warning">
                            The department officer has not submitted an action-taken report yet.
                        </Alert>
                    )}

                </CardContent>
            </Card>

            {/* Status update */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Update Grievance Status
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Select
                            value={status}
                            onChange={(_, value) => setStatus(value)}
                            sx={{ minWidth: 200 }}
                        >
                            <Option value="Submitted">Submitted</Option>
                            <Option value="Under Review">Under Review</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Resolved">Resolved</Option>
                            <Option value="Reopened">Reopened</Option>
                        </Select>

                        <Button
                            loading={saving}
                            disabled={status === grievance.status}
                            onClick={handleStatusUpdate}
                        >
                            Update Status
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Internal remarks */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Internal Remarks
                    </Typography>

                    <Textarea
                        minRows={3}
                        placeholder="Enter an internal remark..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />

                    <Button
                        sx={{ mt: 2 }}
                        loading={saving}
                        disabled={!remark.trim()}
                        onClick={handleAddRemark}
                    >
                        Add Remark
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
                        <Sheet>
                            {history.map((item) => (
                                <Box
                                    key={item._id}
                                    sx={{
                                        py: 2,
                                        borderBottom: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography fontWeight="lg">
                                        {item.previousStatus || "Created"} → {item.newStatus}
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
                            ))}
                        </Sheet>
                    )}
                </CardContent>
            </Card>

        </Box>
    );
};

export default GrievanceDetails;