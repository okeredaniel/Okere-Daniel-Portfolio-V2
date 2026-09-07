import { useEffect, useRef, useState } from 'react'
import './Heroterminal.css'

// each line: what shows after the prompt, and how long to pause
// after it finishes before the next line starts typing
const LINES = [
  { text: 'whoami', isCommand: true },
  { text: 'Daniel "Zero" Okere — software engineer, Lagos', isCommand: false },
  { text: 'stack --list', isCommand: true },
  { text: 'React · Flutter · Python · FastAPI · Node · MongoDB', isCommand: false },
  { text: 'status --current', isCommand: true },
  { text: 'Building Dispatch, VECTOR, WatchHub...', isCommand: false },
]

const TYPE_SPEED = 35 // ms per character
const LINE_PAUSE = 500 // ms pause after a line finishes before next starts

export default function HeroTerminal() {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentText, setCurrentText] = useState('')
  const lineIndexRef = useRef(0)
  const charIndexRef = useRef(0)

  useEffect(() => {
    let timeoutId

    const typeNextChar = () => {
      const line = LINES[lineIndexRef.current]
      if (!line) return // done with all lines

      if (charIndexRef.current <= line.text.length) {
        setCurrentText(line.text.slice(0, charIndexRef.current))
        charIndexRef.current += 1
        timeoutId = setTimeout(typeNextChar, TYPE_SPEED)
      } else {
        // line finished — commit it to displayedLines, move to next
        setDisplayedLines((prev) => [...prev, line])
        setCurrentText('')
        lineIndexRef.current += 1
        charIndexRef.current = 0
        timeoutId = setTimeout(typeNextChar, LINE_PAUSE)
      }
    }

    timeoutId = setTimeout(typeNextChar, LINE_PAUSE)

    return () => clearTimeout(timeoutId)
  }, [])

  const activeLine = LINES[lineIndexRef.current]

  return (
    <div className="hero-terminal">
      <div className="hero-terminal-bar">
        <span className="hero-terminal-dot dot-red" />
        <span className="hero-terminal-dot dot-yellow" />
        <span className="hero-terminal-dot dot-green" />
      </div>

      <div className="hero-terminal-body">
        {displayedLines.map((line, i) => (
          <div className="hero-terminal-line" key={i}>
            {line.isCommand ? (
              <>
                <span className="hero-terminal-prompt">$</span> {line.text}
              </>
            ) : (
              <span className="hero-terminal-output">{line.text}</span>
            )}
          </div>
        ))}

        {activeLine && (
          <div className="hero-terminal-line">
            {activeLine.isCommand ? (
              <>
                <span className="hero-terminal-prompt">$</span> {currentText}
              </>
            ) : (
              <span className="hero-terminal-output">{currentText}</span>
            )}
            <span className="hero-terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  )
}