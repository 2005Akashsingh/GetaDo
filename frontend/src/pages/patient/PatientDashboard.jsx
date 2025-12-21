import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  Stethoscope, 
  Clock, 
  IndianRupee, 
  User, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, apptRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/appointments/my-appointments")
        ]);
        setDoctors(docRes.data.doctors || []);
        setMyAppointments(apptRes.data.appointments || []);
      } catch (error) {
        toast.error("Failed to sync dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* --- WELCOME HEADER --- */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Hello, <span className="text-primary">{user?.name || "Patient"}</span>! 👋
            </h1>
            <p className="text-slate-500 mt-2">Manage your health, view your schedule, and book new consultations.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by specialty or doctor name..." 
              className="input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: DOCTOR DISCOVERY (8 Cols) --- */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Stethoscope className="text-primary" /> Available Specialists
              </h2>
              <span className="text-sm text-slate-400">{filteredDoctors.length} doctors found</span>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400">No doctors match your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor._id} className="group card bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-slate-100 overflow-hidden">
                    <div className="card-body p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                             <User size={28} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">
                              Dr. {doctor.userId?.name}
                            </h3>
                            <p className="text-sm font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md inline-block">
                              {doctor.specialization}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock size={16} className="text-slate-400" />
                          <span>{doctor.experience} Yrs Exp.</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <IndianRupee size={16} className="text-slate-400" />
                          <span className="font-semibold text-slate-700">₹{doctor.fees}</span>
                        </div>
                      </div>

                      <div className="card-actions mt-6">
                        <button
                          className="btn btn-primary w-full rounded-xl gap-2 normal-case"
                          onClick={() => navigate(`/dashboard/patient/book/${doctor._id}`)}
                        >
                          Book Consultation <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: MY APPOINTMENTS (4 Cols) --- */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar className="text-rose-500" /> My Schedule
              </h2>

              <div className="space-y-4">
                {myAppointments.length > 0 ? (
                  myAppointments.slice(0, 5).map((appt) => (
                    <div key={appt._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`badge badge-sm font-bold ${
                          appt.status === 'approved' ? 'badge-success text-white' : 
                          appt.status === 'rejected' ? 'badge-error text-white' : 'badge-warning text-white'
                        }`}>
                          {appt.status}
                        </span>
                        <p className="text-xs text-slate-400 font-medium">{appt.time}</p>
                      </div>
                      <p className="font-bold text-slate-700 truncate">Dr. {appt.doctorId?.userId?.name}</p>
                      <p className="text-xs text-slate-500 mb-3">{appt.date}</p>
                      
                      {appt.status === 'approved' && (
                         <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                           <CheckCircle2 size={12} /> Confirmed
                         </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm">No upcoming visits.</p>
                  </div>
                )}
                
                <button 
                  className="btn btn-ghost btn-block btn-sm text-slate-400 normal-case mt-2"
                  onClick={() => navigate('/dashboard/patient/appointments')}
                >
                  View Full History
                </button>
              </div>

              {/* Promo Card */}
              <div className="mt-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Health Tip</p>
                <p className="mt-2 text-sm leading-relaxed">
                  Drink at least 8 glasses of water daily to maintain energy and clear skin!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default PatientDashboard;