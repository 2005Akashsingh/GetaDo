import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    switch (user.role) {
      case "patient":
        navigate("/dashboard/patient", { replace: true });
        break;

      case "doctor":
        navigate("/dashboard/doctor", { replace: true });
        break;

      case "admin":
        navigate("/dashboard/admin", { replace: true });
        break;

      default:
        navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // 🔄 While redirecting or loading
  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default Dashboard;
