import { useState } from 'react'

const NODE_DEFS = {
  // Personal Assessment Model
  'Calling': 'A clear sense of divine vocation — knowing you are set apart for a specific redemptive purpose in this moment and place.',
  'Character': 'The moral and spiritual formation that makes your leadership trustworthy — integrity, humility, and covenant faithfulness over time.',
  'Commitment to Change': 'A sustained willingness to do the hard, adaptive work of transformation — in yourself, your team, and your community.',
  'Authenticity': 'The integration of Calling and Character — you lead from who you genuinely are, not from a performance of leadership.',
  'Responsiveness': 'The capacity to read your context and adapt your approach — attentiveness to God, community, and circumstance.',
  'Teachability': 'A posture of ongoing learning — remaining a student of scripture, community, and your own experience throughout your leadership journey.',
  
  // Core Values (Week 5 / ch5-widget-0)
  'Accountability': 'A relational commitment to openness and mutual responsibility, allowing others to speak truth into your life and ministry.',
  'Balance': 'Ensuring personal and spiritual wholeness, preventing burnout by managing resources, time, and focus effectively.',
  'Interdependence': 'Operating as an interconnected body rather than isolated leaders — recognizing that we need one another to achieve full Kingdom impact.',
  'Empowerment': 'Equipping, mobilizing, and supporting others to lead, transferring power and resources rather than centralizing control.',
  'Leverage': 'Identifying and engaging strategic opportunities and resources that multiply Kingdom impact far beyond your individual effort.',
}

const SCORE_LABELS = ['', 'Beginning', 'Building Awareness', 'Growing Steadily', 'Practicing Well', 'Living Fully']

const COLORS = ['#00558C', '#2563eb', '#319B41', '#d97706', '#dc2626', '#7c3aed']

