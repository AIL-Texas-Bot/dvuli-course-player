import { useState, useEffect, useCallback } from 'react'
import BlockRenderer from './components/BlockRenderer'
import AudioSidebar from './components/AudioSidebar'
import './index.css'

const BLOCK_LABELS = {
  'infographic':      '🖼 Visual',
  'narrative':        '📖 Read',
  'key-concepts':     '🔑 Concepts',
  'quiz-in-class':    '📝 Quiz',
  'weekly-challenge': '🎯 Challenge',
  'discussion':       '💬 Discuss',
  'activity':         '⚡ Activity',
  'slides':           '🖥 Slides',
  'audio':            '🎧 Audio',
  'widget':           '🧩 Widget',
}

const BLOCK_DESCS = {
  'infographic':      { icon: '🖼', label: 'Visual' },
  'narrative':        { icon: '📖', label: 'Read' },
  'key-concepts':     { icon: '🔑', label: 'Concepts' },
  'quiz-in-class':    { icon: '📝', label: 'Quiz' },
  'weekly-challenge': { icon: '🎯', label: 'Challenge' },
  'discussion':       { icon: '💬', label: 'Discuss' },
  'activity':         { icon: '⚡', label: 'Activity' },
  'slides':           { icon: '🖥', label: 'Slides' },
  'audio':            { icon: '🎧', label: 'Audio' },
  'widget':           { icon: '🧩', label: 'Widget' },
}

const STORAGE_KEYS = {
  sectionIdx: 'dvuli-course-section',
  visited:    'dvuli-course-visited',
}

function loadVisited() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.visited)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveVisited(set) {
  try { localStorage.setItem(STORAGE_KEYS.visited, JSON.stringify([...set])) }
  catch {}
}

function loadSection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sectionIdx)
    return raw !== null ? parseInt(raw, 10) : -1
  } catch { return -1 }
}

function saveSection(idx) {
  try { localStorage.setItem(STORAGE_KEYS.sectionIdx, String(idx)) }
  catch {}
}

function LandingView({ meta, overview, sections, visited, onNavigate }) {
  // Read last check-in from localStorage
  let lastSessionIdx = -1;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sectionIdx);
    if (raw !== null) {
      lastSessionIdx = parseInt(raw, 10);
    }
  } catch {}

  // Determine what the check-in session is
  const hasHistory = lastSessionIdx >= -1;
  const isDashboardCheckin = lastSessionIdx === -1;
  
  // If it's a valid session index, get its title
  let checkinTitle = "";
  if (lastSessionIdx >= 0 && lastSessionIdx < sections.length) {
    checkinTitle = sections[lastSessionIdx].title;
  } else if (isDashboardCheckin) {
    checkinTitle = "Course Dashboard";
  } else {
    checkinTitle = sections[0]?.title || "Session 1";
    lastSessionIdx = 0; // default to first session if no history
  }

  // State for progressive reveal on overview
  const [showFullOverview, setShowFullOverview] = useState(false);

  return (
    <div className="landing-container">
      {/* Immersive Welcome Hero Banner */}
      <header className="landing-hero" style={{
        backgroundImage: 'linear-gradient(rgba(7, 27, 46, 0.6), rgba(0, 61, 102, 0.85)), url(/landing_hero_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 48px 100px'
      }}>
        <div className="landing-hero-content">
          <div className="landing-eyebrow">
            ✨ DeVos Urban Leadership Initiative
          </div>
          <h1 className="landing-title">
            {meta.title || "From Calling to Breakthrough"}
          </h1>
          <p className="landing-subtitle">
            A premium, transformative learning lab for youth ministry leadership systems.
          </p>
        </div>
      </header>

      {/* Main Stacked Body Layout */}
      <div className="landing-body-grid stacked-layout">
        
        {/* 1. About the Journey - Short, Punchy, with Progressive Reveal */}
        <section className="landing-section full-width">
          <div className="landing-card overview-card glass-panel">
            <h2>About this Journey</h2>
            <p className="overview-summary-text" style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '500', marginBottom: '24px', lineHeight: '1.6' }}>
              Rebuild your leadership and youth ministry from the inside out. 
              Move from personal calling excavation to sustainable neighborhood impact.
            </p>
            
            {/* 3 Core Pillars */}
            <div className="overview-pillars-grid">
              <div className="pillar-card">
                <span className="pillar-icon">🔍</span>
                <h4>Self-Discovery</h4>
                <p>Map your divine design through OCEAN wiring and self-reflection.</p>
              </div>
              <div className="pillar-card">
                <span className="pillar-icon">🧭</span>
                <h4>Core Values</h4>
                <p>Build on Accountability, Balance, Interdependence, Empowerment, and Leverage.</p>
              </div>
              <div className="pillar-card">
                <span className="pillar-icon">🚀</span>
                <h4>Breakthrough Plan</h4>
                <p>Formulate an accountability-backed strategic plan for your community.</p>
              </div>
            </div>

            {/* Progressive Reveal Toggle Button */}
            <div className="reveal-toggle-row" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              <button 
                type="button" 
                className="widget-reset-btn" 
                onClick={() => setShowFullOverview(!showFullOverview)}
              >
                {showFullOverview ? "▲ Hide Full Vision" : "▼ Read Full Vision Statement"}
              </button>
            </div>

            {/* Collapsible Panel */}
            {showFullOverview && (
              <div className="overview-full-collapsible" style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px dashed rgba(228, 223, 217, 0.8)',
                animation: 'slideDown 0.3s ease'
              }}>
                <p className="overview-text" style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                  {overview || "This training workshop is built on a single, animating conviction: healthy leaders produce healthy organizations, and healthy organizations build healthy communities. Over sixteen sessions, participants move through an intentional arc — from the inside out — beginning with ruthlessly honest self-discovery, progressing through five foundational Core Values, and culminating in a written, presented, and accountability-backed Breakthrough Plan."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 2. Course Highlights (Stacked & Wide) */}
        <section className="landing-section full-width">
          <div className="landing-card highlights-card-full-width">
            <h2>Course Highlights</h2>
            <div className="highlights-row-grid">
              <div className="highlight-column-item">
                <div className="highlight-num">16</div>
                <div className="highlight-desc">
                  <strong>Chronological Sessions</strong>
                  <span>Moving from excavation of divine design to strategic systems.</span>
                </div>
              </div>
              <div className="highlight-column-item">
                <div className="highlight-num">5</div>
                <div className="highlight-desc">
                  <strong>Core Ministry Values</strong>
                  <span>Accountability, Balance, Interdependence, Empowerment, and Leverage.</span>
                </div>
              </div>
              <div className="highlight-column-item">
                <div className="highlight-num">1</div>
                <div className="highlight-desc">
                  <strong>Wiring Assessment</strong>
                  <span>Scientific client-side OCEAN Big Five profile with Biblical alignment.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Curriculum Arc (Stacked & Wide) */}
        <section className="landing-section full-width">
          <div className="landing-card phases-card-full-width">
            <h2>Curriculum Arc</h2>
            <div className="phases-horizontal-grid">
              <div className="phase-horizontal-card">
                <div className="phase-badge">Phase 1</div>
                <strong>Excavation (S1 - S4)</strong>
                <span>Divine design, DISC/OCEAN, and Leadership Tree synthesis.</span>
              </div>
              <div className="phase-horizontal-card">
                <div className="phase-badge">Phase 2</div>
                <strong>Foundations (S5 - S8)</strong>
                <span>Core Values as pillars of sustainable youth ministry.</span>
              </div>
              <div className="phase-horizontal-card">
                <div className="phase-badge">Phase 3</div>
                <strong>Community (S9 - S11)</strong>
                <span>Asset-based development and youth context mapping.</span>
              </div>
              <div className="phase-horizontal-card">
                <div className="phase-badge">Phase 4</div>
                <strong>Strategy (S12 - S16)</strong>
                <span>Scenario planning, systems thinking, and Breakthrough presentation.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Last Check-In (Square & Centered) & Outline (Underneath & Centered) */}
        <section className="landing-section centered-gate-section">
          <div className="landing-card gate-card-square">
            {hasHistory ? (
              <div className="gate-square-layout">
                <div className="gate-header">
                  <span className="gate-tag">Welcome Back, Leader</span>
                  <h3>Your Last Check-In</h3>
                </div>
                <div className="checkin-info">
                  <div className="checkin-icon">📖</div>
                  <div className="checkin-details">
                    <span className="checkin-session-num">
                      {isDashboardCheckin ? "Dashboard" : `Session ${lastSessionIdx + 1}`}
                    </span>
                    <span className="checkin-session-title">{checkinTitle}</span>
                  </div>
                </div>
                <div className="gate-actions-vertical">
                  <button
                    onClick={() => onNavigate(lastSessionIdx)}
                    className="gate-btn-primary full-width-btn"
                  >
                    Resume Last Session ➔
                  </button>
                </div>
              </div>
            ) : (
              <div className="gate-square-layout">
                <div className="gate-header">
                  <span className="gate-tag">Get Started</span>
                  <h3>Begin Your Leadership Development</h3>
                </div>
                <p className="gate-desc">
                  Step through the portal to access all sessions, tracking dashboards, and behavioral wiring assessments.
                </p>
                <div className="gate-actions-vertical">
                  <button
                    onClick={() => onNavigate(-1)}
                    className="gate-btn-primary full-width-btn"
                  >
                    Enter Course Portal ➔
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Centered Course Outline Underneath */}
          <div className="outline-below-gate">
            <div className="quick-nav-pills-row">
              {sections.map((s, idx) => {
                const isVisited = visited.has(s.id);
                return (
                  <button
                    key={s.id}
                    className={`quick-nav-pill ${isVisited ? 'visited' : ''}`}
                    title={s.title}
                    onClick={() => onNavigate(idx)}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function DashboardView({ meta, sections, visited, progress, onNavigate }) {
  // Compute visitedCount locally from props
  const visitedCount = sections.filter(s => visited.has(s.id)).length;
  // Find next uncompleted session index
  const nextSectionIdx = sections.findIndex(s => !visited.has(s.id));
  const continueIdx = nextSectionIdx !== -1 ? nextSectionIdx : 0;
  const nextSessionTitle = sections[continueIdx]?.title || "First Session";

  // Calculate circular stroke details for Progress Ring
  const radius = 52;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Premium Welcome Hero Card */}
      <header className="session-hero" style={{
        backgroundImage: 'linear-gradient(rgba(7, 27, 46, 0.55), rgba(7, 27, 46, 0.85)), url(/landing_hero_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '56px 40px 48px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        minHeight: 'auto',
        alignItems: 'center'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(217, 119, 6, 0.15)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '10%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'rgba(49, 155, 65, 0.1)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '40px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          width: '100%'
        }} className="dashboard-hero-grid">
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '99px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--amber)',
              marginBottom: '16px'
            }}>
              ⚡ Leadership Development
            </div>
            
            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '36px',
              fontWeight: '700',
              lineHeight: '1.2',
              marginBottom: '14px',
              color: '#fff'
            }}>
              {meta.title || "DeVos Urban Leadership Initiative"}
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: '1.65',
              maxWidth: '600px',
              marginBottom: '24px'
            }}>
              Welcome to your digital learning lab. Access course sessions, track your personal behavior wire assessments, and build sustainable leadership systems for youth ministry.
            </p>
            <button
              onClick={() => onNavigate(continueIdx)}
              style={{
                background: 'linear-gradient(90deg, var(--amber) 0%, #fbbf24 100%)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '700',
                padding: '12px 28px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(217, 119, 6, 0.35)',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Continue Course ➔ <span style={{ fontSize: '12.5px', fontWeight: '500', color: 'rgba(255,255,255,0.85)' }}>({nextSessionTitle})</span>
            </button>
          </div>

          {/* Premium Circular Progress Ring */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px',
            textAlign: 'center',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '14px' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--amber)" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#fff', display: 'block', lineHeight: '1' }}>{progress}%</span>
                <span style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>Complete</span>
              </div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '2px' }}>Progress Metrics</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{visitedCount} of {sections.length} sessions done</div>
          </div>
        </div>
      </header>

      {/* Main Timeline Journey Section */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '56px 40px 80px',
        width: '100%'
      }}>
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)' }}>Learning Pathway</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>Course Progression</h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginTop: '6px' }}>Follow the chronological outline below to progress through your initiative training.</p>
        </div>

        {/* Chronological Pathway Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {sections.map((s, i) => {
            const isCompleted = visited.has(s.id) && continueIdx !== i;
            const isCurrent = continueIdx === i;
            const isLocked = !isCompleted && !isCurrent;

            return (
              <div key={s.id} style={{
                display: 'grid',
                gridTemplateColumns: '64px 1fr',
                gap: '16px',
                position: 'relative'
              }}>
                {/* Visual Connector Line & Node */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: '6px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: '2px solid',
                    borderColor: isCompleted ? 'var(--amber)' : isCurrent ? 'var(--navy)' : 'rgba(228, 223, 217, 0.8)',
                    background: isCompleted ? 'var(--amber)' : isCurrent ? '#fff' : '#fff',
                    color: isCompleted ? '#fff' : isCurrent ? 'var(--navy)' : 'var(--text-light)',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(0, 85, 140, 0.15)' : 'none',
                    zIndex: 2,
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}>
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  {i < sections.length - 1 && (
                    <div style={{
                      width: '2px',
                      flexGrow: 1,
                      minHeight: '40px',
                      background: isCompleted ? 'var(--amber-light)' : 'rgba(228, 223, 217, 0.6)',
                      margin: '6px 0',
                      opacity: isCompleted ? 0.7 : 0.4
                    }} />
                  )}
                </div>

                {/* Chapter Information Card */}
                <div
                  onClick={() => onNavigate(i)}
                  style={{
                    background: '#fff',
                    border: isCurrent ? '2px solid var(--navy)' : '1px solid rgba(228, 223, 217, 0.7)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px',
                    boxShadow: isCurrent ? '0 6px 20px rgba(0, 85, 140, 0.06)' : '0 2px 8px rgba(0,0,0,0.01)',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  className="dashboard-card"
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>Session {i + 1}</span>
                      {isCompleted && <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--amber)', background: 'var(--amber-light)', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>Completed</span>}
                      {isCurrent && <span style={{ fontSize: '9px', fontWeight: '700', color: '#fff', background: 'var(--navy)', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>In Progress</span>}
                    </div>
                    <h3 style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: '17px',
                      fontWeight: '700',
                      color: isCurrent ? 'var(--navy)' : 'var(--text-primary)',
                      margin: 0
                    }}>{s.title}</h3>
                    {s.summary && (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                        {s.summary.slice(0, 140)}{s.summary.length > 140 ? '…' : ''}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                    style={{
                      background: isCompleted ? 'var(--amber-light)' : isCurrent ? 'var(--navy)' : 'var(--bg)',
                      color: isCompleted ? 'var(--amber)' : isCurrent ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isCompleted ? 'Review' : isCurrent ? 'Resume' : 'Start'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [course, setCourse] = useState(null)
  const [sectionIdx, setSectionIdx] = useState(-2)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visited, setVisited] = useState(loadVisited)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)
  // Cache of fully-loaded section data: { [sectionIdx]: sectionData }
  const [sectionsCache, setSectionsCache] = useState({})
  const [sectionLoading, setSectionLoading] = useState(false)

  // Load lightweight course-meta.json first (9.5 KB instead of 23 MB)
  useEffect(() => {
    fetch('/course-meta.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => { setCourse(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  // Mark current session as visited
  useEffect(() => {
    if (!course) return
    const sections = course.sections || []
    if (sectionIdx >= 0 && sectionIdx < sections.length) {
      setVisited(prev => {
        const next = new Set(prev)
        next.add(sections[sectionIdx].id)
        saveVisited(next)
        return next
      })
    }
  }, [sectionIdx, course])

  // Lazy-load full section data when navigating to a session
  useEffect(() => {
    if (sectionIdx < 0) return               // landing / dashboard — no section needed
    if (sectionsCache[sectionIdx]) return     // already cached
    const secNum = sectionIdx + 1
    setSectionLoading(true)
    fetch(`/sections/${secNum}.json`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => {
        setSectionsCache(prev => ({ ...prev, [sectionIdx]: data }))
        setSectionLoading(false)
      })
      .catch(() => setSectionLoading(false))
  }, [sectionIdx])

  // Back-to-top scroll listener
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading course…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading-screen">
        <p style={{ color: 'var(--incorrect)' }}>Failed to load: {error}</p>
      </div>
    )
  }

  const sections = course?.sections || []
  const refs     = course?.references || []
  // Use cached full-section data when available, fall back to meta stub
  const cachedSection = sectionsCache[sectionIdx]
  const section = cachedSection ||
    ((sectionIdx >= 0 && sectionIdx < sections.length) ? sections[sectionIdx] : null)
  const isRefs   = sectionIdx === sections.length
  const meta     = course?.meta || {}

  function navigate(idx) {
    setSectionIdx(idx)
    if (idx !== -2) {
      saveSection(idx)
    }
    setMenuOpen(false)
    setSessionKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function getHeroImage(s) {
    if (!s.blocks) return null
    const b = s.blocks.find(b => b.kind === 'infographic' && (b.imageSrc || b.imageDataUri))
    return b ? (b.imageSrc || b.imageDataUri) : null
  }

  function getBlockSummary(s) {
    const kinds = new Set((s.blocks || []).map(b => b.kind))
    return [...kinds].filter(k => BLOCK_LABELS[k]).slice(0, 5)
  }

  // Real progress: count of visited / total
  const visitedCount = sections.filter(s => visited.has(s.id)).length
  const progress = Math.round((visitedCount / sections.length) * 100)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* Centered Main Content Area */}
      <main className="main-content" style={{ width: '100%', flexGrow: 1 }}>
        {sectionIdx === -2 ? (
          <LandingView
            meta={meta}
            overview={course?.overview}
            sections={sections}
            visited={visited}
            onNavigate={navigate}
          />
        ) : sectionIdx === -1 ? (
          <DashboardView
            meta={meta}
            sections={sections}
            visited={visited}
            progress={progress}
            onNavigate={navigate}
          />
        ) : isRefs ? (
          <ReferencesView refs={refs} />
        ) : sectionIdx >= 0 && sectionLoading && !cachedSection ? (
          // Section is being fetched — show lightweight loading state
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading session {sectionIdx + 1}…</p>
          </div>
        ) : section ? (
          <div className="session-transition" key={sessionKey}>
            <SessionView
              key={section.id}
              section={section}
              sectionNum={sectionIdx + 1}
              total={sections.length}
              heroImage={getHeroImage(section)}
            />
            <SessionFooterNav
              sectionIdx={sectionIdx}
              sections={sections}
              onNavigate={navigate}
            />
          </div>
        ) : null}
      </main>

      {/* Floating Bottom Navigation Trigger */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 990,
          background: '#071b2e',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '99px',
          padding: '10px 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          whiteSpace: 'nowrap'
        }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>
          {sectionIdx === -1 ? "🏠 Dashboard" : `Session ${sectionIdx + 1} of ${sections.length}`}
        </span>
        <span style={{ height: '14px', width: '1.5px', background: 'rgba(255,255,255,0.2)' }} />
        <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Course Outline {menuOpen ? "▼" : "▲"}
        </span>
      </div>

      {/* Collapsible Bottom Navigation Drawer Overlay */}
      {menuOpen && (
        <>
          {/* Dim Backdrop */}
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 27, 46, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'opacity 0.25s ease'
          }} onClick={() => setMenuOpen(false)} />

          {/* Drawer Body */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '70vh',
            background: '#071b2e',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1.5px solid rgba(255, 255, 255, 0.1)',
            borderBottom: 'none',
            animation: 'slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <h3 style={{ color: '#fff', fontSize: '17px', fontFamily: "'Fraunces', serif", margin: 0 }}>Course Outline</h3>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* List links */}
            <div style={{
              overflowY: 'auto',
              padding: '20px 24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Landing Portal Link */}
              <button
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: sectionIdx === -2 ? '1.5px solid var(--amber)' : '1px solid rgba(255,255,255,0.08)',
                  background: sectionIdx === -2 ? 'rgba(217, 119, 6, 0.1)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: "'Inter', sans-serif"
                }}
                onClick={() => { navigate(-2); setMenuOpen(false); }}
              >
                <span style={{ fontSize: '16px' }}>✨</span>
                <span style={{ fontWeight: '700', fontSize: '13.5px' }}>Course Landing Portal</span>
              </button>

              {/* Home Dashboard */}
              <button
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: sectionIdx === -1 ? '1.5px solid var(--amber)' : '1px solid rgba(255,255,255,0.08)',
                  background: sectionIdx === -1 ? 'rgba(217, 119, 6, 0.1)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: "'Inter', sans-serif"
                }}
                onClick={() => { navigate(-1); setMenuOpen(false); }}
              >
                <span style={{ fontSize: '16px' }}>🏠</span>
                <span style={{ fontWeight: '700', fontSize: '13.5px' }}>Course Dashboard</span>
              </button>

              <div style={{
                fontSize: '10px',
                fontWeight: '800',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                margin: '12px 0 6px'
              }}>Sessions</div>

              {sections.map((s, i) => {
                const isActive = sectionIdx === i;
                const isVisited = visited.has(s.id) && !isActive;
                return (
                  <button
                    key={s.id}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      border: isActive ? '1.5px solid var(--amber)' : '1px solid rgba(255,255,255,0.08)',
                      background: isActive ? 'rgba(217, 119, 6, 0.1)' : 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      fontFamily: "'Inter', sans-serif"
                    }}
                    onClick={() => { navigate(i); setMenuOpen(false); }}
                  >
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isVisited ? 'var(--amber)' : isActive ? 'var(--navy)' : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {isVisited ? '✓' : i + 1}
                    </span>
                    <span style={{
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '13.5px',
                      flexGrow: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {s.title}
                    </span>
                  </button>
                );
              })}

              <div style={{
                fontSize: '10px',
                fontWeight: '800',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                margin: '12px 0 6px'
              }}>Library</div>

              <button
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: isRefs ? '1.5px solid var(--amber)' : '1px solid rgba(255,255,255,0.08)',
                  background: isRefs ? 'rgba(217, 119, 6, 0.1)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: "'Inter', sans-serif"
                }}
                onClick={() => { navigate(sections.length); setMenuOpen(false); }}
              >
                <span style={{ fontSize: '16px' }}>📚</span>
                <span style={{ fontWeight: '700', fontSize: '13.5px' }}>References ({refs.length})</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Back to Top FAB */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        style={{ bottom: '88px', right: '24px' }} /* Push up so it doesn't overlap the navigation trigger */
      >
        ↑
      </button>
    </div>
  );
}

