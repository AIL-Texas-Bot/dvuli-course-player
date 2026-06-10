import { useState, useEffect } from 'react'

const MOCK_PEERS = ['David', 'Sarah', 'Michael', 'Marcus']

const CORE_VALUES = [
  { id: 'val-accountability', label: 'Accountability' },
  { id: 'val-balance', label: 'Balance' },
  { id: 'val-interdependence', label: 'Interdependence' },
  { id: 'val-empowerment', label: 'Empowerment' },
  { id: 'val-leverage', label: 'Leverage' },
]

const SKILLS = [
  { id: 'skill-cyd', label: 'Community Youth Development' },
  { id: 'skill-scenario', label: 'Scenario Planning' },
  { id: 'skill-systems', label: 'Systems Thinking' },
  { id: 'skill-networking', label: 'Resource Networking' },
  { id: 'skill-collaboration', label: 'Collaboration/Partnering' },
]

// 4 axes for feedback radar
const RADAR_AXES = [
  { key: 'clarity', label: 'Clarity of Focus' },
  { key: 'empowerment', label: 'Empowerment Strategy' },
  { key: 'realism', label: 'Realism & Actionability' },
  { key: 'alignment', label: 'Personal-Ministry Alignment' }
]

const MOCK_REVIEWS_RECEIVED = [
  {
    reviewer: 'Sarah',
    scores: { clarity: 4, empowerment: 4, realism: 3, alignment: 5 },
    values: ['Accountability', 'Empowerment', 'Leverage'],
    skills: ['Community Youth Development', 'Collaboration/Partnering'],
    barrierSuggestion: 'Your 90-day timeline is incredibly ambitious. Consider breaking the training phase into two smaller cohorts so you do not burn out your core volunteers.',
    synergy: 'My plan focuses on training parent volunteers. We could merge our curriculum resources for Session 3 and do a joint workshop.'
  },
  {
    reviewer: 'David',
    scores: { clarity: 5, empowerment: 3, realism: 4, alignment: 4 },
    values: ['Balance', 'Interdependence'],
    skills: ['Systems Thinking', 'Resource Networking'],
    barrierSuggestion: 'To overcome the funding barrier, you should leverage the City Coordinator\'s contact list from Session 15. Don\'t try to raise the whole budget alone.',
    synergy: 'Your systems diagram in Session 7 highlighted a gap in community trust. Let\'s partner on the joint block party in August to bridge this.'
  },
  {
    reviewer: 'Michael',
    scores: { clarity: 4, empowerment: 5, realism: 4, alignment: 4 },
    values: ['Empowerment', 'Leverage', 'Interdependence'],
    skills: ['Scenario Planning', 'Collaboration/Partnering'],
    barrierSuggestion: 'Empowering youth to lead the Bible studies is excellent. To prevent them from losing motivation, set up a weekly coffee check-in to hear their struggles.',
    synergy: 'I am creating a youth worship band, and your leaders could help run the youth outreach nights we are planning.'
  },
  {
    reviewer: 'Marcus',
    scores: { clarity: 4, empowerment: 4, realism: 5, alignment: 5 },
    values: ['Accountability', 'Balance'],
    skills: ['Systems Thinking', 'Scenario Planning'],
    barrierSuggestion: 'Ensure you have a designated co-leader from day one. If you are the single point of failure, the program will halt when you travel for DVULI alumni events.',
    synergy: 'We are in the same neighborhood. I can share my church basement space for your Friday night workshops, saving you rental costs.'
  }
]

