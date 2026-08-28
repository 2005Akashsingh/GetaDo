<div id="top" align="center">
  <h1>GETADOC</h1>
  <p><em>Transforming Healthcare, Empowering Every Patient Journey</em></p>

  <img alt="last-commit" src="https://img.shields.io/github/last-commit/Utkarshsingh4147/GetaDoc?style=for-the-badge&logo=git&logoColor=white&color=0080ff">
  <img alt="repo-top-language" src="https://img.shields.io/github/languages/top/Utkarshsingh4147/GetaDoc?style=for-the-badge&color=0080ff">
  <img alt="repo-language-count" src="https://img.shields.io/github/languages/count/Utkarshsingh4147/GetaDoc?style=for-the-badge&color=0080ff">

  <p align="center"><em>Built with the MERN Stack:</em></p>

  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  
  <br>

  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-F04D35?style=for-the-badge&logo=mongoose&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="DaisyUI" src="https://img.shields.io/badge/DaisyUI-1AD1A5?style=for-the-badge&logo=daisyui&logoColor=white">
  <img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
  <img alt=".ENV" src="https://img.shields.io/badge/.ENV-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black">
</div>

<hr />

<h2>📖 Table of Contents</h2>
<ul>
  <li><a href="#overview">Overview</a></li>
  <li><a href="#key-features">Key Features</a></li>
  <li><a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </li>
  <li><a href="#usage">Usage</a></li>
</ul>

<hr />

<h2 id="overview">🔍 Overview</h2>
<p>
  GetaDoc is a comprehensive <strong>MERN Stack</strong> healthcare platform. It is designed to modernize the patient-doctor experience through automated scheduling, secure medical data handling, and real-time management tools. By utilizing a modular architecture, the platform ensures that both the frontend and backend are scalable and easy to maintain.
</p>

<hr />

<h2 id="key-features">✨ Key Features</h2>
<ul>
  <li>🛡️ <strong>Secure Authentication:</strong> JWT-based login, email OTP verification at signup, and OTP-based password reset.</li>
  <li>🔐 <strong>Role-Based Access:</strong> Enforced both server-side and in the frontend routing for Patients, Doctors, and Admins.</li>
  <li>📅 <strong>Smart Scheduling:</strong> Book, reschedule, or cancel appointments with instant status updates.</li>
  <li>🧑‍⚕️ <strong>Doctor Management:</strong> Specialized profiles for doctors including availability slots and expertise.</li>
  <li>💳 <strong>Payments:</strong> Razorpay checkout on booking; appointments can't be approved until payment is confirmed.</li>
  <li>🎥 <strong>Video Consultations:</strong> Peer-to-peer WebRTC calls between doctor and patient (Socket.IO signaling), with a live transcript panel captured via the browser's speech recognition.</li>
  <li>🎨 <strong>Responsive UI:</strong> A clean, modern dashboard built with React and styled with DaisyUI/Tailwind.</li>
</ul>

<hr />

<h2 id="getting-started">🚀 Getting Started</h2>

<h3 id="prerequisites">Prerequisites</h3>
<p>To run this project locally, you must have the following installed:</p>
<ul>
  <li><strong>MongoDB:</strong> A local instance or a <a href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a> cloud account.</li>
  <li><strong>Node.js:</strong> JavaScript runtime (v16+ required).</li>
  <li><strong>npm:</strong> Package manager for installing dependencies.</li>
</ul>

<h3 id="installation">Installation</h3>
<ol>
  <li>
    <strong>Clone the repository:</strong>
    <pre><code>git clone https://github.com/Utkarshsingh4147/GetaDoc.git</code></pre>
  </li>
  <li>
    <strong>Install Backend Dependencies:</strong>
    <pre><code>cd backend
npm install</code></pre>
  </li>
  <li>
    <strong>Install Frontend Dependencies:</strong>
    <pre><code>cd ../frontend
npm install</code></pre>
  </li>
  <li>
    <strong>Set up Environment Variables:</strong>
    <p>Create a <code>.env</code> file in the <code>/backend</code> directory. <code>PORT</code>, <code>MONGO_URL</code>, and <code>JWT_SECRET</code> are required; everything else is optional in development (the app logs a warning and degrades gracefully - OTP codes are printed to the server console, Razorpay falls back to non-functional mock keys) but required for that feature to actually work.</p>
<pre><code>PORT=8000
MONGO_URL='your_mongodb_connection_string'
JWT_SECRET='your_jwt_secret'
NODE_ENV='development'

# Required for OTP emails (signup verification, password reset) to actually send.
# Example: a Gmail address with a generated App Password (myaccount.google.com/apppasswords).
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER='your_email@example.com'
SMTP_PASS='your_app_password'
SMTP_FROM='GetADoc <your_email@example.com>'

# Required for real payment checkout (Razorpay Test Mode keys).
RAZORPAY_KEY_ID='rzp_test_...'
RAZORPAY_KEY_SECRET='...'

# Required for AI-generated consultation notes (Google AI Studio).
GEMINI_API_KEY='...'</code></pre>
  </li>
</ol>

<hr />

<h2 id="usage">💡 Usage</h2>
<p>To run the application, open two separate terminals:</p>

<p><strong>Terminal 1 (Backend):</strong></p>
<pre><code>cd backend
npm start</code></pre>

<p><strong>Terminal 2 (Frontend):</strong></p>
<pre><code>cd frontend
npm run dev</code></pre>

<hr />

<div align="left">
  <a href="#top">⬆ Return to Top</a>
</div>
