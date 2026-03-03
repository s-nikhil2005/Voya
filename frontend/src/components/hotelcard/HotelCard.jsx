import React, { useContext } from "react";
import "./HotelCard.css";
import { IoStarSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { BsCupHotFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // ✅ FIXED
import { BookingContext } from "../../context/BookingContext";
import { UserContext } from "../../context/UserContext";

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const { updateBooking } = useContext(BookingContext);
  const { user } = useContext(UserContext);

  if (!hotel) return null;

  const handleClick = () => {
    updateBooking({ hotel: hotel._id });
    navigate("/flights");
  };

  const stars = Number(hotel.hotelStars) || 0;

  return (
    <div className="hotelCard-container">
      {/* LEFT IMAGE */}
      <div className="hotelCard-left">
        <img
          src={hotel.hotelImage}
          alt={hotel.hotelName}
          width="300"
          height="300"
        />
      </div>

      {/* MIDDLE */}
      <div className="hotelCard-mid">
        <div className="hotelCard-mid__header">
          <div className="hotelCard-mid__ratingBox">
            <div className="Box__flex">
              <div className="ratingBox__stars">
                {[...Array(stars)].map((_, i) => (
                  <IoStarSharp key={i} />
                ))}
              </div>
              <div className="ratingBox__tag">RESORT</div>
            </div>

            <div className="Box__flex">
              <span className="ratingBox__hotelRating">
                {hotel.hotelRating}
              </span>
              <span>{hotel.reviewRating} Ratings</span>
            </div>
          </div>

          <div className="hotelCard-mid__hotelDetails">
            <h3>{hotel.hotelName}</h3>
            <p className="Box__flex">
              <FaLocationDot />
              <span>{user?.location}</span>
            </p>
            <p>{hotel.hotelLocation}</p>
          </div>
        </div>

        <div className="hotelCard-mid__hotelDescription">
          <p>{hotel.hotelDescription}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hotelCard-right">
        <span className="hotelCard-right__price">
          $ {hotel.hotelPrice}
        </span>
        <p className="hotelCard-right__tax">
          + $ {hotel.hotelTax} TAXES & FEES
        </p>
        <p className="hotelCard-right__perNight">
          1 room per night
        </p>
        <p className="hotelCard-right__breakfast">
          <BsCupHotFill />
          INCL OF FREE BREAKFAST
        </p>

        <button
          className="hotelCard-right__BookBTN"
          onClick={handleClick}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default HotelCard;