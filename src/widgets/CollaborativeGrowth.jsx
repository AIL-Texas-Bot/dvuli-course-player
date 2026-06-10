import { useState, useEffect } from 'react'

const SKILL_DETAILS = {
  'Self-Reflection': {
    def: 'The capacity to understand your own values, emotional triggers, leadership shadow, and limits, ensuring your behaviors remain congruent with your calling.',
    coreValue: 'Accountability',
    sessions: 'Session 1 (Hexagon Assessment), Session 5 (Core Values & Healthy Change), First National Conference',
    nextAction: 'Establish a monthly check-in with your mentor using a structured checklist to audit your physical, emotional, and spiritual boundaries.'
  },
  'Trust-Building': {
    def: 'The relational practice of creating safety and mutual respect, earning cohort and team confidence slowly through consistency and transparent communication.',
    coreValue: 'Interdependence',
    sessions: 'Session 4 (Mentoring Relationships), Session 9 (Relational Safety & Communication Tools)',
    nextAction: 'Implement anonymous quarterly feedback loops for your volunteers and staff to measure team trust and address concerns openly.'
  },
  'Developing People': {
    def: 'The deliberate empowerment-oriented focus on mentoring, coaching, and releasing others into leadership, rather than holding tasks for yourself.',
    coreValue: 'Empowerment',
    sessions: 'Session 13 (Delegation & Releasing Leaders), Session 14 (Coaching & Leadership Pipeline Structures)',
    nextAction: 'Identify two high-potential youth leaders and begin co-leading the Friday night teaching sessions, giving them full design ownership.'
  },
  'Assessing Environment': {
    def: 'Reading the systems, scenarios, and stakeholders accurately, identifying neighborhood assets, and anticipating obstacles before acting.',
    coreValue: 'Balance',
    sessions: 'Session 3 (Scenario Planning), Session 7 (Systems Thinking & Diagrams), Session 8 (Community Asset Mapping)',
    nextAction: 'Host a neighborhood walk with youth leaders to list 5 community assets (churches, parks, business leaders) to partner with for the summer.'
  },
  'Creating Clarity': {
    def: 'Articulating a compelling, shared vision (starting with "Why") and establishing clear roles, timelines, and measurable goals for execution.',
    coreValue: 'Leverage',
    sessions: 'Session 12 (Decision-Making & Clarity), Session 15 (Resource Networking pitches)',
    nextAction: 'Draft a single-page Why-How-What brief for the next youth cycle and present it to parents and volunteers at a launch dinner.'
  },
  'Sharing Power': {
    def: 'Structuring decision-making processes to distribute authority, letting go of control, and fostering collective ownership of Kingdom outcomes.',
    coreValue: 'Empowerment',
    sessions: 'Session 13 (Releasing Control), Second National Conference (Collaborative leadership case study)',
    nextAction: 'Constitute a Youth Advisory Panel of 5 students who hold voting rights over the Friday night recreation budget and guest speakers.'
  }
}

const SKILLS = Object.keys(SKILL_DETAILS)

const RATING_STEPS = [
  { val: 1, label: 'Beginning' },
  { val: 2, label: 'Awareness' },
  { val: 3, label: 'Steadily' },
  { val: 4, label: 'Practicing' },
  { val: 5, label: 'Exemplar' }
]

