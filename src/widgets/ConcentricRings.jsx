import { useState, useRef, useEffect } from 'react'

const RING_COLORS = ['#7c3aed', '#2563eb', '#319B41']

const PRESETS = {
  golden: {
    title: 'Golden Circle (Why-How-What)',
    rings: [
      { name: 'Why (Core Vocation)', prompt: 'What injustice breaks your heart? What transformation do you believe is possible?', color: '#7c3aed', minR: 0, maxR: 55 },
      { name: 'How (Methodology)', prompt: 'What distinctive methods, relationships, or approaches does your ministry use?', color: '#2563eb', minR: 55, maxR: 95 },
      { name: 'What (Programs)', prompt: 'What programs, services, or activities do you deliver?', color: '#319B41', minR: 95, maxR: 135 },
    ],
    ideas: [
      { label: 'Restore hope to youth', ringIdx: 0 },
      { label: 'Stand for social justice', ringIdx: 0 },
      { label: 'One-on-one mentorship', ringIdx: 1 },
      { label: 'Covenant relationships', ringIdx: 1 },
      { label: 'After-school tutoring', ringIdx: 2 },
      { label: 'Friday night youth club', ringIdx: 2 },
    ]
  },
  resource: {
    title: 'Resource Wheel',
    rings: [
      { name: 'Core Contributors', prompt: 'Who are the 3–5 people you know well who are already committed contributors?', color: '#7c3aed', minR: 0, maxR: 55 },
      { name: 'Potential Partners', prompt: 'Who knows about your ministry but isn\'t yet deeply engaged? List organizations/individuals.', color: '#2563eb', minR: 55, maxR: 95 },
      { name: 'Wider Community', prompt: 'What broader community resources, funders, or institutions could be cultivated?', color: '#319B41', minR: 95, maxR: 135 },
    ],
    ideas: [
      { label: 'Volunteer leaders', ringIdx: 0 },
      { label: 'Core parents council', ringIdx: 0 },
      { label: 'Local Rotary Club', ringIdx: 1 },
      { label: 'Westside Community Center', ringIdx: 1 },
      { label: 'City Youth Grant', ringIdx: 2 },
      { label: 'State Food Bank network', ringIdx: 2 },
    ]
  },
  abcd: {
    title: 'ABCD Asset Map',
    rings: [
      { name: 'Individuals', prompt: 'What gifts, skills, and knowledge do individuals in your community bring?', color: '#7c3aed', minR: 0, maxR: 55 },
      { name: 'Associations', prompt: 'What informal groups, clubs, or community organizations exist in your area?', color: '#2563eb', minR: 55, maxR: 95 },
      { name: 'Institutions', prompt: 'What formal institutions — schools, hospitals, businesses — are present?', color: '#319B41', minR: 95, maxR: 135 },
    ],
    ideas: [
      { label: 'Skilled youth leaders', ringIdx: 0 },
      { label: 'Local baking business owner', ringIdx: 0 },
      { label: 'Teen skateboarding club', ringIdx: 1 },
      { label: 'Neighborhood garden team', ringIdx: 1 },
      { label: 'Westside High School', ringIdx: 2 },
      { label: 'Grace Health Clinic', ringIdx: 2 },
    ]
  }
}

function detectPresetType(desc) {
  const d = desc.toLowerCase()
  if (d.includes('golden circle') || d.includes('why-how-what')) return 'golden'
  if (d.includes('resource wheel') || d.includes('kretzmann') || d.includes('three-ring')) return 'resource'
  return 'abcd'
}

