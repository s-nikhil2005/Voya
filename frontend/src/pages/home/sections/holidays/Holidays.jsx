import { useContext, useState } from "react";
import "./Holidays.css";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router";
import { BookingContext } from "../../../../context/BookingContext";
import { UserContext } from "../../../../context/UserContext";
import { useInView } from "react-intersection-observer";

const Holidays = () => {
  const { places } = useContext(DataContext);
  const { updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const isLoading = !places || places.length === 0;

  return (
    <section className="holidays-container">
      <div className="holidays-container-header">
        <h2>Find Popular Destinations</h2>
        <p>
          Escape the ordinary and explore the extraordinary with our
          handpicked selection of destinations and travel deals.
          Create the trip of your dreams.
        </p>
      </div>{" "}
      <button
        className="holidays-exploreBtn"
        onClick={() => {
          navigate("/destinations");
        }}
      >
        Explore More
      </button>

      <div className="holidays-container__parent">
        {isLoading
          ? // Render 4 placeholders while loading
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="holidays-placeholder">
                <div className="holidays-placeholder__image" />
                <div className="holidays-placeholder__text1" />
                <div className="holidays-placeholder__text2" />
                <div className="holidays-placeholder__flex">
                  <div className="holidays-placeholder__text3" />
                  <div className="holidays-placeholder__text3" />
                </div>
              </div>
            ))
          : // Render actual 4 places once loaded
            places.slice(0, 4).map((place, index) => (
              <HolidayCard
                key={place._id}
                place={place}
                priority={index < 4}
                onBook={() => {
                  updateBooking({
                    place: place._id,
                  });
                  updateUser({
                    location: place.placeName.trim().split(" ").pop(),
                  });
                  navigate("/hotels");
                }}
              />
            ))}
      </div>
    </section>
  );
};

// Subcomponent for individual holiday card with zero layout shift & smooth image loading
const HolidayCard = ({ place, priority, onBook }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, inView } = useInView({
    rootMargin: "600px 0px",
    triggerOnce: true,
  });

  const shouldLoadImage = priority || inView;

  return (
    <div ref={ref} className="holidays-box">
      <div className="holidays-box__image-wrapper">
        {!imageLoaded && <div className="holidays-box__image-skeleton" />}
        {shouldLoadImage && (
          <img
            src={place.placeImage}
            alt={place.placeName}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={`holidays-box__img ${imageLoaded ? "holidays-box__img--loaded" : "holidays-box__img--loading"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        )}
      </div>

      <div className="holidays-box__info">
        <span className="holidays-box__title">{place.placeName}</span>
        <span className="holidays-box__duration">{place.tripDuration}</span>

        <div className="holidays-box_price">
          <div className="holidays-box_priceTag">
            <span>Starts from</span>
            <span>${place.price}/person</span>
          </div>
          <button onClick={onBook}>Book</button>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
