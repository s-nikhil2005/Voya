const nodemailer = require("nodemailer");
const { AUTH_MAIL_PASS, AUTH_MAIL_USER, EMAIL_PROVIDER } = require("../constants");
const { sendEmailV2 } = require("./EmailSenderV2");

// V1: Existing Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_MAIL_USER,
    pass: AUTH_MAIL_PASS,
  },
});

/**
 * V1: Send email via Nodemailer / Gmail SMTP
 */
const sendEmailV1 = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: AUTH_MAIL_USER,
      to,
      subject,
      text,
    };
    if (html) {
      mailOptions.html = html;
    }

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending email via V1 (Nodemailer):", err);
    return false;
  }
};

/**
 * Main sendEmail function with provider selection.
 * EMAIL_PROVIDER=v1 -> Nodemailer (Gmail)
 * EMAIL_PROVIDER=v2 -> Resend HTTPS API
 */
const sendEmail = async (to, subject, text, html) => {
  const provider = (EMAIL_PROVIDER || "v1").toLowerCase();

  if (provider === "v2") {
    return await sendEmailV2(to, subject, text, html);
  }

  // Default to V1 (existing Nodemailer implementation)
  return await sendEmailV1(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendEmailV1,
  sendEmailV2,
};
