import "../styles/Hero.css";

const Hero = ({ title, subtitle }) => {
  return (
    <div className="hero">
      <div className="hero-overlay">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default Hero;