export default function CollaborativeGrowth({ config, blockId }) {
  const [ratings, setRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(`dvuli-widget-state-${blockId}`)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    // Default mock initial scores if empty
    return Object.fromEntries(
      SKILLS.map((sk, idx) => [
        sk,
        {
          before: Math.max(1, 2 - (idx % 2)),
          now: Math.min(5, 3 + (idx % 2)),
          goal: Math.min(5, 4 + (idx % 2))
        }
      ])
    )
  })

  const [selectedSkill, setSelectedSkill] = useState(SKILLS[0])
  const [isPrintView, setIsPrintView] = useState(false)

  const handleRatingChange = (skill, timePoint, val) => {
    setRatings(prev => {
      const next = {
        ...prev,
        [skill]: {
          ...prev[skill],
          [timePoint]: val
        }
      }
      try {
        localStorage.setItem(`dvuli-widget-state-${blockId}`, JSON.stringify(next))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  const selectedData = SKILL_DETAILS[selectedSkill]
  const selectedRatings = ratings[selectedSkill] || { before: 1, now: 3, goal: 5 }

  const resetAll = () => {
    if (window.confirm('Are you sure you want to reset all ratings to beginning baselines?')) {
      const initial = Object.fromEntries(
        SKILLS.map((sk, idx) => [
          sk,
          {
            before: Math.max(1, 2 - (idx % 2)),
            now: Math.min(5, 3 + (idx % 2)),
            goal: Math.min(5, 4 + (idx % 2))
          }
        ])
      )
      setRatings(initial)
      localStorage.setItem(`dvuli-widget-state-${blockId}`, JSON.stringify(initial))
      setSelectedSkill(SKILLS[0])
    }
  }

  const triggerPrint = () => {
    window.print()
  }

  if (isPrintView) {
    return (
      <div className="cg-print-view">
        <div className="cg-print-header">
          <div className="cg-print-logo">DVULI</div>
          <h2>Collaborative Leadership Development Plan</h2>
          <p>DeVos Urban Leadership Initiative — Capstone Portfolio</p>
        </div>

        <table className="cg-print-table">
          <thead>
            <tr>
              <th>Collaborative Leadership Skill</th>
              <th>Ratings (Before ➔ Now ➔ Goal)</th>
              <th>Core Value & Curriculum Development Links</th>
              <th>12-Month Next Action Step</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map(sk => {
              const r = ratings[sk]
              const det = SKILL_DETAILS[sk]
              return (
                <tr key={sk}>
                  <td className="cg-print-skill-name">
                    <strong>{sk}</strong>
                    <span className="cg-print-def">{det.def}</span>
                  </td>
                  <td className="cg-print-ratings">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className="cg-print-badge prev">Beg: {r.before}</span>
                      <span>➔</span>
                      <span className="cg-print-badge now">Now: {r.now}</span>
                      <span>➔</span>
                      <span className="cg-print-badge goal">Goal: {r.goal}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cg-print-links">
                      <strong>Value:</strong> {det.coreValue}<br />
                      <strong>Sessions:</strong> {det.sessions}
                    </div>
                  </td>
                  <td className="cg-print-action">
                    {det.nextAction}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="cg-print-signatures">
          <div className="cg-sig-line">
            <div className="cg-line" />
            <span>Graduate Signature</span>
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
          <button className="widget-save-btn" onClick={triggerPrint}>Print / Save as PDF</button>
          <button className="widget-reset-btn" onClick={() => setIsPrintView(false)}>Back to Interactive View</button>
        </div>
      </div>
    )
  }

  return (
    <div className="cg-widget">
      <div className="cg-header-row">
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '80%' }}>
          Assess your development in the six core skills of collaborative leadership. Map where you began the program, where you stand today, and outline your growth goals for the coming 12 months.
        </p>
        <button className="widget-reset-btn" style={{ marginLeft: 'auto' }} onClick={() => setIsPrintView(true)}>
          🖨 Printable Plan
        </button>
      </div>

      <div className="cg-grid">
        {/* Left Side: Interactive Skills Trajectories */}
        <div className="cg-skills-list">
          {SKILLS.map(sk => {
            const r = ratings[sk]
            const isSel = selectedSkill === sk
            const growth = r.now - r.before
            
            return (
              <div
                key={sk}
                className={`cg-skill-row-card ${isSel ? 'active' : ''}`}
                onClick={() => setSelectedSkill(sk)}
              >
                <div className="cg-skill-row-header">
                  <div className="cg-skill-title-block">
                    <span className="cg-skill-dot" style={{ background: isSel ? 'var(--navy)' : 'rgba(0,85,140,0.2)' }} />
                    <span className="cg-skill-name">{sk}</span>
                  </div>
                  {growth > 0 && (
                    <span className="cg-growth-badge">+{growth} Growth</span>
                  )}
                </div>

                {/* Trajectory Bar */}
                <div className="cg-trajectory-bar-wrap" onClick={(e) => e.stopPropagation()}>
                  <div className="cg-trajectory-labels">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                  <div className="cg-trajectory-line-shell">
                    {/* Connecting line Before -> Now */}
                    <div
                      className="cg-traj-link prev-now"
                      style={{
                        left: `${((r.before - 1) / 4) * 100}%`,
                        width: `${((r.now - r.before) / 4) * 100}%`
                      }}
                    />
                    {/* Connecting line Now -> Goal */}
                    <div
                      className="cg-traj-link now-goal"
                      style={{
                        left: `${((r.now - 1) / 4) * 100}%`,
                        width: `${((r.goal - r.now) / 4) * 100}%`
                      }}
                    />

                    {/* Nodes */}
                    <button
                      className="cg-node-btn before"
                      style={{ left: `${((r.before - 1) / 4) * 100}%` }}
                      title={`Before DVULI rating: ${r.before}`}
                      onClick={() => {
                        const val = r.before === 5 ? 1 : r.before + 1
                        handleRatingChange(sk, 'before', val)
                      }}
                    >
                      {r.before}
                    </button>

                    <button
                      className="cg-node-btn now"
                      style={{ left: `${((r.now - 1) / 4) * 100}%` }}
                      title={`Current end-of-program rating: ${r.now}`}
                      onClick={() => {
                        const val = r.now === 5 ? 1 : r.now + 1
                        handleRatingChange(sk, 'now', val)
                      }}
                    >
                      ⭐
                    </button>

                    <button
                      className="cg-node-btn goal"
                      style={{ left: `${((r.goal - 1) / 4) * 100}%` }}
                      title={`12-Month Goal: ${r.goal}`}
                      onClick={() => {
                        const val = r.goal === 5 ? 1 : r.goal + 1
                        handleRatingChange(sk, 'goal', val)
                      }}
                    >
                      🎯
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Side: Details Panel */}
        <div className="cg-detail-panel">
          <div className="cg-panel-header">
            <h4>{selectedSkill}</h4>
            <span className="bf-comment-tag" style={{ background: 'var(--navy-light)', color: 'var(--navy)' }}>
              Core Value: {selectedData.coreValue}
            </span>
          </div>

          <div className="cg-panel-body">
            <div className="cg-section">
              <h5>Definition & Focus</h5>
              <p>{selectedData.def}</p>
            </div>

            <div className="cg-section">
              <h5>DVULI Curriculum Development</h5>
              <p style={{ fontStyle: 'italic', fontSize: '13px' }}>{selectedData.sessions}</p>
            </div>

            {/* Ratings editor */}
            <div className="cg-rating-editor-card">
              <h5>Customize Trajectory Ratings:</h5>
              <div className="cg-editor-grids">
                <div className="cg-editor-row">
                  <span>Before DVULI:</span>
                  <div className="cg-editor-options">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        className={`cg-editor-btn prev ${selectedRatings.before === v ? 'active' : ''}`}
                        onClick={() => handleRatingChange(selectedSkill, 'before', v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cg-editor-row">
                  <span>Now (End rating):</span>
                  <div className="cg-editor-options">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        className={`cg-editor-btn now ${selectedRatings.now === v ? 'active' : ''}`}
                        onClick={() => handleRatingChange(selectedSkill, 'now', v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cg-editor-row">
                  <span>12-Month Goal:</span>
                  <div className="cg-editor-options">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        className={`cg-editor-btn goal ${selectedRatings.goal === v ? 'active' : ''}`}
                        onClick={() => handleRatingChange(selectedSkill, 'goal', v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="cg-section cg-action-box">
              <h5>🎯 Next Growth Step for Your Breakthrough Plan</h5>
              <p style={{ fontWeight: '500', color: 'var(--navy-dark)' }}>{selectedData.nextAction}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="widget-reset-btn" onClick={resetAll}>↺ Reset all ratings</button>
      </div>
    </div>
  )
}
