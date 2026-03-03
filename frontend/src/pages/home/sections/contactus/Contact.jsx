import  { useState } from "react";
import axios from "axios";
import "./Contact.css";

import { useLoading } from "../../../../context/LoadingContext";
import { MdEmail } from "react-icons/md";
import { SiGooglemessages } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";
import { API_URL } from "../../../../constant";
import { useToast } from "../../../../context/ToastContext";

const Contact = () => {
  const { startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  /* ============================= */
  /* Validation Functions          */
  /* ============================= */

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address";
        return "";

      case "mobile":
        if (!value) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(value))
          return "Enter valid 10-digit Indian mobile number (starts with 6-9)";
        return "";

      case "message":
        if (!value) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        if (value.trim().length > 500)
          return "Message cannot exceed 500 characters";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  /* ============================= */
  /* Input Handler                 */
  /* ============================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      // Remove non-digits and limit to 10
      const cleanedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, mobile: cleanedValue });

      setErrors({
        ...errors,
        mobile: validateField("mobile", cleanedValue),
      });
    } else {
      setFormData({ ...formData, [name]: value });

      setErrors({
        ...errors,
        [name]: validateField(name, value),
      });
    }
  };

  /* ============================= */
  /* Submit                        */
  /* ============================= */

  const handleSend = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    startLoading();

    try {
      const response = await axios.post(`${API_URL}/messages/`, formData);

      if (response.status === 200 || response.data.status === "success") {
        showToast({ type: "success", message: "Message sent successfully!" });
        setFormData({ email: "", mobile: "", message: "" });
        setErrors({});
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Failed to send message",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      stopLoading();
    }
  };

  const isFormValid =
    Object.values(errors).every((error) => !error) &&
    Object.values(formData).every((value) => value);

  /* ============================= */
  /* JSX                           */
  /* ============================= */

  return (
    <section className="contact-container">
      <div className="contact-banner"></div>

      <div className="contact-container-header">
        <span>Let’s Plan Something Amazing Together</span>
        <span>
          Have questions or ideas? Our travel team is just a message away —
          ready to help you turn your dream trip into reality.
        </span>
      </div>

      <form className="contact-form" onSubmit={handleSend} noValidate>
        <div className="contact-form__flex">
          {/* Email */}
          <div className="contact-form__inputGroup">
            <MdEmail className="contact-form__icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="contact-form__input"
            />
          </div>
          {errors.email && <small className="error-text">{errors.email}</small>}

          {/* Mobile */}
          <div className="contact-form__inputGroup">
            <FaPhoneAlt className="contact-form__icon" />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
              className="contact-form__input"
              maxLength={10}
              inputMode="numeric"
            />
          </div>
          {errors.mobile && (
            <small className="error-text">{errors.mobile}</small>
          )}
        </div>

        {/* Message */}
        <div className="contact-form__inputGroup contact-form__textareaGroup">
          <SiGooglemessages className="contact-form__icon contact-form__textareaIcon" />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleInputChange}
            className="contact-form__input contact-form__textarea"
          ></textarea>
        </div>
        {errors.message && (
          <small className="error-text">{errors.message}</small>
        )}

        <button
          type="submit"
          className="contact-sendBtn"
          disabled={!isFormValid}
          style={{ opacity: !isFormValid ? 0.6 : 1 }}
        >
          Send
        </button>
      </form>
    </section>
  );
};

export default Contact;