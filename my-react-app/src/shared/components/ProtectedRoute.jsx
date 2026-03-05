import { Navigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import Loader from "./Loader";

function ProtectedRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
