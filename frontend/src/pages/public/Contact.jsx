import { useState } from "react";

import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Input,
    Textarea,
    Button,
    Stack,
    Alert
} from "@mui/joy";

import { Mail, MapPin, Phone, Send } from "lucide-react";

import Navbar from "../../components/public/Navbar";
import api from "../../services/api";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.post("/contact", formData);

            setSuccess(response.data.message);

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to submit your enquiry. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#F7F9FC" }}>
            <Navbar />

            {/* Header */}
            <Box sx={{ bgcolor: "#102A43", py: 7, textAlign: "center" }}>
                <Container>
                    <Typography level="h1" sx={{ color: "white", mb: 2 }}>
                        Contact Us
                    </Typography>

                    <Typography sx={{ color: "#DCE6F2" }}>
                        Have a question? Send us your enquiry.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 7 }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={4}
                    alignItems="flex-start"
                >
                    {/* Contact Information */}
                    <Box sx={{ flex: 1 }}>
                        <Typography level="h2" sx={{ mb: 2 }}>
                            Get in Touch
                        </Typography>

                        <Typography color="neutral" sx={{ lineHeight: 1.8, mb: 4 }}>
                            Use this form to send questions or enquiries
                            related to the grievance portal.
                        </Typography>

                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Mail color="#1769AA" />
                                <Box>
                                    <Typography level="title-sm">Email</Typography>
                                    <Typography level="body-sm" color="neutral">
                                        Contact through the enquiry form
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <MapPin color="#1769AA" />
                                <Box>
                                    <Typography level="title-sm">Location</Typography>
                                    <Typography level="body-sm" color="neutral">
                                        Kerala, India
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Phone color="#1769AA" />
                                <Box>
                                    <Typography level="title-sm">Support</Typography>
                                    <Typography level="body-sm" color="neutral">
                                        Submit an enquiry for assistance
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>

                    {/* Contact Form */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                        <Card variant="outlined" sx={{ borderRadius: "lg" }}>
                            <CardContent>
                                <Typography level="h3" sx={{ mb: 2 }}>
                                    Send an Enquiry
                                </Typography>

                                {success && (
                                    <Alert color="success" sx={{ mb: 2 }}>
                                        {success}
                                    </Alert>
                                )}

                                {error && (
                                    <Alert color="danger" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={2}>
                                        <Input
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />

                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />

                                        <Input
                                            name="subject"
                                            placeholder="Subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />

                                        <Textarea
                                            name="message"
                                            placeholder="Write your message..."
                                            minRows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            loading={loading}
                                            endDecorator={<Send size={17} />}
                                        >
                                            Submit Enquiry
                                        </Button>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Container>

            {/* Footer */}
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

export default Contact;