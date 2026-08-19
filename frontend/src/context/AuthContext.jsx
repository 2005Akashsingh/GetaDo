import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";


// create context
const AuthContext = createContext();

// custom hook (clean usage)
export const useAuth = () => useContext(AuthContext);

// provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // { userId, role , name, email}
  const [loading, setLoading] = useState(true);

  // 🔹 Check auth status when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔹 Login
  // Returns { success, needsVerification?, email? } instead of a plain boolean
  // so the caller can redirect to OTP verification when the account isn't verified yet.
  const login = async (formData) => {
    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message || "Login successful");

      // fetch user again after login
      const me = await api.get("/auth/me");
      setUser(me.data.user);
      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      if (data?.needsVerification) {
        return { success: false, needsVerification: true, email: data.email };
      }
      toast.error(data?.message || "Login failed");
      return { success: false };
    }
  };

  // 🔹 Signup
  // Returns { success, email? } — email is used to route to the OTP verification screen.
  const signup = async (formData) => {
    try {
      const res = await api.post("/auth/signup", formData);
      toast.success(res.data.message || "Signup successful");
      return { success: true, email: res.data.email };
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return { success: false };
    }
  };

  // 🔹 Verify signup OTP
  const verifyOtp = async (email, code) => {
    try {
      const res = await api.post("/auth/verify-otp", { email, code });
      toast.success(res.data.message || "Email verified");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      return false;
    }
  };

  // 🔹 Resend OTP (signup verification or password reset)
  const resendOtp = async (email, purpose) => {
    try {
      const res = await api.post("/auth/resend-otp", { email, purpose });
      toast.success(res.data.message || "OTP resent");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      return false;
    }
  };

  // 🔹 Request a password reset OTP
  const forgotPassword = async (email) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "OTP sent");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return false;
    }
  };

  // 🔹 Reset password using OTP
  const resetPassword = async (email, code, newPassword) => {
    try {
      const res = await api.post("/auth/reset-password", { email, code, newPassword });
      toast.success(res.data.message || "Password reset successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      return false;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
