const transporter = require("../config/mailer");
const env = require("../config/env");

const OTP_EMAIL_CONTENT = {
  signup: {
    subject: "Verify your GetADoc account",
    heading: "Verify your email",
    message: "Use the code below to verify your GetADoc account. It expires in 10 minutes.",
  },
  reset: {
    subject: "Reset your GetADoc password",
    heading: "Reset your password",
    message: "Use the code below to reset your GetADoc password. It expires in 10 minutes.",
  },
};

exports.sendOtpEmail = async (to, code, purpose) => {
  const content = OTP_EMAIL_CONTENT[purpose] || OTP_EMAIL_CONTENT.signup;

  await transporter.sendMail({
    from: env.smtp.from || "GetADoc <no-reply@getadoc.local>",
    to,
    subject: content.subject,
    html: `
      <div style="font-family: sans-serif;">
        <h2>${content.heading}</h2>
        <p>${content.message}</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</p>
      </div>
    `,
  });
};
