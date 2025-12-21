import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react"; // Import the icon

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await api.post("/doctor/signup", formData);

      toast.success(res.data.message || "Doctor account created");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Doctor signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
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
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl">
        <div className="p-8">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-center mb-2">
            Doctor Registration
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Create a doctor account to manage appointments
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                placeholder="Dr. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register as Doctor"}
            </button>
          </form>

          {/* Footer */}
          <div className="divider my-6">OR</div>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>

          <p className="text-center text-xs text-gray-500 mt-3">
            After signup, complete your doctor profile to start receiving
            appointments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;