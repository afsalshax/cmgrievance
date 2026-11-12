import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Chip,
    Button
} from "@mui/joy";

import {
    Building2,
    HeartPulse,
    GraduationCap,
    Shield,
    Zap,
    Droplets,
    Bus,
    Landmark,
    RefreshCw
} from "lucide-react";

import Navbar from "../../components/public/Navbar";
import api from "../../services/api";

const departmentIcons = [
    Building2,
    HeartPulse,
    GraduationCap,
    Shield,
    Zap,
    Droplets,
    Bus,
    Landmark
];

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/departments");

            setDepartments(
                response.data.departments ||
                response.data.data ||
                []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load departments. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#F7F9FC" }}>
            <Navbar />

            {/* Header */}
            <Box
                sx={{
                    bgcolor: "#102A43",
                    py: 7,
                    textAlign: "center",
                    px: 2
                }}
            >
                <Container>
                    <Typography level="h1" sx={{ color: "white", mb: 2 }}>
                        Government Departments
                    </Typography>

                    <Typography sx={{ color: "#DCE6F2" }}>
                        Explore the departments responsible for handling
                        different public grievances.
                    </Typography>
                </Container>
            </Box>

            {/* Department List */}
            <Container maxWidth="lg" sx={{ py: 7 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography level="h2" sx={{ mb: 1 }}>
                        Available Departments
                    </Typography>

                    <Typography color="neutral">
                        Select the relevant department category when submitting
                        your grievance. Final assignment is subject to CMO review.
                    </Typography>
                </Box>

                {loading && (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }} color="neutral">
                            Loading departments...
                        </Typography>
                    </Box>
                )}

                {!loading && error && (
                    <Alert
                        color="danger"
                        endDecorator={
                            <Button
                                size="sm"
                                variant="outlined"
                                color="danger"
                                onClick={fetchDepartments}
                                startDecorator={<RefreshCw size={15} />}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {!loading && !error && departments.length === 0 && (
                    <Alert color="warning">
                        No departments are currently available.
                    </Alert>
                )}

                {!loading && !error && departments.length > 0 && (
                    <Grid container spacing={3}>
                        {departments.map((department, index) => {
                            const Icon =
                                departmentIcons[index % departmentIcons.length];

                            return (
                                <Grid xs={12} sm={6} md={4} key={department._id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: "100%",
                                            borderRadius: "lg",
                                            transition: "0.2s",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "lg"
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 55,
                                                    height: 55,
                                                    borderRadius: "md",
                                                    bgcolor: "primary.100",
                                                    color: "primary.600",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <Icon size={28} />
                                            </Box>

                                            <Typography level="h4">
                                                {department.name}
                                            </Typography>

                                            <Typography
                                                level="body-sm"
                                                color="neutral"
                                                sx={{ lineHeight: 1.8, minHeight: 55 }}
                                            >
                                                {department.description ||
                                                    "Responsible for handling related public grievances."}
                                            </Typography>

                                            {department.category && (
                                                <Chip
                                                    color="primary"
                                                    variant="soft"
                                                    size="sm"
                                                >
                                                    {department.category}
                                                </Chip>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    bgcolor: "#10243E",
                    textAlign: "center",
                    py: 3,
                    px: 2
                }}
            >
                <Typography sx={{ color: "white" }}>
                    CM Kerala – Public Grievance Redressal Portal
                </Typography>

                <Typography level="body-xs" sx={{ color: "#CBD5E1", mt: 1 }}>
                    Recruitment prototype. Not an official Government of Kerala website.
                </Typography>
            </Box>
        </Box>
    );
};

export default Departments;