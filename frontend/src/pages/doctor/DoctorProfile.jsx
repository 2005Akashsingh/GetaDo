import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  Clock,
  Plus,
  Trash2,
  User as UserIcon,
  Save,
  Stethoscope,
  IndianRupee,
  Briefcase,
  Sparkles
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

const DoctorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");
  const [loading, setLoading] = useState(true);

  // Form state for creating a new profile
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    fees: ""
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctors");
      
      // 3. Find the profile that belongs to the logged-in user
      const doctorsList = res.data.doctors || [];
      const myDoctor = doctorsList.find(
        (doc) => doc.userId?._id === user?.userId || doc.userId === user?.userId
      );

      if (myDoctor) {
        setProfile(myDoctor);
        setSlots(myDoctor.availableSlots || []);
      } else {
        // Handle case where doctor profile isn't created yet
        setProfile(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your specific profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

const handleCreateProfile = async (e) => {
  e.preventDefault();
    if (!user || !user.userId) {
    toast.error("User session not found. Please log in again.");
    return;
  }

  try {
    const payload = {
      userId: user.userId, 
      specialization: formData.specialization,
      experience: Number(formData.experience), 
      fees: Number(formData.fees),             
      availableSlots: []
    };

    const res = await api.post("/doctors/create", payload);

    if (res.data.success) {
      toast.success("Professional profile created!");
      await fetchProfile(); 
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Creation failed";
    toast.error(errorMsg);
    console.error("Profile Creation Error:", error.response?.data);
  }
};

  const addSlot = () => {
    if (!newSlot) return;
    if (slots.includes(newSlot)) {
      toast.warning("This slot already exists");
      return;
    }
    setSlots([...slots, newSlot]);
    setNewSlot("");
  };

  const removeSlot = (slotToRemove) => {
    setSlots(slots.filter((s) => s !== slotToRemove));
  };

  const saveSlots = async () => {
    try {
      await api.put("/doctors/availability", { availableSlots: slots });
      toast.success("Availability updated successfully");
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Doctor Profile</h1>
          <p className="text-slate-500">
            {profile ? "Manage your public information and consultation hours." : "Complete your professional setup to start receiving patients."}
          </p>
        </div>

        {!profile ? (
          /* --- CREATE PROFILE SECTION (Shown if no profile exists) --- */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
            <div className="text-center mb-8">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Setup Professional Profile</h2>
              <p className="text-slate-500 text-sm">Fill in these details to appear in patient searches.</p>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-6">
              <div className="form-control">
                <label className="label font-bold text-slate-700">Specialization</label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Cardiologist, Dermatologist"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label font-bold text-slate-700">Experience (Years)</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className="input input-bordered w-full pl-12 rounded-xl"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label font-bold text-slate-700">Consultation Fee (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      className="input input-bordered w-full pl-12 rounded-xl"
                      value={formData.fees}
                      onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 mt-4">
                Create Professional Profile
              </button>
            </form>
          </div>
        ) : (
          /* --- EXISTING PROFILE SECTION --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: PROFILE SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col items-center text-center">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-primary text-white rounded-2xl w-24 shadow-lg shadow-primary/20">
                      <UserIcon size={40} />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Dr. {profile?.userId?.name}</h2>
                  <div className="badge badge-primary badge-outline mt-2 font-medium capitalize">
                    {profile?.specialization}
                  </div>
                </div>

                <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Briefcase size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{profile?.experience} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <IndianRupee size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">₹{profile?.fees} Consultation Fee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: AVAILABILITY MANAGEMENT */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="text-primary" />
                  <h2 className="text-xl font-bold text-slate-800">Manage Availability</h2>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Add New Time Slot</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="input input-bordered w-full rounded-xl"
                      placeholder="e.g. 09:00 AM - 10:00 AM"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-xl px-6 gap-2" onClick={addSlot}>
                      <Plus size={18} /> Add
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 px-1">Current Active Slots</h3>
                  {slots.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-10 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                      No slots added yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {slots.map((slot, index) => (
                        <div key={index} className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl">
                          <span className="text-sm font-semibold text-slate-700">{slot}</span>
                          <button className="btn btn-ghost btn-xs text-slate-400 hover:text-error" onClick={() => removeSlot(slot)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button className="btn btn-primary w-full h-14 rounded-2xl text-lg font-bold gap-2" onClick={saveSlots}>
                    <Save size={20} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DoctorProfile;