
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        switch (user.role) {
            case "admin":
                return <Navigate to="/admin/dashboard" replace />;
            case "officer":
                return <Navigate to="/officer/dashboard" replace />;
            case "citizen":
                return <Navigate to="/citizen/dashboard" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;