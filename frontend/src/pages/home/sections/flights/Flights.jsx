import "./Flights.css";
import airplane from "../../../../assets/images/home/airplane.webp";
import cabincrew from "../../../../assets/images/home/cabincrew.webp";
import travel from "../../../../assets/images/home/travel.webp";
import { motion } from "framer-motion";

const Flights = () => {
  const cards = [
    {
      image: airplane,
      title: "Global Routes",
      text: "Fly to over 200 destinations worldwide with unmatched comfort and reliability."
    },
    {
      image: cabincrew,
      title: "World-Class Crew",
      text: "Experience hospitality delivered by highly trained professionals."
    },
    {
      image: travel,
      title: "Effortless Travel",
      text: "From takeoff to touchdown, enjoy seamless journeys tailored to you."
    }
  ];

  return (
    <section className="flights-container">
      <div className="flights-header">
        <h2>Effortless Journeys, Exceptional Service</h2>
        <p>
          From takeoff to landing, experience world-class comfort,
          personalized service, and seamless travel designed around you.
        </p>
      </div>

      <div className="flights-grid">
        {cards.map((card, index) => (
          <motion.div
            className="flight-card"
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="flight-image">
              <img src={card.image} alt={card.title} />
              <div className="flight-overlay" />
            </div>

            <div className="flight-content">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Flights;