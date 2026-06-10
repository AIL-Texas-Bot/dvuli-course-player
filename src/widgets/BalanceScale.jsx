import { useState } from 'react'

const PRESET_ASSETS = [
  { label: 'Parent Involvement', type: 'external' },
  { label: 'Positive School Climate', type: 'external' },
  { label: 'Caring Neighbors', type: 'external' },
  { label: 'Youth Programs', type: 'external' },
  { label: 'Creative Activities', type: 'external' },
  { label: 'Caring School Climate', type: 'external' },
  { label: 'Planning & Decision Making', type: 'internal' },
  { label: 'Integrity & Honesty', type: 'internal' },
  { label: 'High Self-Esteem', type: 'internal' },
  { label: 'Sense of Purpose', type: 'internal' },
  { label: 'Personal Responsibility', type: 'internal' },
  { label: 'Interpersonal Competence', type: 'internal' },
]

export default function BalanceScale({ config }) {
  const desc = config.description || ''

  // Extract side labels
  const leftLabel = desc.match(/left\s+pan[^(]*\(([^)]+)\)/i)?.[1]?.trim() || 'External Assets'
  const rightLabel = desc.match(/right\s+pan[^(]*\(([^)]+)\)/i)?.[1]?.trim() || 'Internal Assets'

  const [left, setLeft] = useState([])
  const [right, setRight] = useState([])
  const [tray, setTray] = useState(PRESET_ASSETS)
  const [customInput, setCustomInput] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)
  const [leftDragOver, setLeftDragOver] = useState(false)
  const [rightDragOver, setRightDragOver] = useState(false)

  const totalItems = left.length + right.length
  const diff = left.length - right.length
  
  // Spring tilt calculation: max ±28 degrees
  const tiltDeg = Math.min(28, Math.max(-28, diff * 5))

  // Move preset to left/right
  function movePreset(item, side) {
    if (side === 'left') {
      setLeft(l => [...l, item.label])
    } else {
      setRight(r => [...r, item.label])
    }
    setTray(t => t.filter(x => x.label !== item.label))
  }

  // Remove item back to tray
  function removeItem(index, side) {
    let itemLabel = ''
    if (side === 'left') {
      itemLabel = left[index]
      setLeft(l => l.filter((_, i) => i !== index))
    } else {
      itemLabel = right[index]
      setRight(r => r.filter((_, i) => i !== index))
    }
    
    // Find preset type or default to internal/external
    const isPreset = PRESET_ASSETS.find(x => x.label === itemLabel)
    const presetType = isPreset ? isPreset.type : (side === 'left' ? 'external' : 'internal')
    setTray(t => [...t, { label: itemLabel, type: presetType }])
  }

  function handleAddCustom() {
    if (!customInput.trim()) return
    const newLabel = customInput.trim()
    
    // Default to left (external) or right (internal) depending on active pans or just place in tray
    setTray(t => [...t, { label: newLabel, type: 'custom' }])
    setCustomInput('')
  }

  // Drag and Drop handlers
  function handleDragStart(item) {
    setDraggedItem(item)
  }

  function handleDragOver(e, side) {
    e.preventDefault()
    if (side === 'left') setLeftDragOver(true)
    if (side === 'right') setRightDragOver(true)
  }

  function handleDragLeave(side) {
    if (side === 'left') setLeftDragOver(false)
    if (side === 'right') setRightDragOver(false)
  }

  function handleDrop(e, side) {
    e.preventDefault()
    setLeftDragOver(false)
    setRightDragOver(false)
    if (!draggedItem) return

    movePreset(draggedItem, side)
    setDraggedItem(null)
  }

  function reset() {
    setLeft([])
    setRight([])
    setTray(PRESET_ASSETS)
    setCustomInput('')
  }

  return (
    <div>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
        Balance your development profile. Drag asset cards from the tray into either pan, or click the arrows on the card to place them.
      </p>

      {/* SVG Scale with realistic rotation and hanging baskets */}
      <div className="bs-svg-wrap" style={{ marginBottom: 24 }}>
        <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 360, display: 'block', margin: '0 auto', overflow: 'visible' }}>
          {/* Base & Pillar */}
          <polygon points="160,165 142,190 178,190" fill="var(--text-light)" />
          <rect x={157} y={90} width={6} height={80} rx={3} fill="var(--text-light)" />
          {/* Top Pivot Pin */}
          <circle cx={160} cy={90} r={5} fill="var(--navy)" />

          {/* Rotatable Beam (origin cx=160, cy=90) */}
          <g transform={`rotate(${tiltDeg}, 160, 90)`} style={{ transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}>
            {/* Horizontal beam */}
            <rect x={50} y={87} width={220} height={6} rx={3} fill="var(--navy)" />
            
            {/* Left suspension strings & Pan (Centered at x=60, y=90) */}
            <g transform={`translate(60, 90) rotate(${-tiltDeg})`} style={{ transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}>
              {/* Chains */}
              <line x1={0} y1={3} x2={-20} y2={45} stroke="var(--text-light)" strokeWidth={1.2} />
              <line x1={0} y1={3} x2={20} y2={45} stroke="var(--text-light)" strokeWidth={1.2} />
              {/* Basket / Pan shape */}
              <path d="M-28,45 C-28,55 28,55 28,45 Z" fill={left.length > right.length ? 'var(--navy)' : '#cbd5e1'} opacity={0.9} />
              <ellipse cx={0} cy={45} rx={28} ry={5} fill={left.length > right.length ? 'var(--navy-dark)' : '#94a3b8'} opacity={0.9} />
              {/* Floating items count */}
              <text x={0} y={49} textAnchor="middle" fontSize={11} fontWeight="700" fill="#fff">{left.length}</text>
            </g>

            {/* Right suspension strings & Pan (Centered at x=260, y=90) */}
            <g transform={`translate(260, 90) rotate(${-tiltDeg})`} style={{ transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}>
              {/* Chains */}
              <line x1={0} y1={3} x2={-20} y2={45} stroke="var(--text-light)" strokeWidth={1.2} />
              <line x1={0} y1={3} x2={20} y2={45} stroke="var(--text-light)" strokeWidth={1.2} />
              {/* Basket / Pan shape */}
              <path d="M-28,45 C-28,55 28,55 28,45 Z" fill={right.length > left.length ? 'var(--green)' : '#cbd5e1'} opacity={0.9} />
              <ellipse cx={0} cy={45} rx={28} ry={5} fill={right.length > left.length ? 'var(--green-dark)' : '#94a3b8'} opacity={0.9} />
              {/* Floating items count */}
              <text x={0} y={49} textAnchor="middle" fontSize={11} fontWeight="700" fill="#fff">{right.length}</text>
            </g>
          </g>
        </svg>

        {/* Dynamic Tally Feedback */}
        <div className="bs-tally">
          {left.length === right.length && left.length > 0
            ? '⚖️ Perfectly Balanced! Internal and External assets are aligned.'
            : left.length > right.length
            ? `External Dominant — ${left.length - right.length} more external assets`
            : right.length > left.length
            ? `Internal Dominant — ${right.length - left.length} more internal assets`
            : 'Sort assets to see the scale balance'}
        </div>
      </div>

      {/* Interactive Drag/Drop Board Pans */}
      <div className="bs-layout">
        {/* Left Pan: External Assets */}
        <div 
          className={`bs-pan-area ${leftDragOver ? 'dragover' : ''}`}
          onDragOver={e => handleDragOver(e, 'left')}
          onDragLeave={() => handleDragLeave('left')}
          onDrop={e => handleDrop(e, 'left')}
        >
          <div className="bs-pan-label" style={{ color: 'var(--navy)' }}>{leftLabel}</div>
          <div className="bs-pan-chips">
            {left.map((item, i) => (
              <span key={i} className="widget-chip" style={{ background: 'rgba(0, 85, 140, 0.05)', borderColor: 'rgba(0, 85, 140, 0.15)' }}>
                {item}
                <button className="widget-chip-remove" onClick={() => removeItem(i, 'left')}>×</button>
              </span>
            ))}
            {left.length === 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic', padding: '10px 0' }}>Drag/place external assets here…</span>
            )}
          </div>
        </div>

        {/* Right Pan: Internal Assets */}
        <div 
          className={`bs-pan-area ${rightDragOver ? 'dragover' : ''}`}
          onDragOver={e => handleDragOver(e, 'right')}
          onDragLeave={() => handleDragLeave('right')}
          onDrop={e => handleDrop(e, 'right')}
        >
          <div className="bs-pan-label" style={{ color: 'var(--green)' }}>{rightLabel}</div>
          <div className="bs-pan-chips">
            {right.map((item, i) => (
              <span key={i} className="widget-chip" style={{ color: 'var(--green)', background: 'rgba(49, 155, 65, 0.05)', borderColor: 'rgba(49, 155, 65, 0.15)' }}>
                {item}
                <button className="widget-chip-remove" style={{ color: 'rgba(49, 155, 65, 0.5)' }} onClick={() => removeItem(i, 'right')}>×</button>
              </span>
            ))}
            {right.length === 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic', padding: '10px 0' }}>Drag/place internal assets here…</span>
            )}
          </div>
        </div>
      </div>

      {/* Asset Tray (Preset Items to interact with) */}
      <div className="bs-tray">
        <div className="bs-tray-title">📥 Available Assets Tray (Drag or Click Arrow)</div>
        <div className="bs-tray-items">
          {tray.map((item, i) => (
            <div
              key={i}
              className="bs-tray-chip"
              draggable
              onDragStart={() => handleDragStart(item)}
            >
              <button 
                type="button" 
                onClick={() => movePreset(item, 'left')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '6px', color: 'var(--navy)', fontWeight: 'bold' }}
                title="Move left"
              >
                ←
              </button>
              {item.label}
              <button 
                type="button" 
                onClick={() => movePreset(item, 'right')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '6px', color: 'var(--green)', fontWeight: 'bold' }}
                title="Move right"
              >
                →
              </button>
            </div>
          ))}
          {tray.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Tray empty! All assets placed. Remove them to place back in tray.</div>
          )}
        </div>

        {/* Custom Asset Input */}
        <div className="bs-add-row">
          <input
            className="bs-add-input"
            placeholder="Add custom asset item…"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
          />
          <button className="widget-save-btn" onClick={handleAddCustom}>+ Add to Tray</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="widget-reset-btn" onClick={reset}>↺ Start over</button>
      </div>
    </div>
  )
}
