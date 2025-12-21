import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Faq from "../components/Faq";

const LandingPage = () => {
  return (
    <div className="bg-base-100">
      {/* ================= NAVBAR ================= */}
      <div className="navbar bg-base-100 shadow-sm px-6">
        <div className="flex-1 text-2xl font-bold text-primary flex items-center gap-2 cursor-pointer">
          <Link to="/" className="flex items-center gap-2 group transition-all">
            <div className="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold shadow-md shadow-primary/40 group-hover:rotate-12 transition-transform">
            G
          </div>
          <span className="text-xl font-extrabold tracking-tight hidden sm:block">
            Geta<span className="text-primary">Doc</span>
          </span>
          </Link>
        </div>

        <div className="flex gap-3">
          <Link to="/login" className="btn btn-ghost btn-sm">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Patient Signup
          </Link>
          <Link to="/doctor/signup" className="btn btn-outline btn-sm">
            Join as Doctor
          </Link>
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="hero min-h-[80vh] bg-base-200 px-6">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <img
            src="https://images.unsplash.com/photo-1758691463569-66de91d76452?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVkaWNhbCUyMGV4cGVydGlzZXxlbnwwfHwwfHx8MA%3D%3D"
            className="max-w-lg rounded-lg shadow-xl"
            alt="Doctor consultation"
          />

          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Book Doctor Appointments <br /> Anytime, Anywhere
            </h1>
            <p className="py-6 text-gray-600 max-w-xl">
              GetaDoc is a smart healthcare appointment platform that connects
              patients with verified doctors, simplifies scheduling, and gives
              admins complete system control.
            </p>

            <div className="flex gap-4">
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/doctor/signup" className="btn btn-outline">
                Join as Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose GetaDoc?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Easy Booking */}
          <div className="card bg-base-200 shadow-xl overflow-hidden">
            <figure className="h-48">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                alt="Easy Booking"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold">Easy Booking</h3>
              <p className="text-sm text-gray-600">
                Patients can easily book appointments with doctors based on
                availability.
              </p>
            </div>
          </div>

          {/* Doctor Management */}
          <div className="card bg-base-200 shadow-xl overflow-hidden">
            <figure className="h-48">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                alt="Doctor Management"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold">Doctor Management</h3>
              <p className="text-sm text-gray-600">
                Doctors manage availability, approve appointments, and track
                schedules.
              </p>
            </div>
          </div>

          {/* Admin Control */}
          <div className="card bg-base-200 shadow-xl overflow-hidden">
            <figure className="h-48">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                alt="Admin Control"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold">Admin Control</h3>
              <p className="text-sm text-gray-600">
                Admins monitor users, doctors, and appointments from a single
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DOCTOR SECTION ================= */}
      <section className="bg-base-200 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1600959907703-125ba1374a12"
            className="rounded-lg shadow-lg"
            alt="Doctor team"
          />

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Built for Doctors
            </h2>
            <p className="text-gray-600 mb-6">
              GetaDoc helps doctors manage their time efficiently. Set your
              availability, approve or reject appointments, and focus on what
              truly matters — patient care.
            </p>
            <Link to="/doctor/signup" className="btn btn-primary">
              Become a Doctor on GetaDoc
            </Link>
          </div>
        </div>
      </section>
      
      {/* ================= CTA ================= */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Healthcare, Simplified
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Whether you are a patient looking for trusted doctors or a healthcare
          professional wanting better appointment management, GetaDoc is built
          for you.
        </p>
        <Link to="/signup" className="btn btn-primary btn-lg">
          Start Now
        </Link>
      </section>
      <hr />

      {/* FAQ */}
      <Faq/>

      {/* ================= FOOTER ================= */}
      <Footer/>
    </div>
  );
};

export default LandingPage;
