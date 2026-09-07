import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import gsap from 'gsap'
import './ProjectsPage.css'

const ALL_PROJECTS = [
  {
    name: 'WatchHub',
    tech: 'Flutter · Supabase · PostgreSQL',
    description: 'Luxury watch commerce app with full auth, admin dashboard, and a Supabase backend.',
    longDescription:
      'A group project — luxury watch commerce app built in Flutter. Handled auth, admin screens, and routing. Backend migrated from PHP/Railway to Supabase mid-build after hitting Railway free-tier limits, which meant converting the MySQL schema to PostgreSQL and rewriting the data providers.',
    gradient: 'linear-gradient(135deg, #2a2320, #0e0c0b)',
    link: 'https://github.com/okeredaniel',
  },
  {
    name: 'Dispatch',
    tech: 'Tauri · React · Node.js · MongoDB',
    description: 'Real-time incident management desktop app with role-based dashboards and live updates.',
    longDescription:
      'Desktop incident management app with role-based dashboards (Admin, Management, Customer, Professional), real-time updates via Ably, and Google OAuth through system-browser polling. Dark glassmorphism UI with GPU-accelerated sidebar animations.',
    gradient: 'linear-gradient(135deg, #d97757, #7f77dd)',
    link: 'https://github.com/okeredaniel',
  },
  {
    name: 'Stryde',
    tech: 'React · model-viewer',
    description: '3D shoe e-commerce site with an interactive GLB model instead of static product shots.',
    longDescription:
      'Shoe e-commerce concept using a real 3D GLB model via <model-viewer> instead of flat product photos, so the shoe can be rotated and inspected. Split hero layout, Poppins Black type.',
    gradient: 'linear-gradient(135deg, #4de1a8, #2a2320)',
    link: 'https://github.com/okeredaniel',
  },
  {
    name: 'Gesture Pic Finder',
    tech: 'Python · OpenCV · MediaPipe',
    description: 'Desktop app detecting 12 hand gestures and 8 face/combo gestures, with reaction media display.',
    longDescription:
      'Python desktop app using OpenCV and MediaPipe to detect 12 hand gestures and 8 face/combo gestures, triggering matching reaction images/videos in response.',
    gradient: 'linear-gradient(135deg, #7f77dd, #16171a)',
    link: 'https://github.com/okeredaniel',
  },
]

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(null)
  const pageRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.from('.projects-back-link', { opacity: 0, y: -10, duration: 0.5 })
        .from(
          '.projects-eyebrow',
          { opacity: 0, y: 14, duration: 0.5 },
          '-=0.25'
        )
        .from(
          '.projects-headline',
          { opacity: 0, y: 24, duration: 0.6 },
          '-=0.3'
        )
        .from(
          '.projects-card',
          { opacity: 0, y: 30, duration: 0.6, stagger: 0.1 },
          '-=0.3'
        )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="projects-page" ref={pageRef}>
      <div className="projects-page-inner">
        <Link to="/" className="projects-back-link">
          <ArrowLeft size={15} />
          Back home
        </Link>

        <p className="projects-eyebrow">All Work</p>
        <h1 className="projects-headline">Projects</h1>
                   <p className="work-descrip">
              A few things I've built recently — from mobile apps to full-stack
              tools, each one solving a real problem
            </p>
        <div className="projects-full-grid">
          {ALL_PROJECTS.map((project) => (
            <div
              className="projects-card"
              key={project.name}
              onClick={() => setActiveProject(project)}
              role="button"
              tabIndex={0}
            >
              <div className="projects-card-image" style={{ background: project.gradient }} />
      
            </div>
          ))}
        </div>
      </div>

      {activeProject && (
        <div className="project-modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <div className="project-modal-image" style={{ background: activeProject.gradient }}>
              <button
                className="project-modal-close"
                onClick={() => setActiveProject(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="project-modal-body">
              <h3 className="project-modal-name">{activeProject.name}</h3>
              <p className="project-modal-tech">{activeProject.tech}</p>
              <p className="project-modal-desc">{activeProject.longDescription}</p>

              <a
                href={activeProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-link"
              >
                View project
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}