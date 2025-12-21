<!-- Frontend Folder Structure -->
frontend/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance (baseURL, cookies)
│   │
│   ├── assets/
│   │   └── images/               # Logos, illustrations (optional)
│   │
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation
│   │   ├── Footer.jsx            # Footer (optional)
│   │   ├── DoctorCard.jsx        # Doctor display card
│   │   ├── Loader.jsx            # Loading spinner
│   │   └── ProtectedRoute.jsx    # Route guard
│   │
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state
│   │
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Signup.jsx            # Signup (patient / doctor)
│   │   ├── ForgotPassword.jsx    # Email → OTP
│   │   ├── ResetPassword.jsx     # OTP → new password
│   │   ├── Dashboard.jsx         # Common dashboard wrapper
│   │   │
│   │   ├── patient/
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   └── MyAppointments.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── DoctorProfile.jsx
│   │   │   └── DoctorAppointments.jsx
│   │   │
│   │   └── admin/
│   │       └── AdminDashboard.jsx   # Optional (bonus)
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx          # Centralized routes
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── vite.config.js


<!-- Backend Folder Structure -->