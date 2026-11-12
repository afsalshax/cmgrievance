import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Stack,
    Typography
} from "@mui/joy";
import { Building2 } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                px: { xs: 2, md: 8 },
                py: 2,
                bgcolor: "white",
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2
            }}
        >
            {/* Logo */}
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Building2 size={34} color="#1769AA" />

                <Box>
                    <Typography level="title-lg" fontWeight="bold">
                        CM Kerala
                    </Typography>

                    <Typography level="body-xs" color="neutral">
                        Public Grievance Redressal Portal
                    </Typography>
                </Box>
            </Stack>

            {/* Navigation */}
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ flexWrap: "wrap" }}
            >
                {[
                    ["Home", "/"],
                    ["About", "/about"],
                    ["How It Works", "/how-it-works"],
                    ["Departments", "/departments"],
                    ["Contact", "/contact"],
                    ["FAQ", "/faq"]
                ].map(([label, path]) => (
                    <Typography
                        key={path}
                        component={Link}
                        to={path}
                        level="body-sm"
                        sx={{
                            color: "#334155",
                            textDecoration: "none",
                            fontWeight: 600,
                            "&:hover": { color: "#1769AA" }
                        }}
                    >
                        {label}
                    </Typography>
                ))}
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/login")}
                >
                    Login
                </Button>

                <Button
                    color="primary"
                    onClick={() => navigate("/register")}
                >
                    Register
                </Button>
            </Stack>
        </Box>
    );
};

export default Navbar;