export default function ConcentricRings({ config }) {
  const desc = config.description || ''
  const presetType = detectPresetType(desc)
  const presetData = PRESETS[presetType]
  const rings = presetData.rings

  const [items, setItems] = useState([])
  const [inputText, setInputText] = useState('')
  const [activeRing, setActiveRing] = useState(0)
  const [draggedItem, setDraggedItem] = useState(null)
  
  const svgRef = useRef(null)
  const cx = 140; const cy = 140
  const ringBoundaries = [55, 95, 135]

  // Initialize with some presets
  useEffect(() => {
    // Generate scattered points inside correct rings
    const initial = presetData.ideas.map((idea, i) => {
      const { x, y } = generatePointInRing(idea.ringIdx)
      return {
        id: `preset-${i}`,
        label: idea.label,
        ringIdx: idea.ringIdx,
        x, y
      }
    })
    setItems(initial)
  }, [presetType])

  function generatePointInRing(ringIdx) {
    const minR = ringIdx === 0 ? 12 : ringBoundaries[ringIdx - 1] + 12
    const maxR = ringBoundaries[ringIdx] - 12
    const r = minR + Math.random() * (maxR - minR)
    const angle = Math.random() * 2 * Math.PI
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    }
  }

  function handleAddCustom() {
    if (!inputText.trim()) return
    const { x, y } = generatePointInRing(activeRing)
    setItems(it => [...it, {
      id: `custom-${Date.now()}`,
      label: inputText.trim(),
      ringIdx: activeRing,
      x, y
    }])
    setInputText('')
  }

  function handlePresetClick(idea) {
    const { x, y } = generatePointInRing(idea.ringIdx)
    setItems(it => [...it, {
      id: `idea-${Date.now()}`,
      label: idea.label,
      ringIdx: idea.ringIdx,
      x, y
    }])
  }

  function deleteItem(id) {
    setItems(it => it.filter(item => item.id !== id))
  }

  // Drag handles for moving bubbles directly on the SVG
  function handleSvgDragStart(e, item) {
    setDraggedItem(item)
    // Create an invisible drag image to prevent native ghosting
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  function handleSvgDragOver(e) {
    e.preventDefault()
    if (!draggedItem || !svgRef.current) return
    
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width * 280
    const py = (e.clientY - rect.top) / rect.height * 280

    // Clamp coordinates
    const dx = px - cx
    const dy = py - cy
    const dist = Math.sqrt(dx*dx + dy*dy)
    const clampedDist = Math.min(130, dist)
    
    const angle = Math.atan2(dy, dx)
    const newX = cx + clampedDist * Math.cos(angle)
    const newY = cy + clampedDist * Math.sin(angle)

    // Detect which ring it is in now based on distance
    let newRingIdx = 2 // Outer default
    if (clampedDist < ringBoundaries[0]) newRingIdx = 0
    else if (clampedDist < ringBoundaries[1]) newRingIdx = 1

    setItems(it => it.map(item => 
      item.id === draggedItem.id 
        ? { ...item, x: newX, y: newY, ringIdx: newRingIdx } 
        : item
    ))
  }

  function handleSvgDragEnd() {
    setDraggedItem(null)
  }

  function reset() {
    setItems([])
    setInputText('')
    setActiveRing(0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Interactive asset mapping. Drag chips from the ideas tray onto the rings below, or drag item bubbles directly between rings on the SVG board to categorize them.
      </p>

      <div className="cr2-layout">
        {/* SVG concentric chart */}
        <div className="cr2-svg-wrap">
          <svg
            ref={svgRef}
            viewBox="0 0 280 280"
            width={260}
            height={260}
            className="cr2-svg"
            onDragOver={handleSvgDragOver}
          >
            {/* Draw concentric rings outside-in */}
            {[2, 1, 0].map(idx => {
              const r = ringBoundaries[idx]
              const ring = rings[idx]
              const isActive = activeRing === idx
              
              return (
                <g key={idx}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={idx === 2 ? '#faf8f5' : idx === 1 ? 'rgba(255,255,255,0.75)' : '#fff'}
                    stroke={isActive ? ring.color : 'rgba(228, 223, 217, 0.8)'}
                    strokeWidth={isActive ? 3 : 1.5}
                    onClick={() => setActiveRing(idx)}
                    style={{ cursor: 'pointer', transition: 'stroke 0.2s, stroke-width 0.2s' }}
                  />
                  {/* Category arc text labels */}
                  <text
                    x={cx}
                    y={cy - r + 13}
                    textAnchor="middle"
                    fontSize={8.5}
                    fontWeight="700"
                    fill={ring.color}
                    opacity={0.65}
                    style={{ pointerEvents: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                  >
                    {ring.name.split(' (')[0]}
                  </text>
                </g>
              )
            })}
            
            {/* Center dot */}
            <circle cx={cx} cy={cy} r={5} fill="var(--navy)" opacity={0.3} />

            {/* Render items as floating bubbles directly in the rings */}
            {items.map(item => {
              const ring = rings[item.ringIdx]
              const isDragged = draggedItem?.id === item.id
              
              return (
                <g
                  key={item.id}
                  transform={`translate(${item.x}, ${item.y})`}
                  draggable
                  onDragStart={(e) => handleSvgDragStart(e, item)}
                  onDragEnd={handleSvgDragEnd}
                  style={{ cursor: 'grab' }}
                  className="float-bubble"
                >
                  {/* Glowing bubble anchor */}
                  <rect
                    x={-42}
                    y={-10}
                    width={84}
                    height={20}
                    rx={10}
                    fill="#fff"
                    stroke={ring.color}
                    strokeWidth={isDragged ? 2.5 : 1.5}
                    opacity={isDragged ? 0.9 : 0.85}
                    style={{
                      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))',
                      transition: 'stroke 0.25s, stroke-width 0.25s'
                    }}
                  />
                  {/* Item label */}
                  <text
                    x={0}
                    y={1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={7.5}
                    fontWeight="700"
                    fill="#0f172a"
                    style={{ pointerEvents: 'none' }}
                  >
                    {item.label.length > 18 ? item.label.slice(0, 16) + '..' : item.label}
                  </text>
                  {/* Delete button (displays on hover in web) */}
                  <circle
                    cx={36}
                    cy={-7}
                    r={5.5}
                    fill="#ef4444"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id) }}
                  />
                  <text
                    x={36}
                    y={-7}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={6}
                    fontWeight="bold"
                    fill="#fff"
                    style={{ pointerEvents: 'none' }}
                  >
                    ×
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Ring edit panels */}
        <div className="cr2-panels">
          {rings.map((ring, idx) => {
            const ringItems = items.filter(it => it.ringIdx === idx)
            const isActive = activeRing === idx
            
            return (
              <div key={idx} className={`cr2-ring-panel ${isActive ? 'active' : ''}`}>
                <div className="cr2-ring-header" onClick={() => setActiveRing(idx)}>
                  <span className="cr2-ring-dot" style={{ background: ring.color }} />
                  <span className="cr2-ring-name">{ring.name}</span>
                  {ringItems.length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: ring.color, background: ring.color + '15', padding: '2px 8px', borderRadius: 99, marginLeft: '6px' }}>
                      {ringItems.length}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 16, transition: 'transform .2s', transform: isActive ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
                {isActive && (
                  <div className="cr2-ring-body">
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{ring.prompt}</p>
                    <div className="cr2-items">
                      {ringItems.map((item) => (
                        <span key={item.id} className="widget-chip" style={{ background: ring.color + '10', borderColor: ring.color + '20', color: ring.color }}>
                          {item.label}
                          <button className="widget-chip-remove" style={{ color: ring.color }} onClick={() => deleteItem(item.id)}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="cr2-add-row">
                      <input
                        className="cr2-add-input"
                        placeholder="Type new item…"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                      />
                      <button className="cr2-add-btn" style={{ background: ring.color }} onClick={handleAddCustom}>+</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Idea Bank Tray */}
      <div className="bs-tray" style={{ marginTop: '0' }}>
        <div className="bs-tray-title">💡 Asset Bank Presets (Click to place in active ring)</div>
        <div className="bs-tray-items">
          {presetData.ideas
            .filter(idea => !items.some(x => x.label === idea.label))
            .map((idea, i) => (
              <button
                key={i}
                type="button"
                className="bs-tray-chip"
                onClick={() => handlePresetClick(idea)}
                style={{ cursor: 'pointer', border: '1px solid rgba(228, 223, 217, 0.8)', background: '#fff' }}
              >
                + {idea.label}
              </button>
            ))}
          {presetData.ideas.every(idea => items.some(x => x.label === idea.label)) && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>All preset ideas are currently placed. Add custom items above.</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="widget-reset-btn" onClick={reset}>↺ Reset Map</button>
      </div>
    </div>
  )
}
