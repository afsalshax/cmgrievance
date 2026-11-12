import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Sheet,
    Table,
    CircularProgress,
    Alert,
    Divider,
    Stack
} from "@mui/joy";

import {
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Plus,
    ArrowRight,
    Search,
} from "lucide-react";

import { getMyGrievances } from "../../services/citizenService";

function CitizenDashboard() {
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");



    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const loadGrievances = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyGrievances();

            setGrievances(
                response.grievances || response.data || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load your grievances."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGrievances();
    }, []);

    const stats = [
        {
            title: "Total Grievances",
            value: grievances.length,
            icon: <FileText size={22} />,
            color: "#2563eb",
        },
        {
            title: "Pending",
            value: grievances.filter((g) =>
                ["Submitted", "Under Review"].includes(g.status)
            ).length,
            icon: <Clock size={22} />,
            color: "#d97706",
        },
        {
            title: "In Progress",
            value: grievances.filter(
                (g) => g.status === "In Progress"
            ).length,
            icon: <AlertCircle size={22} />,
            color: "#7c3aed",
        },
        {
            title: "Resolved",
            value: grievances.filter(
                (g) => g.status === "Resolved"
            ).length,
            icon: <CheckCircle size={22} />,
            color: "#16a34a",
        },
    ];

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
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
            {/* Welcome section */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography level="h2" fontWeight="bold">
                        Welcome, {user.name || "Citizen"}!
                    </Typography>

                    <Typography level="body-md" sx={{ color: "neutral.500", mt: 1 }}>
                        Manage and track your submitted grievances.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        startDecorator={<Plus size={18} />}
                        onClick={() => navigate("/citizen/submit")}
                        sx={{ bgcolor: "#155eef" }}
                    >
                        Submit Grievance
                    </Button>

                    <Button
                        color="danger"
                        variant="outlined"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Stack>
            </Box>

            {error && (
                <Alert color="danger" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Statistics */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid xs={12} sm={6} md={3} key={stat.title}>
                        <Card variant="outlined" sx={{ borderRadius: "lg" }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography level="body-sm" color="neutral">
                                        {stat.title}
                                    </Typography>

                                    <Box sx={{ color: stat.color }}>
                                        {stat.icon}
                                    </Box>
                                </Box>

                                <Typography level="h2" sx={{ mt: 1 }}>
                                    {loading ? "—" : stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick actions */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid xs={12} md={6}>
                    <Card
                        variant="soft"
                        color="primary"
                        sx={{ borderRadius: "lg" }}
                    >
                        <CardContent>
                            <Typography level="h4">
                                Submit a Grievance
                            </Typography>

                            <Typography level="body-sm" sx={{ mt: 1 }}>
                                Report a public issue and receive a unique reference number.
                            </Typography>

                            <Button
                                variant="solid"
                                color="primary"
                                endDecorator={<ArrowRight size={17} />}
                                sx={{ mt: 2, alignSelf: "flex-start" }}
                                onClick={() => navigate("/citizen/submit")}
                            >
                                Submit Now
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6}>
                    <Card
                        variant="soft"
                        color="success"
                        sx={{ borderRadius: "lg" }}
                    >
                        <CardContent>
                            <Typography level="h4">
                                Track Your Grievance
                            </Typography>

                            <Typography level="body-sm" sx={{ mt: 1 }}>
                                Check the latest status and progress of your complaint.
                            </Typography>

                            <Button
                                variant="solid"
                                color="success"
                                endDecorator={<Search size={17} />}
                                sx={{ mt: 2, alignSelf: "flex-start" }}
                                onClick={() => navigate("/citizen/track")}
                            >
                                Track Now
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent grievances */}
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "lg",
                    bgcolor: "white",
                    overflow: "auto",
                }}
            >
                <Box
                    sx={{
                        p: 2.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography level="h4">
                            My Grievances
                        </Typography>

                        <Typography level="body-sm" color="neutral">
                            View your recently submitted complaints.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={loadGrievances}
                    >
                        Refresh
                    </Button>
                </Box>

                <Divider />

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : grievances.length === 0 ? (
                    <Box sx={{ textAlign: "center", p: 5 }}>
                        <FileText size={40} color="#94a3b8" />

                        <Typography level="h4" sx={{ mt: 2 }}>
                            No grievances found
                        </Typography>

                        <Typography level="body-sm" color="neutral" sx={{ mt: 1 }}>
                            You haven't submitted any grievances yet.
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            onClick={() => navigate("/citizen/submit")}
                        >
                            Submit Your First Grievance
                        </Button>
                    </Box>
                ) : (
                    <Table hoverRow>
                        <thead>
                            <tr>
                                <th>Reference Number</th>
                                <th>Subject</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Date</th>
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

                                    <td>{item.category}</td>

                                    <td>
                                        <Chip
                                            size="sm"
                                            color={
                                                item.priority === "High"
                                                    ? "danger"
                                                    : item.priority === "Medium"
                                                        ? "warning"
                                                        : "success"
                                            }
                                        >
                                            {item.priority}
                                        </Chip>
                                    </td>

                                    <td>
                                        <Chip
                                            size="sm"
                                            color={getStatusColor(item.status)}
                                        >
                                            {item.status}
                                        </Chip>
                                    </td>

                                    <td>
                                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Sheet>
        </Box>
    );
}

export default CitizenDashboard;