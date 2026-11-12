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
import { LogIn, ShieldCheck } from "lucide-react";
import { loginUser } from "../../services/authService";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
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

            const response = await loginUser(formData);

            // Adjust these property names if your API response differs.
            const token = response.token;
            const user = response.user;

            if (!token || !user) {
                throw new Error("Invalid login response from server.");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (user.role === "officer") {
                navigate("/officer/dashboard");
            } else {
                navigate("/citizen/dashboard");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Login failed. Please check your credentials."
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
                    maxWidth: 430,
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
                        <LogIn size={28} />
                    </Box>

                    <Typography level="h3" fontWeight="bold">
                        Welcome Back
                    </Typography>

                    <Typography level="body-sm" sx={{ color: "neutral.500", mt: 1 }}>
                        Login to access your grievance portal.
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
                                Password
                            </Typography>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Enter your password"
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
                            Login
                        </Button>
                    </Box>
                </form>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Typography level="body-sm" textAlign="center">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        style={{ color: "#155eef", fontWeight: 600 }}
                    >
                        Register
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
                        Secure citizen access.
                    </Typography>
                </Box>
            </Sheet>
        </Box>
    );
}

export default Login;