import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard } from 'swiper/modules'
import 'swiper/css'
import './Work.css'
import ford from '../assets/peppermint.png'
import vector from '../assets/vec.png'
import mak from '../assets/coming.jpg';

gsap.registerPlugin(ScrollTrigger)

// Each project is one carousel slide.
// All slides share one size (--work-slide-ratio in Work.css).
// Swap the postimg placeholders for your own screenshots as you finish each project.
const PROJECTS = [
  { name: 'Vector', tech: 'React · Supabase · Rust · Python', image: vector, url: null },
  { name: 'Peppermint', tech: 'React · JS · Gsap', image: ford, url: 'https://peppermint-wip-v1.vercel.app/' },
  { name: 'Stryde', tech: 'React · model-viewer', image: mak, url: null },
  { name: 'Project 4', tech: 'Tech stack', image: mak, url: null },
  { name: 'Project 5', tech: 'Tech stack', image: mak, url: null },
  { name: 'Project 6', tech: 'Tech stack', image: mak, url: null },
]

const EASE = 'back.out(1.7)'
const DURATION = 0.3

export default function Work() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const cursorRef = useRef(null)
  const iconRef = useRef(null)
  const swiperRef = useRef(null)
  const [active, setActive] = useState(0)

  // section entrance (single reveal)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work-stage, .work-info', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [])

  // arrow cursor that follows the mouse and flips left/right over the carousel
  useLayoutEffect(() => {
    const stage = stageRef.current
    const cursor = cursorRef.current
    const icon = iconRef.current
    if (!stage || !cursor || !icon) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let side = null // 'left' | 'right'
    let x = 0
    let y = 0

    const sideFor = (clientX) => {
      const r = stage.getBoundingClientRect()
      return clientX > r.left + r.width / 2 ? 'right' : 'left'
    }

    const ctx = gsap.context(() => {
      gsap.set(icon, { rotation: -135, opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })
      const setX = gsap.quickSetter(cursor, 'x', 'px')
      const setY = gsap.quickSetter(cursor, 'y', 'px')

      const onEnter = (e) => {
        x = e.clientX
        y = e.clientY
        setX(x)
        setY(y)
        const r = stage.getBoundingClientRect()
        side = sideFor(x)

        let startRotation
        if (y < r.top + r.height / 2) startRotation = -135
        else startRotation = side === 'right' ? 135 : -315

        gsap.set(icon, { rotation: startRotation })
        gsap.to(icon, {
          rotation: side === 'right' ? 0 : -180,
          scale: 1,
          opacity: 1,
          duration: DURATION,
          ease: EASE,
        })
      }

      const onMove = (e) => {
        x = e.clientX
        y = e.clientY
        setX(x)
        setY(y)
        const next = sideFor(x)
        if (side && next !== side) {
          side = next
          gsap.to(icon, {
            rotation: side === 'right' ? 0 : -180,
            duration: DURATION,
            ease: EASE,
            overwrite: 'auto',
          })
        }
      }

      const onLeave = () => {
        const r = stage.getBoundingClientRect()
        let out
        if (y < r.top + r.height / 2) out = side === 'right' ? -135 : -45
        else out = side === 'right' ? 135 : -315
        gsap.to(icon, { rotation: out, opacity: 0, scale: 0.3, duration: DURATION, overwrite: 'auto' })
        side = null
      }

      stage.addEventListener('mouseenter', onEnter)
      stage.addEventListener('mousemove', onMove)
      stage.addEventListener('mouseleave', onLeave)

      return () => {
        stage.removeEventListener('mouseenter', onEnter)
        stage.removeEventListener('mousemove', onMove)
        stage.removeEventListener('mouseleave', onLeave)
      }
    }, stage)

    return () => ctx.revert()
  }, [])

  const bumpCursor = () => {
    if (!cursorRef.current) return
    gsap.fromTo(
      cursorRef.current,
      { scale: 0.85 },
      { scale: 1, duration: 0.3, ease: EASE, overwrite: 'auto' }
    )
  }

  const current = PROJECTS[active]

  return (
    <section id="work" className="work snap-section" ref={sectionRef}>
      {/* blurred backdrop follows the active project */}
      <div
        className="work-backdrop"
        style={{ backgroundImage: `url(${current.image})` }}
        aria-hidden="true"
      />

      <div className="work-inner">
        <div className="work-stage" ref={stageRef}>
          <Swiper
            className="work-swiper"
            modules={[Keyboard]}
            keyboard={{ enabled: true }}
            loop
            slidesPerView="auto"
            spaceBetween={40}
            centeredSlides
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={(s) => {
              setActive(s.realIndex)
              bumpCursor()
            }}
          >
            {PROJECTS.map((project, index) => (
              <SwiperSlide
                key={project.name}
                className="work-slide"
              >
                <img
                  className="work-slide__img"
                  src={project.image}
                  alt={`${project.name} preview`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  draggable="false"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            className="work-nav work-nav--prev"
            aria-label="Previous project"
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <button
            type="button"
            className="work-nav work-nav--next"
            aria-label="Next project"
            onClick={() => swiperRef.current?.slideNext()}
          />
        </div>

        <div className="work-info">
          <div className="work-info__text">
            <p className="work-info__name">{current.name}</p>
            <p className="work-info__tech">{current.tech}</p>
          </div>

          {current.url ? (
            <a
              className="work-info__visit"
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit site
              <ArrowRight size={13} />
            </a>
          ) : (
            <span className="work-info__soon">Coming soon</span>
          )}
        </div>
      </div>

      <div className="work-cursor" ref={cursorRef} aria-hidden="true">
        <svg className="work-cursor__icon" ref={iconRef} viewBox="0 0 117.25 86.75">
          <path
            className="work-cursor__path"
            d="M111.45,42.5,74.65,5.7l-9.9,9.9,20.6,20.6H6.45v14h78.9L64.75,70.8l9.9,9.9,36.8-36.8A1,1,0,0,0,111.45,42.5Z"
          />
        </svg>
      </div>
    </section>
  )
}