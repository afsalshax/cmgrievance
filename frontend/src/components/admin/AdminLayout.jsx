
import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
    Box,
    Sheet,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemContent,
    Avatar,
    Divider,
    IconButton,
    Button,
} from "@mui/joy";

import {
    LayoutDashboard,
    FileText,
    Building2,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck,
    Menu,
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Grievances",
        path: "/admin/grievances",
        icon: FileText,
    },
    {
        title: "Departments",
        path: "/admin/departments",
        icon: Building2,
    },
    {
        title: "Officers",
        path: "/admin/officers",
        icon: Users,
    },
    {
        title: "Reports & Analytics",
        path: "/admin/reports",
        icon: BarChart3,
    },
    {
        title: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F4F7FB" }}>

            {/* SIDEBAR */}
            <Sheet
                sx={{
                    width: 260,
                    bgcolor: "#10243E",
                    color: "white",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    height: "100vh",
                    zIndex: 100,
                    boxSizing: "border-box",
                }}
            >
                {/* BRAND */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
                    <Box
                        sx={{
                            bgcolor: "#2563EB",
                            borderRadius: "md",
                            p: 1,
                            display: "flex",
                        }}
                    >
                        <ShieldCheck size={25} color="white" />
                    </Box>

                    <Box>
                        <Typography level="title-lg" sx={{ color: "white", fontWeight: 700 }}>
                            CM Kerala
                        </Typography>

                        <Typography level="body-xs" sx={{ color: "#A9BDD4" }}>
                            Grievance Portal
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ bgcolor: "#29415E", my: 2 }} />

                <Typography
                    level="body-xs"
                    sx={{
                        color: "#8DA4BF",
                        fontWeight: 700,
                        px: 1.5,
                        mb: 1.5,
                    }}
                >
                    MAIN MENU
                </Typography>

                {/* NAVIGATION */}
                <List sx={{ gap: 0.7, flexGrow: 1 }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <ListItem key={item.path}>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    sx={{
                                        borderRadius: "md",
                                        color: "#CBD5E1",
                                        minHeight: 44,

                                        "&:hover": {
                                            bgcolor: "#23466D",
                                            color: "white",
                                        },

                                        "&.active": {
                                            bgcolor: "#2563EB",
                                            color: "white",
                                            fontWeight: 600,
                                        },
                                    }}
                                >
                                    <Icon size={19} />

                                    <ListItemContent>
                                        <Typography level="title-sm" sx={{ color: "inherit" }}>
                                            {item.title}
                                        </Typography>
                                    </ListItemContent>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                {/* ADMIN PROFILE */}
                <Divider sx={{ bgcolor: "#29415E", my: 2 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1 }}>
                    <Avatar size="sm" sx={{ bgcolor: "#2563EB" }}>
                        A
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography level="title-sm" sx={{ color: "white" }}>
                            Administrator
                        </Typography>

                        <Typography level="body-xs" sx={{ color: "#A9BDD4" }}>
                            CMO Admin
                        </Typography>
                    </Box>

                    <IconButton
                        variant="plain"
                        color="neutral"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} color="#CBD5E1" />
                    </IconButton>
                </Box>
            </Sheet>

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    flex: 1,
                    ml: "260px",
                    minWidth: 0,
                }}
            >
                {/* HEADER */}
                <Sheet
                    sx={{
                        height: 76,
                        px: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        bgcolor: "white",
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                    }}
                >
                    <Box>
                        <Typography level="title-lg" fontWeight={700}>
                            Administration Panel
                        </Typography>

                        <Typography level="body-xs" color="neutral">
                            Chief Minister's Public Grievance Redressal
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar size="sm" sx={{ bgcolor: "#DBEAFE", color: "#1D4ED8" }}>
                            A
                        </Avatar>

                        <Box>
                            <Typography level="title-sm">
                                Administrator
                            </Typography>

                            <Typography level="body-xs" color="neutral">
                                Super Admin
                            </Typography>
                        </Box>
                    </Box>
                </Sheet>

                {/* PAGE CONTENT */}
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;