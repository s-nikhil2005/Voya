
import "./Footer.css";
import { FaFacebookSquare, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();

    if (window.location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 300);
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">

        {/* Left Column */}
        <div className="footer-brand">
          <h2
            className="footer-logo"
            onClick={(e) => handleNavigation(e, "hero")}
          >
            Voya
          </h2>
          <p className="footer-tagline">
            Your journey, your story — explore beyond the horizon.
          </p>

          <div className="footer-socials">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/in/nikhil-singh-580845284/" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              <FaFacebookSquare />
            </a>
          </div>
        </div>

        {/* Middle Column */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={(e) => handleNavigation(e, "destinations")}>Destinations</li>
            <li onClick={(e) => handleNavigation(e, "flights")}>Flights</li>
            <li onClick={(e) => handleNavigation(e, "holidays")}>Holidays</li>
            <li onClick={(e) => handleNavigation(e, "contact")}>Contact</li>
          </ul>
        </div>

        {/* Right Column */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: support@cloudtrip.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Mumbai, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Voya. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;