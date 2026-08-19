import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MailCheck } from "lucide-react";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await verifyOtp(email, code);
    setLoading(false);
    if (success) navigate("/login");
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    await resendOtp(email, "signup");
    setResending(false);
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
            <MailCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">Verify Your Email</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Enter the 6-digit code we sent to your email
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

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">OTP Code</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="input input-bordered w-full text-center text-2xl tracking-[0.5em] focus:input-primary"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2 text-base tracking-wide"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="divider my-6">OR</div>

          <p className="text-center text-sm">
            Didn't get a code?{" "}
            <button
              onClick={handleResend}
              className="link link-primary font-medium"
              disabled={resending || !email}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </p>

          <p className="text-center text-sm mt-3">
            <Link to="/login" className="link link-primary font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
