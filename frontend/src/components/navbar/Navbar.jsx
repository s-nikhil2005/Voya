import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (isHome) {
      scrollToSection();
    } else {
      navigate("/");
      setTimeout(scrollToSection, 300);
    }

    setMenuOpen(false);
  };

  return (
    <nav
      className={`navbar-container 
        ${(isHome && scrolled) || !isHome ? "navbar-scrolled" : ""}
      `}
    >
      <div
        className="navbar-logo"
        onClick={(e) => handleNavigation(e, "hero")}
      >
        Voya
      </div>

      <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
        <a href="#hero" onClick={(e) => handleNavigation(e, "hero")}>
          Home
        </a>
        <a href="#aboutus" onClick={(e) => handleNavigation(e, "aboutus")}>
          About Us
        </a>
        <a href="#hotels" onClick={(e) => handleNavigation(e, "hotels")}>
          Hotels
        </a>
        <a href="#flights" onClick={(e) => handleNavigation(e, "flights")}>
          Flights
        </a>
        <a href="#holidays" onClick={(e) => handleNavigation(e, "holidays")}>
          Holidays
        </a>
        <a href="#contactus" onClick={(e) => handleNavigation(e, "contactus")}>
          Contact Us
        </a>
      </div>

      <div
        className={`navbar-hamburger ${menuOpen ? "is-active" : ""}`}
        onClick={toggleMenu}
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;