function getRadarPoint(cx, cy, r, i, total) {
  const angle = (-90 + (360 / total) * i) * Math.PI / 180
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

export default function BreakthroughFeedback({ config, blockId }) {
  const [activeTab, setActiveTab] = useState('give') // 'give' or 'receive'
  const [selectedPresenter, setSelectedPresenter] = useState(MOCK_PEERS[0])
  const [selectedValues, setSelectedValues] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [scores, setScores] = useState({ clarity: 3, empowerment: 3, realism: 3, alignment: 3 })
  const [barrierSuggestion, setBarrierSuggestion] = useState('')
  const [synergy, setSynergy] = useState('')
  const [submittedReviews, setSubmittedReviews] = useState([])
  const [successMsg, setSuccessMsg] = useState('')

  // Load reviews submitted by user
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`dvuli-widget-state-${blockId}`)
      if (saved) {
        setSubmittedReviews(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }
  }, [blockId])

  const handleValueToggle = (val) => {
    setSelectedValues(prev => 
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newReview = {
      id: Date.now(),
      presenter: selectedPresenter,
      scores: { ...scores },
      values: [...selectedValues],
      skills: [...selectedSkills],
      barrierSuggestion,
      synergy
    }

    const nextReviews = [...submittedReviews.filter(r => r.presenter !== selectedPresenter), newReview]
    setSubmittedReviews(nextReviews)
    localStorage.setItem(`dvuli-widget-state-${blockId}`, JSON.stringify(nextReviews))

    setSuccessMsg(`Feedback successfully submitted for ${selectedPresenter}!`)
    setTimeout(() => setSuccessMsg(''), 4000)

    // Reset form
    setSelectedValues([])
    setSelectedSkills([])
    setScores({ clarity: 3, empowerment: 3, realism: 3, alignment: 3 })
    setBarrierSuggestion('')
    setSynergy('')
  }

  // Calculate Aggregates for "My Feedback Report"
  // Combining mock review data with any self-submitted entries where target is "Self" or similar, 
  // but for the student player we assume the report is feedback *received* by the student from the cohort.
  const allReceived = MOCK_REVIEWS_RECEIVED
  const avgScores = {}
  RADAR_AXES.forEach(ax => {
    const sum = allReceived.reduce((acc, rev) => acc + rev.scores[ax.key], 0)
    avgScores[ax.key] = parseFloat((sum / allReceived.length).toFixed(1))
  })

  // SVG Radar setup
  const cx = 150
  const cy = 150
  const R = 90
  const totalAxes = RADAR_AXES.length

  const radarPoints = RADAR_AXES.map((ax, i) => {
    const val = avgScores[ax.key]
    const p = getRadarPoint(cx, cy, (val / 5) * R, i, totalAxes)
    const base = getRadarPoint(cx, cy, R, i, totalAxes)
    return { ...ax, x: p.x, y: p.y, baseX: base.x, baseY: base.y }
  })

  const radarPoly = radarPoints.map(p => `${p.x},${p.y}`).join(' ')
  const outerPoly = radarPoints.map(p => `${p.baseX},${p.baseY}`).join(' ')

  const resetAllSubmissions = () => {
    if (window.confirm('Are you sure you want to clear your submitted peer reviews?')) {
      setSubmittedReviews([])
      localStorage.removeItem(`dvuli-widget-state-${blockId}`)
    }
  }

  return (
    <div className="bf-widget">
      {/* Tabs */}
      <div className="bf-tabs">
        <button
          className={`bf-tab-btn ${activeTab === 'give' ? 'active' : ''}`}
          onClick={() => setActiveTab('give')}
        >
          📣 Review a Peer\'s Plan
        </button>
        <button
          className={`bf-tab-btn ${activeTab === 'receive' ? 'active' : ''}`}
          onClick={() => setActiveTab('receive')}
        >
          📊 My Feedback Report
        </button>
      </div>

      {activeTab === 'give' ? (
        <form onSubmit={handleSubmit} className="bf-form">
          <div className="bf-form-grid">
            <div className="bf-form-left">
              <div className="bf-form-group">
                <label className="bf-label">Select Presenter:</label>
                <select
                  className="widget-input"
                  value={selectedPresenter}
                  onChange={(e) => setSelectedPresenter(e.target.value)}
                >
                  {MOCK_PEERS.map(peer => (
                    <option key={peer} value={peer}>{peer}</option>
                  ))}
                </select>
              </div>

              {/* Core Values Checkboxes */}
              <div className="bf-form-group">
                <label className="bf-label">Core Values Evident in Plan:</label>
                <div className="bf-checkbox-grid">
                  {CORE_VALUES.map(v => (
                    <label key={v.id} className={`bf-checkbox-card ${selectedValues.includes(v.label) ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(v.label)}
                        onChange={() => handleValueToggle(v.label)}
                        style={{ display: 'none' }}
                      />
                      <span className="bf-checkbox-marker">{selectedValues.includes(v.label) ? '☑' : '☐'}</span>
                      {v.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Breakthrough Skills Checkboxes */}
              <div className="bf-form-group">
                <label className="bf-label">Breakthrough Skills Displayed:</label>
                <div className="bf-checkbox-grid">
                  {SKILLS.map(s => (
                    <label key={s.id} className={`bf-checkbox-card ${selectedSkills.includes(s.label) ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(s.label)}
                        onChange={() => handleSkillToggle(s.label)}
                        style={{ display: 'none' }}
                      />
                      <span className="bf-checkbox-marker">{selectedSkills.includes(s.label) ? '☑' : '☐'}</span>
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bf-form-right">
              {/* Sliders */}
              <div className="bf-sliders-card">
                <h4 className="bf-card-title">Score Dimensions (1-5)</h4>
                
                {RADAR_AXES.map(ax => (
                  <div key={ax.key} className="bf-slider-item">
                    <div className="bf-slider-header">
                      <span className="bf-slider-label">{ax.label}</span>
                      <span className="bf-slider-val-badge">{scores[ax.key]} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={scores[ax.key]}
                      onChange={(e) => setScores(s => ({ ...s, [ax.key]: parseInt(e.target.value) }))}
                      className="widget-slider"
                    />
                  </div>
                ))}
              </div>

              {/* Text Fields */}
              <div className="bf-form-group">
                <label className="bf-label">Suggestions to Overcome Barriers:</label>
                <textarea
                  className="widget-textarea"
                  placeholder="Offer 1-2 concrete, actionable suggestions for physical, relational, or budget hurdles..."
                  value={barrierSuggestion}
                  onChange={(e) => setBarrierSuggestion(e.target.value)}
                  required
                />
              </div>

              <div className="bf-form-group">
                <label className="bf-label">Synergies & Collaboration Potential:</label>
                <textarea
                  className="widget-textarea"
                  placeholder="What joint efforts or shared resources could multiply the impact of both your plans?"
                  value={synergy}
                  onChange={(e) => setSynergy(e.target.value)}
                  required
                />
              </div>

              {successMsg && (
                <div className="bf-success-msg">
                  {successMsg}
                </div>
              )}

              <div className="bf-submit-row">
                <button type="submit" className="widget-save-btn">
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>

          {submittedReviews.length > 0 && (
            <div className="bf-reviews-log">
              <h4>Submitted Evaluations ({submittedReviews.length})</h4>
              <div className="bf-log-grid">
                {submittedReviews.map(r => (
                  <div key={r.id} className="bf-log-card">
                    <span className="bf-log-name">Review for <strong>{r.presenter}</strong></span>
                    <span className="bf-log-scores">
                      C: {r.scores.clarity} | E: {r.scores.empowerment} | R: {r.scores.realism} | A: {r.scores.alignment}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="widget-reset-btn" onClick={resetAllSubmissions}>Clear Log</button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="bf-report">
          <div className="bf-report-grid">
            {/* SVG Radar Panel */}
            <div className="bf-report-radar-panel">
              <h4 className="bf-card-title">Cohort Feedback Summary</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: 16 }}>
                Aggregated ratings based on {allReceived.length} reviews received from your city cohort.
              </p>

              <div className="bf-radar-svg-wrap">
                <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 260 }}>
                  {/* Outer rings */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map(r => (
                    <polygon
                      key={r}
                      points={RADAR_AXES.map((_, idx) => {
                        const pt = getRadarPoint(cx, cy, r * R, idx, totalAxes)
                        return `${pt.x},${pt.y}`
                      }).join(' ')}
                      fill="none"
                      stroke="rgba(228, 223, 217, 0.6)"
                      strokeWidth={1}
                    />
                  ))}

                  {/* Axes lines */}
                  {radarPoints.map((p, idx) => (
                    <line
                      key={idx}
                      x1={cx}
                      y1={cy}
                      x2={p.baseX}
                      y2={p.baseY}
                      stroke="rgba(228, 223, 217, 0.8)"
                      strokeWidth={1.5}
                    />
                  ))}

                  {/* Filled area */}
                  <polygon
                    points={radarPoly}
                    fill="rgba(0, 85, 140, 0.16)"
                    stroke="var(--navy)"
                    strokeWidth={2}
                  />

                  {/* Dashed outer boundary */}
                  <polygon
                    points={outerPoly}
                    fill="none"
                    stroke="rgba(0, 85, 140, 0.25)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />

                  {/* Data Points and Labels */}
                  {radarPoints.map((p, idx) => {
                    const angle = (-90 + (360 / totalAxes) * idx) * Math.PI / 180
                    const lx = cx + (R + 24) * Math.cos(angle)
                    const ly = cy + (R + 24) * Math.sin(angle)
                    
                    let textAnchor = 'middle'
                    if (Math.cos(angle) > 0.1) textAnchor = 'start'
                    else if (Math.cos(angle) < -0.1) textAnchor = 'end'

                    return (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r={4.5} fill="var(--navy)" />
                        <text
                          x={lx}
                          y={ly}
                          fontSize={9}
                          fontWeight="700"
                          fill="#334155"
                          textAnchor={textAnchor}
                          dominantBaseline="middle"
                        >
                          {p.label} ({avgScores[p.key]})
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Averages Breakdown */}
              <div className="bf-scores-legend">
                {RADAR_AXES.map(ax => (
                  <div key={ax.key} className="bf-legend-item">
                    <span className="bf-legend-dot" />
                    <span className="bf-legend-name">{ax.label}:</span>
                    <strong className="bf-legend-score">{avgScores[ax.key]} / 5</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Comment Cards */}
            <div className="bf-report-comments">
              <h4 className="bf-card-title">Written Peer Suggestions</h4>
              <div className="bf-comments-list">
                {allReceived.map((rev, idx) => (
                  <div key={idx} className="bf-comment-card">
                    <div className="bf-comment-header">
                      <span className="bf-comment-author">🛡 Cohort Panelist {idx + 1} ({rev.reviewer})</span>
                      <span className="bf-comment-rating-pills">
                        C:{rev.scores.clarity} E:{rev.scores.empowerment} R:{rev.scores.realism} A:{rev.scores.alignment}
                      </span>
                    </div>

                    <div className="bf-comment-section">
                      <h5>Overcoming Barriers & Hurdle Actions:</h5>
                      <p>{rev.barrierSuggestion}</p>
                    </div>

                    <div className="bf-comment-section">
                      <h5>Synergy & Collaborative Opportunities:</h5>
                      <p>{rev.synergy}</p>
                    </div>

                    <div className="bf-comment-footer">
                      <span className="bf-comment-tag">Core Values: {rev.values.join(', ')}</span>
                      <span className="bf-comment-tag">Skills: {rev.skills.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
