import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'
import Cube from './Cubecarousel.jsx'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '10+', label: 'Projects' },
  { value: '5+', label: 'Languages' },
  { value: '1', label: 'School' },
  { value: "'26", label: 'Grad year' },
  { value: '3yrs', label: 'Proficiency' },
]

export default function About() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.about-reveal')
      gsap.from(items, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about snap-section" ref={sectionRef}>
      <div className="about-inner">
        <div className="about-columns about-reveal">
          <div className="about-columns-left">
            <Cube />
          </div>

          <div className="about-columns-right">
            <p className="about-eyebrow about-reveal">About Me</p>

            <h2 className="about-headline about-reveal">
              Turning Ideas Into Products
            </h2>

            {/* <h3 className="about-subheading about-reveal">Built From Zero.</h3> */}
            <p className="about-text about-reveal">
              Software engineering student at Aptech, Lagos, working across Flutter,
              React, Python, and Java. Turning ideas into real, working products
              instead of just talking about them.
            </p>
          </div>
        </div>

        {/* <div className="about-stats about-reveal">
          {STATS.map((stat) => (
            <div className="about-stat" key={stat.label}>
              <p className="about-stat-value">{stat.value}</p>
              <p className="about-stat-label">{stat.label}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}