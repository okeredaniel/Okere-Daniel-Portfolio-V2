import { useLayoutEffect, useRef, useState } from 'react'
import './Skills.css'

// Import each image so Vite bundles it correctly
import flutterImg from '../assets/flutter box.jpg'
import reactImg from '../assets/react box.jpg'
import mernImg from '../assets/mern box.jpg'
import javaImg from '../assets/java box.png'
import pythonImg from '../assets/python box.jpg'
import dartImg from '../assets/dart box.png'
import nodeImg from '../assets/node box.png'

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

const SPEED_WHEEL = 0.03 // wheel sensitivity
const SPEED_DRAG = -0.15 // drag sensitivity
const SNAP_DELAY = 140 // ms of no input before the nearest card settles into place
const SMOOTHING = 7 // how quickly the cards glide to their target (higher = snappier)

export default function Skills() {
  const sectionRef = useRef(null)
  const itemRefs = useRef([])
  const cursorRefs = useRef([])
  const [active, setActive] = useState(0)

  // `progress` (0-100) is where the user wants the carousel to be. `pos` is a
  // float card index that eases toward it every frame, so cards glide, rotate,
  // scale and fade continuously instead of jumping. Item CSS variables are
  // written directly, so React only re-renders when the front card changes.
  useLayoutEffect(() => {
    const section = sectionRef.current
    const items = itemRefs.current.filter(Boolean)
    const cursors = cursorRefs.current.filter(Boolean)
    const total = items.length
    if (!section || !total) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let progress = 50
    let pos = 0
    let current = -1
    let raf = 0
    let last = 0
    let snapTimer = 0
    let isDown = false
    let startX = 0
    let dragged = 0

    const clamp = (v) => Math.max(0, Math.min(v, 100))
    const toIndex = (p) => (p / 100) * (total - 1)
    const toProgress = (i) => (i / (total - 1)) * 100

    // position every card relative to the (fractional) front card
    const apply = () => {
      items.forEach((item, i) => {
        const d = i - pos
        const dist = Math.abs(d)
        const opacity = Math.max(0, 1 - dist * 0.32)
        item.style.setProperty('--d', d)
        item.style.setProperty('--s', Math.max(0.7, 1 - dist * 0.07))
        item.style.setProperty('--o', opacity)
        item.style.zIndex = Math.round((total - dist) * 100)
        item.style.visibility = opacity < 0.02 ? 'hidden' : 'visible'
      })
    }

    // frame-rate independent easing toward the target
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const target = toIndex(progress)
      const diff = target - pos

      if (reduceMotion || Math.abs(diff) < 0.001) {
        pos = target
        apply()
        raf = 0
        return
      }

      pos += diff * (1 - Math.exp(-SMOOTHING * dt))
      apply()
      raf = requestAnimationFrame(tick)
    }

    const run = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const setProgress = (value) => {
      progress = clamp(value)
      const next = Math.round(toIndex(progress))
      if (next !== current) {
        current = next
        setActive(next)
      }
      run()
    }

    // after input stops, settle on the nearest card
    const snap = () => setProgress(toProgress(Math.round(toIndex(progress))))
    const scheduleSnap = () => {
      clearTimeout(snapTimer)
      snapTimer = setTimeout(() => {
        if (!isDown) snap()
      }, SNAP_DELAY)
    }

    // initial state
    pos = toIndex(progress)
    apply()
    current = Math.round(pos)
    setActive(current)

    // wheel: only hijack while the carousel can still move. At either end the
    // event is left alone so the page keeps scrolling normally.
    const onWheel = (e) => {
      const next = clamp(progress + e.deltaY * SPEED_WHEEL)
      if (next === progress) return
      e.preventDefault()
      setProgress(next)
      scheduleSnap()
    }

    // drag (mouse + touch via pointer events)
    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      isDown = true
      dragged = 0
      startX = e.clientX
    }
    const onPointerMove = (e) => {
      if (!isDown) return
      const dx = e.clientX - startX
      dragged += Math.abs(dx)
      startX = e.clientX
      setProgress(progress + dx * SPEED_DRAG)
    }
    const onPointerUp = () => {
      if (!isDown) return
      isDown = false
      snap()
    }

    // click a card to bring it to the front (ignored if it was really a drag)
    const clickHandlers = items.map((item, i) => {
      const handler = () => {
        if (dragged > 5) return
        setProgress(toProgress(i))
      }
      item.addEventListener('click', handler)
      return handler
    })

    // custom cursor (mouse only, only while inside this section)
    const onCursorMove = (e) => {
      if (e.pointerType !== 'mouse') return
      cursors.forEach((c) => {
        c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      })
    }
    const onEnter = (e) => {
      if (e.pointerType === 'mouse') section.classList.add('is-hover')
    }
    const onLeave = () => section.classList.remove('is-hover')

    section.addEventListener('wheel', onWheel, { passive: false })
    section.addEventListener('pointerdown', onPointerDown)
    section.addEventListener('pointermove', onCursorMove)
    section.addEventListener('pointerenter', onEnter)
    section.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(snapTimer)
      section.removeEventListener('wheel', onWheel)
      section.removeEventListener('pointerdown', onPointerDown)
      section.removeEventListener('pointermove', onCursorMove)
      section.removeEventListener('pointerenter', onEnter)
      section.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      items.forEach((item, i) => item.removeEventListener('click', clickHandlers[i]))
    }
  }, [])

  const current = SKILLS[active]

  return (
    <section id="skills" className="skills snap-section" ref={sectionRef}>
      <div className="sk-carousel">
        {SKILLS.map((skill, i) => (
          <div
            className="sk-item"
            key={skill.name}
            ref={(el) => (itemRefs.current[i] = el)}
          >
            <div className="sk-box">
              <div className="sk-title">{skill.name}</div>
              <div className="sk-num">{String(i + 1).padStart(2, '0')}</div>
              <img src={skill.image} alt={`${skill.name} skill`} draggable="false" />
            </div>
          </div>
        ))}
      </div>

      {/* vertical rule + rotated tagline */}
      <div className="sk-layout" aria-hidden="true">
        <div className="sk-layout__box">
          What I work with
          <br />
          tools I actually reach for,
          <br />
          not just ones I've heard of.
        </div>
      </div>

      {/* details for the front-most skill */}
      <div className="sk-caption" key={active} style={{ '--skill-color': current.color }}>
        <p className="sk-caption__meta">
          <span className="sk-caption__dot" />
          {current.category} · {current.years}
        </p>
        <p className="sk-caption__desc">{current.description}</p>
        <div className="sk-caption__tags">
          {current.projects.map((project) => (
            <span key={project} className="sk-tag">
              {project}
            </span>
          ))}
        </div>
      </div>

      <div className="sk-cursor" ref={(el) => (cursorRefs.current[0] = el)} aria-hidden="true" />
      <div
        className="sk-cursor sk-cursor--dot"
        ref={(el) => (cursorRefs.current[1] = el)}
        aria-hidden="true"
      />
    </section>
  )
}