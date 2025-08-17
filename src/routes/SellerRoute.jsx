import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loading from "../components/ui/Loading";
import Forbidden from "../pages/forbidden/Forbidden";


const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isRoleLoading } = useRole();

  if (loading || isRoleLoading) return <Loading />;

  if (!user) return <Navigate to="/login" replace />;

  if (role !== "seller") return <Forbidden />;

  return children;
};

export default SellerRoute;
