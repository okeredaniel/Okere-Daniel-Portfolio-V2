import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { GitFork, Link, Mail, Copy, Check, ArrowUpRight, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ShaderBackground from './ShaderBackground'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'okered764@gmail.com'

const SOCIALS = [
  { label: 'GitHub', handle: '@okeredaniel', href: 'https://github.com/okeredaniel', Icon: GitFork },
  { label: 'LinkedIn', handle: '/in/okeredaniel', href: 'https://linkedin.com/in/okeredaniel', Icon: Link },
]

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

// live Lagos clock + how far through the day it is (0-1)
function useLagosTime() {
  const [now, setNow] = useState({ time: '--:--:--', date: '', progress: 0 })

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const time = timeFmt.format(d)
      const [h, m, s] = time.split(':').map(Number)
      setNow({
        time,
        date: dateFmt.format(d),
        progress: ((h % 24) * 3600 + m * 60 + s) / 86400,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return now
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef(null)
  const { time, date, progress } = useLagosTime()

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(EMAIL)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      })
      .catch(() => {})
  }

  // cursor-following glow on the glass cards
  const handleSpotlight = (e) => {
    const card = e.target.closest('.contact-card')
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - r.left}px`)
    card.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })
        .from('.contact-topbar', { opacity: 0, y: -12, duration: 0.5 })
        .from('.contact-line > span', { yPercent: 110, duration: 0.9, stagger: 0.12 }, '-=0.2')
        .from('.contact-lead', { opacity: 0, y: 16, duration: 0.6 }, '-=0.5')
        .from('.contact-card', { opacity: 0, y: 36, duration: 0.7, stagger: 0.12 }, '-=0.4')
        .from('.contact-bottom-bar', { opacity: 0, duration: 0.5 }, '-=0.3')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="contact snap-section" ref={sectionRef}>
      <ShaderBackground />
      <div className="contact-scrim" aria-hidden="true" />

      <div className="contact-inner">
        {/* Top bar */}
        <div className="contact-topbar">
          <p className="contact-eyebrow">Let's connect</p>
          <p className="contact-status">
            <span className="contact-status-dot" />
            Available for work · Lagos, NG
          </p>
        </div>

        {/* Headline */}
        <h2 className="contact-headline">
          <span className="contact-line">
            <span>Let's build</span>
          </span>
          <span className="contact-line">
            <span className="contact-accent">something great.</span>
          </span>
        </h2>
        <p className="contact-lead">
          Got a project, an idea, or just want to say hi? My inbox is open.
        </p>

        {/* Cards */}
        <div className="contact-grid" onPointerMove={handleSpotlight}>
          {/* Email */}
          <div className="contact-card contact-card--mail">
            <div className="contact-card-head">
              <span className="contact-card-icon">
                <Mail size={16} />
              </span>
              <span className="contact-card-label">Email me</span>
            </div>

            <a className="contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>

            <div className="contact-actions">
              <a className="contact-btn contact-btn--primary" href={`mailto:${EMAIL}`}>
                Start a project
                <ArrowRight size={15} />
              </a>
              <button
                type="button"
                className={`contact-btn contact-btn--ghost ${copied ? 'is-copied' : ''}`}
                onClick={handleCopy}
                aria-label="Copy email address"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span role="status">{copied ? 'Copied!' : 'Copy email'}</span>
              </button>
            </div>
          </div>

          {/* Socials */}
          <div className="contact-card contact-card--social">
            <div className="contact-card-head">
              <span className="contact-card-label">Find me online</span>
            </div>

            <ul className="contact-social-list">
              {SOCIALS.map(({ label, handle, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                  >
                    <span className="contact-social-icon">
                      <Icon size={16} />
                    </span>
                    <span className="contact-social-text">
                      <span className="contact-social-name">{label}</span>
                      <span className="contact-social-handle">{handle}</span>
                    </span>
                    <ArrowUpRight size={16} className="contact-social-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Local time */}
          <div className="contact-card contact-card--time">
            <div className="contact-card-head">
              <span className="contact-card-label">Local time · Lagos</span>
            </div>

            <p className="contact-clock">{time}</p>
            <p className="contact-date">{date}</p>

            <div className="contact-day" style={{ '--p': progress }}>
              <div className="contact-day-track">
                <div className="contact-day-fill" />
              </div>
              <div className="contact-day-ticks">
                <span>00</span>
                <span>06</span>
                <span>12</span>
                <span>18</span>
                <span>24</span>
              </div>
            </div>

            <p className="contact-zone">WAT · UTC+1</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="contact-bottom-bar">
          <p>© {new Date().getFullYear()} Daniel Okere.</p>
          <p className="contact-hint">Move your cursor to look around</p>
          <p>Lagos, Nigeria</p>
        </div>
      </div>
    </section>
  )
}