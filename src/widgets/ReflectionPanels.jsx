import { useState } from 'react'

const SLIDER_LABELS = ['Just Beginning', 'Exploring', 'Growing', 'Practicing', 'Living This Fully']

function DialSelector({ value, onChange }) {
  const steps = [1, 2, 3, 4, 5]
  const colors = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#6d28d9']
  
  return (
    <div className="rp-dial-container">
      <div className="rp-dial-track" style={{ display: 'flex', gap: '8px' }}>
        {steps.map(step => {
          const active = value === step
          const activeColor = colors[step - 1]
          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: active ? activeColor : 'rgba(228, 223, 217, 0.8)',
                background: active ? activeColor : '#fff',
                color: active ? '#fff' : '#64748b',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: active ? `0 4px 12px ${activeColor}40` : 'none',
                transform: active ? 'scale(1.12)' : 'none',
              }}
            >
              {step}
            </button>
          )
        })}
      </div>
      <div className="rp-dial-label">
        {value > 0 ? SLIDER_LABELS[value - 1] : 'Rate dimension…'}
      </div>
    </div>
  )
}

function Panel({ title, prompt, idx, isOpen, onToggle, value, onChange, sliderVal, onSlider }) {
  const done = sliderVal > 0 && value.trim().length > 10
  return (
    <div className={`rp-panel ${isOpen ? 'active' : ''}`}>
      <div className="rp-panel-header" onClick={onToggle}>
        <div className="rp-panel-title">{title}</div>
        <div className="rp-panel-status">
          {done && <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>}
          {sliderVal > 0 && (
            <span style={{
              fontSize: '11px', fontWeight: '700', background: 'var(--navy)',
              color: '#fff', borderRadius: '99px', padding: '3px 9px'
            }}>{sliderVal}/5</span>
          )}
          <span style={{ fontSize: 16, color: '#94a3b8', transition: 'transform .25s',
            transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
        </div>
      </div>
      {isOpen && (
        <div className="rp-panel-body">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {prompt}
          </p>
          <textarea
            className="widget-textarea"
            placeholder="Write your reflections here…"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          <div style={{ marginTop: '6px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Level of Practice:
            </div>
            <DialSelector value={sliderVal} onChange={onSlider} />
          </div>
        </div>
      )}
    </div>
  )
}

function PurposeCompass({ panels, scores, onAdjustScore }) {
  const size = 220; const cx = 110; const cy = 110; const R = 80
  const angles = panels.map((_, i) => (-90 + (360 / panels.length) * i) * Math.PI / 180)
  
  const points = angles.map((a, i) => {
    const s = scores[i] || 1
    return {
      x: cx + R * Math.cos(a),
      y: cy + R * Math.sin(a),
      fill: cx + (s / 5) * R * Math.cos(a),
      fillY: cy + (s / 5) * R * Math.sin(a),
    }
  })
  
  const outerPoly = points.map(p => `${p.x},${p.y}`).join(' ')
  const innerPoly = points.map(p => `${p.fill},${p.fillY}`).join(' ')

  function handleCompassClick(e, idx) {
    e.stopPropagation()
    // Set score to index value
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    
    // Calculate distance from center
    const dx = clickX - (rect.width / 2)
    const dy = clickY - (rect.height / 2)
    const dist = Math.sqrt(dx*dx + dy*dy)
    const maxDist = (rect.width / 2) * (R / (size / 2))
    
    // Convert to 1-5 score
    const newScore = Math.max(1, Math.min(5, Math.round((dist / maxDist) * 5)))
    onAdjustScore(idx, newScore)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rp-compass-svg">
        {/* Reference rings */}
        {[.25,.5,.75,1].map(r => (
          <polygon key={r}
            points={points.map((p, i) => `${cx + r*R*Math.cos(angles[i])},${cy + r*R*Math.sin(angles[i])}`).join(' ')}
            fill="none" stroke="rgba(0, 85, 140, 0.15)" strokeWidth={1} />
        ))}
        {/* Axis lines */}
        {points.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(228, 223, 217, 0.8)" strokeWidth={1.5} />
        ))}
        {/* Filled radar */}
        <polygon points={innerPoly} fill="rgba(0, 85, 140, 0.15)" stroke="var(--navy)" strokeWidth={2.5} style={{ transition: 'all 0.3s ease' }} />
        
        {/* Interactive rating handles */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.fill}
            cy={p.fillY}
            r={7}
            fill="var(--navy)"
            stroke="#fff"
            strokeWidth={2}
            style={{ cursor: 'ns-resize', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))', transition: 'all 0.3s ease' }}
            title={`Drag or click axis to adjust ${panels[i]}`}
          />
        ))}

        {/* Clickable transparent overlays for axes to allow direct click ratings */}
        {points.map((p, i) => {
          // Draw thin invisible hover targets along the axis lines
          return (
            <line
              key={`target-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="transparent"
              strokeWidth={18}
              style={{ cursor: 'pointer' }}
              onClick={(e) => handleCompassClick(e, i)}
            />
          )
        })}

        {/* Labels */}
        {panels.map((label, i) => (
          <text key={i}
            x={cx + (R + 20) * Math.cos(angles[i])}
            y={cy + (R + 20) * Math.sin(angles[i])}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9.5} fontWeight="700" fill="var(--navy)"
          >
            {label.split(' ').map((w, j) => (
              <tspan key={j} x={cx + (R + 20) * Math.cos(angles[i])} dy={j === 0 ? 0 : 11}>{w}</tspan>
            ))}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default function ReflectionPanels({ config, blockId }) {
  const desc = config.description || ''
  const slashMatch = desc.match(/\(([^)]+\/[^)]+)\)/)
  const panels = slashMatch
    ? slashMatch[1].split('/').map(s => s.trim())
    : ['Know God', 'Make the World Better', 'Use Your Greatest Gift']

  const basePrompt = 'Write your thoughts on how you are applying this calling dimension in your current leadership context.'

  const [open, setOpen] = useState(0)
  const [texts, setTexts] = useState(() => panels.map(() => ''))
  const [scores, setScores] = useState(() => panels.map(() => 0))

  const allScored = scores.every(s => s > 0)

  function setText(i, val) { setTexts(t => { const n = [...t]; n[i] = val; return n }) }
  function setScore(i, val) { setScores(s => { const n = [...s]; n[i] = val; return n }) }
  function reset() { setTexts(panels.map(() => '')); setScores(panels.map(() => 0)); setOpen(0) }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {panels.map((title, i) => (
          <Panel
            key={i}
            title={title}
            prompt={basePrompt}
            idx={i}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
            value={texts[i]}
            onChange={v => setText(i, v)}
            sliderVal={scores[i]}
            onSlider={v => setScore(i, v)}
          />
        ))}
      </div>
      
      {scores.some(s => s > 0) && (
        <div className="rp-compass">
          <div className="rp-compass-title">🧭 Interactive Purpose Compass</div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', marginTop: '-8px' }}>
            Click anywhere along the compass axes to dynamically adjust your ratings in real time.
          </p>
          <PurposeCompass 
            panels={panels} 
            scores={scores.map(s => s || 1)} 
            onAdjustScore={(idx, val) => setScore(idx, val)} 
          />
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
        <button className="widget-reset-btn" onClick={reset}>↺ Start over</button>
      </div>
    </>
  )
}
