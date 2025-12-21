import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react"; // Import the icon

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 relative">
      
      {/* --- BACK BUTTON (Positioned Top Left of screen) --- */}
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => navigate("/")} 
          className="btn btn-ghost gap-2 normal-case hover:bg-base-300 rounded-2xl group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline font-semibold">Back to Home</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 pt-4">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Login to your account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full focus:input-primary"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label flex justify-between">
                <span className="label-text font-medium">Password</span>
                <Link
                  to="/forgot-password"
                  className="text-sm link link-primary"
                >
                  Forgot Password?
                </Link>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full my-2 focus:input-primary"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary w-full text-base tracking-wide mt-2"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="divider my-6">OR</div>

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="link link-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;