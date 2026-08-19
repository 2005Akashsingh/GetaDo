const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const registerSignalingHandlers = require("./signalingHandler");
const registerTranscriptHandlers = require("./transcriptHandler");

function getTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="));
  return match ? decodeURIComponent(match.slice("token=".length)) : null;
}

function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: /^http:\/\/localhost:\d+$/,
      credentials: true,
    },
  });

  // Authenticate every socket connection off the same JWT cookie used by the REST API
  io.use(async (socket, next) => {
    try {
      const token = getTokenFromCookieHeader(socket.handshake.headers.cookie);
      if (!token) return next(new Error("Not authenticated"));

      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(decoded.userId).select("name email role");
      if (!user) return next(new Error("User no longer exists"));

      socket.user = {
        userId: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      };
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    registerSignalingHandlers(io, socket);
    registerTranscriptHandlers(io, socket);
  });

  return io;
}

module.exports = initSockets;
