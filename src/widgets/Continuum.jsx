import { useState, useRef, useEffect } from 'react'

const COLORS = ['#00558C', '#2563eb', '#319B41', '#d97706', '#dc2626', '#7c3aed', '#b45309', '#6d28d9']

function parseEnds(desc) {
  // 'Individual Betterment (Charity)' at the far left ... 'Community Development (Transformation)' at the far right
  const leftMatch  = desc.match(/'([^']{3,50})'\s+at\s+the\s+far\s+left/i)
  const rightMatch = desc.match(/'([^']{3,50})'\s+at\s+the\s+far\s+right/i)
  if (leftMatch && rightMatch) return { left: leftMatch[1], right: rightMatch[1] }

  // spectrum from 'X' to 'Y'
  const fromMatch = desc.match(/spectrum\s+from\s+'([^']{3,50})'/i)
  const toMatch   = desc.match(/to\s+'([^']{3,50})'\s+at\s+the\s+far\s+right/i)
  if (fromMatch) return { left: fromMatch[1], right: toMatch ? toMatch[1] : 'High' }

  // four-stage pathway: Recipients → Resources → Assets → Leaders
  if (desc.toLowerCase().includes('recipients') && desc.toLowerCase().includes('leaders')) {
    return { left: 'Recipients', right: 'Leaders', midpoints: ['Resources', 'Assets'] }
  }

  return { left: 'Relief / Betterment', right: 'Development / Transformation' }
}

function parsePresetItems(desc) {
  const match = [...desc.matchAll(/'([^']{3,40})'/g)].map(m => m[1]).filter(s => !s.includes('far') && !s.includes('Betterment') && !s.includes('Development'))
  return match.length > 0 ? match.slice(0, 8) : ['Food Pantry', 'Tutoring Program', 'Jobs Clinic', 'Youth Council', 'Housing Cooperative']
}

