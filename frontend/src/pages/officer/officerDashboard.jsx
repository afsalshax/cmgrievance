import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    Table,
    CircularProgress,
    Alert,
    Stack
} from "@mui/joy";

import { Eye, RefreshCw, ClipboardList } from "lucide-react";
import api from "../../services/api";

const OfficerDashboard = () => {
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    const loadGrievances = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (status !== "All") {
                params.status = status;
            }

            const response = await api.get("/officer/grievances", {
                params,
            });

            setGrievances(response.data.grievances || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load assigned grievances."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGrievances();
    }, [status]);

    const getStatusColor = (value) => {
        switch (value) {
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

    const total = grievances.length;

    const inProgress = grievances.filter(
        (item) => item.status === "In Progress"
    ).length;

    const resolved = grievances.filter(
        (item) => item.status === "Resolved"
    ).length;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box>
                    <Typography level="h3">
                        Officer Dashboard
                    </Typography>

                    <Typography level="body-sm" color="neutral">
                        Manage your assigned public grievances.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        variant="outlined"
                        startDecorator={<RefreshCw size={16} />}
                        onClick={loadGrievances}
                    >
                        Refresh
                    </Button>

                    <Button color="danger" variant="outlined" onClick={handleLogout}>
                        Logout
                    </Button>
                </Stack>
            </Box>

            {error && (
                <Alert color="danger">
                    {error}
                </Alert>
            )}

            {/* Statistics */}
            <Grid container spacing={2}>

                <Grid xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="body-sm" color="neutral">
                                Assigned Grievances
                            </Typography>

                            <Typography level="h2">
                                {total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="body-sm" color="neutral">
                                In Progress
                            </Typography>

                            <Typography level="h2" color="primary">
                                {inProgress}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="body-sm" color="neutral">
                                Resolved
                            </Typography>

                            <Typography level="h2" color="success">
                                {resolved}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* Grievance List */}
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
                            Assigned Grievances
                        </Typography>

                        <Select
                            value={status}
                            onChange={(_, value) => setStatus(value || "All")}
                            sx={{ minWidth: 180 }}
                        >
                            <Option value="All">All Statuses</Option>
                            <Option value="Submitted">Submitted</Option>
                            <Option value="Under Review">Under Review</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Resolved">Resolved</Option>
                            <Option value="Reopened">Reopened</Option>
                        </Select>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : grievances.length === 0 ? (
                        <Alert color="info">
                            No grievances assigned to you yet.
                        </Alert>
                    ) : (
                        <Table
                            hoverRow
                            borderAxis="both"
                            sx={{ minWidth: 700 }}
                        >
                            <thead>
                                <tr>
                                    <th>Reference</th>
                                    <th>Subject</th>
                                    <th>District</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {grievances.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <Typography level="body-sm" fontWeight="lg">
                                                {item.referenceNumber}
                                            </Typography>
                                        </td>

                                        <td>{item.subject}</td>

                                        <td>{item.district}</td>

                                        <td>{item.priority}</td>

                                        <td>
                                            <Chip
                                                size="sm"
                                                color={getStatusColor(item.status)}
                                            >
                                                {item.status}
                                            </Chip>
                                        </td>

                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outlined"
                                                startDecorator={<Eye size={15} />}
                                                onClick={() =>
                                                    navigate(`/officer/grievances/${item._id}`)
                                                }
                                            >
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                </CardContent>
            </Card>

        </Box>
    );
};

export default OfficerDashboard;