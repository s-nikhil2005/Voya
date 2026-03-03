
import "./About.css";
import { GiCommercialAirplane } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { CiPercent } from "react-icons/ci";
import { motion } from "framer-motion";

const boxVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const About = () => {
  const boxes = [
    {
      icon: <GiCommercialAirplane />,
      title: "Global Adventures",
      text: "Go beyond the guidebook. Our handpicked tours immerse you in new cultures, spark global connections, and help you create stories worth retelling.",
    },
    {
      icon: <BsFillPeopleFill />,
      title: "Travel Circle",
      text: "You're more than a tourist — you're one of us. Connect with a worldwide crew of explorers, swap tips, share stories, and fuel your next adventure.",
    },
    {
      icon: <CiPercent />,
      title: "Exclusive Deals",
      text: "Make every mile count. Snag exclusive deals on flights, stays, and packages—saving you more so you can see more.",
    },
  ];

  return (
    <section className="about-container" id="aboutus">
      <motion.div
        className="about-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Adventure Awaits</h2>
        <p>
          From epic global tours to a community of fearless travelers and
          unbeatable travel deals — we’re here to fuel your next great escape.
        </p>
      </motion.div>

      <div className="about-cards">
        {boxes.map((box, index) => (
          <motion.div
            key={index}
            className="about-card"
            variants={boxVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="about-icon">{box.icon}</div>
            <h3>{box.title}</h3>
            <p>{box.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About;