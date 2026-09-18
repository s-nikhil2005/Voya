import { useContext, useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import "./PlaceCard.css";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../../context/BookingContext";
import { UserContext } from "../../context/UserContext";
import { API_URL } from "../../constant";
import { IoImageOutline } from "react-icons/io5";
import { getOptimizedImageUrl } from "../../utils/imageUtils";

const PlaceCard = ({ place, priority = false }) => {
  const navigate = useNavigate();
  const { updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const handleClick = () => {
    updateBooking({ place: place._id });
    updateUser({
      location: place.placeName.trim().split(" ").pop(),
    });
    navigate("/hotels");
  };

  // ✅ Optimized frontend image URL construction (idempotent, original DB intact)
  const rawImage =
    place.placeImage?.startsWith("http")
      ? place.placeImage
      : `${API_URL.replace("/api/v1", "")}/${place.placeImage}`;
  const placeImage = getOptimizedImageUrl(rawImage, 600, 80);

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

  useEffect(() => {
    if (imgRef.current) {
      checkImageLoaded(imgRef.current);
    }
  }, [placeImage, checkImageLoaded]);

  const handleLoad = () => {
    setImageLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setImageLoaded(true);
  };

  return (
    <div className="placecard-box">
      <div className="placecard-image-wrapper">
        {/* Shimmer Skeleton Placeholder only while image is loading and not errored */}
        {!imageLoaded && !hasError && (
          <div className="placecard-image-skeleton"></div>
        )}

        {/* Fallback UI if image fails to load */}
        {hasError && (
          <div className="placecard-image-fallback">
            <IoImageOutline className="placecard-fallback-icon" />
            <span className="placecard-fallback-text">{place.placeName}</span>
          </div>
        )}

        <img
          ref={handleImgRef}
          src={placeImage}
          alt={place.placeName}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          className={`placecard-img ${imageLoaded && !hasError ? "placecard-img--loaded" : "placecard-img--loading"}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: hasError ? "none" : undefined }}
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
  priority: PropTypes.bool,
};

export default PlaceCard;