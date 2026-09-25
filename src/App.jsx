import { useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import Hero from './pages/Hero.jsx'
import About from './pages/About.jsx'
import ResumeModal from './pages/ResumeModal.jsx'
import Connect from './pages/Work.jsx'
import Skills from './pages/Skills.jsx'
import Contact from './pages/Contact.jsx' 
import HeaderActions from "./pages/HeaderActions.jsx"

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

function HomePage() {
  // const smootherRef = useRef(null)
  const [resumeOpen, setResumeOpen] = useState(false)

  // useLayoutEffect(() => {
  //   smootherRef.current = ScrollSmoother.create({
  //     wrapper: '#smooth-wrapper',
  //     content: '#smooth-content',
  //     smooth: 1.2,
  //     effects: true,
  //   })


  return (
    <>
      <div id="smooth-wrapper">
        <main id="smooth-content">
          
          <Hero onResumeOpen={() => setResumeOpen(true)} />
          {/* <About />
          <Connect />
          <Skills />
          <Contact /> */}
        </main>
      </div>
      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
         <HeaderActions />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Connect" element={<Connect />} />
        <Route path="/Skills" element={<Skills />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}