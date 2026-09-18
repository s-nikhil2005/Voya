import { useContext, useEffect, useState } from "react";
import "./Destinations.css";
import InputBox from "../../components/inputbox/InputBox";
import PlaceCard from "../../components/placecard/PlaceCard";
import { DataContext } from "../../context/DataContext";

const Destinations = () => {
  const { places } = useContext(DataContext);
  const [query, setQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isLoading = !places || places.length === 0;

  const filteredPlaces = Array.isArray(places)
    ? places.filter((place) =>
        place.placeName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <section className="destinations-container">
      {/* HERO SECTION */}
      <div className="destinations-hero">
        <h1>Explore The World</h1>
        <p>
          Discover handpicked destinations across beaches, mountains,
          historical cities and cultural wonders.
        </p>

        <div className="destinations-search">
          <InputBox
            type="text"
            label="Search Destination"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            width="500px"
          />
        </div>
      </div>

      {/* DESTINATION GRID */}
      <div className="destinations-grid">
        {isLoading ? (
          [...Array(8)].map((_, index) => (
            <div key={index} className="placecard-skeleton"></div>
          ))
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, index) => (
            <div key={place._id} className="fade-in">
              <PlaceCard place={place} priority={index < 4} />
            </div>
          ))
        ) : (
          <div className="no-results">No destinations found</div>
        )}
      </div>
    </section>
  );
};

export default Destinations;