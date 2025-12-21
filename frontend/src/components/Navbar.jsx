import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  ChevronDown,
  Calendar,
  Settings
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 1. Logic to determine the correct dashboard base path
  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin": return "/dashboard/admin";
      case "doctor": return "/dashboard/doctor";
      case "patient": return "/dashboard/patient";
      default: return "/";
    }
  };

  // 2. Logic to generate top-level navigation links based on role
  const getNavLinks = () => {
    if (!user) return [{ name: "Find Doctors", path: "/" }];
    
    const links = {
      patient: [
        { name: "Find Doctors", path: "/dashboard/patient" },
        { name: "My Appointments", path: "/dashboard/patient/appointments" },
      ],
      doctor: [
        { name: "Dashboard", path: "/dashboard/doctor" },
        { name: "Appointments", path: "/dashboard/doctor/appointments" },
        { name: "My Profile", path: "/dashboard/doctor/profile" },
      ],
      admin: [
        { name: "Admin Panel", path: "/dashboard/admin" },
      ]
    };

    return links[user.role] || [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-4 md:px-10 h-20">
      {/* --- MOBILE MENU & LOGO --- */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle text-slate-600">
            <Menu size={24} />
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-2xl w-52 border border-slate-100">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="py-3 font-medium">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <Link to="/" className="flex items-center gap-2 group transition-all">
          <div className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            G
          </div>
          <span className="text-xl font-black tracking-tight hidden sm:block text-slate-800">
            Geta<span className="text-primary">Doc</span>
          </span>
        </Link>
      </div>

      {/* --- DESKTOP NAVIGATION --- */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className="px-4 py-2 rounded-xl hover:bg-primary/5 hover:text-primary font-semibold transition-all text-slate-600"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* --- USER PROFILE DROPDOWN --- */}
      <div className="navbar-end gap-3">
        {!user ? (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm font-semibold hover:bg-base-200">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm px-5 rounded-full shadow-lg shadow-primary/30">Sign Up</Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-primary/20 p-0.5">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center font-bold">
                {user.role.charAt(0).toUpperCase()}
              </div>
            </label>

            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-3 shadow-2xl bg-base-100 rounded-2xl w-60 border border-base-200">
              <li className="mb-2 px-2 py-1">
                <div className="flex flex-col items-start gap-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-70">{user.role} Account</span>
                  <span className="text-sm font-semibold truncate w-full">{user.name || "User"}</span>
                </div>
              </li>
              <div className="divider my-0 opacity-50"></div>
              <li>
                {/* 2. Changed navigate("/dashboard") to getDashboardPath() */}
                <button onClick={() => navigate(getDashboardPath())} className="flex items-center gap-3 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile & Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { logout(); navigate("/"); }} 
                  className="flex items-center gap-3 py-3 text-error hover:bg-error/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;