require("dotenv").config();

const requiredEnvVars = ["MONGO_URL", "JWT_SECRET"];

const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
  process.exit(1);
}

const optionalEnvVars = {
  RAZORPAY_KEY_ID: "Razorpay payments will use mock test credentials",
  RAZORPAY_KEY_SECRET: "Razorpay payments will use mock test credentials",
  SMTP_HOST: "OTP/verification emails will fail to send",
  SMTP_PORT: "OTP/verification emails will fail to send",
  SMTP_USER: "OTP/verification emails will fail to send",
  SMTP_PASS: "OTP/verification emails will fail to send",
  GEMINI_API_KEY: "AI consultation notes will be unavailable",
};

Object.entries(optionalEnvVars).forEach(([key, warning]) => {
  if (!process.env[key]) {
    console.warn(`[env] ${key} not set — ${warning}`);
  }
});

module.exports = {
  port: process.env.PORT || 8000,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_123mock456id",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "mock_secret_abc123",
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};
