import { useEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText' // free in gsap 3.13+
import './About.css'
import vector from '../assets/vec.png'
import peppermint from '../assets/peppermint.png'

gsap.registerPlugin(ScrollTrigger, SplitText)

// a highlighted phrase that reveals an image on hover
function HoverText({ image, alt, children }) {
  return (
    <span className="about-hover">
      {children}
      <span className="about-img">
        <img src={image} alt={alt} />
      </span>
    </span>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    let ctx
    let cancelled = false

    const init = () => {
      if (cancelled || !sectionRef.current || !textRef.current) return

      ctx = gsap.context(() => {
        // split after fonts load so the line breaks are measured correctly
        const split = SplitText.create(textRef.current, {
          type: 'lines',
          linesClass: 'split-line',
        })

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              once: true,
            },
          })
          .to('.about-subtitle', { opacity: 0.7, duration: 0.4 }, '>0.5')
          .to('.about-text', { opacity: 1, duration: 0 }, '<')
          .fromTo(
            split.lines,
            { y: '100%' },
            {
              y: 0,
              opacity: 1,
              ease: 'sine.out',
              transformOrigin: 'top',
              stagger: 0.1,
              duration: 1.2,
            },
            '<0.4'
          )
          .to('.about-down', { opacity: 1, ease: 'sine.out', duration: 0.4 }, '>')

        return () => split.revert()
      }, sectionRef)
    }

    document.fonts.ready.then(init)

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about-subtitle">about</div>

      <div className="about-text" ref={textRef}>
        I turn ideas into products building{' '}
        {/* <HoverText image={vector} alt="Vector dashboard"> */}
        <span className='po'> full-stack apps</span>
         
        {/* </HoverText>{' '} */}
        with React, Supabase, Rust and Python, crafting{' '}
        {/* <HoverText image={peppermint} alt="Peppermint landing page"> */}
        <span className='po'>animated interfaces</span>
          
        {/* </HoverText>{' '} */}
        with GSAP, and shipping mobile with Flutter and Java behind the backend.
      </div>

      <div className="about-down">
        {/* <ArrowDown className="about-down__icon" strokeWidth={1.5} /> */}
      </div>
    </section>
  )
}