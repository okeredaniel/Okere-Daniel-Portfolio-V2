import { useEffect } from 'react'
import { X, Maximize2 } from 'lucide-react'
import resumePdf from '../assets/Daniel_Okere_CV.pdf'
import './ResumeModal.css'

export default function ResumeModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="resume-overlay">
      <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
        <div className="resume-modal-top">
          <span className="resume-modal-title">Resume</span>
          <button className="resume-modal-close" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className="resume-modal-body">
          <iframe
            src={`${resumePdf}#toolbar=0&navpanes=0&scrollbar=0`}
            title="Resume preview"
            className="resume-iframe"
          />
        </div>

        <div className="resume-modal-footer">
          <a
            href={resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-open-full"
          >
            Open full size
            <Maximize2 size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}