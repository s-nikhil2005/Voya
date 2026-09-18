import { useContext, useState, useRef, useCallback, useEffect } from "react";
import "./Holidays.css";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router";
import { BookingContext } from "../../../../context/BookingContext";
import { UserContext } from "../../../../context/UserContext";
import { IoImageOutline } from "react-icons/io5";
import { getOptimizedImageUrl } from "../../../../utils/imageUtils";

const Holidays = () => {
  const { places } = useContext(DataContext);
  const { updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const isLoading = !places || places.length === 0;

  return (
    <section   id="popular-destinations" className="holidays-container">
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
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const checkImageLoaded = useCallback((node) => {
    if (!node) return;

    // 1. Instant check: naturalWidth > 0 means image bytes are available
    if (node.naturalWidth > 0) {
      setImageLoaded(true);
      setHasError(false);
      return;
    }

    // 2. Check complete flag
    if (node.complete) {
      if (node.naturalWidth > 0) {
        setImageLoaded(true);
        setHasError(false);
      } else if (node.src) {
        setHasError(true);
        setImageLoaded(true);
      }
      return;
    }

    // 3. Fast decode() check for cached images
    if (typeof node.decode === "function") {
      node
        .decode()
        .then(() => {
          if (node.naturalWidth > 0) {
            setImageLoaded(true);
            setHasError(false);
          }
        })
        .catch(() => {
          if (node.complete && node.naturalWidth === 0) {
            setHasError(true);
            setImageLoaded(true);
          }
        });
    }
  }, []);

  const handleImgRef = useCallback(
    (node) => {
      imgRef.current = node;
      if (!node) return;

      checkImageLoaded(node);

      // Also attach native listeners directly to catch events outside React's synthetic lifecycle
      const onNativeLoad = () => {
        setImageLoaded(true);
        setHasError(false);
      };
      const onNativeError = () => {
        setHasError(true);
        setImageLoaded(true);
      };

      node.addEventListener("load", onNativeLoad, { once: true });
      node.addEventListener("error", onNativeError, { once: true });
    },
    [checkImageLoaded]
  );

  const holidayImage = getOptimizedImageUrl(place.placeImage, 600, 80);

  useEffect(() => {
    if (imgRef.current) {
      checkImageLoaded(imgRef.current);
    }
  }, [holidayImage, checkImageLoaded]);

  const handleLoad = () => {
    setImageLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setImageLoaded(true);
  };

  return (
    <div className="holidays-box">
      <div className="holidays-box__image-wrapper">
        {!imageLoaded && !hasError && (
          <div className="holidays-box__image-skeleton" />
        )}
        {hasError && (
          <div className="holidays-box__image-fallback">
            <IoImageOutline className="holidays-box__fallback-icon" />
            <span className="holidays-box__fallback-text">{place.placeName}</span>
          </div>
        )}
        <img
          ref={handleImgRef}
          src={holidayImage}
          alt={place.placeName}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          className={`holidays-box__img ${imageLoaded && !hasError ? "holidays-box__img--loaded" : "holidays-box__img--loading"}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: hasError ? "none" : undefined }}
        />
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
