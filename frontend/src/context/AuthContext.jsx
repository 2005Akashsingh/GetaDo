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
  const login = async (formData) => {
    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message || "Login successful");

      // fetch user again after login
      const me = await api.get("/auth/me");
      setUser(me.data.user);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  // 🔹 Signup
  const signup = async (formData) => {
    try {
      const res = await api.post("/auth/signup", formData);
      toast.success(res.data.message || "Signup successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
