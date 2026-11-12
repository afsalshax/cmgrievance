import { Box, Container, Typography, Card, CardContent, Grid } from "@mui/joy";
import { Target, Users, ShieldCheck } from "lucide-react";
import Navbar from "../../components/public/Navbar";

const About = () => {
    const objectives = [
        {
            icon: <Target size={30} />,
            title: "Our Purpose",
            description: "Provide citizens with a simple digital platform to submit public grievances."
        },
        {
            icon: <Users size={30} />,
            title: "Citizen Focus",
            description: "Make complaint registration, tracking and communication accessible."
        },
        {
            icon: <ShieldCheck size={30} />,
            title: "Transparency",
            description: "Maintain grievance history and provide visibility into the resolution process."
        }
    ];

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#F7F9FC" }}>
            <Navbar />

            <Box sx={{ bgcolor: "#102A43", color: "white", py: 7, textAlign: "center" }}>
                <Container>
                    <Typography level="h1" sx={{ color: "white", mb: 2 }}>
                        About the Portal
                    </Typography>
                    <Typography sx={{ color: "#DCE6F2", maxWidth: 700, mx: "auto" }}>
                        A digital grievance management prototype designed to
                        simplify public complaint registration, monitoring and resolution.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 7 }}>
                <Typography level="h2" sx={{ mb: 2 }}>
                    Our Mission
                </Typography>

                <Typography level="body-lg" color="neutral" sx={{ lineHeight: 1.9, mb: 5 }}>
                    This portal demonstrates how technology can help citizens
                    communicate public grievances through a centralized platform.
                    It provides a structured workflow for reviewing complaints,
                    assigning departments, recording actions and communicating
                    resolution updates.
                </Typography>

                <Typography level="h2" sx={{ mb: 3 }}>
                    Key Objectives
                </Typography>

                <Grid container spacing={3}>
                    {objectives.map((item) => (
                        <Grid xs={12} md={4} key={item.title}>
                            <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
                                <CardContent sx={{ gap: 2 }}>
                                    <Box sx={{ color: "primary.500" }}>
                                        {item.icon}
                                    </Box>
                                    <Typography level="h4">{item.title}</Typography>
                                    <Typography color="neutral">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Box sx={{ bgcolor: "#10243E", color: "white", textAlign: "center", py: 3 }}>
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

export default About;