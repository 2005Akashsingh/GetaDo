import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ArrowLeft, 
  Star, 
  ShieldCheck,
  CreditCard
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format for the date picker minimum
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        setDoctor(res.data.doctor);
      } catch (error) {
        toast.error("Failed to load doctor details");
        navigate("/patient-dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select both date and a time slot");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/appointments/book", {
        doctorId,
        date,
        time,
      });

      toast.success(res.data.message || "Appointment booked successfully!");
      navigate("/dashboard/patient");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={18} /> Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: DOCTOR PROFILE CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 border-4 border-white shadow-md">
                  <User size={48} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Dr. {doctor.userId?.name}</h2>
                <p className="text-primary font-medium text-sm px-3 py-1 bg-blue-50 rounded-full mt-2">
                  {doctor.specialization}
                </p>
                
                <div className="flex items-center gap-1 mt-4 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  <span className="text-slate-400 text-xs ml-1">(4.8/5)</span>
                </div>
              </div>

              <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Experience</span>
                  <span className="font-semibold text-slate-800">{doctor.experience} Years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-semibold text-slate-800 text-lg">₹{doctor.fees}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex gap-3 items-start">
                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Verified specialist. Your data is encrypted and secure.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CalendarIcon className="text-primary" /> Select Slot
              </h3>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">1. Choose Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={today}
                      className="input input-bordered w-full pl-12 rounded-xl focus:ring-2 ring-primary/20 bg-slate-50/50 border-slate-200"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>

                {/* Slot Grid */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">2. Available Time Slots</label>
                  {!doctor.availableSlots || doctor.availableSlots.length === 0 ? (
                    <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl">No specific slots listed. Contact clinic for timing.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {doctor.availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                            time === slot 
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-95" 
                              : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                          }`}
                        >
                          <Clock size={14} /> {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary Box */}
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <CreditCard size={18} /> Booking Summary
                  </h4>
                  <p className="text-sm text-indigo-700">
                    {date && time 
                      ? `Your visit is scheduled for Dr. ${doctor.userId?.name} on ${date} at ${time}.`
                      : "Please select a date and time to continue."}
                  </p>
                </div>

                <button 
                  className={`btn btn-primary w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all ${isSubmitting ? 'loading' : ''}`}
                  type="submit"
                  disabled={isSubmitting || !date || !time}
                >
                  {isSubmitting ? "Confirming..." : `Confirm Booking • ₹${doctor.fees}`}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookAppointment;