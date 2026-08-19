const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const initSockets = require('./src/sockets');

const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const doctorAuthRoutes = require("./src/routes/doctorAuthRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const consultationRoutes = require("./src/routes/consultationRoutes");


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: /^http:\/\/localhost:\d+$/,
    credentials: true,               // allow cookies
  })
);

//connect DB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor", doctorAuthRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/consultations", consultationRoutes);

app.get('/', (req, res) => {
  res.send({ success: true, message: "Welcome to Getadoc" });
})

const httpServer = http.createServer(app);
initSockets(httpServer);

httpServer.listen(env.port, () => {
  console.log("App running on the port", env.port);
});
