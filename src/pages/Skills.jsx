import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Skills.css'

// Import each image so Vite bundles it correctly
import flutterImg from '../assets/flutter box.jpg'
import reactImg from '../assets/react box.jpg'
import mernImg from '../assets/mern box.jpg'
import javaImg from '../assets/java box.png'
import pythonImg from '../assets/python box.jpg'
import dartImg from '../assets/dart box.png'
import nodeImg from '../assets/node box.png'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  {
    name: 'Flutter',
    category: 'Mobile',
    years: '2+ yrs',
    description: 'Used across WatchHub and Gesture Pic Finder for cross-platform mobile builds.',
    projects: ['WatchHub', 'Gesture Pic Finder'],
    image: flutterImg,
    color: '#13B9FD',
  },
  {
    name: 'React',
    category: 'Web',
    years: '2+ yrs',
    description: 'Main frontend framework for this portfolio, Stryde, and Dispatch.',
    projects: ['Portfolio', 'Stryde', 'Dispatch'],
    image: reactImg,
    color: '#005972',
  },
  {
    name: 'MERN',
    category: 'Full Stack',
    years: '1+ yr',
    description: 'MongoDB, Express, React, Node — used for full-stack builds like Dispatch.',
    projects: ['Dispatch'],
    image: mernImg,
    color: '#4DB33D',
  },
  {
    name: 'Java',
    category: 'Backend',
    years: '2+ yrs',
    description: 'Core language from Aptech coursework, JavaFX and OOP fundamentals.',
    projects: ['Aptech coursework'],
    image: javaImg,
    color: '#c70909',
  },
  {
    name: 'Python',
    category: 'Backend',
    years: '2+ yrs',
    description: 'OpenCV and MediaPipe work for Gesture Pic Finder, general scripting.',
    projects: ['Gesture Pic Finder'],
    image: pythonImg,
    color: '#e4e000e7',
  },
  {
    name: 'Dart',
    category: 'Mobile',
    years: '2+ yrs',
    description: "Flutter's language — same projects, same timeframe as Flutter above.",
    projects: ['WatchHub'],
    image: dartImg,
    color: '#00B4AB',
  },
  {
    name: 'Node',
    category: 'Backend',
    years: '1+ yr',
    description: 'Server-side logic and APIs for Dispatch.',
    projects: ['Dispatch'],
    image: nodeImg,
    color: '#d100a4',
  },
]

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #2a2a2a, #111111)'

function getBannerStyle(skill) {
  if (skill.image) {
    return {
      backgroundImage: `url(${skill.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { background: FALLBACK_GRADIENT }
}

export default function Skills() {
  const sectionRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.skill-line')

      lines.forEach((line, i) => {
        const chars = line.querySelectorAll('.skill-char')
        const staggerAmount = 0.025 + i * 0.012

        gsap.from(chars, {
          opacity: 0,
          y: 40,
          rotate: 6,
          duration: 0.5,
          ease: 'back.out(1.7)',
          stagger: staggerAmount,
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" className="skills snap-section" ref={sectionRef}>
      <div className="skills-inner">
        <div className="skills-header">
          <h3 className="skills-eyebrow">What I Work With</h3>
          <p className="skills-description">Tools I actually reach for, not just ones I've heard of.</p>
        </div>

        <div className="skills-content-layout">
          {/* Left Column: Skills List */}
          <div className="skills-list">
            {SKILLS.map((skill, i) => {
              const isDimmed = hoveredIndex !== null && hoveredIndex !== i
              const isActive = (hoveredIndex !== null ? hoveredIndex : activeIndex) === i

              return (
      <div
  className={`skill-row ${isDimmed ? 'is-dimmed' : ''} ${isActive ? 'is-active' : ''}`}
  key={skill.name}
  style={{ '--skill-color': skill.color }}
  onMouseEnter={() => {
    setHoveredIndex(i)
    setActiveIndex(i)
  }}
  onMouseLeave={() => setHoveredIndex(null)}
>
                  <h2 className="skill-line">
                    <span className="skill-line-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="skill-line-text">
                      {skill.name.split('').map((char, ci) => (
                        <span className="skill-char" key={ci}>
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </span>
                  </h2>

                  {/* Accordion detail card for mobile only */}
                  <div className="skill-mobile-details">
                    <div className="skills-panel-card">
                      <div
                        className="skills-panel-banner"
                        style={getBannerStyle(skill)}
                      >
                        {!skill.image && (
                          <span className="skills-banner-icon">{skill.name[0]}</span>
                        )}
                      </div>
                      <div className="skills-panel-content">
                        <div className="skill-info-top">
                          <p className="skill-info-category">{skill.category}</p>
                          <span className="skill-info-years">{skill.years}</span>
                        </div>
                        <h3 className="skills-panel-title">{skill.name}</h3>
                        <div className="skill-info-divider" />
                        <p className="skill-info-desc">{skill.description}</p>
                        <div className="skill-info-tags">
                          {skill.projects.map((project) => (
                            <span key={project} className="project-tag">{project}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Stationary detail panel (Desktop only) */}
          <div className="skills-detail-panel">
            <div className="skills-panel-sticky">
              <div className="skills-panel-card">
                <div
                  className="skills-panel-banner"
                  style={getBannerStyle(SKILLS[activeIndex])}
                >
                  {!SKILLS[activeIndex].image && (
                    <span className="skills-banner-icon">{SKILLS[activeIndex].name[0]}</span>
                  )}
                </div>

                <div className="skills-panel-content" key={activeIndex}>
                  <div className="skill-info-top">
                    <span className="skill-info-category">{SKILLS[activeIndex].category}</span>
                    <span className="skill-info-years">{SKILLS[activeIndex].years}</span>
                  </div>
                  <h3 className="skills-panel-title">{SKILLS[activeIndex].name}</h3>
                  <div className="skill-info-divider" />
                  <p className="skill-info-desc">{SKILLS[activeIndex].description}</p>

                  <div className="skills-panel-projects">
                    <p className="projects-label">Used In:</p>
                    <div className="skill-info-tags">
                      {SKILLS[activeIndex].projects.map((project) => (
                        <span key={project} className="project-tag">{project}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}