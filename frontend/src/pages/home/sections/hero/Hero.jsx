
import "./Hero.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

// Images (Use ONLY your best 3 images)
import image1 from "../../../../assets/images/home/hero-primary.webp";
import image2 from "../../../../assets/images/home/hero-secondary.webp";
import image3 from "../../../../assets/images/home/hero-third.webp";

const heroImages = [image1, image2, image3];

const Hero = () => {
  return (
    <section className="hero-container">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        speed={1500}
        className="hero-swiper"
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero-slide-image"
              style={{ backgroundImage: `url(${image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Premium Content */}
      <div className="hero-content">
        <h1>Travel Without Limits</h1>
        <p>
          Curated journeys. Exceptional stays. Seamless luxury experiences.
        </p>
        <button className="hero-btn">Explore Destinations</button>
      </div>
    </section>
  );
};

export default Hero;