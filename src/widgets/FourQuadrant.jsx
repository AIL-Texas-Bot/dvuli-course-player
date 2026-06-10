import { useState, useEffect } from 'react'

const BOARD_PRESETS = {
  'stop-start': {
    cells: [
      { label: 'Stop', emoji: '🛑', color: '#dc2626', bg: '#dc2626', prompt: 'Things that no longer serve your CYD vision' },
      { label: 'Start', emoji: '🚀', color: '#16a34a', bg: '#16a34a', prompt: 'New approaches suggested by learning' },
      { label: 'Continue', emoji: '✅', color: '#2563eb', bg: '#2563eb', prompt: 'Things aligned with development' },
      { label: 'Improve', emoji: '⚡', color: '#d97706', bg: '#d97706', prompt: 'Things to keep but adapt' },
    ],
    ideas: [
      { label: 'Traditional lectures', cellIdx: 0, color: '#fecaca' },
      { label: 'Transactional handouts', cellIdx: 0, color: '#fecaca' },
      { label: 'Youth-led panels', cellIdx: 1, color: '#bbf7d0' },
      { label: 'Asset-based mapping', cellIdx: 1, color: '#bbf7d0' },
      { label: 'Covenant mentoring', cellIdx: 2, color: '#bfdbfe' },
      { label: 'Friday youth hub', cellIdx: 2, color: '#bfdbfe' },
      { label: 'Parent participation', cellIdx: 3, color: '#fef08a' },
      { label: 'Peer feedback boards', cellIdx: 3, color: '#fef08a' },
    ]
  },
  'time-matrix': {
    cells: [
      { label: 'Quadrant I', emoji: '🔥', color: '#dc2626', bg: '#dc2626', prompt: 'Urgent & Important (Crises, emergency deadlines)' },
      { label: 'Quadrant II', emoji: '🌱', color: '#16a34a', bg: '#16a34a', prompt: 'Not Urgent & Important (Strategic planning, mentoring, devotions)' },
      { label: 'Quadrant III', emoji: '📢', color: '#d97706', bg: '#d97706', prompt: 'Urgent & Not Important (Last-minute key requests, chatty drop-ins)' },
      { label: 'Quadrant IV', emoji: '🕸', color: '#64748b', bg: '#64748b', prompt: 'Not Urgent & Not Important (Trivial tasks, mindless scrolling)' },
    ],
    ideas: [
      { label: 'Attending an unplanned community emergency', cellIdx: 0, color: '#fecaca' },
      { label: 'Crisis counseling session with a family', cellIdx: 0, color: '#fecaca' },
      { label: 'Preparing a curriculum starting in two hours', cellIdx: 0, color: '#fecaca' },
      { label: 'Resolving building security issue during youth night', cellIdx: 0, color: '#fecaca' },
      
      { label: 'Annual strategic planning retreat', cellIdx: 1, color: '#bbf7d0' },
      { label: 'Daily prayer and Scripture reading', cellIdx: 1, color: '#bbf7d0' },
      { label: 'Preparing next week\'s curriculum proactively', cellIdx: 1, color: '#bbf7d0' },
      { label: 'Proactive mentoring session with a young leader', cellIdx: 1, color: '#bbf7d0' },
      
      { label: 'Responding to volunteer\'s last-minute key text', cellIdx: 2, color: '#fef08a' },
      { label: 'Attending routine meeting without agenda', cellIdx: 2, color: '#fef08a' },
      { label: 'Returning general chat call from longtime donor', cellIdx: 2, color: '#fef08a' },
      { label: 'Interrupting focus work to answer minor emails', cellIdx: 2, color: '#fef08a' },
      
      { label: 'Mindless social media scrolling between tasks', cellIdx: 3, color: '#cbd5e1' },
      { label: 'Sorting old paper files already digitized', cellIdx: 3, color: '#cbd5e1' },
      { label: 'Webinar on topic unrelated to ministry goals', cellIdx: 3, color: '#cbd5e1' },
      { label: 'Redesigning a slide layout for the fourth time', cellIdx: 3, color: '#cbd5e1' },
    ]
  },
  'consequential-faith': {
    cells: [
      { label: 'Creed', emoji: '📖', color: '#7c3aed', bg: '#7c3aed', prompt: 'Robust theological beliefs — what do programs teach?' },
      { label: 'Community', emoji: '🤝', color: '#2563eb', bg: '#2563eb', prompt: 'Warm belonging — how do youth experience deep friendship?' },
      { label: 'Call', emoji: '🎯', color: '#059669', bg: '#059669', prompt: 'A sense of vocation — how does ministry shape purpose?' },
      { label: 'Hope', emoji: '✨', color: '#d97706', bg: '#d97706', prompt: 'Expectant missional hope — what future are you forming youth toward?' },
    ],
    ideas: [
      { label: 'Teach core biblical truth', cellIdx: 0, color: '#ddd6fe' },
      { label: 'Small group sharing', cellIdx: 1, color: '#bfdbfe' },
      { label: 'Vocation interviews', cellIdx: 2, color: '#bbf7d0' },
      { label: 'Expectant prayer walks', cellIdx: 3, color: '#fef08a' },
    ]
  },
  'big-grid': {
    cells: [
      { label: 'Monument', emoji: '🏛', color: '#0891b2', bg: '#0891b2', prompt: 'Stable, resource-rich, but declining adaptability.' },
      { label: 'Lifeboat', emoji: '🚤', color: '#dc2626', bg: '#dc2626', prompt: 'Reactive, survival-focused, limited vision.' },
      { label: 'Pioneer', emoji: '🧭', color: '#7c3aed', bg: '#7c3aed', prompt: 'Innovative and agile, but lacking sustainable resources.' },
      { label: 'Movement', emoji: '🌊', color: '#16a34a', bg: '#16a34a', prompt: 'Resourced AND adaptive — the aspirational scenario.' },
    ],
    ideas: [
      { label: 'Endowment reliance only', cellIdx: 0, color: '#cffafe' },
      { label: 'Scrambling for grants', cellIdx: 1, color: '#fecaca' },
      { label: 'High-risk youth startup', cellIdx: 2, color: '#ddd6fe' },
      { label: 'Sustainable ecosystems', cellIdx: 3, color: '#bbf7d0' },
    ]
  },
  'aar': {
    cells: [
      { label: 'Intent', emoji: '🎯', color: '#2563eb', bg: '#2563eb', prompt: 'What did we set out to do?' },
      { label: 'Actual Results', emoji: '📊', color: '#059669', bg: '#059669', prompt: 'What really happened?' },
      { label: 'What Worked', emoji: '✅', color: '#16a34a', bg: '#16a34a', prompt: 'What contributed to positive outcomes?' },
      { label: 'What Didn\'t', emoji: '⚠️', color: '#dc2626', bg: '#dc2626', prompt: 'What contributed to negative outcomes?' },
      { label: 'Surprises', emoji: '⚡', color: '#d97706', bg: '#d97706', prompt: 'What unexpected things happened?' },
      { label: 'Next Time', emoji: '🔄', color: '#7c3aed', bg: '#7c3aed', prompt: 'What will we do differently?' },
    ],
    ideas: [
      { label: 'Increase members by 20%', cellIdx: 0, color: '#bfdbfe' },
      { label: 'Grew by 15%, but staff tired', cellIdx: 1, color: '#bbf7d0' },
      { label: 'Active text campaigns', cellIdx: 2, color: '#bbf7d0' },
      { label: 'Unclear schedules', cellIdx: 3, color: '#fecaca' },
      { label: 'High parent attendance', cellIdx: 4, color: '#fef08a' },
      { label: 'Set clear deadlines', cellIdx: 5, color: '#ddd6fe' },
    ]
  },
  'six-hats': {
    cells: [
      { label: 'White Hat', emoji: '🤍', color: '#64748b', bg: '#64748b', prompt: 'What do we know? What information do we have?' },
      { label: 'Red Hat', emoji: '❤️', color: '#dc2626', bg: '#dc2626', prompt: 'What is your gut reaction? What emotions?' },
      { label: 'Black Hat', emoji: '🖤', color: '#1e293b', bg: '#1e293b', prompt: 'What are the risks? What could go wrong?' },
      { label: 'Yellow Hat', emoji: '💛', color: '#d97706', bg: '#d97706', prompt: 'What are the benefits? Why might this work?' },
      { label: 'Green Hat', emoji: '💚', color: '#16a34a', bg: '#16a34a', prompt: 'What new ideas, alternatives, or solutions?' },
      { label: 'Blue Hat', emoji: '💙', color: '#2563eb', bg: '#2563eb', prompt: 'What is our process? What should we do next?' },
    ],
    ideas: [
      { label: 'Costs $5k, 40 kids attend', cellIdx: 0, color: '#cbd5e1' },
      { label: 'Anxious but optimistic', cellIdx: 1, color: '#fecaca' },
      { label: 'Staff burnout by month 3', cellIdx: 2, color: '#cbd5e1' },
      { label: 'Great neighborhood ties', cellIdx: 3, color: '#fef08a' },
      { label: 'Cafe partnership trial', cellIdx: 4, color: '#bbf7d0' },
      { label: 'Set 2-hour weekly agenda', cellIdx: 5, color: '#bfdbfe' },
    ]
  },
}

