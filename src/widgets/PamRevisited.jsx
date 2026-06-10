import { useState, useEffect } from 'react'

const NODES = ['Calling', 'Character', 'Commitment to Change', 'Authenticity', 'Responsiveness', 'Teachability']

const NODE_DEFS = {
  'Calling': 'Faithfully doing the work that God has called me to do for His Kingdom. Shift from career performance to divine mission.',
  'Character': 'Consistently living out the values I espouse, applying them to my every action. Integrity and transparency.',
  'Commitment to Change': 'Being open to change that helps me align myself with God\'s will. Willingness to be disrupted and adapt.',
  'Authenticity': 'The integration of Calling and Character — leading from who you genuinely are in God\'s eyes, not from a performance of leadership.',
  'Responsiveness': 'The capacity to submit your will to God\'s will — having the attitude of Christ in your actions and relationship to circumstances.',
  'Teachability': 'Wanting to be transformed through the renewing of your mind — being a learner rather than a knower.'
}

const DEFAULT_BASELINE = {
  'Calling': 2,
  'Character': 3,
  'Commitment to Change': 2,
  'Authenticity': 3,
  'Responsiveness': 2,
  'Teachability': 3
}

function radarPoint(cx, cy, r, i, total) {
  const angle = (-90 + (360 / total) * i) * Math.PI / 180
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

export default function PamRevisited({ config, blockId }) {
  // Load Session 1 Baseline Scores
  const [baseline, setBaseline] = useState(() => {
    try {
      const saved = localStorage.getItem('dvuli-widget-state-ch1-widget-1')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure all nodes have scores > 0
        if (NODES.every(n => parsed[n] > 0)) return parsed
      }
    } catch (e) {
      console.error('Failed to load Session 1 hexagon scores:', e)
    }
    return { ...DEFAULT_BASELINE }
  })

  // Load Session 16 Current Scores & Reflections
  const [currentScores, setCurrentScores] = useState(() => {
    try {
      const saved = localStorage.getItem(`dvuli-widget-state-${blockId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.scores) return parsed.scores
      }
    } catch {}
    return Object.fromEntries(NODES.map(n => [n, 4])) // Default 4
  })

  const [reflections, setReflections] = useState(() => {
    try {
      const saved = localStorage.getItem(`dvuli-widget-state-${blockId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.reflections) return parsed.reflections
      }
    } catch {}
    return Object.fromEntries(NODES.map(n => [n, '']))
  })

  const [selectedNode, setSelectedNode] = useState(NODES[0])
  const [isPrintView, setIsPrintView] = useState(false)
  const [showBaselineEditor, setShowBaselineEditor] = useState(false)

  // Save current scores and reflections to localStorage
  const saveState = (updatedScores, updatedReflections) => {
    try {
      localStorage.setItem(
        `dvuli-widget-state-${blockId}`,
        JSON.stringify({ scores: updatedScores, reflections: updatedReflections })
      )
    } catch (e) {
      console.error(e)
    }
  }

  const handleCurrentScoreChange = (node, val) => {
    setCurrentScores(prev => {
      const next = { ...prev, [node]: val }
      saveState(next, reflections)
      return next
    })
  }

  const handleReflectionChange = (node, text) => {
    setReflections(prev => {
      const next = { ...prev, [node]: text }
      saveState(currentScores, next)
      return next
    })
  }

  const handleBaselineChange = (node, val) => {
    setBaseline(prev => {
      const next = { ...prev, [node]: val }
      // Also save baseline back to the Session 1 key to maintain integration
      try {
        localStorage.setItem('dvuli-widget-state-ch1-widget-1', JSON.stringify(next))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  const resetAll = () => {
    if (window.confirm('Are you sure you want to reset all current ratings and learning reflections?')) {
      const scores = Object.fromEntries(NODES.map(n => [n, 4]))
      const refs = Object.fromEntries(NODES.map(n => [n, '']))
      setCurrentScores(scores)
      setReflections(refs)
      saveState(scores, refs)
      setSelectedNode(NODES[0])
    }
  }

  // SVG parameters
  const cx = 150
  const cy = 150
  const R = 90
  const total = NODES.length

  // Generate SVG Polygons
  const baselinePoints = NODES.map((n, i) => radarPoint(cx, cy, (baseline[n] / 5) * R, i, total))
  const currentPoints = NODES.map((n, i) => radarPoint(cx, cy, (currentScores[n] / 5) * R, i, total))
  const outerPoints = NODES.map((n, i) => radarPoint(cx, cy, R, i, total))

  const baselinePoly = baselinePoints.map(p => `${p.x},${p.y}`).join(' ')
  const currentPoly = currentPoints.map(p => `${p.x},${p.y}`).join(' ')
  const outerPoly = outerPoints.map(p => `${p.x},${p.y}`).join(' ')

  const averageGrowth = (
    NODES.reduce((acc, n) => acc + (currentScores[n] - baseline[n]), 0) / NODES.length
  ).toFixed(1)

  if (isPrintView) {
    return (
      <div className="cg-print-view pam-print-layout">
        <div className="cg-print-header">
          <div className="cg-print-logo">DeVos Urban Leadership Initiative</div>
          <h2>Divine Design Portrait</h2>
          <p>Holistic Leadership Development Hexagon Revisited</p>
        </div>

        <div className="pam-print-content-wrap">
          {/* SVG Overlay Chart */}
          <div className="pam-print-chart-box">
            <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 260 }}>
              {/* Outer grid rings */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map(r => (
                <polygon
                  key={r}
                  points={NODES.map((_, i) => {
                    const pt = radarPoint(cx, cy, r * R, i, total)
                    return `${pt.x},${pt.y}`
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(228, 223, 217, 0.6)"
                  strokeWidth={1}
                />
              ))}

              {/* Axis lines */}
              {NODES.map((_, i) => {
                const base = radarPoint(cx, cy, R, i, total)
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={base.x}
                    y2={base.y}
                    stroke="rgba(228, 223, 217, 0.8)"
                    strokeWidth={1.5}
                  />
                )
              })}

              {/* Baseline Area (Amber outline / translucent fill) */}
              <polygon
                points={baselinePoly}
                fill="rgba(217, 119, 6, 0.08)"
                stroke="var(--amber)"
                strokeWidth={2}
                strokeDasharray="4 3"
              />

              {/* Current Area (Navy/Green outline / translucent fill) */}
              <polygon
                points={currentPoly}
                fill="rgba(49, 155, 65, 0.12)"
                stroke="#166534"
                strokeWidth={2.5}
              />

              {/* Node Indicators and Labels */}
              {NODES.map((n, i) => {
                const angle = (-90 + (360 / total) * i) * Math.PI / 180
                const lx = cx + (R + 24) * Math.cos(angle)
                const ly = cy + (R + 24) * Math.sin(angle)
                const p = radarPoint(cx, cy, (currentScores[n] / 5) * R, i, total)

                let textAnchor = 'middle'
                if (Math.cos(angle) > 0.1) textAnchor = 'start'
                else if (Math.cos(angle) < -0.1) textAnchor = 'end'

                return (
                  <g key={n}>
                    <circle cx={p.x} cy={p.y} r={4} fill="#166534" />
                    <text
                      x={lx}
                      y={ly}
                      fontSize={8.5}
                      fontWeight="700"
                      fill="#0f172a"
                      textAnchor={textAnchor}
                      dominantBaseline="middle"
                    >
                      {n} (B:{baseline[n]}➔C:{currentScores[n]})
                    </text>
                  </g>
                )
              })}
            </svg>

            <div className="pam-growth-summary-badge">
              Average Growth Metric: <strong>+{averageGrowth} Levels</strong>
            </div>
          </div>

          {/* Reflections Grid */}
          <div className="pam-print-reflections">
            {NODES.map(n => (
              <div key={n} className="pam-print-ref-card">
                <h5>{n} Learning Reflection</h5>
                <p className="pam-print-ref-text">
                  {reflections[n] || <i>No reflection recorded for this dimension.</i>}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="cg-print-signatures" style={{ marginTop: 40 }}>
          <div className="cg-sig-line">
            <div className="cg-line" />
            <span>DVULI Graduate Signature</span>
          </div>
          <div className="cg-sig-line">
            <div className="cg-line" />
            <span>City Coordinator Signature</span>
          </div>
          <div className="cg-sig-line">
            <div className="cg-line" />
            <span>Ministry Mentor Signature</span>
          </div>
        </div>

        <div className="cg-print-footer">
          <button className="widget-save-btn" onClick={() => window.print()}>Print Portrait</button>
          <button className="widget-reset-btn" onClick={() => setIsPrintView(false)}>Back to Interactive View</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pam-widget">
      <div className="cg-header-row">
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '75%' }}>
          Revisit the 6-dimension Personal Assessment Model from Session 1. Visualise your developmental arc, map your growth metrics, and compile your final learning reflections into your graduation portrait.
        </p>
        <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
          <button className="widget-reset-btn" onClick={() => setShowBaselineEditor(!showBaselineEditor)}>
            ⚙️ Baseline Edits
          </button>
          <button className="widget-reset-btn" onClick={() => setIsPrintView(true)}>
            👑 Export Portrait
          </button>
        </div>
      </div>

      {showBaselineEditor && (
        <div className="pam-baseline-editor">
          <h5>Edit Session 1 Baselines:</h5>
          <div className="pam-baseline-grid">
            {NODES.map(n => (
              <div key={n} className="pam-baseline-row">
                <span className="pam-baseline-label">{n}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={baseline[n]}
                  onChange={(e) => handleBaselineChange(n, parseInt(e.target.value))}
                  className="widget-slider"
                />
                <span className="pam-baseline-val">{baseline[n]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cg-grid">
        {/* Left Side: SVG Chart overlay & Ratings panel */}
        <div className="pam-chart-panel">
          <div className="bf-radar-svg-wrap">
            <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 280 }}>
              {/* Outer grid rings */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map(r => (
                <polygon
                  key={r}
                  points={NODES.map((_, i) => {
                    const pt = radarPoint(cx, cy, r * R, i, total)
                    return `${pt.x},${pt.y}`
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(228, 223, 217, 0.6)"
                  strokeWidth={1}
                />
              ))}

              {/* Axis lines */}
              {NODES.map((_, i) => {
                const base = radarPoint(cx, cy, R, i, total)
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={base.x}
                    y2={base.y}
                    stroke="rgba(228, 223, 217, 0.8)"
                    strokeWidth={1.5}
                  />
                )
              })}

              {/* Baseline Area (Amber dashed line / transparent fill) */}
              <polygon
                points={baselinePoly}
                fill="none"
                stroke="var(--amber)"
                strokeWidth={2}
                strokeDasharray="4 3"
              />

              {/* Current Area (Solid green line / transparent fill) */}
              <polygon
                points={currentPoly}
                fill="rgba(49, 155, 65, 0.16)"
                stroke="#166534"
                strokeWidth={2.5}
              />

              {/* Interactive Scoring Ticks */}
              {NODES.map((n, i) => {
                const color = selectedNode === n ? '#166534' : 'var(--navy)'
                return [1, 2, 3, 4, 5].map(rating => {
                  const tickPos = radarPoint(cx, cy, (rating / 5) * R, i, total)
                  const isActive = currentScores[n] === rating
                  return (
                    <circle
                      key={`${n}-${rating}`}
                      cx={tickPos.x}
                      cy={tickPos.y}
                      r={isActive ? 5.5 : 3.5}
                      fill={isActive ? '#166534' : '#fff'}
                      stroke={color}
                      strokeWidth={isActive ? 2 : 1.2}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => {
                        setSelectedNode(n)
                        handleCurrentScoreChange(n, rating)
                      }}
                    />
                  )
                })
              })}

              {/* Node Vertex markers and Labels */}
              {NODES.map((n, i) => {
                const angle = (-90 + (360 / total) * i) * Math.PI / 180
                const lx = cx + (R + 26) * Math.cos(angle)
                const ly = cy + (R + 26) * Math.sin(angle)
                const active = selectedNode === n
                
                let textAnchor = 'middle'
                if (Math.cos(angle) > 0.1) textAnchor = 'start'
                else if (Math.cos(angle) < -0.1) textAnchor = 'end'

                return (
                  <g key={n} style={{ cursor: 'pointer' }} onClick={() => setSelectedNode(n)}>
                    <circle
                      cx={outerPoints[i].x}
                      cy={outerPoints[i].y}
                      r={15}
                      fill={active ? '#166534' : '#fff'}
                      stroke={active ? '#166534' : '#94a3b8'}
                      strokeWidth={1.5}
                      style={{ transition: 'all 0.2s' }}
                    />
                    <text
                      x={outerPoints[i].x}
                      y={outerPoints[i].y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10}
                      fontWeight="700"
                      fill={active ? '#fff' : '#475569'}
                    >
                      {currentScores[n]}
                    </text>
                    <text
                      x={lx}
                      y={ly}
                      fontSize={9.5}
                      fontWeight="700"
                      fill={active ? 'var(--navy)' : '#334155'}
                      textAnchor={textAnchor}
                      dominantBaseline="middle"
                    >
                      {n}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Growth breakdown panel */}
          <div className="pam-score-status">
            {NODES.map(n => {
              const diff = currentScores[n] - baseline[n]
              return (
                <div key={n} className="pam-score-row">
                  <span className="pam-score-label">{n}</span>
                  <div className="pam-score-comparison">
                    <span className="prev">B: {baseline[n]}</span>
                    <span>➔</span>
                    <span className="now">C: {currentScores[n]}</span>
                  </div>
                  <span className={`pam-diff-badge ${diff > 0 ? 'growth' : diff < 0 ? 'decline' : 'equal'}`}>
                    {diff > 0 ? `+${diff} Growth` : diff < 0 ? `${diff} Decline` : 'Stable'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side: Learning Reflections editor */}
        <div className="cg-detail-panel">
          <div className="cg-panel-header">
            <h4>{selectedNode} Reflection</h4>
            <span className="bf-comment-tag" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
              Growth: +{currentScores[selectedNode] - baseline[selectedNode]} levels
            </span>
          </div>

          <div className="cg-panel-body">
            <div className="cg-section">
              <h5>Dimension Description</h5>
              <p>{NODE_DEFS[selectedNode]}</p>
            </div>

            {/* Reflection Textarea */}
            <div className="cg-section">
              <h5>Learning Journal Entry</h5>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 8, fontStyle: 'italic' }}>
                Write one paragraph answering: What shifted in your understanding? What specific DVULI experience developed it? What does this mean for your Breakthrough Plan?
              </p>
              <textarea
                className="widget-textarea"
                style={{ minHeight: 180 }}
                placeholder={`Describe your growth and shifts in ${selectedNode} over the course of the DVULI program...`}
                value={reflections[selectedNode]}
                onChange={(e) => handleReflectionChange(selectedNode, e.target.value)}
              />
            </div>

            {/* Slider rating */}
            <div className="cg-rating-editor-card">
              <h5>Update Current Rating:</h5>
              <div className="cg-editor-options" style={{ marginTop: 10 }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`cg-editor-btn now ${currentScores[selectedNode] === v ? 'active' : ''}`}
                    onClick={() => handleCurrentScoreChange(selectedNode, v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="widget-reset-btn" onClick={resetAll}>↺ Reset ratings & reflections</button>
      </div>
    </div>
  )
}
