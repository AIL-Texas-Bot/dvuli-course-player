import { useState, useRef } from 'react'

const COLORS = ['#2563eb', '#319B41', '#d97706', '#dc2626', '#7c3aed', '#b45309', '#6d28d9', '#0891b2']

const DEFAULT_PRESETS = [
  'Leadership changes',
  'Funding constraints',
  'Volunteer turnover',
  'Community resistance',
  'Technology failure',
  'New youth programs',
  'Facility expansions',
  'Staff burnout',
]

const LSA_PRESETS = [
  'James (Low Skill / High Dedication)',
  'Maria (High Skill / High Dedication)',
  'Tanya (Low Skill / Low Dedication)',
  'Sarah (High Skill / Low Dedication)'
]

const LSA_STRATEGIES = {
  'James': { stage: 'Apprentice', strategy: 'Coaching', correctQuad: 'Top-Left', desc: 'James is eager but lacks skill. Use Coaching (S2): provide clear direction but also explain decisions and check in often to build relationship.' },
  'Maria': { stage: 'Master', strategy: 'Delegating', correctQuad: 'Top-Right', desc: 'Maria has high skill and high dedication. Use Delegating (S4): give her full ownership of the project and support her from a distance.' },
  'Tanya': { stage: 'Novice', strategy: 'Directing', correctQuad: 'Bottom-Left', desc: 'Tanya is low skill and low dedication. Use Directing (S1): give clear, specific instructions and close supervision to rebuild her skills.' },
  'Sarah': { stage: 'Journeyman', strategy: 'Supporting', correctQuad: 'Bottom-Right', desc: 'Sarah is highly skilled but has low dedication or feels disconnected. Use Supporting (S3): share decision making, listen, and focus on motivation.' }
}

