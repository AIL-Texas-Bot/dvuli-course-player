import { useState } from 'react'

export default function ReflectiveJournal({ blockId, config }) {
  const [stage, setStage] = useState('write-right') // write-right, locked, write-left, complete
  
  const [rightText, setRightText] = useState('')
  const [leftText, setLeftText] = useState('')
  
  const [journalEntries, setJournalEntries] = useState([
    {
      date: 'May 28, 2026',
      right: 'My Biblical DISC profile indicated I am a highly dominant and results-focused leader (D style). I found this accurate, but it also highlighted why I sometimes clash with my steadier staff members.',
      left: 'Reflective loop analysis: I notice a pattern of rushing team meetings when I get anxious about budgets. I need to slow down, ask for input, and validate others\' concerns.'
    }
  ])

  function handleSaveRight() {
    if (rightText.trim().length < 5) return
    setStage('locked')
  }

  function simulateCooloff() {
    setStage('write-left')
  }

  function handleSaveLeft() {
    if (leftText.trim().length < 5) return
    
    // Add completed loop to timeline
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setJournalEntries(prev => [
      {
        date: today,
        right: rightText.trim(),
        left: leftText.trim()
      },
      ...prev
    ])
    
    // Reset form
    setRightText('')
    setLeftText('')
    setStage('write-right')
  }

  function resetJournal() {
    setRightText('')
    setLeftText('')
    setStage('write-right')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Reflective Loop Journaling. Enter your immediate reaction to your assessment data, simulate the 24-hour cool-off, and write your deeper loop insights.
      </p>

      {/* Side-by-Side Journal Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Right Column: Immediate Response */}
        <div style={{
          background: '#fff',
          border: '1.5px solid rgba(228, 223, 217, 0.8)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)' }}>📝 Response to Events (Right Column)</span>
            <span style={{ fontSize: '9px', background: 'var(--navy-light)', color: 'var(--navy)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Immediate</span>
          </div>
          
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            Record your raw thoughts, feelings, and immediate reactions to your DISC and LSA assessment results.
          </p>

          <textarea
            className="widget-textarea"
            placeholder="Write your immediate reactions..."
            value={rightText}
            disabled={stage !== 'write-right'}
            onChange={e => setRightText(e.target.value)}
            style={{ minHeight: '130px' }}
          />

          {stage === 'write-right' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="widget-save-btn"
                disabled={rightText.trim().length < 5}
                onClick={handleSaveRight}
              >
                Save & Lock Loop →
              </button>
            </div>
          )}

          {stage !== 'write-right' && (
            <div style={{ fontSize: '12.5px', color: 'var(--green)', fontWeight: 'bold' }}>
              ✓ Immediate reflection locked.
            </div>
          )}
        </div>

        {/* Left Column: Deeper Loop Insights */}
        <div style={{
          background: stage === 'write-right' ? 'rgba(246, 244, 241, 0.4)' : '#fff',
          border: '1.5px solid',
          borderColor: stage === 'write-right' ? 'rgba(228, 223, 217, 0.5)' : 'rgba(228, 223, 217, 0.8)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: stage === 'write-right' ? '#cbd5e1' : 'var(--navy)' }}>
              🧭 Reflective Loop (Left Column)
            </span>
            <span style={{
              fontSize: '9px',
              background: stage === 'write-left' ? 'var(--navy-light)' : 'rgba(228, 223, 217, 0.4)',
              color: stage === 'write-left' ? 'var(--navy)' : '#cbd5e1',
              padding: '2px 8px', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase'
            }}>
              24h Delay
            </span>
          </div>

          <p style={{ fontSize: '12.5px', color: stage === 'write-right' ? '#cbd5e1' : 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            Analyze deeper patterns. <em>What structural habits or mental models explain your initial response?</em>
          </p>

          {/* Locked Overlay */}
          {stage === 'write-right' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</span>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 'bold' }}>Locked until Right Column is saved</span>
            </div>
          )}

          {stage === 'locked' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '150px', gap: '12px' }}>
              <span style={{ fontSize: '24px', animation: 'floatBubble 3s infinite ease-in-out' }}>⏳</span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: 'var(--amber)', fontWeight: 'bold' }}>24-Hour Cooldown Cool-off Active</div>
                <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>DVULI discipline requires resting before deeper evaluation.</div>
              </div>
              <button
                type="button"
                className="widget-save-btn"
                style={{ background: 'var(--amber)', boxShadow: 'none' }}
                onClick={simulateCooloff}
              >
                ⏩ Simulate 24 Hours Later
              </button>
            </div>
          )}

          {stage === 'write-left' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <textarea
                className="widget-textarea"
                placeholder="Spiraling loop questions: What deeper pattern is visible? How has your thinking shifted? What action will you take?"
                value={leftText}
                onChange={e => setLeftText(e.target.value)}
                style={{ minHeight: '130px' }}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="widget-reset-btn" onClick={resetJournal}>Cancel</button>
                <button
                  type="button"
                  className="widget-save-btn"
                  disabled={leftText.trim().length < 5}
                  onClick={handleSaveLeft}
                >
                  Save Full Loop ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Timeline */}
      {journalEntries.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.05em' }}>
            📅 Journal Archive / Learning History
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {journalEntries.map((entry, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid rgba(228,223,217,0.7)', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.015)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(228,223,217,0.3)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--navy)' }}>📖 {entry.date}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div style={{ fontSize: '12.5px', color: '#475569', borderRight: '1.5px solid rgba(228,223,217,0.4)', paddingRight: '14px', lineHeight: 1.6 }}>
                    <strong>Immediate:</strong> {entry.right}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--navy-dark)', fontStyle: 'italic', lineHeight: 1.6 }}>
                    <strong>Deeper Loop:</strong> {entry.left}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
