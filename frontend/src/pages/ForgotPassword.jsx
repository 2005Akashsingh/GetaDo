import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await forgotPassword(email);
    setLoading(false);
    if (success) navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 relative">
      <div className="absolute top-8 left-8">
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost gap-2 normal-case hover:bg-base-300 rounded-2xl group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline font-semibold">Back to Home</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl">
        <div className="p-8">
          <div className="flex justify-center mb-4 text-primary">
            <KeyRound size={40} />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">Forgot Password</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Enter your email and we'll send you an OTP to reset your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full focus:input-primary"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2 text-base tracking-wide"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <div className="divider my-6">OR</div>

          <p className="text-center text-sm">
            Remembered your password?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