export default function TwoAxisMap({ config, blockId }) {
  const desc = config.description || ''
  const isLsa = blockId === 'ch3-widget-0'

  const activePresets = isLsa ? LSA_PRESETS : DEFAULT_PRESETS

  // Extract axis labels
  const xMatch = desc.match(/horizontal axis\s*=\s*([^(,\n]{3,30})/i) || desc.match(/x-axis[:\s]+([^(,\n]{3,25})/i)
  const yMatch = desc.match(/vertical axis\s*=\s*([^(,\n]{3,30})/i)  || desc.match(/y-axis[:\s]+([^(,\n]{3,25})/i)

  const xLabel = isLsa ? 'Skill Level' : (xMatch ? xMatch[1].trim().split('(')[0].trim() : 'Impact')
  const yLabel = isLsa ? 'Dedication / Commitment' : (yMatch ? yMatch[1].trim().split('(')[0].trim() : 'Certainty')

  const [bubbles, setBubbles] = useState([])
  const [inputText, setInputText] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)
  const [movingBubble, setMovingBubble] = useState(null)
  const svgRef = useRef(null)

  const W = 420; const H = 340
  const pad = 44

  function getQuadrant(x, y) {
    const isRight = x >= W / 2
    const isTop = y < H / 2
    if (isTop && isRight) return 'Top-Right'
    if (isTop && !isRight) return 'Top-Left'
    if (!isTop && isRight) return 'Bottom-Right'
    return 'Bottom-Left'
  }

  function getLsaQuadLabel(quad) {
    if (quad === 'Top-Right') return 'Master (Delegating)'
    if (quad === 'Top-Left') return 'Apprentice (Coaching)'
    if (quad === 'Bottom-Left') return 'Novice (Directing)'
    return 'Journeyman (Supporting)'
  }

  function addBubble(label) {
    if (!label.trim()) return
    const id = `bubble-${Date.now()}`
    setBubbles(bs => [...bs, {
      id,
      label: label.trim(),
      x: W / 2 + (Math.random() * 40 - 20),
      y: H / 2 + (Math.random() * 40 - 20),
      color: COLORS[bs.length % COLORS.length],
    }])
  }

  function handleCustomAdd() {
    if (!inputText.trim()) return
    addBubble(inputText)
    setInputText('')
  }

  function removeBubble(id) {
    setBubbles(bs => bs.filter(b => b.id !== id))
  }

  function handlePresetDragStart(e, label) {
    setDraggedItem(label)
    e.dataTransfer.setData('text/plain', label)
  }

  function handleSvgDragOver(e) {
    e.preventDefault()
    if (!svgRef.current) return
    
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width * W
    const py = (e.clientY - rect.top) / rect.height * H
    
    const x = Math.min(W - pad, Math.max(pad, px))
    const y = Math.min(H - pad, Math.max(pad, py))

    if (movingBubble) {
      setBubbles(bs => bs.map(b => b.id === movingBubble.id ? { ...b, x, y } : b))
    }
  }

  function handleSvgDrop(e) {
    e.preventDefault()
    if (!svgRef.current) return
    
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width * W
    const py = (e.clientY - rect.top) / rect.height * H
    
    const x = Math.min(W - pad, Math.max(pad, px))
    const y = Math.min(H - pad, Math.max(pad, py))

    if (movingBubble) {
      setBubbles(bs => bs.map(b => b.id === movingBubble.id ? { ...b, x, y } : b))
      setMovingBubble(null)
    } else if (draggedItem) {
      setBubbles(bs => [...bs, {
        id: `bubble-${Date.now()}`,
        label: draggedItem,
        x, y,
        color: COLORS[bs.length % COLORS.length]
      }])
      setDraggedItem(null)
    }
  }

  function handleBubbleDragStart(e, bubble) {
    setMovingBubble(bubble)
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  function handleSvgClick(e) {
    if (inputText.trim()) {
      const svg = svgRef.current
      const rect = svg.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width * W
      const py = (e.clientY - rect.top) / rect.height * H
      const x = Math.min(W - pad, Math.max(pad, px))
      const y = Math.min(H - pad, Math.max(pad, py))

      setBubbles(bs => [...bs, {
        id: `bubble-${Date.now()}`,
        label: inputText.trim(),
        x, y,
        color: COLORS[bs.length % COLORS.length]
      }])
      setInputText('')
    }
  }

  function reset() {
    setBubbles([])
    setInputText('')
    setDraggedItem(null)
    setMovingBubble(null)
  }

  const unplacedPresets = activePresets.filter(label => !bubbles.some(b => b.label === label))

  // Find placed LSA bubbles info
  const lsaEvaluations = bubbles.map(b => {
    // extract key e.g. "James"
    const key = Object.keys(LSA_STRATEGIES).find(k => b.label.includes(k))
    if (!key) return null
    const strategyInfo = LSA_STRATEGIES[key]
    const currentQuad = getQuadrant(b.x, b.y)
    const isCorrect = currentQuad === strategyInfo.correctQuad
    return {
      label: b.label,
      key,
      isCorrect,
      currentQuad,
      ...strategyInfo
    }
  }).filter(Boolean)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {isLsa 
          ? 'Leader-Style Alignment mapping. Drag candidates onto the grid based on their Skill and Dedication, then review their recommended developmental strategies.'
          : 'Strategic layout mapping. Drag preset factors from the tray directly onto the map grid, or grab and drag existing bubbles to re-position them within the quadrants.'
        }
      </p>

      <div className="tam-layout">
        {/* Chart SVG */}
        <div className="tam-chart-wrap">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="tam-chart-svg"
            onDragOver={handleSvgDragOver}
            onDrop={handleSvgDrop}
            onClick={handleSvgClick}
            style={{ cursor: inputText.trim() ? 'crosshair' : 'default' }}
          >
            {/* Background quadrant highlights */}
            <rect x={pad} y={pad} width={(W-2*pad)/2} height={(H-2*pad)/2} fill="rgba(0,0,0,0.01)" className="tam-quadrant-rect" />
            <rect x={W/2} y={pad} width={(W-2*pad)/2} height={(H-2*pad)/2} fill="rgba(0,0,0,0.01)" className="tam-quadrant-rect" />
            <rect x={pad} y={H/2} width={(W-2*pad)/2} height={(H-2*pad)/2} fill="rgba(0,0,0,0.01)" className="tam-quadrant-rect" />
            <rect x={W/2} y={H/2} width={(W-2*pad)/2} height={(H-2*pad)/2} fill="rgba(0,0,0,0.01)" className="tam-quadrant-rect" />

            {/* Grid gridlines */}
            {[1,2,3,4].map(i => (
              <g key={i}>
                <line x1={pad + i*(W-2*pad)/5} y1={pad} x2={pad + i*(W-2*pad)/5} y2={H-pad} stroke="rgba(228,223,217,0.5)" strokeWidth={1} />
                <line x1={pad} y1={pad + i*(H-2*pad)/5} x2={W-pad} y2={pad + i*(H-2*pad)/5} stroke="rgba(228,223,217,0.5)" strokeWidth={1} />
              </g>
            ))}

            {/* Quadrant dividers */}
            <line x1={W/2} y1={pad} x2={W/2} y2={H-pad} stroke="rgba(0, 85, 140, 0.25)" strokeWidth={2} strokeDasharray="4 3" />
            <line x1={pad} y1={H/2} x2={W-pad} y2={H/2} stroke="rgba(0, 85, 140, 0.25)" strokeWidth={2} strokeDasharray="4 3" />

            {/* Axes */}
            <line x1={pad} y1={H-pad} x2={W-pad} y2={H-pad} stroke="var(--navy)" strokeWidth={2.5} markerEnd="url(#arrow)" />
            <line x1={pad} y1={H-pad} x2={pad} y2={pad} stroke="var(--navy)" strokeWidth={2.5} markerEnd="url(#arrow)" />

            <defs>
              <marker id="arrow" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto">
                <path d="M0,0 L0,8 L8,4 z" fill="var(--navy)" />
              </marker>
            </defs>

            {/* Axis labels */}
            <text x={W/2} y={H-8} textAnchor="middle" fontSize={11} fontWeight="700" fill="var(--navy)">{xLabel} →</text>
            <text x={12} y={H/2} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight="700" fill="var(--navy)"
              transform={`rotate(-90, 12, ${H/2})`}>
              ↑ {yLabel}
            </text>

            {/* Low/High axis limits */}
            <text x={pad+4} y={H-pad+16} fontSize={8.5} fontWeight="700" fill="#94a3b8">Low</text>
            <text x={W-pad-4} y={H-pad+16} fontSize={8.5} fontWeight="700" fill="#94a3b8" textAnchor="end">High</text>
            <text x={pad-6} y={H-pad-4} fontSize={8.5} fontWeight="700" fill="#94a3b8" textAnchor="end">Low</text>
            <text x={pad-6} y={pad+6} fontSize={8.5} fontWeight="700" fill="#94a3b8" textAnchor="end">High</text>

            {/* Quadrant text indicators */}
            <text x={pad+8} y={pad+14} fontSize={8} fontWeight="bold" fill="#cbd5e1" textAnchor="start">
              {isLsa ? 'APPRENTICE (COACH)' : 'QUAD II'}
            </text>
            <text x={W-pad-8} y={pad+14} fontSize={8} fontWeight="bold" fill="#cbd5e1" textAnchor="end">
              {isLsa ? 'MASTER (DELEGATE)' : 'QUAD I'}
            </text>
            <text x={pad+8} y={H-pad-8} fontSize={8} fontWeight="bold" fill="#cbd5e1" textAnchor="start">
              {isLsa ? 'NOVICE (DIRECT)' : 'QUAD III'}
            </text>
            <text x={W-pad-8} y={H-pad-8} fontSize={8} fontWeight="bold" fill="#cbd5e1" textAnchor="end">
              {isLsa ? 'JOURNEYMAN (SUPPORT)' : 'QUAD IV'}
            </text>

            {/* Placed bubbles on map */}
            {bubbles.map(b => (
              <g
                key={b.id}
                transform={`translate(${b.x}, ${b.y})`}
                draggable
                onDragStart={(e) => handleBubbleDragStart(e, b)}
                className="tam-bubble-marker"
              >
                <circle cx={0} cy={0} r={18} fill={b.color} opacity={0.88} />
                <circle cx={0} cy={0} r={18} fill="none" stroke="#fff" strokeWidth={1.5} />
                <text x={0} y={1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fontWeight="700" fill="#fff">
                  {b.label.split(' ')[0].slice(0, 7)}
                </text>
                {/* Delete cross */}
                <circle cx={14} cy={-14} r={5} fill="#ef4444" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); removeBubble(b.id) }} />
                <text x={14} y={-14} textAnchor="middle" dominantBaseline="middle" fontSize={5.5} fontWeight="bold" fill="#fff">×</text>
              </g>
            ))}
          </svg>
          {inputText.trim() && (
            <p style={{ fontSize: 11, color: 'var(--amber)', textAlign: 'center', marginTop: 6, fontWeight: '700' }}>
              🎯 Click anywhere on the map above to place "{inputText}"
            </p>
          )}
        </div>

        {/* Sidebar Controls */}
        <div>
          <div className="tam-sidebar-title">Custom Item Input</div>
          <div className="tam-add-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              className="widget-input"
              placeholder="e.g. Budget limitations"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustomAdd()}
            />
            <button className="widget-save-btn" onClick={handleCustomAdd}>
              {inputText.trim() ? 'Ready to Place' : 'Create Item'}
            </button>
          </div>

          {bubbles.length > 0 && (
            <>
              <div className="tam-sidebar-title">Mapped Factors ({bubbles.length})</div>
              <div className="tam-items-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {bubbles.map(b => (
                  <div key={b.id} className="tam-item-row">
                    <span className="tam-item-dot" style={{ background: b.color }} />
                    <span className="tam-item-name" style={{ fontSize: 11 }}>{b.label}</span>
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--navy)', background: 'var(--navy-light)', padding: '2px 6px', borderRadius: '4px' }}>
                      {isLsa ? getLsaQuadLabel(getQuadrant(b.x, b.y)) : getQuadrant(b.x, b.y)}
                    </span>
                    <button className="tam-item-del" onClick={() => removeBubble(b.id)}>×</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* LSA Diagnostic Review Cards */}
      {isLsa && lsaEvaluations.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>📋 LSA Alignment Evaluation</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lsaEvaluations.map((evalItem, idx) => (
              <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', borderLeft: `4px solid ${evalItem.isCorrect ? 'var(--correct)' : 'var(--incorrect)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>{evalItem.key}</strong>
                  <span style={{ fontSize: 11, fontWeight: '700', padding: '2px 8px', borderRadius: 4, background: evalItem.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: evalItem.isCorrect ? 'var(--correct)' : 'var(--incorrect)' }}>
                    {evalItem.isCorrect ? '✓ Aligned' : '✗ Misaligned'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Current Position: <strong>{getLsaQuadLabel(evalItem.currentQuad)}</strong>
                  {!evalItem.isCorrect && (
                    <span> (Expected: <strong>{getLsaQuadLabel(evalItem.correctQuad)}</strong>)</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-main)', lineHeight: '1.4' }}>
                  {evalItem.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Drawer */}
      <div className="bs-tray" style={{ marginTop: '0' }}>
        <div className="bs-tray-title">📥 Factors Drawer (Drag presets onto the map grid, or click to auto-place)</div>
        <div className="bs-tray-items">
          {unplacedPresets.map((label, i) => (
            <div
              key={i}
              className="bs-tray-chip"
              draggable
              onDragStart={(e) => handlePresetDragStart(e, label)}
              onClick={() => addBubble(label)}
              style={{ cursor: 'grab' }}
            >
              ✥ {label}
            </div>
          ))}
          {unplacedPresets.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>All preset factors placed. Create custom ones above.</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="widget-reset-btn" onClick={reset}>↺ Reset Map</button>
      </div>
    </div>
  )
}
