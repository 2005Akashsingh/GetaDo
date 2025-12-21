import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const email = state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-xl font-bold text-center">Reset Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button className="btn btn-primary w-full" type="submit">
              Reset Password
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            <Link to="/login" className="link link-primary">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