function detectPreset(desc, blockId) {
  const d = (desc || '').toLowerCase()
  const bid = (blockId || '').toLowerCase()
  
  if (bid === 'ch6-widget-0' || d.includes('time management') || d.includes('quadrant sorter') || d.includes('time matrix') || d.includes('covey')) return 'time-matrix'
  if (bid === 'ch11-widget-2' || (d.includes('stop') && d.includes('start') && d.includes('continue'))) return 'stop-start'
  if (bid === 'ch9-widget-2' || d.includes('creed') || d.includes('consequential faith')) return 'consequential-faith'
  if (bid === 'ch12-widget-2' || d.includes('monument') || d.includes('lifeboat') || d.includes('pioneer')) return 'big-grid'
  if (bid === 'ch13-widget-1' || d.includes('after-action') || d.includes('aar')) return 'aar'
  if (bid === 'ch13-widget-2' || d.includes('six thinking hats') || d.includes('thinking hat')) return 'six-hats'
  
  return 'stop-start'
}

export default function FourQuadrant({ config, blockId }) {
  const presetType = detectPreset(config.description || '', blockId)
  const board = BOARD_PRESETS[presetType]
  const cells = board.cells

  const [notes, setNotes] = useState([])
  const [inputs, setInputs] = useState(() => cells.map(() => ''))
  const [draggedNote, setDraggedNote] = useState(null)
  const [dragOverCell, setDragOverCell] = useState(null)
  const [showSuggested, setShowSuggested] = useState(false)

  // Initialize presets
  useEffect(() => {
    const initial = board.ideas.map((idea, i) => ({
      id: `preset-${i}`,
      label: idea.label,
      cellIdx: idea.cellIdx,
      color: idea.color,
      rotation: Math.random() * 4 - 2
    }))
    setNotes(initial)
  }, [presetType])

  const cols = cells.length === 6 ? 3 : 2

  function addCustomNote(ci) {
    if (!inputs[ci].trim()) return
    const newNote = {
      id: `custom-${Date.now()}`,
      label: inputs[ci].trim(),
      cellIdx: ci,
      color: '#fef08a',
      rotation: Math.random() * 4 - 2
    }
    setNotes(n => [...n, newNote])
    setInputs(inp => {
      const copy = [...inp]
      copy[ci] = ''
      return copy
    })
  }

  function handlePresetClick(idea) {
    const newNote = {
      id: `preset-click-${Date.now()}`,
      label: idea.label,
      cellIdx: idea.cellIdx,
      color: idea.color,
      rotation: Math.random() * 4 - 2
    }
    setNotes(n => [...n, newNote])
  }

  function removeNote(id) {
    setNotes(n => n.filter(note => note.id !== id))
  }

  function handleNoteDragStart(note) {
    setDraggedNote(note)
  }

  function handleCellDragOver(e, cellIdx) {
    e.preventDefault()
    setDragOverCell(cellIdx)
  }

  function handleCellDrop(e, cellIdx) {
    e.preventDefault()
    setDragOverCell(null)
    if (!draggedNote) return

    setNotes(n => n.map(note => 
      note.id === draggedNote.id 
        ? { ...note, cellIdx } 
        : note
    ))
    setDraggedNote(null)
  }

  function reset() {
    setNotes([])
    setInputs(cells.map(() => ''))
    setDraggedNote(null)
    setDragOverCell(null)
    setShowSuggested(false)
  }

  const unplacedPresets = board.ideas.filter(idea => !notes.some(n => n.label === idea.label))

  // Find correct placements count
  const totalPresetNotes = board.ideas.length
  const placedPresetNotesCount = notes.filter(n => board.ideas.some(idea => idea.label === n.label)).length
  const correctPlacementsCount = notes.filter(n => {
    const matchedIdea = board.ideas.find(idea => idea.label === n.label)
    return matchedIdea && matchedIdea.cellIdx === n.cellIdx
  }).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Interactive planning board. Drag sticky notes between cells to organize them, or write your own custom notes.
      </p>

      {/* Grid cells */}
      <div className="fq-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((cell, ci) => {
          const cellNotes = notes.filter(n => n.cellIdx === ci)
          const isDraggingOver = dragOverCell === ci
          
          return (
            <div
              key={ci}
              className={`fq-cell ${isDraggingOver ? 'dragover' : ''}`}
              onDragOver={e => handleCellDragOver(e, ci)}
              onDragLeave={() => setDragOverCell(null)}
              onDrop={e => handleCellDrop(e, ci)}
            >
              <div className="fq-cell-header" style={{ background: cell.bg }}>
                <span>{cell.emoji}</span>
                <span>{cell.label}</span>
                {cellNotes.length > 0 && (
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '1px 6px', borderRadius: '4px', marginLeft: 'auto', fontWeight: 'bold' }}>
                    {cellNotes.length}
                  </span>
                )}
              </div>
              <div className="fq-cell-body">
                {cell.prompt && (
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4, marginBottom: 10, fontStyle: 'italic' }}>
                    {cell.prompt}
                  </p>
                )}
                
                {/* Placed sticky notes */}
                <div className="fq-cell-items">
                  {cellNotes.map((note) => {
                    const presetIdea = board.ideas.find(idea => idea.label === note.label)
                    const isCorrect = presetIdea && presetIdea.cellIdx === note.cellIdx
                    
                    let noteCls = 'fq-note'
                    if (showSuggested && presetIdea) {
                      noteCls += isCorrect ? ' note-correct' : ' note-incorrect'
                    }

                    return (
                      <div
                        key={note.id}
                        className={noteCls}
                        draggable
                        onDragStart={() => handleNoteDragStart(note)}
                        style={{
                          background: note.color,
                          transform: `rotate(${note.rotation}deg)`,
                          border: showSuggested && presetIdea ? (isCorrect ? '2px solid var(--correct)' : '2px solid var(--incorrect)') : 'none'
                        }}
                      >
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                          {note.label}
                          {showSuggested && presetIdea && (
                            <span style={{ fontSize: 10, fontWeight: 700, marginTop: 4, color: isCorrect ? '#065f46' : '#991b1b' }}>
                              {isCorrect ? '✓ Match' : `✗ Should be: ${cells[presetIdea.cellIdx].label}`}
                            </span>
                          )}
                        </span>
                        <button className="fq-note-remove" onClick={() => removeNote(note.id)}>×</button>
                      </div>
                    )
                  })}
                </div>

                {/* Input row */}
                <div className="fq-add-row">
                  <input
                    className="fq-add-input"
                    placeholder="Type sticky note…"
                    value={inputs[ci]}
                    onChange={e => setInputs(inp => {
                      const copy = [...inp]
                      copy[ci] = e.target.value
                      return copy
                    })}
                    onKeyDown={e => e.key === 'Enter' && addCustomNote(ci)}
                  />
                  <button className="fq-add-btn" style={{ background: cell.bg }} onClick={() => addCustomNote(ci)}>+</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preset Note Drawer */}
      <div className="bs-tray" style={{ marginTop: '0' }}>
        <div className="bs-tray-title">📌 Sticky Note Presets (Drag to a cell or click to place)</div>
        <div className="bs-tray-items">
          {unplacedPresets.map((idea, i) => (
            <div
              key={i}
              className="bs-tray-chip"
              draggable
              onDragStart={() => handleNoteDragStart({ id: `preset-drag-${i}`, label: idea.label, cellIdx: idea.cellIdx, color: idea.color, rotation: Math.random() * 4 - 2 })}
              onClick={() => handlePresetClick(idea)}
              style={{ cursor: 'grab', background: idea.color, color: '#334155', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              ✥ {idea.label}
            </div>
          ))}
          {unplacedPresets.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>All presets mapped. Add custom sticky notes directly inside cells.</div>
          )}
        </div>
      </div>

      {/* Suggested placements dashboard */}
      {showSuggested && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>📊 Suggested Placement Review</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
            Out of {placedPresetNotesCount} preset activities placed, <strong>{correctPlacementsCount}</strong> match Covey's Time Management Matrix framework.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '8px 12px', background: 'rgba(25, 200, 100, 0.05)', borderRadius: '6px', borderLeft: '3px solid var(--correct)' }}>
              <strong style={{ fontSize: 12, color: 'var(--correct)' }}>Quadrant II (Not Urgent but Important)</strong>
              <div style={{ fontSize: 14, margin: '4px 0' }}>
                Your Placed: {notes.filter(n => n.cellIdx === 1).length} items
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Focusing here ensures proactive planning, devotions, and mentoring. This represents Jesus and Nehemiah's leadership priority.
              </span>
            </div>
            <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '6px', borderLeft: '3px solid var(--incorrect)' }}>
              <strong style={{ fontSize: 12, color: 'var(--incorrect)' }}>Quadrant III & IV (Non-Important)</strong>
              <div style={{ fontSize: 14, margin: '4px 0' }}>
                Your Placed: {notes.filter(n => n.cellIdx === 2 || n.cellIdx === 3).length} items
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Tasks here represent distractions and time-wasters that can consume a leader's schedule if not delegated or deleted.
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="widget-reset-btn"
          style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
          onClick={() => setShowSuggested(s => !s)}
        >
          {showSuggested ? 'Hide Suggestions' : 'Compare with Covey\'s Model'}
        </button>
        <button className="widget-reset-btn" onClick={reset}>↺ Reset Board</button>
      </div>
    </div>
  )
}
