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



[Image of MERN stack architecture diagram]


<hr />

<h2 id="key-features">✨ Key Features</h2>
<ul>
  <li>🛡️ <strong>Secure Authentication:</strong> JWT-based login and role-based access for Patients, Doctors, and Admins.</li>
  <li>📅 <strong>Smart Scheduling:</strong> Book, reschedule, or cancel appointments with instant status updates.</li>
  <li>🧑‍⚕️ <strong>Doctor Management:</strong> Specialized profiles for doctors including availability slots and expertise.</li>
  <li>📧 <strong>Notification System:</strong> Automated email alerts for appointment confirmations and reminders.</li>
  <li>🎨 <strong>Responsive UI:</strong> A clean, modern dashboard built with React and styled with DaisyUI/Tailwind.</li>
</ul>

<hr />

<h2 id="getting-started">🚀 Getting Started</h2>

<h3 id="prerequisites">Prerequisites</h3>
<p>To run this project locally, you must have the following installed:</p>
<ul>
  <li><strong>MongoDB:</strong> A local instance or a <a href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a> cloud account.</li>
  <li><strong>Express:</strong> Web framework for Node.js.</li>
  <li><strong>React:</strong> Frontend library (Node.js v16+ required).</li>
  <li><strong>Node.js:</strong> JavaScript runtime for the backend.</li>
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
    <pre><code>cd backend <br> npm install</code></pre>
  </li>
  <li>
    <strong>Install Frontend Dependencies:</strong>
    <pre><code>cd frontend <br> npm install</code></pre>
  </li>
  <li>
    <strong>Set up Environment Variables:</strong>
    <p>Create a <code>.env</code> file in the <code>/backend</code> directory and add your MongoDB URI and JWT Secret and SMTP username and password and a sender Email.</p>
    <code>
      PORT=8000
      MONGO_URL='mongodb+srv://<username>:<password>@clustername.23gvics.mongodb.net/doctor_app'
      JWT_SECRET='yourjwtsecret'
      NODE_ENV='development'
      SMTP_USER='xyz123@smtp-brevo.com'
      SMTP_PASS='xsmtpsib-11111111111sample1111111111111'
      SENDER_EMAIL='xyz@gmail.com'
    </code>
  </li>
</ol>

<hr />

<h2 id="usage">💡 Usage</h2>
<p>To run the application, you will need to open two terminals:</p>

<p><strong>Terminal 1 (Backend):</strong></p>
<pre><code>cd backend && npm start</code></pre>

<p><strong>Terminal 2 (Frontend):</strong></p>
<pre><code>cd frontend && npm run dev</code></pre>

<hr />

<div align="left">
  <a href="#top">⬆ Return to Top</a>
</div>
