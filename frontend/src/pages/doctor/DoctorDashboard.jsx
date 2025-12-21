import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  X, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  ClipboardList, 
  TrendingUp 
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending or all
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/my-appointments");
      setAppointments(res.data.appointments || []);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length
  };

  const filteredAppointments = appointments.filter(appt => 
    activeTab === "all" ? true : appt.status === "pending"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* --- WELCOME SECTION --- */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Doctor Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, Dr. {user?.name}. Here's your schedule for today.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/doctor/profile')}
            className="btn btn-outline btn-primary rounded-xl"
          >
            Update Availability
          </button>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Users size={24}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Total Patients</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600"><ClipboardList size={24}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Pending Requests</p>
              <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><TrendingUp size={24}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Confirmed Visits</p>
              <p className="text-2xl font-bold text-slate-800">{stats.approved}</p>
            </div>
          </div>
        </div>

        {/* --- APPOINTMENTS SECTION --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800">Manage Appointments</h2>
            <div className="tabs tabs-boxed bg-slate-50 p-1">
              <button 
                className={`tab rounded-lg font-medium transition-all ${activeTab === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                onClick={() => setActiveTab('pending')}
              >
                Action Required
              </button>
              <button 
                className={`tab rounded-lg font-medium transition-all ${activeTab === 'all' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                onClick={() => setActiveTab('all')}
              >
                History / All
              </button>
            </div>
          </div>

          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Calendar size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Clear Schedule!</h3>
                <p className="text-slate-500">No {activeTab} appointments to display.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAppointments.map((appt) => (
                  <div 
                    key={appt._id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-white rounded-2xl w-14 shadow-lg shadow-primary/20">
                          <span className="text-xl font-bold">{appt.patientId?.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{appt.patientId?.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-md border border-slate-100">
                            <Calendar size={12}/> {appt.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-md border border-slate-100">
                            <Clock size={12}/> {appt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-none pt-4 md:pt-0">
                      <div className="mr-4">
                        <span className={`badge badge-sm font-bold uppercase tracking-wider px-3 py-2 ${
                          appt.status === "approved" ? "badge-success text-white" :
                          appt.status === "rejected" ? "badge-error text-white" : "badge-warning text-white"
                        }`}>
                          {appt.status}
                        </span>
                      </div>

                      {appt.status === "pending" && (
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-square btn-sm btn-success text-white rounded-lg"
                            onClick={() => updateStatus(appt._id, "approved")}
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            className="btn btn-square btn-sm btn-error text-white rounded-lg"
                            onClick={() => updateStatus(appt._id, "rejected")}
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;