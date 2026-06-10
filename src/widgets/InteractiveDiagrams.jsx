import { useState } from 'react'

const BODY_ROLES = [
  { id: 'head', label: 'Strategic Planner', part: 'Brain / Head', disc: 'C', scripture: '1 Cor 12:21', gap: 'Without strategic planning, the organization drifts without long-term goals or clear structural blueprints.' },
  { id: 'heart', label: 'Counselor / Encourager', part: 'Heart', disc: 'S', scripture: '1 Cor 12:26', gap: 'Without counselors or encouragers, staff burn out quickly and conflicts remain unresolved, eroding trust.' },
  { id: 'hands', label: 'Frontline Youth Worker', part: 'Hands', disc: 'I', scripture: '1 Cor 12:15', gap: 'Without frontline workers, programs fail to build warm direct trust relationships with youth.' },
  { id: 'feet', label: 'Community Organizer', part: 'Feet', disc: 'D', scripture: '1 Cor 12:18', gap: 'Without organizers, the ministry remains isolated from local schools, churches, and neighborhoods.' },
  { id: 'mouth', label: 'Communicator / Teacher', part: 'Mouth', disc: 'I/D', scripture: '1 Cor 12:28', gap: 'Without communicators, the cause of the youth is not shared, and theological foundations are weak.' },
  { id: 'shoulders', label: 'Administrator', part: 'Shoulders', disc: 'C', scripture: '1 Cor 12:28', gap: 'Without administrators, logistics fall apart, budgets are mismanaged, and rallies are chaotic.' }
]

const LEVERAGE_NODES = [
  { id: 'leader', label: 'Leader', x: 140, y: 35, influences: ['youth', 'organization'] },
  { id: 'youth', label: 'Youth', x: 230, y: 90, influences: ['peers', 'family'] },
  { id: 'family', label: 'Family', x: 230, y: 190, influences: ['school', 'youth'] },
  { id: 'school', label: 'School', x: 140, y: 245, influences: ['peers', 'community'] },
  { id: 'peers', label: 'Peers', x: 50, y: 190, influences: ['youth', 'community'] },
  { id: 'community', label: 'Community', x: 50, y: 90, influences: ['church', 'family'] },
  { id: 'church', label: 'Church', x: 100, y: 140, influences: ['leader', 'community'] },
  { id: 'organization', label: 'Organization', x: 180, y: 140, influences: ['leader', 'youth'] }
]

export default function InteractiveDiagrams({ blockId, config }) {
  const isBody = blockId?.includes('ch7') || config?.description?.toLowerCase().includes('body of christ')

  // State for Body of Christ
  const [selectedPart, setSelectedPart] = useState('head')
  const [roleStatus, setRoleStatus] = useState({
    head: 'present',
    heart: 'present',
    hands: 'me',
    feet: 'absent',
    mouth: 'present',
    shoulders: 'absent'
  })

  // State for Leverage Finder
  const [selectedNode, setSelectedNode] = useState('leader')
  const [leverageValue, setLeverageValue] = useState(1) // 1 to 5 leverage multiplier
  const [activeRipple, setActiveRipple] = useState(false)

  function triggerRipple() {
    setActiveRipple(true)
    setTimeout(() => {
      setActiveRipple(false)
    }, 1200)
  }

  function handleSetRoleStatus(partId, status) {
    setRoleStatus(prev => ({ ...prev, [partId]: status }))
  }

  function resetAll() {
    setRoleStatus({ head: 'present', heart: 'present', hands: 'me', feet: 'absent', mouth: 'present', shoulders: 'absent' })
    setSelectedPart('head')
    setSelectedNode('leader')
    setLeverageValue(1)
    setActiveRipple(false)
  }

  // ─── MODE A: BODY OF CHRIST PARTS ────────────────
  if (isBody) {
    const activeRole = BODY_ROLES.find(r => r.id === selectedPart)
    
    // Count roles
    const counts = { present: 0, absent: 0, me: 0 }
    Object.values(roleStatus).forEach(s => counts[s]++)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Body of Christ Team Map. Click on parts of the body figure (Head, Heart, Hands, Feet, Mouth, Shoulders) to identify who fills each role in your team.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '28px', alignItems: 'center' }}>
          
          {/* SVG Body Diagram */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 260" width="100%" style={{ maxWidth: '240px', overflow: 'visible' }}>
              {/* Human outline sketch */}
              <path
                d="M100,30 C112,30 120,40 120,52 C120,64 112,74 100,74 C88,74 80,64 80,52 C80,40 88,30 100,30 Z M70,80 L130,80 L140,140 L125,140 L120,95 L115,95 L115,240 L102,240 L100,160 L98,160 L85,240 L85,95 L80,95 L75,140 L60,140 Z"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth={1.5}
              />
              
              {/* Head / Brain node */}
              <circle cx={100} cy={52} r={16}
                fill={selectedPart === 'head' ? 'var(--navy)' : 'rgba(0, 85, 140, 0.15)'}
                stroke="var(--navy)" strokeWidth={selectedPart === 'head' ? 2.5 : 1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('head')}
              />

              {/* Mouth node */}
              <circle cx={100} cy={66} r={6}
                fill={selectedPart === 'mouth' ? '#7c3aed' : 'rgba(124, 58, 237, 0.2)'}
                stroke="#7c3aed" strokeWidth={selectedPart === 'mouth' ? 2 : 0.8}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('mouth')}
              />

              {/* Heart node */}
              <circle cx={100} cy={96} r={10}
                fill={selectedPart === 'heart' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)'}
                stroke="#ef4444" strokeWidth={selectedPart === 'heart' ? 2 : 1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('heart')}
              />

              {/* Shoulders node */}
              <path d="M78,82 L122,82 L122,88 L78,88 Z"
                fill={selectedPart === 'shoulders' ? '#d97706' : 'rgba(217, 119, 6, 0.15)'}
                stroke="#d97706" strokeWidth={selectedPart === 'shoulders' ? 1.5 : 0.8}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('shoulders')}
              />

              {/* Hands node */}
              <circle cx={60} cy={140} r={9}
                fill={selectedPart === 'hands' ? '#319b41' : 'rgba(49, 155, 65, 0.15)'}
                stroke="#319b41" strokeWidth={selectedPart === 'hands' ? 2 : 1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('hands')}
              />
              <circle cx={140} cy={140} r={9}
                fill={selectedPart === 'hands' ? '#319b41' : 'rgba(49, 155, 65, 0.15)'}
                stroke="#319b41" strokeWidth={selectedPart === 'hands' ? 2 : 1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('hands')}
              />

              {/* Feet node */}
              <circle cx={92} cy={240} r={9}
                fill={selectedPart === 'feet' ? '#2563eb' : 'rgba(37, 99, 235, 0.15)'}
                stroke="#2563eb" strokeWidth={selectedPart === 'feet' ? 2 : 1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('feet')}
              />
              <circle cx={108} cy={240} r={9}
                fill={selectedPart === 'feet' ? '#2563eb' : 'rgba(37, 99, 235, 0.15)'}
                stroke="#2563eb" strokeWidth={selectedPart === 'feet' ? 2 : 1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setSelectedPart('feet')}
              />
            </svg>
          </div>

          {/* Details / Role Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="hr-node-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', fontFamily: "'Fraunces', serif" }}>
                  {activeRole.label}
                </span>
                <span style={{ fontSize: '10px', background: 'var(--navy-light)', color: 'var(--navy)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {activeRole.part}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span>DISC Alignment: <strong>{activeRole.disc}</strong></span>
                <span>Scripture: <strong>{activeRole.scripture}</strong></span>
              </div>

              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5', margin: 0, marginBottom: '14px' }}>
                {activeRole.gap}
              </p>

              {/* Status toggles */}
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Role Presence on Team:
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['present', 'absent', 'me'].map(status => {
                  const labels = { present: 'Present', absent: 'Absent', me: 'Occupied by me' }
                  const active = roleStatus[selectedPart] === status
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleSetRoleStatus(selectedPart, status)}
                      style={{
                        flex: 1, padding: '5px 0', borderRadius: '6px',
                        border: '1.5px solid',
                        borderColor: active ? 'var(--navy)' : '#cbd5e1',
                        background: active ? 'var(--navy-light)' : '#fff',
                        color: active ? 'var(--navy)' : 'var(--text-muted)',
                        fontSize: '11px', fontWeight: '700', cursor: 'pointer'
                      }}
                    >
                      {labels[status]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Gap Analysis Box */}
            <div style={{ padding: '12px 14px', background: 'rgba(217, 119, 6, 0.04)', border: '1px solid rgba(217, 119, 6, 0.12)', borderRadius: '12px', fontSize: '12px', lineHeight: '1.5' }}>
              📊 <strong>Team Summary:</strong> {counts.present} roles present, {counts.me} filled by you. <strong>{counts.absent} critical roles are absent</strong>. Look at the absent roles to target your next volunteer recruits.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="widget-reset-btn" onClick={resetAll}>↺ Reset Team Map</button>
        </div>
      </div>
    )
  }

  // ─── MODE B: LEVERAGE FINDER DIAGRAM ──────────────
  const activeNode = LEVERAGE_NODES.find(n => n.id === selectedNode)
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Ministry Systems Leverage Map. Click nodes in the systems diagram to see their relationships. Drag the leverage lever to visualize the network ripple effect.
      </p>

      <div className="cr2-layout" style={{ alignItems: 'center' }}>
        
        {/* SVG Network Diagram */}
        <div className="cr2-svg-wrap">
          <svg viewBox="0 0 280 280" width={260} height={260} className="cr2-svg">
            
            {/* Connection lines */}
            {LEVERAGE_NODES.map(node => {
              return node.influences.map(targetId => {
                const target = LEVERAGE_NODES.find(n => n.id === targetId)
                const isSelectedConnection = selectedNode === node.id
                
                return (
                  <g key={`${node.id}-${targetId}`}>
                    <line
                      x1={node.x} y1={node.y}
                      x2={target.x} y2={target.y}
                      stroke={isSelectedConnection ? 'var(--navy)' : 'rgba(228,223,217,0.7)'}
                      strokeWidth={isSelectedConnection ? 2.5 : 1}
                      style={{ transition: 'stroke 0.25s' }}
                    />
                    {/* Animated Ripple Waves */}
                    {activeRipple && isSelectedConnection && (
                      <circle cx={node.x} cy={node.y} r={0} fill="none" stroke="var(--navy)" strokeWidth={1.5} opacity={0.8}>
                        <animate attributeName="r" from="0" to="100" dur="1.2s" repeatCount="1" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="1.2s" repeatCount="1" />
                      </circle>
                    )}
                  </g>
                )
              })
            })}

            {/* Nodes */}
            {LEVERAGE_NODES.map(node => {
              const active = selectedNode === node.id
              const isInfluenced = LEVERAGE_NODES.find(n => n.id === selectedNode)?.influences.includes(node.id)
              
              return (
                <g key={node.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedNode(node.id)}>
                  <circle
                    cx={node.x} cy={node.y}
                    r={active ? 20 : isInfluenced ? 16 : 14}
                    fill={active ? 'var(--navy)' : isInfluenced ? 'var(--navy-light)' : '#fff'}
                    stroke={active ? 'var(--navy)' : 'rgba(228, 223, 217, 0.8)'}
                    strokeWidth={1.5}
                    style={{ transition: 'all 0.25s' }}
                  />
                  <text
                    x={node.x} y={node.y + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={7.5} fontWeight="700"
                    fill={active ? '#fff' : 'var(--text-primary)'}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Leverage Lever Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="hr-node-panel" style={{ padding: '16px' }}>
            <h5 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', marginBottom: '6px', fontFamily: "'Fraunces', serif" }}>
              Active Node: {activeNode.label}
            </h5>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, marginBottom: '12px' }}>
              Directly influences: <strong>{activeNode.influences.map(i => LEVERAGE_NODES.find(n => n.id === i).label).join(', ')}</strong>.
            </p>

            {/* Leverage Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <span>Leverage Multiplier:</span>
                <span>x{leverageValue}</span>
              </div>
              <input
                type="range" min={1} max={5} value={leverageValue}
                className="widget-slider"
                onChange={e => setLeverageValue(Number(e.target.value))}
              />
              <div className="widget-slider-labels">
                <span>1 — Small</span>
                <span>5 — Disproportionate</span>
              </div>
            </div>

            <button
              type="button"
              className="widget-save-btn"
              style={{ width: '100%', marginTop: '14px', background: 'var(--navy)' }}
              onClick={triggerRipple}
            >
              ⚡ Pull Leverage Lever
            </button>
          </div>
          
          <div style={{ padding: '12px 14px', background: 'rgba(0, 85, 140, 0.04)', border: '1px solid rgba(0, 85, 140, 0.12)', borderRadius: '12px', fontSize: '12px', lineHeight: '1.5' }}>
            💡 <strong>Systems Thinking Insight:</strong> Changing the relationship connection from <strong>{activeNode.label}</strong> with a multiplier of <strong>x{leverageValue}</strong> propagates ripple effects through the entire ministry ecosystem.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="widget-reset-btn" onClick={resetAll}>↺ Reset Leverage Finder</button>
      </div>
    </div>
  )
}
