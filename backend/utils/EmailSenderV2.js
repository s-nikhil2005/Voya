const { Resend } = require("resend");
const { RESEND_API_KEY, RESEND_FROM_EMAIL } = require("../constants");

let resendClient = null;

const getResendClient = () => {
  if (!resendClient && RESEND_API_KEY) {
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
};

/**
 * Sends an email using the Resend HTTPS API (V2 email provider).
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text body
 * @param {string} [html] - Optional HTML body
 * @returns {Promise<boolean>} - True if email sent successfully, false otherwise
 */
const sendEmailV2 = async (to, subject, text, html) => {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.error("Error sending email via V2: RESEND_API_KEY is not configured.");
      return false;
    }

    // Use configured verified sender or default testing identity
    const from = RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const payload = {
      from,
      to,
      subject,
      text,
    };

    if (html) {
      payload.html = html;
    } else if (text) {
      payload.html = `<div style="font-family: sans-serif; line-height: 1.5; color: #333;"><p>${text}</p></div>`;
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("Resend API error:", error.message || error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in sendEmailV2:", err.message || err);
    return false;
  }
};

module.exports = { sendEmailV2 };
