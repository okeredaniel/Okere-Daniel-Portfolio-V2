import { useLayoutEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Work.css'
import ford from '../assets/FORD.jpg'
import vector from '../assets/vec.png'

gsap.registerPlugin(ScrollTrigger)

// order matters — position in this array maps directly to the
// bento layout in Work.css (nth-child 1-3 = top row, 4-5 = middle
// row, 6 = full-width bottom tile)
const PROJECTS = [
  { name: 'Vector', tech: 'React · Supabase · Rust · Python', image: vector, url: 'https://example.com/watchhub' },
  { name: 'Dispatch', tech: 'Tauri · React · MongoDB', image: ford, url: 'https://example.com/dispatch' },
  { name: 'Stryde', tech: 'React · model-viewer', image: ford, url: 'https://example.com/stryde' },
  { name: 'Project 4', tech: 'Tech stack', image: ford, url: 'https://example.com' },
  { name: 'Project 5', tech: 'Tech stack', image: ford, url: 'https://example.com' },
  { name: 'Project 6', tech: 'Tech stack', image: ford, url: 'https://example.com' },
]

export default function Work() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from('.work-eyebrow', { opacity: 0, y: 14, duration: 0.5 })
        .from('.work-headline', { opacity: 0, y: 24, duration: 0.6 }, '-=0.3')
        .from('.work-descrip', { opacity: 0, y: 16, duration: 0.5 }, '-=0.35')
        .from('.work-more-btn', { opacity: 0, y: 10, duration: 0.5 }, '-=0.35')
        .from(
          '.work-tile',
          { opacity: 0, y: 40, duration: 0.7, stagger: 0.12 },
          '-=0.3'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="work" className="work snap-section">
      <div className="work-inner">
        <div className="work-header">
          {/* <div>
            <h2 className="work-headline">Projects</h2>
            <p className="work-descrip">
              A few things I've built recently — from mobile apps to full-stack
              tools, each one solving a real problem
            </p>
          </div> */}
          {/* <Link to="/projects" className="work-more-btn">
            View more projects
            <ArrowRight size={15} />
          </Link> */}
        </div>

        <div className="work-grid">
          {PROJECTS.map((project) => {
            const isVectorProject = project.name === 'Vector'

            return (
              <div
                key={project.name}
                className={`work-tile ${isVectorProject ? 'work-tile-vector' : 'work-tile-skeleton'}`}
              >
                {isVectorProject ? (
                  <div
                    className="work-tile-image"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                ) : (
                  <div className="work-tile-image work-skeleton-image" aria-hidden="true">
                    <span className="work-skeleton-block work-skeleton-block-lg" />
                    <span className="work-skeleton-block work-skeleton-block-md" />
                    <span className="work-skeleton-block work-skeleton-block-sm" />
                  </div>
                )}

                <div className="work-tile-info">
                  <div className="work-tile-text">
                    <p className={`work-tile-name ${!isVectorProject ? 'is-placeholder' : ''}`}>
                      {project.name}
                    </p>
                    <p className={`work-tile-tech ${!isVectorProject ? 'is-placeholder' : ''}`}>
                      {project.tech}
                    </p>
                  </div>

                  {isVectorProject ? (
                    <a
                      className="work-tile-visit"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit site
                      <ArrowRight size={13} />
                    </a>
                  ) : (
                    <span className="work-tile-placeholder">Coming soon</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}