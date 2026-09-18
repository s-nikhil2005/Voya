import React, { useContext, useEffect, useState } from "react";
import "./FlightCard.css";
import { ImSpoonKnife } from "react-icons/im";
import { IoAirplane } from "react-icons/io5";
import { useNavigate } from "react-router";
import { BookingContext } from "../../context/BookingContext";
import { UserContext } from "../../context/UserContext";

import airplaneBg from "../../assets/images/home/airplane.webp";
import travelBg from "../../assets/images/home/travel.webp";
import mountainBg from "../../assets/images/home/mountain.webp";

const getFlightBackground = (name = "") => {
  const lower = (name || "").toLowerCase();
  if (lower.includes("vistara")) return airplaneBg;
  if (lower.includes("air india")) return airplaneBg;
  if (lower.includes("singapore")) return travelBg;
  if (lower.includes("emirates")) return mountainBg;
  if (lower.includes("indigo")) return airplaneBg;
  if (lower.includes("spicejet")) return travelBg;
  if (lower.includes("qatar")) return mountainBg;
  if (lower.includes("lufthansa")) return mountainBg;
  if (lower.includes("british")) return airplaneBg;
  if (lower.includes("etihad")) return travelBg;
  return airplaneBg;
};

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();
  // If logo is missing or from 1000logos.net (which returns 404/hangs for 6s), immediately use fallback badge
  const isKnownBroken =
    !flight?.flightLogo || flight.flightLogo.includes("1000logos.net");
  const [logoError, setLogoError] = useState(isKnownBroken);

  const handleBookNow = () => {
    updateBooking({ flight: flight._id });
    navigate("/register");
  };

  const { updateBooking } = useContext(BookingContext);
  const { user } = useContext(UserContext);

  const bgImage = getFlightBackground(flight?.flightName);

  return (
    <div
      className="flightContianer"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(21, 31, 61, 0.88) 0%, rgba(26, 39, 76, 0.93) 100%), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="section1">
        <div className="sectionLeft">
          <button className="deal">DEAL</button>
          <p>
            Christmas Day Sale is live, Flat 14% Off (up to Rs. 2,017) on using
            American Express Cards and RBL Bank Credit Cards. TnC apply
          </p>
        </div>
      </div>
      <div className="section2">
        <div className="devider1">
          <div className="flightDetails">
            <div className="flightLogo">
              {logoError ? (
                <div className="flightLogo-fallback" title={flight.flightName}>
                  <IoAirplane className="flightLogo-fallback-icon" />
                </div>
              ) : (
                <img
                  src={flight.flightLogo}
                  alt={flight.flightName || "flight logo"}
                  decoding="async"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
            <div className="flightName">
              <p>{flight.flightName}</p>
              <p>{flight.flightNumber}</p>
            </div>
          </div>
          <div className="timeSection">
            <div className="timeBox">
              <p>{flight.departureTime}</p>
              <p>{flight.departureDestination}</p>
            </div>
            <div className="line"></div>
            <div className="timeBox">
              <p>{flight.arrivalTime}</p>
              {/* <p>{country}</p> */}
              <p>{user.location}</p>
            </div>
          </div>
        </div>
        <div className="devider2">
          <div className="totalTime">
            <p>{flight.totalTime}</p>
            <p>Non Stop</p>
          </div>
          <div className="flightPrice">
            <p>$ {flight.flightPrice}</p>
            <button
              className="flightBookNowBtn"
              onClick={() => {
                handleBookNow(flight);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      <div className="section3">
        <div>
          <select>
            <option>Flight Details</option>
          </select>
        </div>
        <div className="flightFooter">
          <div className="mealSection">
            <ImSpoonKnife />
            <p>Free Meal</p>
          </div>
          <div className="emissions">
            <p>Emissions: 142 Kg CO2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
