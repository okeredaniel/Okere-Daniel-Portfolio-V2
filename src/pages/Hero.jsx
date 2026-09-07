import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Download } from "lucide-react";
import log from "../assets/log.png";
import resumePdf from "../assets/Daniel_Okere_CV.pdf";
import "./Hero.css";
import Terminal from "../pages/Heroterminal.jsx";

export default function Hero({ onResumeOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => video.play().catch(() => {});
    tryPlay();

    video.addEventListener("pause", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);

    return () => {
      video.removeEventListener("pause", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, []);

  return (
    <section className="hero snap-section">
      
      <div className="hero-bg-fallback" aria-hidden="true" data-speed="0" />
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
          {/* <img className="logo-image" src={log} alt="Daniel logo" /> */}
          <span className="logo">Danny</span>
        </div>

        <div className="nav-toggle-wrap">
         
        </div>
      </header>

      <div className="hero-spacer" />

      <div className="hero-content">
        <div className="hero-copy">
          <div className="eyebrow fu fu-2">
            <Sparkles size={14} />
            <span>Available for select work</span>
          </div>

          <h1 className="tagline fu fu-3">
            Turning zero
            <br />
            Into Inspirations.
          </h1>

          <div className="cta-group fu fu-4">
            <button className="btn-solid" onClick={onResumeOpen}>
              Resume
              <ArrowRight size={16} />
            </button>

            <button className="btn-ghost1" aria-label="Download resume">
              Software Developer
            </button>  
          </div>
        </div>

        <div className="hero-panel fu fu-4">
          <Terminal />
        </div>
      </div>
      <div className="hero-fade"></div>
    </section>
  );
}