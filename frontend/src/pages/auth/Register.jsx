import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    Sheet,
    Typography,
    Input,
    Button,
    Alert,
    Divider,
} from "@mui/joy";
import { UserPlus, ShieldCheck } from "lucide-react";
import { registerCitizen } from "../../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            await registerCitizen(formData);

            alert("Registration successful. Please login.");
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f4f7fb",
                p: 2,
            }}
        >
            <Sheet
                variant="outlined"
                sx={{
                    width: "100%",
                    maxWidth: 460,
                    p: 4,
                    borderRadius: "lg",
                    boxShadow: "lg",
                    bgcolor: "white",
                }}
            >
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Box
                        sx={{
                            width: 55,
                            height: 55,
                            mx: "auto",
                            mb: 2,
                            borderRadius: "md",
                            bgcolor: "#e8f1ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#155eef",
                        }}
                    >
                        <UserPlus size={28} />
                    </Box>

                    <Typography level="h3" fontWeight="bold">
                        Create Account
                    </Typography>

                    <Typography level="body-sm" sx={{ color: "neutral.500", mt: 1 }}>
                        Register to submit and track your grievances.
                    </Typography>
                </Box>

                {error && (
                    <Alert color="danger" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                            <Typography level="body-sm" fontWeight="lg" sx={{ mb: 0.7 }}>
                                Full Name
                            </Typography>
                            <Input
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Box>
                            <Typography level="body-sm" fontWeight="lg" sx={{ mb: 0.7 }}>
                                Email Address
                            </Typography>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Box>
                            <Typography level="body-sm" fontWeight="lg" sx={{ mb: 0.7 }}>
                                Mobile Number
                            </Typography>
                            <Input
                                name="mobile"
                                placeholder="Enter your mobile number"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Box>
                            <Typography level="body-sm" fontWeight="lg" sx={{ mb: 0.7 }}>
                                Password
                            </Typography>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Button
                            type="submit"
                            loading={loading}
                            fullWidth
                            sx={{ mt: 1, bgcolor: "#155eef" }}
                        >
                            Create Account
                        </Button>
                    </Box>
                </form>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Typography level="body-sm" textAlign="center">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{ color: "#155eef", fontWeight: 600 }}
                    >
                        Login
                    </Link>
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        mt: 3,
                    }}
                >
                    <ShieldCheck size={16} color="#64748b" />
                    <Typography level="body-xs" sx={{ color: "neutral.500" }}>
                        Your information is protected.
                    </Typography>
                </Box>
            </Sheet>
        </Box>
    );
}

export default Register;