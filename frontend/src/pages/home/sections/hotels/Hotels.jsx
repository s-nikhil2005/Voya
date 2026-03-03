import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "./Hotels.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/* ============================= */
/*  35+ Famous Global Locations  */
/* ============================= */

const locations = [
  // Europe
  { lat: 48.8566, lng: 2.3522, name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760c0341?q=80&w=1920" },
  { lat: 41.9028, lng: 12.4964, name: "Rome, Italy", image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=1920" },
  { lat: 51.5074, lng: -0.1278, name: "London, UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920" },
  { lat: 40.4168, lng: -3.7038, name: "Madrid, Spain", image: "https://images.unsplash.com/photo-1543340713-8e5b1e0d40b4?q=80&w=1920" },
  { lat: 52.5200, lng: 13.4050, name: "Berlin, Germany", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=1920" },

  // USA
  { lat: 40.7128, lng: -74.0060, name: "New York, USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1920" },
  { lat: 34.0522, lng: -118.2437, name: "Los Angeles, USA", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920" },
  { lat: 25.7617, lng: -80.1918, name: "Miami, USA", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1920" },
  { lat: 36.1699, lng: -115.1398, name: "Las Vegas, USA", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1920" },

  // Asia
  { lat: 35.6895, lng: 139.6917, name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1920" },
  { lat: 1.3521, lng: 103.8198, name: "Singapore", image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=1920" },
  { lat: 22.3964, lng: 114.1095, name: "Hong Kong", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920" },
  { lat: 13.7563, lng: 100.5018, name: "Bangkok, Thailand", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1920" },
  { lat: 19.0760, lng: 72.8777, name: "Mumbai, India", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1920" },
  { lat: 28.6139, lng: 77.2090, name: "New Delhi, India", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1920" },

  // Middle East
  { lat: 25.2048, lng: 55.2708, name: "Dubai, UAE", image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1920" },
  { lat: 31.7683, lng: 35.2137, name: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1920" },

  // Australia
  { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia", image: "https://images.unsplash.com/photo-1524293581273-795a27184502?q=80&w=1920" },
  { lat: -37.8136, lng: 144.9631, name: "Melbourne, Australia", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920" },

  // South America
  { lat: -22.9068, lng: -43.1729, name: "Rio de Janeiro, Brazil", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1920" },
  { lat: -34.6037, lng: -58.3816, name: "Buenos Aires, Argentina", image: "https://images.unsplash.com/photo-1526481280691-3c469b90c6e9?q=80&w=1920" },

  // Africa
  { lat: -33.9249, lng: 18.4241, name: "Cape Town, South Africa", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1920" },
  { lat: 30.0444, lng: 31.2357, name: "Cairo, Egypt", image: "https://images.unsplash.com/photo-1544989164-31e8c5c63c30?q=80&w=1920" },

  // Islands
  { lat: 3.2028, lng: 73.2207, name: "Maldives", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920" },
  { lat: 20.7984, lng: -156.3319, name: "Hawaii, USA", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1920" },
  { lat: 36.3932, lng: 25.4615, name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1505739774398-52f0a8a34b60?q=80&w=1920" }
];

const center = [20, 0];

const Hotels = () => {
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  return (
    <>
      <section className="hotels-container">
        <div className="hotels-header">
          <h2>Explore the World</h2>
          <p>
            Discover iconic destinations and premium stays across the globe.
          </p>
        </div>

        <div className="hotels-map">
<MapContainer
  center={center}
  zoom={2}
  minZoom={2}
  maxZoom={6}
  scrollWheelZoom={false}
  className="map-container"
  maxBounds={[
    [-90, -180],
    [90, 180]
  ]}
  maxBoundsViscosity={1.0}
>
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />

            <MarkerClusterGroup>
              {locations.map((loc, index) => (
                <Marker key={index} position={[loc.lat, loc.lng]}>
                  <Popup>
                    <div className="popup-card">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        onClick={() => {
                          setActiveImage(loc.image);
                          setOpen(true);
                        }}
                      />
                      <h4>{loc.name}</h4>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: activeImage }]}
        plugins={[Zoom]}
      />
    </>
  );
};

export default Hotels;