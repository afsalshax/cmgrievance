
import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Sheet,
    Table,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/joy";

import {
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    ArrowUpRight,
} from "lucide-react";

import {
    getDashboardStats,
    getAllGrievances,
} from "../../services/adminService";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const chartColors = [
    "#2563eb",
    "#f59e0b",
    "#8b5cf6",
    "#16a34a",
    "#dc2626",
];

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        overdue: 0,
    });

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [statsResponse, grievanceResponse] = await Promise.all([
                getDashboardStats(),
                getAllGrievances(),
            ]);

            const statsData =
                statsResponse.stats || statsResponse.data || statsResponse;

            const grievanceData =
                grievanceResponse.grievances ||
                grievanceResponse.data ||
                [];

            setStats({
                total: statsData.total ?? 0,
                pending: statsData.pending ?? 0,
                resolved: statsData.resolved ?? 0,
                overdue: statsData.overdue ?? 0,
            });

            setGrievances(
                Array.isArray(grievanceData) ? grievanceData : []
            );
        } catch (err) {
            console.error("Dashboard loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const statCards = [
        {
            title: "Total Grievances",
            value: stats.total,
            icon: FileText,
            color: "primary",
            description: "All registered complaints",
        },
        {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "warning",
            description: "Awaiting resolution",
        },
        {
            title: "Resolved",
            value: stats.resolved,
            icon: CheckCircle,
            color: "success",
            description: "Successfully resolved",
        },
        {
            title: "Overdue",
            value: stats.overdue,
            icon: AlertTriangle,
            color: "danger",
            description: "Require immediate attention",
        },
    ];

    const statusData = [
        {
            name: "Submitted",
            value: grievances.filter(
                (g) => g.status === "Submitted"
            ).length,
        },
        {
            name: "Under Review",
            value: grievances.filter(
                (g) => g.status === "Under Review"
            ).length,
        },
        {
            name: "In Progress",
            value: grievances.filter(
                (g) => g.status === "In Progress"
            ).length,
        },
        {
            name: "Resolved",
            value: grievances.filter(
                (g) => g.status === "Resolved"
            ).length,
        },
        {
            name: "Reopened",
            value: grievances.filter(
                (g) => g.status === "Reopened"
            ).length,
        },
    ].filter((item) => item.value > 0);

    const getStatusColor = (status) => {
        const colors = {
            Submitted: "primary",
            "Under Review": "warning",
            "In Progress": "neutral",
            Resolved: "success",
            Reopened: "danger",
        };

        return colors[status] || "neutral";
    };

    const getPriorityColor = (priority) => {
        const colors = {
            Low: "success",
            Medium: "warning",
            High: "danger",
        };

        return colors[priority] || "neutral";
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <CircularProgress />
                <Typography level="body-sm">
                    Loading dashboard...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>

            {/* PAGE HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography level="h2" sx={{ fontSize: 26, fontWeight: 700 }}>
                        Dashboard Overview
                    </Typography>

                    <Typography level="body-sm" color="neutral">
                        Monitor and manage public grievances across Kerala.
                    </Typography>
                </Box>

                <Button
                    startDecorator={<RefreshCw size={16} />}
                    variant="outlined"
                    color="primary"
                    onClick={loadDashboard}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert color="danger" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* STATISTICS CARDS */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                {statCards.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.title}
                            variant="outlined"
                            sx={{
                                borderRadius: "lg",
                                boxShadow: "sm",
                                bgcolor: "background.surface",
                            }}
                        >
                            <CardContent orientation="horizontal">
                                <Box sx={{ flex: 1 }}>
                                    <Typography level="body-sm" color="neutral">
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        level="h2"
                                        sx={{ fontSize: 30, fontWeight: 700, mt: 1 }}
                                    >
                                        {item.value}
                                    </Typography>

                                    <Typography level="body-xs" color="neutral" sx={{ mt: 1 }}>
                                        {item.description}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: "md",
                                        bgcolor: `${item.color}.softBg`,
                                        color: `${item.color}.solidColor`,
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    <Icon size={22} />
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* ANALYTICS */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "1.1fr 1.9fr",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                {/* STATUS CHART */}
                <Card variant="outlined" sx={{ borderRadius: "lg" }}>
                    <CardContent>
                        <Typography level="title-lg">
                            Grievance Status
                        </Typography>

                        <Typography level="body-xs" color="neutral">
                            Distribution by current status
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {statusData.length > 0 ? (
                            <Box sx={{ width: "100%", height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={90}
                                            paddingAngle={3}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={chartColors[index % chartColors.length]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Typography
                                level="body-sm"
                                color="neutral"
                                sx={{ textAlign: "center", py: 10 }}
                            >
                                No grievance data available.
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* QUICK OVERVIEW */}
                <Card variant="outlined" sx={{ borderRadius: "lg" }}>
                    <CardContent>
                        <Typography level="title-lg">
                            Grievance Overview
                        </Typography>

                        <Typography level="body-xs" color="neutral">
                            Current grievance statistics
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {[
                            {
                                label: "Submitted",
                                count: statusData.find(
                                    (s) => s.name === "Submitted"
                                )?.value || 0,
                                color: "#2563eb",
                            },
                            {
                                label: "Under Review",
                                count: statusData.find(
                                    (s) => s.name === "Under Review"
                                )?.value || 0,
                                color: "#f59e0b",
                            },
                            {
                                label: "In Progress",
                                count: statusData.find(
                                    (s) => s.name === "In Progress"
                                )?.value || 0,
                                color: "#8b5cf6",
                            },
                            {
                                label: "Resolved",
                                count: statusData.find(
                                    (s) => s.name === "Resolved"
                                )?.value || 0,
                                color: "#16a34a",
                            },
                            {
                                label: "Reopened",
                                count: statusData.find(
                                    (s) => s.name === "Reopened"
                                )?.value || 0,
                                color: "#dc2626",
                            },
                        ].map((item) => (
                            <Box key={item.label} sx={{ mb: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 0.7,
                                    }}
                                >
                                    <Typography level="body-sm">
                                        {item.label}
                                    </Typography>

                                    <Typography level="title-sm">
                                        {item.count}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        bgcolor: "neutral.softBg",
                                        borderRadius: "lg",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: "100%",
                                            width: `${stats.total > 0
                                                ? Math.min((item.count / stats.total) * 100, 100)
                                                : 0
                                                }%`,
                                            bgcolor: item.color,
                                            borderRadius: "lg",
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </Box>

            {/* RECENT GRIEVANCES */}
            <Card variant="outlined" sx={{ borderRadius: "lg" }}>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Box>
                            <Typography level="title-lg">
                                Recent Grievances
                            </Typography>

                            <Typography level="body-xs" color="neutral">
                                Latest complaints submitted by citizens
                            </Typography>
                        </Box>

                        <Button
                            size="sm"
                            variant="soft"
                            endDecorator={<ArrowUpRight size={15} />}
                            onClick={() => window.location.assign("/admin/grievances")}
                        >
                            View All
                        </Button>
                    </Box>

                    <Sheet
                        variant="outlined"
                        sx={{
                            borderRadius: "md",
                            overflow: "auto",
                        }}
                    >
                        <Table
                            hoverRow
                            stripe="odd"
                            sx={{ minWidth: 750 }}
                        >
                            <thead>
                                <tr>
                                    <th>Reference ID</th>
                                    <th>Subject</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                </tr>
                            </thead>

                            <tbody>
                                {grievances.slice(0, 8).map((grievance) => (
                                    <tr key={grievance._id}>
                                        <td>
                                            <Typography level="body-xs" fontWeight="lg">
                                                {grievance.referenceNumber}
                                            </Typography>
                                        </td>

                                        <td>
                                            <Typography level="body-sm">
                                                {grievance.subject}
                                            </Typography>
                                        </td>

                                        <td>{grievance.category}</td>

                                        <td>
                                            <Chip
                                                size="sm"
                                                color={getPriorityColor(grievance.priority)}
                                                variant="soft"
                                            >
                                                {grievance.priority}
                                            </Chip>
                                        </td>

                                        <td>
                                            <Chip
                                                size="sm"
                                                color={getStatusColor(grievance.status)}
                                                variant="soft"
                                            >
                                                {grievance.status}
                                            </Chip>
                                        </td>

                                        <td>
                                            {grievance.createdAt
                                                ? new Date(grievance.createdAt).toLocaleDateString()
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}

                                {grievances.length === 0 && (
                                    <tr>
                                        <td colSpan={6}>
                                            <Typography
                                                level="body-sm"
                                                color="neutral"
                                                sx={{ textAlign: "center", py: 3 }}
                                            >
                                                No grievances found.
                                            </Typography>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Sheet>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminDashboard;