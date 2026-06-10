import { useState } from 'react'

const RATING_OPTS = ['Rarely', 'Sometimes', 'Often']
const RATING_COLORS = { 'Rarely': 'var(--green)', 'Sometimes': 'var(--amber)', 'Often': 'var(--incorrect)' }
const GLIDER_BG = { 'Rarely': 'rgba(49, 155, 65, 0.95)', 'Sometimes': 'rgba(217, 119, 6, 0.95)', 'Often': 'rgba(220, 38, 38, 0.95)' }

function parseCategories(desc) {
  const catMatch = desc.match(/eight\s+(?:asset\s+)?categories/i)

  // 40 Assets defaults
  if (catMatch || desc.toLowerCase().includes('40 asset') || desc.toLowerCase().includes('forty')) {
    return [
      {
        name: 'Support', color: '#2563eb',
        items: ['Family support', 'Positive family communication', 'Other adult relationships', 'Caring neighborhood', 'Caring school climate', 'Parent involvement in schooling']
      },
      {
        name: 'Empowerment', color: '#7c3aed',
        items: ['Community values youth', 'Youth as resources', 'Service to others', 'Safety']
      },
      {
        name: 'Boundaries & Expectations', color: '#059669',
        items: ['Family boundaries', 'School boundaries', 'Neighborhood boundaries', 'Adult role models', 'Positive peer influence', 'High expectations']
      },
      {
        name: 'Constructive Use of Time', color: '#d97706',
        items: ['Creative activities', 'Youth programs', 'Religious community', 'Time at home']
      },
      {
        name: 'Commitment to Learning', color: '#dc2626',
        items: ['Achievement motivation', 'School engagement', 'Homework', 'Bonding to school', 'Reading for pleasure']
      },
      {
        name: 'Positive Values', color: '#0891b2',
        items: ['Caring', 'Equality & social justice', 'Integrity', 'Honesty', 'Responsibility', 'Restraint']
      },
      {
        name: 'Social Competencies', color: '#6d28d9',
        items: ['Planning & decision making', 'Interpersonal competence', 'Cultural competence', 'Resistance skills', 'Peaceful conflict resolution']
      },
      {
        name: 'Positive Identity', color: '#b45309',
        items: ['Personal power', 'Self-esteem', 'Sense of purpose', 'Positive view of personal future']
      },
    ]
  }

  // Warning signs (ch14)
  if (desc.toLowerCase().includes('warning sign') || desc.toLowerCase().includes('heart at war')) {
    return [
      {
        name: 'Self-Justifying Behaviors', color: '#dc2626',
        items: ['Blaming others for problems', 'Minimizing my role in conflicts', 'Recruiting allies to my side', 'Keeping score of wrongs done to me']
      },
      {
        name: 'Mischaracterizing Others', color: '#d97706',
        items: ["Assuming others' worst motives", 'Seeing them as obstacles or threats', 'Labeling people by their faults', 'Dismissing their perspective']
      },
      {
        name: 'Internal Warning Signs', color: '#7c3aed',
        items: ['Horribilizing situations', 'Catastrophizing outcomes', 'Feeling justified in my frustration', 'Withdrawing from connection']
      },
      {
        name: 'Relationship Patterns', color: '#2563eb',
        items: ['Avoiding difficult conversations', 'Indirect communication', 'Passive resistance', 'Expressing frustration indirectly']
      },
    ]
  }

  return [
    { name: 'Self-Assessment', color: '#7c3aed', items: ['Clear vision', 'Consistent habits', 'Accountable structures', 'Adaptive learning'] }
  ]
}

function SwitchboardRating({ current, onChange }) {
  const activeIndex = RATING_OPTS.indexOf(current)
  const gliderBg = current ? GLIDER_BG[current] : 'var(--navy)'
  
  return (
    <div className="cr-switchboard">
      {/* Sliding glider background */}
      {current && (
        <div 
          className="cr-switchboard-glider"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
            background: gliderBg
          }}
        />
      )}
      
      {RATING_OPTS.map((opt, i) => (
        <button
          key={opt}
          type="button"
          className={`cr-switchboard-btn ${current === opt ? 'active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function ChecklistRater({ config }) {
  const categories = parseCategories(config.description || '')
  const [ratings, setRatings] = useState({})

  const total = categories.reduce((a, c) => a + c.items.length, 0)
  const rated = Object.keys(ratings).filter(k => ratings[k] !== undefined).length

  // Stats counting
  const stats = { Rarely: 0, Sometimes: 0, Often: 0 }
  Object.values(ratings).forEach(v => {
    if (v) stats[v]++
  })

  function setRating(key, val) {
    setRatings(r => ({ ...r, [key]: r[key] === val ? undefined : val }))
  }

  function reset() {
    setRatings({})
  }

  // Percentages for stacked progress bar
  const rarelyPct = rated > 0 ? (stats.Rarely / total) * 100 : 0
  const sometimesPct = rated > 0 ? (stats.Sometimes / total) * 100 : 0
  const oftenPct = rated > 0 ? (stats.Often / total) * 100 : 0

  return (
    <div>
      {/* Stacked statistics bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: '600' }}>
          <span>{rated} of {total} assessed</span>
          {stats.Often > 0 && (
            <span style={{ color: 'var(--incorrect)', fontWeight: '700' }}>⚠ {stats.Often} marked "Often"</span>
          )}
        </div>
        
        {/* Colorful segment indicator */}
        <div style={{ height: 8, background: 'rgba(228, 223, 217, 0.4)', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${rarelyPct}%`, background: 'var(--green)', transition: 'width 0.35s ease' }} title={`Rarely: ${stats.Rarely}`} />
          <div style={{ width: `${sometimesPct}%`, background: 'var(--amber)', transition: 'width 0.35s ease' }} title={`Sometimes: ${stats.Sometimes}`} />
          <div style={{ width: `${oftenPct}%`, background: 'var(--incorrect)', transition: 'width 0.35s ease' }} title={`Often: ${stats.Often}`} />
        </div>
      </div>

      <div className="cr-categories">
        {categories.map(cat => {
          const catItems = cat.items
          const catRatedCount = catItems.filter(item => ratings[`${cat.name}::${item}`]).length
          
          return (
            <div key={cat.name} className="cr-category">
              <div className="cr-cat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '4px', background: cat.color, display: 'inline-block', boxShadow: `0 0 8px ${cat.color}50` }} />
                  <div className="cr-cat-title">{cat.name}</div>
                </div>
                <div className="cr-cat-progress" style={{ background: `${cat.color}15`, color: cat.color }}>
                  {catRatedCount} / {catItems.length}
                </div>
              </div>

              {catItems.map(item => {
                const key = `${cat.name}::${item}`
                const current = ratings[key]
                
                return (
                  <div key={item} className="cr-item">
                    <div className="cr-item-label">{item}</div>
                    <SwitchboardRating current={current} onChange={v => setRating(key, v)} />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Stats Summary Panel */}
      {rated > 0 && (
        <div className="cr-summary-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Rarely: <strong>{stats.Rarely}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)' }} />
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Sometimes: <strong>{stats.Sometimes}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--incorrect)' }} />
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Often: <strong>{stats.Often}</strong></span>
            </div>
          </div>
        </div>
      )}

      {rated === total && (
        <div style={{ padding: 20, background: 'rgba(49, 155, 65, 0.05)', borderRadius: 16, border: '1px solid rgba(49, 155, 65, 0.15)', marginTop: 24, animation: 'slideDown 0.3s ease' }}>
          <div style={{ fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6, fontSize: 15 }}>✓ Assessment Complete!</div>
          <p style={{ fontSize: 13.5, color: 'var(--green-dark)', lineHeight: 1.6 }}>
            Review your "Often" responses. These represent your immediate growth opportunities or critical watchpoints.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="widget-reset-btn" onClick={reset}>↺ Reset Assessment</button>
      </div>
    </div>
  )
}
