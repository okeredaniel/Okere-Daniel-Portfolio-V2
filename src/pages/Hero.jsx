import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import "./Hero.css";
import ThreeProjectorBackground from "../components/ThreeProjectorBackground.jsx";
import HeaderActions from "../pages/HeaderActions.jsx";


export default function Hero({ onResumeOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="hero snap-section">
      {/* Replaces the old video/fallback background with the fused three.js scene */}
<ThreeProjectorBackground projectionIntensity={0.1} />

      <div className="hero-scrim" data-speed="0" />

      <svg className="hero-grain" aria-hidden="true" data-speed="0">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <header className="site-nav fu fu-1">
        <div className="logo-wrap">
     
          {/* <span className="logo">Danny</span> */}
        </div>

        <div className="nav-toggle-wrap"></div>
      </header>

      <div className="hero-spacer" />

      <div className="hero-content">
        <div className="hero-copy">
          {/* <div className="eyebrow fu fu-2">
            <Sparkles size={14} />
            <span>Available for select work</span>
          </div> */}

          <h1 className="tagline fu fu-3">
            Full-stack developer <br />
            Building with Style <br />
            and Speed
          </h1>

          <div className="cta-group fu fu-4">
            <button className="btn-solid" onClick={onResumeOpen}>
              Resume
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* <div className="hero-panel fu fu-4">
          <Terminal />
        </div> */}
      </div>
      <div className="hero-fade"></div>
    </section>
  );
}