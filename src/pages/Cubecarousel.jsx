import { useState } from 'react'
import './CubeCarousel.css'

const FACES = [
  { number: '01 / Explore', icon: '◈', title: 'Explore', text: 'Diving into new technologies, frameworks, and problems worth solving.', className: 'front' },
  { number: '02 / Create', icon: '✦', title: 'Create', text: 'Writing clean, efficient code to build robust software solutions.', className: 'right' },
  { number: '03 / Design', icon: '◉', title: 'Design', text: 'Architecting scalable systems with maintainability in mind.', className: 'back' },
  { number: '04 / Launch', icon: '↗', title: 'Launch', text: 'Shipping production-ready applications that deliver real value.', className: 'left' },
]

export default function CubeCarousel() {
  const [slide, setSlide] = useState(1) // 1-4, matches FACES index + 1

  const goPrev = () => setSlide((s) => (s === 1 ? FACES.length : s - 1))
  const goNext = () => setSlide((s) => (s === FACES.length ? 1 : s + 1))

  const cubeRotation = (slide - 1) * -90

  return (
    <main className="carousel">
      <div className="scene">
        <div
          className="cube"
          style={{ transform: `rotateY(${cubeRotation}deg)` }}
        >
          {FACES.map((face) => (
            <section className={`face ${face.className}`} key={face.title}>
              <div className="number">{face.number}</div>
              <div className="icon">{face.icon}</div>
              <h2>{face.title}</h2>
              <p>{face.text}</p>
            </section>
          ))}
          <section className="face top" />
          <section className="face bottom" />
        </div>
        <div className="shadow" />
      </div>

      <nav className="navigation">
        <button className="nav-button" onClick={goPrev} aria-label="Previous">
          ←
        </button>

        <div className="dots">
          {FACES.map((_, i) => (
            <button
              key={i}
              className={`dot ${slide === i + 1 ? 'active' : ''}`}
              onClick={() => setSlide(i + 1)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button className="nav-button" onClick={goNext} aria-label="Next">
          →
        </button>
      </nav>
    </main>
  )
}