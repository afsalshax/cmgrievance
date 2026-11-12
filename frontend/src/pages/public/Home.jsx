import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Stack,
    Typography
} from "@mui/joy";

import {
    FileText,
    Search,
    ShieldCheck,
    ArrowRight,
    Building2,
    Clock,
    CheckCircle
} from "lucide-react";

import Navbar from "../../components/public/Navbar";

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <FileText size={30} />,
            title: "Submit Grievance",
            description:
                "Register your complaints online and receive a unique reference number.",
            action: "Submit Now",
            path: "/login"
        },
        {
            icon: <Search size={30} />,
            title: "Track Grievance",
            description:
                "Track the progress of your submitted complaints using your reference number.",
            action: "Track Now",
            path: "/citizen/track"
        },
        {
            icon: <ShieldCheck size={30} />,
            title: "Transparent Process",
            description:
                "Follow the progress of your complaint through a structured resolution process.",
            action: "Learn More",
            path: "/how-it-works"
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Submit Complaint",
            description: "Register your grievance through the online portal."
        },
        {
            number: "02",
            title: "Review & Assignment",
            description: "The grievance is reviewed and assigned to the relevant department."
        },
        {
            number: "03",
            title: "Department Action",
            description: "The concerned officer investigates and submits an action report."
        },
        {
            number: "04",
            title: "Resolution",
            description: "The review process is completed and the citizen is updated."
        }
    ];

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#F7F9FC" }}>
            <Navbar />

            {/* Hero Section */}
            <Box
                sx={{
                    background:
                        "linear-gradient(120deg, #102A43 0%, #1769AA 100%)",
                    color: "white",
                    py: { xs: 8, md: 12 },
                    px: 2
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={5} alignItems="center">
                        <Grid xs={12} md={7}>
                            <Typography
                                level="body-sm"
                                sx={{
                                    color: "#BFDBFE",
                                    fontWeight: "bold",
                                    mb: 2,
                                    letterSpacing: 2
                                }}
                            >
                                CITIZEN GRIEVANCE REDRESSAL
                            </Typography>

                            <Typography
                                level="h1"
                                sx={{
                                    color: "white",
                                    fontSize: {
                                        xs: "2.3rem",
                                        md: "3.5rem"
                                    },
                                    lineHeight: 1.2,
                                    mb: 3
                                }}
                            >
                                Your Voice Matters.
                                <br />
                                We Are Here to Listen.
                            </Typography>

                            <Typography
                                level="body-lg"
                                sx={{
                                    color: "#E2E8F0",
                                    maxWidth: 600,
                                    mb: 4,
                                    lineHeight: 1.8
                                }}
                            >
                                A digital platform for citizens to submit
                                public grievances, track complaint progress
                                and stay informed throughout the resolution
                                process.
                            </Typography>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <Button
                                    size="lg"
                                    color="primary"
                                    onClick={() => navigate("/login")}
                                    endDecorator={<ArrowRight size={18} />}
                                >
                                    Submit a Grievance
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outlined"
                                    sx={{
                                        color: "white",
                                        borderColor: "white",
                                        "&:hover": {
                                            bgcolor: "rgba(255,255,255,0.1)"
                                        }
                                    }}
                                    onClick={() => navigate("/login")}
                                >
                                    Citizen Login
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid xs={12} md={5}>
                            <Card
                                variant="soft"
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.12)",
                                    color: "white",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    borderRadius: "xl",
                                    p: 3
                                }}
                            >
                                <Building2 size={55} color="#BFDBFE" />

                                <Typography
                                    level="h3"
                                    sx={{ color: "white", mt: 3, mb: 1 }}
                                >
                                    Citizen First
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#E2E8F0",
                                        lineHeight: 1.8
                                    }}
                                >
                                    Making grievance submission and tracking
                                    simpler through a centralized digital
                                    platform.
                                </Typography>

                                <Stack spacing={2} sx={{ mt: 4 }}>
                                    {[
                                        "Online complaint registration",
                                        "Department-level assignment",
                                        "Status tracking and updates"
                                    ].map((item) => (
                                        <Stack
                                            key={item}
                                            direction="row"
                                            spacing={1.5}
                                            alignItems="center"
                                        >
                                            <CheckCircle
                                                size={19}
                                                color="#86EFAC"
                                            />
                                            <Typography
                                                level="body-sm"
                                                sx={{ color: "white" }}
                                            >
                                                {item}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box sx={{ textAlign: "center", mb: 5 }}>
                    <Typography level="h2" sx={{ mb: 1 }}>
                        How Can We Help You?
                    </Typography>

                    <Typography color="neutral">
                        Access the services available through this portal.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {features.map((feature) => (
                        <Grid xs={12} md={4} key={feature.title}>
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
                                    <Box sx={{ color: "primary.500" }}>
                                        {feature.icon}
                                    </Box>

                                    <Typography level="h4">
                                        {feature.title}
                                    </Typography>

                                    <Typography
                                        level="body-sm"
                                        color="neutral"
                                        sx={{ lineHeight: 1.8 }}
                                    >
                                        {feature.description}
                                    </Typography>

                                    <Button
                                        variant="soft"
                                        endDecorator={<ArrowRight size={16} />}
                                        onClick={() =>
                                            navigate(feature.path)
                                        }
                                    >
                                        {feature.action}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Process */}
            <Box sx={{ bgcolor: "white", py: 8 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Typography level="h2" sx={{ mb: 1 }}>
                            How It Works
                        </Typography>

                        <Typography color="neutral">
                            A simple process from complaint submission to resolution.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {steps.map((step) => (
                            <Grid xs={12} sm={6} md={3} key={step.number}>
                                <Box sx={{ textAlign: "center", px: 2 }}>
                                    <Typography
                                        level="h1"
                                        sx={{
                                            color: "primary.300",
                                            mb: 2
                                        }}
                                    >
                                        {step.number}
                                    </Typography>

                                    <Typography level="h4" sx={{ mb: 1 }}>
                                        {step.title}
                                    </Typography>

                                    <Typography
                                        level="body-sm"
                                        color="neutral"
                                        sx={{ lineHeight: 1.8 }}
                                    >
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Card
                    variant="soft"
                    color="primary"
                    sx={{
                        textAlign: "center",
                        p: { xs: 3, md: 6 },
                        borderRadius: "xl"
                    }}
                >
                    <Clock size={35} />

                    <Typography level="h2" sx={{ mt: 2, mb: 1 }}>
                        Have a Grievance?
                    </Typography>

                    <Typography sx={{ mb: 3 }}>
                        Register your complaint and follow its progress online.
                    </Typography>

                    <Button
                        size="lg"
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </Button>
                </Card>
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    bgcolor: "#10243E",
                    color: "white",
                    textAlign: "center",
                    py: 3,
                    px: 2
                }}
            >
                <Typography sx={{ color: "white" }}>
                    CM Kerala – Public Grievance Redressal Portal
                </Typography>

                <Typography
                    level="body-xs"
                    sx={{ color: "#CBD5E1", mt: 1 }}
                >
                    Recruitment prototype for demonstration purposes.
                    Not an official Government of Kerala website.
                </Typography>
            </Box>
        </Box>
    );
};

export default Home;