function SessionFooterNav({ sectionIdx, sections, onNavigate }) {
  const hasPrev = sectionIdx > 0
  const hasNext = sectionIdx < sections.length - 1
  const prevTitle = hasPrev ? sections[sectionIdx - 1].title : null
  const nextTitle = hasNext ? sections[sectionIdx + 1].title : null

  return (
    <div className="session-footer-nav">
      {hasPrev ? (
        <button className="session-footer-btn prev" onClick={() => onNavigate(sectionIdx - 1)}>
          <span className="session-footer-btn-label">Previous Session</span>
          <span className="session-footer-btn-title">← {prevTitle}</span>
        </button>
      ) : <div />}
      {hasNext ? (
        <button className="session-footer-btn next" onClick={() => onNavigate(sectionIdx + 1)}>
          <span className="session-footer-btn-label">Continue to Next</span>
          <span className="session-footer-btn-title">{nextTitle} →</span>
        </button>
      ) : (
        <button className="session-footer-btn next" onClick={() => onNavigate(sections.length)}>
          <span className="session-footer-btn-label">Course Complete</span>
          <span className="session-footer-btn-title">View References →</span>
        </button>
      )}
    </div>
  )
}


const CHAPTER_RESOURCES = {
  1: {
    folder: 'Leader assessment ',
    files: [
      { name: 'LW1 Workbook (Word Document)', path: 'LW1-PreAssignment-2024-Unbranded.docx' },
      { name: 'LW1 Pre-Assignment (Electronic PDF)', path: 'LW1-PreAssignment-2024-Electronic.pdf' },
      { name: 'LW1 Training Toolkit (PowerPoint)', path: 'LW1-TrainingToolkit-2024.pptx' },
      { name: 'Leadership Tree PDF', path: 'Leadership-Tree-2024.pdf' },
      { name: 'LW1 Schedule', path: 'LW1-Schedule-2024-1.pdf' },
      { name: 'Leading at a Higher Level (Chapter 4)', path: 'Leading-at-a-Higher-Level_Chapter-4.pdf' },
      { name: 'Supplemental Resources', path: 'Supplemental-Resources.pdf' },
    ]
  },
  2: {
    folder: 'Leader assessment ',
    files: [
      { name: 'LW1 Workbook (Word Document)', path: 'LW1-PreAssignment-2024-Unbranded.docx' },
      { name: 'LW1 Pre-Assignment (Electronic PDF)', path: 'LW1-PreAssignment-2024-Electronic.pdf' },
      { name: 'LW1 Training Toolkit (PowerPoint)', path: 'LW1-TrainingToolkit-2024.pptx' },
    ]
  },
  3: {
    folder: 'Leader assessment ',
    files: [
      { name: 'LW1 Workbook (Word Document)', path: 'LW1-PreAssignment-2024-Unbranded.docx' },
      { name: 'LW1 Pre-Assignment (Electronic PDF)', path: 'LW1-PreAssignment-2024-Electronic.pdf' },
      { name: 'LW1 Training Toolkit (PowerPoint)', path: 'LW1-TrainingToolkit-2024.pptx' },
    ]
  },
  4: {
    folder: 'Leader assessment ',
    files: [
      { name: 'LW1 Workbook (Word Document)', path: 'LW1-PreAssignment-2024-Unbranded.docx' },
      { name: 'LW1 Pre-Assignment (Electronic PDF)', path: 'LW1-PreAssignment-2024-Electronic.pdf' },
      { name: 'Leadership Tree PDF', path: 'Leadership-Tree-2024.pdf' },
      { name: 'LW1 Training Toolkit (PowerPoint)', path: 'LW1-TrainingToolkit-2024.pptx' },
    ]
  },
  5: {
    folder: 'Core Values and Healthy Change',
    files: [
      { name: 'NC1 Workbook (Electronic PDF)', path: 'NC1-Workbook-2024-Electronic.pdf' },
      { name: 'NC1 Pre-Assignment (Electronic PDF)', path: 'NC1-PreAssignment-2024-Electronic_.pdf' },
      { name: 'NC1 Training Toolkit (PowerPoint)', path: 'NC1-TrainingToolkit-2024.pptx' },
      { name: 'NC1 Schedule', path: 'NC1-Schedule-2024.pdf' },
      { name: 'Thoughts on Servant Leadership', path: 'Thoughts-on-Servant-Leadership-CBurton.pdf' },
    ]
  },
  6: {
    folder: 'Core Values and Healthy Change',
    files: [
      { name: 'NC1 Workbook (Electronic PDF)', path: 'NC1-Workbook-2024-Electronic.pdf' },
      { name: 'NC1 Pre-Assignment (Electronic PDF)', path: 'NC1-PreAssignment-2024-Electronic_.pdf' },
      { name: 'First Things First (Time Management Matrix)', path: 'First-Things-First-_Time-Management-Matrix-Pages-36_37.pdf' },
    ]
  },
  7: {
    folder: 'Core Values and Healthy Change',
    files: [
      { name: 'NC1 Workbook (Electronic PDF)', path: 'NC1-Workbook-2024-Electronic.pdf' },
      { name: 'NC1 Pre-Assignment (Electronic PDF)', path: 'NC1-PreAssignment-2024-Electronic_.pdf' },
      { name: 'Empowerment Handout', path: 'Empowerment-Handout-2024.docx' },
    ]
  },
  8: {
    folder: 'Core Values and Healthy Change',
    files: [
      { name: 'NC1 Workbook (Electronic PDF)', path: 'NC1-Workbook-2024-Electronic.pdf' },
      { name: 'NC1 Pre-Assignment (Electronic PDF)', path: 'NC1-PreAssignment-2024-Electronic_.pdf' },
    ]
  },
  9: {
    folder: 'Asset Based Development',
    files: [
      { name: 'LW2 Workbook (Electronic PDF)', path: 'LW2-Workbook-2024-Electronic.pdf' },
      { name: 'LW2 Pre-Assignment (Electronic PDF)', path: 'LW2-PreAssignment-2024-Electronic.pdf' },
      { name: 'LW2 Training Toolkit (PowerPoint)', path: 'LW2-Training-Toolkit-2024.pptx' },
      { name: 'LW2 Schedule', path: 'LW2-Schedule-2023.pdf' },
    ]
  },
  10: {
    folder: 'Asset Based Development',
    files: [
      { name: 'LW2 Workbook (Electronic PDF)', path: 'LW2-Workbook-2024-Electronic.pdf' },
      { name: 'LW2 Pre-Assignment (Electronic PDF)', path: 'LW2-PreAssignment-2024-Electronic.pdf' },
      { name: 'Mapping Community Assets', path: 'Mapping-Community-Assets.pdf' },
      { name: 'Jackson Times PDF', path: 'Jackson-Times-2024.pdf' },
    ]
  },
  11: {
    folder: 'Asset Based Development',
    files: [
      { name: 'LW2 Workbook (Electronic PDF)', path: 'LW2-Workbook-2024-Electronic.pdf' },
      { name: 'LW2 Pre-Assignment (Electronic PDF)', path: 'LW2-PreAssignment-2024-Electronic.pdf' },
    ]
  },
  12: {
    folder: 'Scenario Planning',
    files: [
      { name: 'LW3 Workbook (Electronic PDF)', path: 'LW3-Workbook-2024-Electronic.pdf' },
      { name: 'LW3 Pre-Assignment (Electronic PDF)', path: 'LW3-PreAssignment-2024-Electronic.pdf' },
      { name: 'LW3 Training Toolkit (PowerPoint)', path: 'LW3-Training-Toolkit-2024.pptx' },
    ]
  },
  13: {
    folder: 'Systems Thinking',
    files: [
      { name: 'NC2 Workbook (Electronic PDF)', path: 'NC2-Workbook-2024-Electronic.pdf' },
      { name: 'NC2 Pre-Assignment (Electronic PDF)', path: 'NC2-PreAssignment-2024-Electronic.pdf' },
      { name: 'NC2 Training Toolkit (PowerPoint)', path: 'NC2-Training-Toolkit-2024.pptx' },
      { name: 'Breakthrough Handbook', path: 'Breakthrough-Handbook-2024.pdf' },
      { name: 'NC2 Schedule', path: 'NC2-Schedule-2024.pdf' },
    ]
  },
  14: {
    folder: 'Systems Thinking',
    files: [
      { name: 'NC2 Workbook (Electronic PDF)', path: 'NC2-Workbook-2024-Electronic.pdf' },
      { name: 'NC2 Pre-Assignment (Electronic PDF)', path: 'NC2-PreAssignment-2024-Electronic.pdf' },
      { name: 'Arbinger Believer’s Guide', path: '2024-Arbinger-Believers-Guide.pdf' },
    ]
  },
  15: {
    folder: 'resource networking',
    files: [
      { name: 'LW4 Workbook (Electronic PDF)', path: 'LW4-Workbook-2024-Electronic.pdf' },
      { name: 'LW4 Pre-Assignment (Electronic PDF)', path: 'LW4-PreAssignment-2024-Electronic.pdf' },
      { name: 'Raising Resources Guide', path: 'Raising-Resources_1_0_0.pdf' },
      { name: 'Discover Total Resources', path: 'Discover-Total-Resources_0.pdf' },
      { name: 'LW4 Schedule', path: 'LW4-Schedule-2024.pdf' },
    ]
  },
  16: {
    folder: 'Leading change',
    files: [
      { name: 'LW5 Workbook (Electronic PDF)', path: 'LW5-Workbook-2024-Electronic.pdf' },
      { name: 'LW5 Pre-Assignment (Electronic PDF)', path: 'LW5-PreAssignment-2024-Electronic.pdf' },
      { name: 'Breakthrough Plan Feedback Form', path: 'Breakthrough-Plan-Feedback-Form.pdf' },
      { name: 'Supplemental Collaboration Materials', path: 'Supplemental-Collaboration-Materials.pdf' },
      { name: '5 Easy Pieces Game Instructions', path: '5-Easy-Pieces-Game-Instructions.pdf' },
    ]
  }
};