export default function Continuum({ config }) {
  const { left, right, midpoints } = parseEnds(config.description || '')
  const presetItems = parsePresetItems(config.description || '')

  const [markers, setMarkers] = useState([])
  const [inputText, setInputText] = useState('')
  const [draggedChip, setDraggedChip] = useState(null)
  const trackRef = useRef(null)

  // Initialize presets
  useEffect(() => {
    setMarkers(
      presetItems.map((label, i) => ({
        id: `marker-${i}`,
        label,
        pos: null, // start unplaced
        color: COLORS[i % COLORS.length]
      }))
    )
  }, [config.description])

  function addCustomMarker() {
    if (!inputText.trim()) return
    const id = `marker-${Date.now()}`
    setMarkers(ms => [...ms, {
      id,
      label: inputText.trim(),
      pos: null,
      color: COLORS[ms.length % COLORS.length]
    }])
    setInputText('')
  }

  function handleAddPreset(label) {
    // Auto place in center of the track or at a random point
    const rpos = 0.2 + Math.random() * 0.6
    setMarkers(ms => ms.map(m => m.label === label ? { ...m, pos: rpos } : m))
  }

  function removeMarker(id) {
    // Return to unplaced state
    setMarkers(ms => ms.map(m => m.id === id ? { ...m, pos: null } : m))
  }

  function deleteMarkerCompletely(id) {
    setMarkers(ms => ms.filter(m => m.id !== id))
  }

  function updateMarkerPos(id, clientX) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const pos = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    setMarkers(ms => ms.map(m => m.id === id ? { ...m, pos } : m))
  }

  // Handle click on the track to place the first unplaced marker
  function handleTrackClick(e) {
    const unplaced = markers.find(m => m.pos === null)
    if (unplaced) {
      updateMarkerPos(unplaced.id, e.clientX)
    }
  }

  // Drag-and-drop presets onto track
  function handleChipDragStart(label) {
    setDraggedChip(label)
  }

  function handleTrackDrop(e) {
    e.preventDefault()
    if (!draggedChip || !trackRef.current) return
    
    const rect = trackRef.current.getBoundingClientRect()
    const pos = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    
    setMarkers(ms => ms.map(m => m.label === draggedChip ? { ...m, pos } : m))
    setDraggedChip(null)
  }

  // Mouse & Touch Drag Event Handlers for beads
  function startBeadDrag(e, id) {
    e.preventDefault()
    const isTouch = e.type.startsWith('touch')
    const moveHandler = (ev) => {
      const clientX = isTouch ? ev.touches[0].clientX : ev.clientX
      updateMarkerPos(id, clientX)
    }
    const upHandler = () => {
      window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', moveHandler)
      window.removeEventListener(isTouch ? 'touchend' : 'mouseup', upHandler)
    }
    window.addEventListener(isTouch ? 'touchmove' : 'mousemove', moveHandler)
    window.addEventListener(isTouch ? 'touchend' : 'mouseup', upHandler)
  }

  const placed = markers.filter(m => m.pos !== null)
  const unplaced = markers.filter(m => m.pos === null)
  const mids = midpoints || []

  // Overlap stacking algorithm: stagger heights if markers overlap
  const sortedPlaced = [...placed].sort((a, b) => a.pos - b.pos)
  const staggerLevels = {}
  sortedPlaced.forEach((m, idx) => {
    let lvl = 0
    for (let prevIdx = 0; prevIdx < idx; prevIdx++) {
      const prev = sortedPlaced[prevIdx]
      const prevLvl = staggerLevels[prev.id] || 0
      // If within 9% position range, stack higher
      if (Math.abs(m.pos - prev.pos) < 0.09 && prevLvl === lvl) {
        lvl = prevLvl + 1
      }
    }
    staggerLevels[m.id] = lvl
  })

  function reset() {
    setMarkers(ms => ms.map(m => ({ ...m, pos: null })))
    setInputText('')
  }

  return (
    <div>
      <div className="cont-track-wrap" onDragOver={e => e.preventDefault()} onDrop={handleTrackDrop}>
        {/* Scale labels */}
        <div className="cont-end-labels">
          <span style={{ color: 'var(--navy)', maxWidth: 180, lineHeight: 1.25 }}>{left}</span>
          <span style={{ color: 'var(--navy-dark)', maxWidth: 180, textAlign: 'right', lineHeight: 1.25 }}>{right}</span>
        </div>

        {/* Midpoint labels */}
        {mids.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 12, padding: '0 20px' }}>
            {mids.map(m => (
              <span key={m} style={{ fontSize: 11, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{m}</span>
            ))}
          </div>
        )}

        {/* Continuum Track */}
        <div
          ref={trackRef}
          className="cont-track"
          onClick={handleTrackClick}
          style={{ height: '10px', background: 'linear-gradient(90deg, var(--navy-light) 0%, rgba(0, 85, 140, 0.25) 50%, var(--navy) 100%)' }}
        >
          {placed.map(m => {
            const level = staggerLevels[m.id] || 0
            // Calculate stagger translateY offset: level 0 = -50% (centered), level 1 = -180% (above), level 2 = -310% (even higher)
            const yOffset = -50 - (level * 110)
            
            return (
              <div
                key={m.id}
                className="cont-marker"
                style={{
                  left: `${m.pos * 100}%`,
                  transform: `translate(-50%, ${yOffset}%)`,
                  transition: draggedChip ? 'none' : 'left 0.1s ease, transform 0.2s'
                }}
                onMouseDown={e => startBeadDrag(e, m.id)}
                onTouchStart={e => startBeadDrag(e, m.id)}
              >
                <div className="cont-marker-dot" style={{ background: m.color, border: '2px solid #fff', boxShadow: '0 3px 8px rgba(0,0,0,0.18)' }} />
                <div className="cont-marker-label" style={{
                  transform: 'none', top: '-32px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px'
                }}>
                  {m.label} ({Math.round(m.pos * 100)}%)
                </div>
              </div>
            );
          })}

          {unplaced.length > 0 && placed.length === 0 && (
            <div style={{
              position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)',
              fontSize: 11, color: 'var(--navy)', fontWeight: '700', whiteSpace: 'nowrap',
              background: 'var(--navy-light)', padding: '4px 12px', borderRadius: 99,
              border: '1px solid rgba(0, 85, 140, 0.15)', pointerEvents: 'none'
            }}>
              👆 Click track to place: "{unplaced[0].label}"
            </div>
          )}
        </div>
      </div>

      {/* Legend / Placed Items */}
      {placed.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
            Placed Items Grid:
          </div>
          <div className="cont-items-legend" style={{ marginTop: 0 }}>
            {placed.map(m => (
              <div key={m.id} className="cont-legend-item">
                <span className="cont-legend-dot" style={{ background: m.color }} />
                <span style={{ fontWeight: '500' }}>{m.label}</span>
                <span style={{ color: 'var(--navy)', fontWeight: '700' }}>{Math.round(m.pos * 100)}%</span>
                <button 
                  type="button" 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }} 
                  onClick={() => removeMarker(m.id)}
                  title="Remove from track"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unplaced Items Tray */}
      {unplaced.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
            Tray of Factors (Drag to track or click to auto-place):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {unplaced.map(m => (
              <span
                key={m.id}
                className="widget-chip"
                draggable
                onDragStart={() => handleChipDragStart(m.label)}
                onClick={() => handleAddPreset(m.label)}
                style={{ cursor: 'grab', background: '#fff', border: '1px solid rgba(228, 223, 217, 0.8)' }}
              >
                ✥ {m.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom item addition */}
      <div className="cont-add-row" style={{ marginTop: '20px' }}>
        <input 
          className="widget-input" 
          placeholder="Add custom activity marker…"
          value={inputText} 
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomMarker()} 
        />
        <button className="widget-save-btn" onClick={addCustomMarker}>Add to Tray</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="widget-reset-btn" onClick={reset}>↺ Reset Continuum</button>
      </div>
    </div>
  )
}
