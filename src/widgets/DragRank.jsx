import { useState } from 'react'

const DVULI_INSIGHT = `In DVULI's framework, all three methods work together — but the deepest self-knowledge comes from integrating what you observe about yourself, what trusted others reflect back to you, and what formal assessments reveal. No single method is sufficient alone.`

export default function DragRank({ config }) {
  const desc = config.description || ''

  // Extract items from description or default to core methods
  const quoted = [...desc.matchAll(/'([^']{3,40})'/g)].map(m => m[1])
  const items = quoted.length >= 2 ? quoted.slice(0, 5) :
    ['Personal Reflection', 'Feedback from Others', 'Formal Evaluation']

  const [order, setOrder] = useState(() => items.map((label, i) => ({ id: `rank-${i}`, label })))
  const [revealed, setRevealed] = useState(false)
  const [reflection, setReflection] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)

  function move(idx, dir) {
    const next = [...order]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setOrder(next)
  }

  function handleDragStart(e, idx) {
    setDraggedIndex(idx)
    e.dataTransfer.effectAllowed = 'move'
    // Set a tiny bit of opacity on the drag visual
    setTimeout(() => {
      e.target.classList.add('dragging')
    }, 0)
  }

  function handleDragOver(e, idx) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === idx) return

    // Reorder items in state immediately for dynamic swap animation
    const next = [...order]
    const item = next[draggedIndex]
    next.splice(draggedIndex, 1)
    next.splice(idx, 0, item)
    setOrder(next)
    setDraggedIndex(idx)
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging')
    setDraggedIndex(null)
  }

  function reset() {
    setOrder(items.map((label, i) => ({ id: `rank-${i}`, label })))
    setRevealed(false)
    setReflection('')
  }

  const COLORS = ['#00558C', '#2563eb', '#319B41', '#d97706', '#dc2626']

  return (
    <div className="dr-container">
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
        Rank these options in the order of importance to you. Drag and drop cards to rearrange them, or use the arrow buttons.
      </p>
      
      <div className="dr-cards">
        {order.map((item, idx) => {
          const isDragging = draggedIndex === idx
          return (
            <div
              key={item.id}
              className={`dr-card ${revealed ? 'locked' : ''} ${isDragging ? 'dragging' : ''}`}
              draggable={!revealed}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
            >
              <div 
                className="dr-rank" 
                style={{ 
                  background: revealed ? 'var(--green)' : COLORS[idx % COLORS.length],
                  transition: 'background 0.3s'
                }}
              >
                {idx + 1}
              </div>
              <div className="dr-card-label">{item.label}</div>
              
              {!revealed && (
                <>
                  <div className="dr-btns" style={{ marginRight: '8px' }}>
                    <button type="button" className="dr-btn" onClick={() => move(idx, -1)} disabled={idx === 0}>▲</button>
                    <button type="button" className="dr-btn" onClick={() => move(idx, 1)} disabled={idx === order.length - 1}>▼</button>
                  </div>
                  <div className="dr-drag-handle">☰</div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {!revealed && (
        <div style={{ marginTop: 20 }}>
          <textarea
            className="widget-textarea"
            placeholder="Reflect on why you chose this order. What does it reveal about your leadership priorities?"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
          />
          <button
            type="button"
            className="widget-save-btn"
            style={{ marginTop: 12 }}
            onClick={() => setRevealed(true)}
            disabled={reflection.trim().length < 5}
          >
            Lock in my ranking →
          </button>
        </div>
      )}

      {revealed && (
        <div className="dr-reveal">
          <div className="dr-reveal-title">💡 Assessment Insights</div>
          <div className="dr-reveal-text">{DVULI_INSIGHT}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            <button className="widget-reset-btn" onClick={reset}>↺ Reorder</button>
          </div>
        </div>
      )}
    </div>
  )
}
