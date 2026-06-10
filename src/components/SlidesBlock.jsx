import { useState, useEffect, useCallback } from 'react'

function Slide({ slide, animKey }) {
  const layout = slide.layout || 'content'
  return (
    <div className="slide-stage slide-fade-enter" key={animKey} data-layout={layout}>
      {slide.title && <div className="slide-title-text">{slide.title}</div>}
      {slide.bodyText && <div className="slide-body-text">{slide.bodyText}</div>}
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="slide-bullets">
          {slide.bullets.map((b, i) => (
            <li key={i} className="slide-bullet">{b}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function SlidesBlock({ block }) {
  const slides = block.slides || []
  const [current, setCurrent] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= slides.length) return
    setCurrent(idx)
    setAnimKey(k => k + 1)
  }, [slides.length])

  // Keyboard navigation (only when focused or fullscreen)
  useEffect(() => {
    if (!fullscreen) return
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1)
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fullscreen, current, goTo])

  if (!slides.length) return null
  const slide = slides[current]

  return (
    <div className={`slides-block${fullscreen ? ' fullscreen' : ''}`}>
      <div className="slides-header">
        <div className="slides-header-title">🖥 {block.title || 'Session Slides'}</div>
        <div className="slides-header-actions">
          <span className="slide-counter">{current + 1} / {slides.length}</span>
          <button
            className="fullscreen-btn"
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? '⊠' : '⊞'}
          </button>
        </div>
      </div>

      <Slide slide={slide} animKey={animKey} />

      <div className="slide-controls">
        <button
          className="slide-nav-btn"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
        >
          ← Prev
        </button>
        <div className="slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`slide-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="slide-nav-btn"
          onClick={() => goTo(current + 1)}
          disabled={current === slides.length - 1}
        >
          Next →
        </button>
      </div>

      {showNotes && slide.speakerNotes && (
        <div className="speaker-notes-panel">
          <div className="speaker-notes-label">🎤 Speaker Notes</div>
          <div className="speaker-notes-text">{slide.speakerNotes}</div>
        </div>
      )}

      <div className="slides-footer">
        {slide.speakerNotes && (
          <button
            className="speaker-notes-toggle"
            onClick={() => setShowNotes(n => !n)}
          >
            {showNotes ? 'Hide Notes' : '🎤 Speaker Notes'}
          </button>
        )}
      </div>
    </div>
  )
}
