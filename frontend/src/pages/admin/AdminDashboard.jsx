import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp
} from "lucide-react"; // Install lucide-react for icons
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const usersRes = await api.get("/admin/users");
      const apptRes = await api.get("/admin/appointments");
      setUsers(usersRes.data.users || []);
      setAppointments(apptRes.data.appointments || []);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    );
  }

  const doctorCount = users.filter((u) => u.role === "doctor").length;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">System Overview</h1>
            <p className="text-blue-100 max-w-md">
              Welcome back, Admin. Here is what's happening with your medical platform today.
            </p>
          </div>
          <div className="hidden md:block">
             {/* Abstract medical/admin graphic */}
             <div className="bg-white/10 p-4 rounded-full backdrop-blur-md">
                <ShieldCheck size={48} className="text-white" />
             </div>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Registered" 
            value={users.length} 
            icon={<Users className="text-blue-600" />} 
            trend="+12% this month"
          />
          <StatCard 
            title="Specialist Doctors" 
            value={doctorCount} 
            icon={<UserPlus className="text-emerald-600" />} 
            trend="Active Status"
          />
          <StatCard 
            title="Total Appointments" 
            value={appointments.length} 
            icon={<Calendar className="text-amber-600" />} 
            trend="Live Queue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- USER MANAGEMENT SECTION --- */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users size={20} className="text-blue-500" /> Recent Users
                </h2>
                <button className="btn btn-ghost btn-sm text-blue-600">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-slate-500 font-semibold uppercase text-xs">User</th>
                      <th className="text-slate-500 font-semibold uppercase text-xs">Role</th>
                      <th className="text-slate-500 font-semibold uppercase text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral-focus text-neutral-content rounded-full w-8 text-xs">
                                <span>{u.name.charAt(0)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-700">{u.name}</div>
                              <div className="text-sm opacity-50">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-sm font-medium ${u.role === 'doctor' ? 'badge-info' : 'badge-ghost'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                           <button className="btn btn-ghost btn-xs"><ChevronRight size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* --- APPOINTMENTS SECTION --- */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={20} className="text-rose-500" /> Appointment Traffic
                </h2>
              </div>
              <div className="p-6 overflow-x-auto">
                 <div className="grid gap-4">
                    {appointments.length > 0 ? appointments.slice(0, 4).map((a) => (
                        <div key={a._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-blue-100 transition-colors bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                    <Calendar size={20} className="text-indigo-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{a.patientId?.name || "Unknown Patient"}</p>
                                    <p className="text-xs text-slate-500">with Dr. {a.doctorId?.userId?.name || "General"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">{a.date}</p>
                                <span className={`badge badge-outline badge-xs ${
                                    a.status === 'approved' ? 'badge-success' : 'badge-warning'
                                }`}>{a.status}</span>
                            </div>
                        </div>
                    )) : <p className="text-center text-slate-400">No appointments found.</p>}
                 </div>
              </div>
            </section>
          </div>

          {/* --- SIDEBAR INFO / ACTIONS --- */}
          <div className="space-y-6">
            <div className="card bg-white shadow-sm border border-slate-100">
              <div className="card-body">
                <h3 className="font-bold text-slate-800 mb-2">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                    <button className="btn btn-primary btn-sm justify-start gap-2">
                        <UserPlus size={16} /> Add New Doctor
                    </button>
                    <button className="btn btn-outline btn-sm justify-start gap-2">
                        <Activity size={16} /> Generate Report
                    </button>
                </div>
              </div>
            </div>

            <div className="card bg-indigo-900 text-white shadow-lg overflow-hidden relative">
              <div className="card-body z-10">
                <TrendingUp size={40} className="mb-4 text-indigo-300" />
                <h3 className="font-bold text-lg">System Health</h3>
                <p className="text-indigo-200 text-sm">All services are currently running optimally.</p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    99.9% Uptime
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

// Reusable Stat Component
const StatCard = ({ title, value, icon, trend }) => (
  <div className="card bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-slate-50">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">Live</span>
    </div>
    <h2 className="text-slate-500 font-medium text-sm">{title}</h2>
    <div className="flex items-baseline gap-2">
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <span className="text-xs text-emerald-500 font-medium">{trend}</span>
    </div>
  </div>
);

export default AdminDashboard;