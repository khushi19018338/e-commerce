import { Navigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import Loader from "./Loader";

function AdminRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
