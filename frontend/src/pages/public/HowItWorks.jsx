import { Box, Container, Typography, Card, CardContent, Stack } from "@mui/joy";
import {
    FileText,
    ClipboardCheck,
    Building2,
    ClipboardList,
    CheckCircle
} from "lucide-react";
import Navbar from "../../components/public/Navbar";

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            icon: <FileText size={28} />,
            title: "Submit Your Grievance",
            description: "Register as a citizen and submit your complaint with the relevant details and supporting documents."
        },
        {
            number: "02",
            icon: <ClipboardCheck size={28} />,
            title: "CMO Review",
            description: "The submitted grievance is reviewed and evaluated before being assigned."
        },
        {
            number: "03",
            icon: <Building2 size={28} />,
            title: "Department Assignment",
            description: "The grievance is forwarded to the appropriate department and assigned officer."
        },
        {
            number: "04",
            icon: <ClipboardList size={28} />,
            title: "Investigation and Action",
            description: "The assigned officer investigates the complaint and submits an action-taken report."
        },
        {
            number: "05",
            icon: <CheckCircle size={28} />,
            title: "Resolution and Feedback",
            description: "The CMO reviews the report, updates the grievance status and the citizen can provide feedback after resolution."
        }
    ];

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#F7F9FC" }}>
            <Navbar />

            <Box sx={{ bgcolor: "#102A43", py: 7, textAlign: "center" }}>
                <Container>
                    <Typography level="h1" sx={{ color: "white", mb: 2 }}>
                        How It Works
                    </Typography>
                    <Typography sx={{ color: "#DCE6F2" }}>
                        Follow the grievance resolution process step by step.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ py: 7 }}>
                <Stack spacing={3}>
                    {steps.map((step) => (
                        <Card key={step.number} variant="outlined">
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <Box sx={{
                                        bgcolor: "primary.100",
                                        color: "primary.600",
                                        p: 2,
                                        borderRadius: "md"
                                    }}>
                                        {step.icon}
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography level="body-xs" color="primary">
                                            STEP {step.number}
                                        </Typography>
                                        <Typography level="h4" sx={{ my: 1 }}>
                                            {step.title}
                                        </Typography>
                                        <Typography color="neutral">
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>

            <Box sx={{ bgcolor: "#10243E", textAlign: "center", py: 3 }}>
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

export default HowItWorks;