function radarPoint(cx, cy, r, i, numAxes) {
  const angle = (-90 + (360 / numAxes) * i) * Math.PI / 180
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

export default function HexagonRadar({ config, blockId }) {
  const desc = config.description || ''

  // Set node names: Pentagonal Core Values for ch5-widget-0, Hexagonal PAM for others
  const nodesMatch = desc.match(/nodes[:\s]+([^.]{10,120})/i)
  const nodeNames = blockId === 'ch5-widget-0'
    ? ['Accountability', 'Balance', 'Interdependence', 'Empowerment', 'Leverage']
    : (nodesMatch
        ? nodesMatch[1].replace(/\band\b/gi, ',').split(',').map(s => s.trim()).filter(s => s.length > 1 && s.length < 35).slice(0, 6)
        : ['Calling', 'Character', 'Commitment to Change', 'Authenticity', 'Responsiveness', 'Teachability'])

  // Identify "outer" nodes that unlock after inner ones (first 3) - disable for 5-axis
  const outerMatch = desc.match(/outer nodes \(([^)]+)\)/i)
  const outerNodes = nodeNames.length === 5
    ? []
    : (outerMatch ? outerMatch[1].split(',').map(s => s.trim()) : nodeNames.slice(3))

  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem(`dvuli-widget-state-${blockId}`)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return Object.fromEntries(nodeNames.map(n => [n, 0]))
  })
  const [selected, setSelected] = useState(nodeNames[0])

  const cx = 160; const cy = 160; const R = 105
  const numAxes = nodeNames.length
  
  // Outer lock is bypassed if no outer nodes are designated
  const innerDone = outerNodes.length === 0 || nodeNames.slice(0, 3).every(n => scores[n] > 0)

  const points = nodeNames.map((n, i) => {
    const base = radarPoint(cx, cy, R, i, numAxes)
    const s = scores[n]
    const filled = s > 0 ? radarPoint(cx, cy, (s / 5) * R, i, numAxes) : { x: cx, y: cy }
    return { name: n, base, filled, color: COLORS[i % COLORS.length], isOuter: outerNodes.includes(n) }
  })

  const radarPoly = points.map(p => `${p.filled.x},${p.filled.y}`).join(' ')
  const hexOutline = points.map(p => `${p.base.x},${p.base.y}`).join(' ')

  function setScore(name, val) {
    const isOuter = outerNodes.includes(name)
    if (isOuter && !innerDone) return
    setScores(s => {
      const next = { ...s, [name]: val }
      try {
        localStorage.setItem(`dvuli-widget-state-${blockId}`, JSON.stringify(next))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  const sel = selected ? points.find(p => p.name === selected) : null

  function reset() {
    const next = Object.fromEntries(nodeNames.map(n => [n, 0]))
    setScores(next)
    try {
      localStorage.setItem(`dvuli-widget-state-${blockId}`, JSON.stringify(next))
    } catch (e) {
      console.error(e)
    }
    setSelected(nodeNames[0])
  }

  return (
    <div className="hr-container">
      {/* SVG Radar */}
      <div className="hr-svg-wrap">
        <svg viewBox="0 0 320 320" width="100%" className="hr-svg" style={{ maxWidth: 360 }}>
          {/* Reference grids (Radar rings) */}
          {[.2,.4,.6,.8,1].map(r => (
            <polygon key={r}
              points={nodeNames.map((_, i) => {
                const p = radarPoint(cx, cy, r * R, i, numAxes)
                return `${p.x},${p.y}`
              }).join(' ')}
              fill="none" stroke="rgba(228, 223, 217, 0.6)" strokeWidth={1}
            />
          ))}
          
          {/* Axis lines */}
          {points.map((p, i) => (
            <line key={i} x1={cx} y1={cy} x2={p.base.x} y2={p.base.y}
              stroke="rgba(228, 223, 217, 0.8)" strokeWidth={1.5} />
          ))}

          {/* Radar fill */}
          {points.some(p => scores[p.name] > 0) && (
            <polygon points={radarPoly}
              fill="rgba(0, 85, 140, 0.18)" stroke="var(--navy)" strokeWidth={2.5}
              style={{ transition: 'all .4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          )}

          {/* Radar outline dashed */}
          <polygon points={hexOutline} fill="none" stroke="rgba(0, 85, 140, 0.3)" strokeWidth={1.5} strokeDasharray="4 3" />

          {/* Interactive scoring ticks along each axis line */}
          {points.map((p, i) => {
            const locked = p.isOuter && !innerDone
            if (locked) return null

            return [1, 2, 3, 4, 5].map(rating => {
              const tickPos = radarPoint(cx, cy, (rating / 5) * R, i, numAxes)
              const isActive = scores[p.name] === rating
              return (
                <circle
                  key={`${p.name}-${rating}`}
                  cx={tickPos.x}
                  cy={tickPos.y}
                  r={isActive ? 6 : 4}
                  fill={isActive ? p.color : '#fff'}
                  stroke={p.color}
                  strokeWidth={isActive ? 2 : 1.5}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => {
                    setSelected(p.name)
                    setScore(p.name, rating)
                  }}
                  className="hr-band-clickable"
                  title={`Rate ${p.name} as ${rating}`}
                />
              )
            })
          })}

          {/* Node vertex markers */}
          {points.map((p, i) => {
            const locked = p.isOuter && !innerDone
            const scored = scores[p.name] > 0
            const active = selected === p.name

            return (
              <g key={i}
                style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
                onClick={() => !locked && setSelected(p.name)}
              >
                <circle cx={p.base.x} cy={p.base.y} r={18}
                  fill={locked ? '#f1f5f9' : active ? p.color : scored ? p.color + '20' : '#fff'}
                  stroke={locked ? '#e4dfd9' : p.color}
                  strokeWidth={2}
                  opacity={locked ? .5 : 1}
                  style={{
                    filter: active ? `drop-shadow(0 0 6px ${p.color}80)` : 'none',
                    transition: 'all .3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />
                
                {scored && !active && (
                  <text x={p.base.x} y={p.base.y + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={11} fontWeight="700" fill={p.color}>
                    {scores[p.name]}
                  </text>
                )}

                {active && (
                  <text x={p.base.x} y={p.base.y + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={11} fontWeight="700" fill="#fff">
                    {scores[p.name] || '?'}
                  </text>
                )}

                {!scored && !active && !locked && (
                  <circle cx={p.base.x} cy={p.base.y} r={3} fill={p.color} />
                )}

                {locked && (
                  <text x={p.base.x} y={p.base.y + 1}
                    textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="#94a3b8">🔒</text>
                )}

                {/* Node labels */}
                {(() => {
                  const angle = (-90 + (360 / numAxes) * i) * Math.PI / 180
                  const lx = cx + (R + 28) * Math.cos(angle)
                  const ly = cy + (R + 28) * Math.sin(angle)
                  const words = p.name.split(' ')
                  
                  let textAnchor = 'middle'
                  if (Math.cos(angle) > 0.1) textAnchor = 'start'
                  else if (Math.cos(angle) < -0.1) textAnchor = 'end'

                  return (
                    <text textAnchor={textAnchor} dominantBaseline="middle"
                      x={lx} y={ly}
                      fontSize={9.5} fontWeight="700" fill={locked ? '#cbd5e1' : active ? 'var(--navy)' : '#334155'}>
                      {words.map((w, wi) => (
                        <tspan key={wi} x={lx} dy={wi === 0 ? 0 : 10}>
                          {w}
                        </tspan>
                      ))}
                    </text>
                  )
                })()}
              </g>
            )
          })}
          {/* Center center ring */}
          <circle cx={cx} cy={cy} r={6} fill="var(--navy)" opacity={.25} />
        </svg>
      </div>

      {/* Side panel */}
      <div>
        {sel && (
          <div className="hr-node-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: sel.color, display: 'inline-block', boxShadow: `0 0 8px ${sel.color}60` }} />
              <div className="hr-node-name">{sel.name}</div>
              {sel.isOuter && !innerDone && (
                <span style={{ fontSize: '10px', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '99px', fontWeight: '700', marginLeft: 'auto' }}>Locked</span>
              )}
            </div>
            
            <p className="hr-node-def">
              {NODE_DEFS[sel.name] || 'Assess how strongly this dimension shows up in your current leadership.'}
            </p>

            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Select Rating:
            </div>
            
            <div className="hr-score-grid">
              {[1, 2, 3, 4, 5].map(rating => {
                const isOuter = outerNodes.includes(sel.name)
                const locked = isOuter && !innerDone
                return (
                  <button
                    key={rating}
                    type="button"
                    className={`hr-score-btn ${scores[sel.name] === rating ? 'active' : ''}`}
                    disabled={locked}
                    style={{ opacity: locked ? 0.4 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}
                    onClick={() => setScore(sel.name, rating)}
                    title={SCORE_LABELS[rating]}
                  >
                    {rating}
                  </button>
                )
              })}
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--navy)', fontWeight: '600', minHeight: '20px' }}>
              {scores[sel.name] > 0 ? `Level ${scores[sel.name]} — ${SCORE_LABELS[scores[sel.name]]}` : 'Select a rating above or on the chart'}
            </div>
          </div>
        )}

        {/* Locked status banner */}
        {!innerDone && (
          <div style={{ marginTop: 14, padding: 12, background: 'rgba(217, 119, 6, 0.05)', borderRadius: 12, border: '1px solid rgba(217, 119, 6, 0.15)', fontSize: '12px', color: 'var(--amber)', lineHeight: '1.5' }}>
            🔒 <strong>Dimensions Locked:</strong> Score Calling, Character, and Commitment to Change (first 3 nodes) to unlock outer dimensions.
          </div>
        )}

        {/* Completion status */}
        {nodeNames.every(n => scores[n] > 0) && (
          <div style={{ marginTop: 14, padding: 14, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', fontSize: 13.5, color: '#166534', lineHeight: 1.5 }}>
            🎉 <strong>Assessment Mapped!</strong><br />
            Overall Average: <strong>{(Object.values(scores).reduce((a, b) => a + b, 0) / nodeNames.length).toFixed(1)} / 5</strong>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="widget-reset-btn" onClick={reset}>↺ Start over</button>
        </div>
      </div>
    </div>
  )
}