function ChapterResourcesSection({ sectionNum }) {
  const resourceData = CHAPTER_RESOURCES[sectionNum];
  if (!resourceData) return null;

  return (
    <div className="resources-block block-wrapper" style={{ marginTop: '36px' }}>
      <div className="resources-header" style={{
        background: 'linear-gradient(135deg, var(--navy-dark) 0%, var(--navy-mid) 100%)',
        padding: '20px 28px',
        color: '#fff',
        borderRadius: '14px 14px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>📚</span>
        <h3 style={{ margin: 0, fontSize: '18px', fontFamily: "'Fraunces', Georgia, serif", color: '#fff' }}>
          Workbooks & Resources
        </h3>
      </div>
      <div className="resources-body" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: 'none',
        borderRadius: '0 0 14px 14px',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
          Download official DeVos Urban Leadership Initiative (DVULI) materials and workbooks for this session:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {resourceData.files.map((file, idx) => {
            const isPPTX = file.path.endsWith('.pptx');
            const isDOCX = file.path.endsWith('.docx');
            const icon = isPPTX ? '📊' : isDOCX ? '📝' : '📕';
            const fileUrl = `/DVULI/${encodeURIComponent(resourceData.folder)}/${encodeURIComponent(file.path)}`;
            return (
              <a
                key={idx}
                href={fileUrl}
                download
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '13.5px',
                  transition: 'all 0.2s ease'
                }}
                className="resource-download-link"
              >
                <span style={{ fontSize: '18px' }}>{icon}</span>
                <span style={{ flexGrow: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--navy)', fontWeight: 'bold' }}>↓</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function HeaderResourcesLink({ sectionNum }) {
  const resourceData = CHAPTER_RESOURCES[sectionNum];
  if (!resourceData) return null;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      margin: '10px 0 16px 0',
      width: '100%',
      justifyContent: 'flex-start'
    }}>
      {resourceData.files.map((file, idx) => {
        const isPPTX = file.path.endsWith('.pptx');
        const isDOCX = file.path.endsWith('.docx');
        const icon = isPPTX ? '📊' : isDOCX ? '📝' : '📕';
        const fileUrl = `/DVULI/${encodeURIComponent(resourceData.folder)}/${encodeURIComponent(file.path)}`;
        return (
          <a
            key={idx}
            href={fileUrl}
            download
            className="header-resource-download-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '99px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <span>{icon}</span>
            <span>{file.name}</span>
            <span style={{ fontSize: '10px', opacity: 0.8 }}>↓</span>
          </a>
        );
      })}
    </div>
  );
}


function SessionView({ section, sectionNum, total, heroImage }) {
  const blocks = section.blocks || []
  const blockTypes = [...new Set(blocks.map(b => b.kind))]
  const infographicBlock = blocks.find(b => b.kind === 'infographic' && b.id.endsWith('-infographic'))

  return (
    <article>
      {/* Premium Compact Chapter Hero Page */}
      <header style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 48px 32px',
        color: '#fff',
        background: '#071b2e'
      }}>
        {/* Parallax Background Illustration */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/landing_hero_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `hue-rotate(${(sectionNum - 1) * 22.5}deg) brightness(0.28) saturate(1.25)`,
          transform: 'scale(1.05)',
          zIndex: 0
        }} />

        {/* Radial Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(7, 27, 46, 0.4) 0%, rgba(7, 27, 46, 0.9) 100%)',
          zIndex: 1
        }} />

        {/* Large Decorative Session Number background */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '48px',
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: '100px',
          fontWeight: '700',
          color: 'rgba(255,255,255,0.03)',
          lineHeight: '1',
          userSelect: 'none',
          zIndex: 2
        }}>{sectionNum}</div>

        {/* Content Box */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '99px',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--amber)'
          }}>
            Session {sectionNum} of {total}
          </div>

          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: '700',
            lineHeight: '1.15',
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            margin: '8px 0 4px 0'
          }}>
            {section.title}
          </h1>

          {section.summary && (
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.7',
              maxWidth: '680px',
              margin: '0 0 16px 0'
            }}>
              {section.summary}
            </p>
          )}

          {/* Workbooks & Resources Link Row at the top */}
          <HeaderResourcesLink sectionNum={sectionNum} />

          {/* Jump Links Navigation Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '28px',
            width: '100%',
            maxWidth: '540px',
            margin: '28px auto 0'
          }}>
            {Object.keys(BLOCK_DESCS)
              .filter(kind => kind !== 'weekly-challenge' && kind !== 'discussion' && kind !== 'activity' && kind !== 'audio' && kind !== 'widget')
              .map(kind => {
                const firstBlock = blocks.find(b => b.kind === kind)
              const exists = !!firstBlock
              const item = BLOCK_DESCS[kind]
              return (
                <a
                  key={kind}
                  className={exists ? "toc-square-btn" : "toc-square-btn-disabled"}
                  href={exists ? `#${firstBlock.id}` : undefined}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '94px',
                    height: '94px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: exists ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.015)',
                    color: exists ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)',
                    border: exists ? '1px solid rgba(255,255,255,0.12)' : '1px dashed rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    backdropFilter: exists ? 'blur(8px)' : 'none',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    cursor: exists ? 'pointer' : 'default',
                    pointerEvents: exists ? 'auto' : 'none',
                    userSelect: 'none'
                  }}
                >
                  <span style={{ fontSize: '20px', marginBottom: '4px', filter: exists ? 'none' : 'grayscale(100%) opacity(0.5)' }}>{item.icon}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{item.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </header>

      {/* Anchor for starting the session scroll */}
      <div id="session-start-indicator" style={{ height: '1px', marginTop: '-1px' }} />

      {/* Blocks */}
      <div className="session-body">
        {infographicBlock && (
          <BlockRenderer
            key={infographicBlock.id}
            block={infographicBlock}
            widgets={blocks.filter(b => b.kind === 'widget')}
            style={{ animationDelay: '0ms' }}
          />
        )}

        {blocks
          .filter(block => 
            block.kind !== 'widget' && 
            block.kind !== 'audio' &&
            block.id !== infographicBlock?.id &&
            !block.id.endsWith('-hero') &&
            block.kind !== 'weekly-challenge' &&
            block.kind !== 'discussion' &&
            block.kind !== 'activity'
          )
          .map((block, i) => (
            <BlockRenderer
              key={block.id}
              block={block}
              widgets={blocks.filter(b => b.kind === 'widget')}
              style={{ animationDelay: `${(i + 1) * 50}ms` }}
            />
          ))
        }
        
        {/* Workbooks & Resources Downloads */}
        <ChapterResourcesSection sectionNum={sectionNum} />
      </div>

      {/* Floating Audiobook Side Panel */}
      <AudioSidebar block={blocks.find(b => b.kind === 'audio')} />
    </article>
  )
}

