import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Input,
    Select,
    Option,
    Button,
    Chip,
    Table,
    Sheet,
    CircularProgress,
    Alert,
    IconButton,
    Divider,
} from "@mui/joy";

import {
    Search,
    RefreshCw,
    Brain,
    Eye,
    Filter,
} from "lucide-react";

import {
    getAllGrievances,
    analyzeGrievance,
} from "../../services/adminService";

const GrievanceList = () => {
    const navigate = useNavigate();

    // States
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [district, setDistrict] = useState("");

    const [error, setError] = useState("");
    const [analyzingId, setAnalyzingId] = useState(null);

    // Fetch grievances
    const loadGrievances = async () => {
        try {
            setLoading(true);
            setError("");

            const filters = {
                search: search || undefined,
                status: status || undefined,
                priority: priority || undefined,
                district: district || undefined,
            };

            const response = await getAllGrievances(filters);

            setGrievances(response.grievances || []);

        } catch (err) {
            console.error("Grievance loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load grievances."
            );
        } finally {
            setLoading(false);
        }
    };

    // Load grievances when filters change
    useEffect(() => {
        loadGrievances();
    }, [status, priority, district]);

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        loadGrievances();
    };

    // Clear filters
    const handleClearFilters = () => {
        setSearch("");
        setStatus("");
        setPriority("");
        setDistrict("");
    };

    // AI analysis
    const handleAIAnalysis = async (id) => {
        try {
            setAnalyzingId(id);
            setError("");

            await analyzeGrievance(id);

            await loadGrievances();

        } catch (err) {
            console.error("AI analysis error:", err);

            setError(
                err.response?.data?.message ||
                "AI analysis failed. Please try again."
            );
        } finally {
            setAnalyzingId(null);
        }
    };

    // Status colors
    const getStatusColor = (value) => {
        const colors = {
            Submitted: "warning",
            "Under Review": "primary",
            "In Progress": "info",
            Resolved: "success",
            Reopened: "danger",
        };

        return colors[value] || "neutral";
    };

    // Priority colors
    const getPriorityColor = (value) => {
        const colors = {
            Low: "success",
            Medium: "warning",
            High: "danger",
        };

        return colors[value] || "neutral";
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            {/* Page Header */}
            <Box>
                <Typography level="h3">
                    Grievance Management
                </Typography>

                <Typography
                    level="body-sm"
                    sx={{ color: "text.secondary", mt: 0.5 }}
                >
                    View, search and manage citizen grievances.
                </Typography>
            </Box>

            {/* Error Message */}
            {error && (
                <Alert color="danger" variant="soft">
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Card variant="outlined">
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Filter size={18} />

                        <Typography level="title-md">
                            Search & Filters
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        {/* Search */}
                        <Input
                            placeholder="Search reference or subject..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startDecorator={<Search size={18} />}
                            sx={{
                                flex: 1,
                                minWidth: 220,
                            }}
                        />

                        {/* Status Filter */}
                        <Select
                            placeholder="All Statuses"
                            value={status}
                            onChange={(_, value) => setStatus(value || "")}
                            sx={{ minWidth: 150 }}
                        >
                            <Option value="">All Statuses</Option>
                            <Option value="Submitted">Submitted</Option>
                            <Option value="Under Review">Under Review</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Resolved">Resolved</Option>
                            <Option value="Reopened">Reopened</Option>
                        </Select>

                        {/* Priority Filter */}
                        <Select
                            placeholder="All Priorities"
                            value={priority}
                            onChange={(_, value) => setPriority(value || "")}
                            sx={{ minWidth: 150 }}
                        >
                            <Option value="">All Priorities</Option>
                            <Option value="Low">Low</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="High">High</Option>
                        </Select>

                        {/* District Filter */}
                        <Input
                            placeholder="District"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            sx={{ minWidth: 150 }}
                        />

                        {/* Search Button */}
                        <Button
                            type="submit"
                            startDecorator={<Search size={16} />}
                        >
                            Search
                        </Button>

                        {/* Refresh */}
                        <IconButton
                            variant="outlined"
                            color="neutral"
                            onClick={loadGrievances}
                            title="Refresh"
                        >
                            <RefreshCw size={18} />
                        </IconButton>

                        {/* Clear Filters */}
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Grievance Table */}
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
                            All Grievances
                        </Typography>

                        <Chip color="primary" variant="soft">
                            {grievances.length} Records
                        </Chip>
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                p: 6,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : grievances.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <Typography level="title-md">
                                No grievances found
                            </Typography>

                            <Typography
                                level="body-sm"
                                color="neutral"
                                sx={{ mt: 1 }}
                            >
                                Try changing your search or filters.
                            </Typography>
                        </Box>
                    ) : (
                        <Sheet
                            sx={{
                                overflowX: "auto",
                                borderRadius: "sm",
                            }}
                        >
                            <Table
                                hoverRow
                                stickyHeader
                                borderAxis="bothBetween"
                                sx={{
                                    minWidth: 1100,
                                    "& th": {
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                    },
                                    "& td": {
                                        verticalAlign: "middle",
                                    },
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Reference No.</th>
                                        <th>Subject</th>
                                        <th>District</th>
                                        <th>Category</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Department</th>
                                        <th>AI Analysis</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {grievances.map((item) => (
                                        <tr key={item._id}>

                                            {/* Reference */}
                                            <td>
                                                <Typography
                                                    level="body-sm"
                                                    fontWeight="lg"
                                                >
                                                    {item.referenceNumber}
                                                </Typography>
                                            </td>

                                            {/* Subject */}
                                            <td>
                                                <Typography
                                                    level="body-sm"
                                                    sx={{ maxWidth: 200 }}
                                                >
                                                    {item.subject}
                                                </Typography>
                                            </td>

                                            {/* District */}
                                            <td>{item.district}</td>

                                            {/* Category */}
                                            <td>{item.category}</td>

                                            {/* Priority */}
                                            <td>
                                                <Chip
                                                    size="sm"
                                                    color={getPriorityColor(item.priority)}
                                                >
                                                    {item.priority}
                                                </Chip>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <Chip
                                                    size="sm"
                                                    color={getStatusColor(item.status)}
                                                >
                                                    {item.status}
                                                </Chip>
                                            </td>

                                            {/* Department */}
                                            <td>
                                                {item.department?.name || "Not assigned"}
                                            </td>

                                            {/* AI Analysis */}
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    color="primary"
                                                    loading={analyzingId === item._id}
                                                    disabled={analyzingId !== null}
                                                    startDecorator={<Brain size={15} />}
                                                    onClick={() =>
                                                        handleAIAnalysis(item._id)
                                                    }
                                                >
                                                    Analyze
                                                </Button>
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="soft"
                                                    color="neutral"
                                                    startDecorator={<Eye size={15} />}
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/grievances/${item._id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default GrievanceList;