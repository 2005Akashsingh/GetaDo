import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  XCircle, 
  CheckCircle, 
  AlertCircle,
  Filter,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, approved, pending, rejected
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/my-appointments");
      setAppointments(res.data.appointments || []);
    } catch (error) {
      toast.error("Could not load your appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled successfully");
      fetchAppointments(); // Refresh list
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appt => 
    filter === "all" ? true : appt.status === filter
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate('/dashboard/patient')}
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold text-slate-800">My Appointments</h1>
            <p className="text-slate-500">Track and manage your medical consultations</p>
          </div>

          {/* --- TAB FILTERS --- */}
          <div className="tabs tabs-boxed bg-white p-1 border border-slate-100 shadow-sm">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`tab tab-sm md:tab-md capitalize ${filter === tab ? "tab-active bg-primary text-white" : "text-slate-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- APPOINTMENT LIST --- */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-slate-400 font-medium tracking-wide">Syncing your schedule...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No appointments found</h3>
            <p className="text-slate-500 mt-2 mb-8">You don't have any {filter !== 'all' ? filter : ''} appointments scheduled.</p>
            <button 
              className="btn btn-primary px-8 rounded-xl"
              onClick={() => navigate('/dashboard/patient')}
            >
              Book a New Appointment
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAppointments.map((appt) => (
              <div 
                key={appt._id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Status Bar (Side) */}
                  <div className={`w-2 md:w-3 ${
                    appt.status === 'approved' ? 'bg-emerald-500' : 
                    appt.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-400'
                  }`} />

                  <div className="flex-1 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="avatar placeholder">
                        <div className="bg-slate-100 text-slate-600 rounded-2xl w-16">
                          <User size={32} />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">Dr. {appt.doctorId?.userId?.name}</h4>
                        <p className="text-sm text-primary font-medium">{appt.doctorId?.specialization}</p>
                        <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                          <MapPin size={12} /> Medical Center, Main Wing
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-row md:flex-col gap-8 md:gap-1 w-full md:w-auto border-y md:border-none py-4 md:py-0 border-slate-50">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={18} className="text-slate-400" />
                        <span className="font-semibold">{appt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={18} className="text-slate-400" />
                        <span className="font-medium text-sm">{appt.time}</span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                      <div className="text-right hidden md:block mr-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                          appt.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                          appt.status === 'rejected' ? 'bg-rose-50 border-rose-200 text-rose-600' : 
                          'bg-amber-50 border-amber-200 text-amber-600'
                        }`}>
                          {appt.status}
                        </span>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        {appt.status === 'pending' && (
                          <button 
                            onClick={() => handleCancel(appt._id)}
                            className="btn btn-outline btn-error btn-sm flex-1 md:flex-none gap-2 rounded-lg"
                          >
                            <XCircle size={16} /> Cancel
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm bg-slate-50 text-slate-600 flex-1 md:flex-none rounded-lg">
                           Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer Message */}
                {appt.status === 'approved' && (
                  <div className="bg-emerald-50 px-6 py-2 flex items-center gap-2 text-emerald-700 text-xs font-medium">
                    <CheckCircle size={14} /> Please arrive 15 minutes before your scheduled time.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyAppointments;