import { useContext } from "react";
import PropTypes from "prop-types";
import "./PlaceCard.css";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../../context/BookingContext";
import { UserContext } from "../../context/UserContext";
import { API_URL } from "../../constant";

const PlaceCard = ({ place }) => {
  const navigate = useNavigate();
  const { updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);

  const handleClick = () => {
    updateBooking({ place: place._id });
    updateUser({
      location: place.placeName.trim().split(" ").pop(),
    });
    navigate("/hotels");
  };

  // ✅ Clean image handling
  const placeImage =
    place.placeImage?.startsWith("http")
      ? place.placeImage
      : `${API_URL.replace("/api/v1", "")}/${place.placeImage}`;

  return (
    <div className="placecard-box">
      <div className="placecard-image-wrapper">
        <img
          src={placeImage}
          alt={place.placeName}
          loading="lazy"
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      <div className="placecard-content">
        <h3 className="placecard-title">{place.placeName}</h3>

        <p className="placecard-duration">{place.tripDuration}</p>

        <div className="placecard-footer">
          <div className="placecard-price">
            <span className="price-label">Starts from</span>
            <span className="price-value">${place.price}/person</span>
          </div>

          <button className="placecard-btn" onClick={handleClick}>
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

PlaceCard.propTypes = {
  place: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    placeImage: PropTypes.string.isRequired,
    placeName: PropTypes.string.isRequired,
    tripDuration: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default PlaceCard;