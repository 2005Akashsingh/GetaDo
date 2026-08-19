const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: Number(env.smtp.port) || 587,
  secure: Number(env.smtp.port) === 465,
  auth:
    env.smtp.user && env.smtp.pass
      ? { user: env.smtp.user, pass: env.smtp.pass }
      : undefined,
});

module.exports = transporter;
