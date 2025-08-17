import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole"; // this will fetch user role from backend
import Forbidden from "../pages/forbidden/Forbidden";
import Loading from "../components/ui/Loading";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading: roleLoading } = useRole(); // fetch from backend
    const location = useLocation();

    if (loading || roleLoading) return <Loading/>;

    if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />;

    if (role !== "admin") return <Navigate to="/forbidden" state={{ from: location }} replace />;

    return children;
};

export default AdminRoute;