function ReferencesView({ refs }) {
  return (
    <article>
      <header style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px 50px',
        color: '#fff',
        background: '#0f172a'
      }}>
        {/* Parallax Background Illustration */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/landing_hero_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'hue-rotate(240deg) brightness(0.25) saturate(0.8)',
          transform: 'scale(1.05)',
          zIndex: 0
        }} />

        {/* Radial Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
          zIndex: 1
        }} />

        <div className="session-num-large" style={{ fontSize: 80, position: 'absolute', top: '24px', right: '48px', opacity: 0.15, zIndex: 2 }}>📚</div>

        <div style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '99px',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--amber)'
          }}>
            Bibliography
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: '700',
            lineHeight: '1.15',
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            margin: '8px 0 4px 0'
          }}>
            References
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.6',
            maxWidth: '680px',
            margin: 0
          }}>
            {refs.length} academic sources grounding the DVULI curriculum in research, theology, and leadership science.
          </p>
        </div>
      </header>
      <div className="session-body">
        <div className="references-block block-wrapper">
          <div className="references-header">
            <div className="references-header-title">Full Bibliography</div>
          </div>
          <div className="references-list">
            {refs.map((ref, i) => (
              <div key={i} className="reference-item">
                <div className="reference-title">{ref.title}</div>
                <div>
                  <span className="reference-authors">{ref.authors}</span>
                  {ref.year && <span className="reference-year">{ref.year}</span>}
                </div>
                {ref.url && (
                  <a className="reference-link" href={ref.url} target="_blank" rel="noopener noreferrer">
                    View source →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
