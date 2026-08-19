import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roles: optional array of allowed roles (e.g. ["doctor"]). Omit to allow any authenticated user.
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // 🔹 Still checking auth (JWT + /auth/me)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 🔹 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Logged in, but wrong role for this section
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔹 Logged in and authorized → allow access
  return children;
};

export default ProtectedRoute;