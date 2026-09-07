import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { GitFork, Link, Mail, Copy, Check, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/okeredaniel', Icon: GitFork },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/okeredaniel', Icon: Link },
]

const EMAIL = 'okered764@gmail.com'

function useLagosTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date())
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef(null)
  const lagosTime = useLagosTime()

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power2.out' },
      })
      tl.from('.contact-eyebrow', { opacity: 0, y: 14, duration: 0.5 })
        .from('.contact-headline', { opacity: 0, y: 28, duration: 0.7 }, '-=0.3')
        .from('.contact-email-block', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
        .from('.contact-social-row', { opacity: 0, y: 16, duration: 0.5 }, '-=0.35')
        .from('.contact-time-widget', { opacity: 0, x: 30, duration: 0.6 }, '-=0.5')
        .from('.contact-bottom-bar', { opacity: 0, y: 12, duration: 0.4 }, '-=0.2')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="contact snap-section" ref={sectionRef}>
      <div className="contact-inner">

        {/* Top divider line */}
        <div className="contact-divider" />

        <div className="contact-grid">

          {/* Left: Copy call-to-action */}
          <div className="contact-left">
            <p className="contact-eyebrow">Let's Connect</p>
            <h2 className="contact-headline">
              Let's build<br />something great.
            </h2>

            {/* Copy email block */}
            <button
              className={`contact-email-block ${copied ? 'is-copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy email address"
            >
              <div className="contact-email-icon">
                {copied ? <Check size={16} strokeWidth={2.5} /> : <Mail size={16} strokeWidth={2} />}
              </div>
              <div className="contact-email-text">
                <span className="contact-email-label">{copied ? 'Copied!' : 'Email me'}</span>
                <span className="contact-email-value">{EMAIL}</span>
              </div>
              <div className="contact-copy-icon">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </div>
            </button>

            {/* Socials */}
            <div className="contact-social-row">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  <ArrowUpRight size={13} className="contact-social-arrow" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Live time widget */}
          <div className="contact-right">
            <div className="contact-time-widget">
              <div className="contact-time-header">
                <span className="contact-time-dot" />
                <span className="contact-time-label">Available for work · Lagos, NG</span>
              </div>
              <p className="contact-time-clock">{lagosTime}</p>
              <p className="contact-time-zone">WAT · UTC+1</p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="contact-bottom-bar">
          <p className="contact-footer-copy">
            © {new Date().getFullYear()} Daniel Okere.
          </p>
          <p className="contact-footer-right">Lagos, Nigeria</p>
        </div>

      </div>
    </section>
  )
}
