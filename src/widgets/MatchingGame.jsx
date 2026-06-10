import { useState, useEffect } from 'react'

const GAME_PRESETS = {
  character: {
    title: 'Biblical Character DISC Match',
    subtitle: 'Match the Biblical figures to their primary DISC behavioral profiles.',
    targets: [
      { id: 'D', label: 'Dominance (D)', desc: 'Paul, Deborah, Martha (driving, task-driven, decisive)' },
      { id: 'I', label: 'Influence (I)', desc: 'Peter, David, Lydia (expressive, persuasive, relational)' },
      { id: 'S', label: 'Steadiness (S)', desc: 'Barnabas, Mary, Timothy (encouraging, loyal, supportive)' },
      { id: 'C', label: 'Conscientiousness (C)', desc: 'Moses, Nehemiah, Thomas (analytical, orderly, precise)' }
    ],
    items: [
      { id: 'Paul', label: 'Paul', targetId: 'D', clue: 'Highly focused on mission expansion, confronted Peter, bold and direct.' },
      { id: 'Peter', label: 'Peter', targetId: 'I', clue: 'Spoke immediately at transfiguration, enthusiastic, eager relationship builder.' },
      { id: 'Barnabas', label: 'Barnabas', targetId: 'S', clue: 'Known as the "Son of Encouragement," stood by John Mark patiently.' },
      { id: 'Moses', label: 'Moses', targetId: 'C', clue: 'Detail-oriented regarding law plans, cautious communicator, slow to speak.' },
      { id: 'Deborah', label: 'Deborah', targetId: 'D', clue: 'Decisive military-judge leader, went to battle directly when needed.' },
      { id: 'David', label: 'David', targetId: 'I', clue: 'Wrote expressive psalms, inspired cohorts, led through personal charisma.' },
      { id: 'Mary', label: 'Mary', targetId: 'S', clue: 'Quietly sat at Jesus\' feet, devoted, stable supporter of the disciples.' },
      { id: 'Nehemiah', label: 'Nehemiah', targetId: 'C', clue: 'Organized the wall rebuild systematically, kept precise records.' },
      { id: 'Martha', label: 'Martha', targetId: 'D', clue: 'Active, direct, and task-driven; confronted Jesus directly about her sister\'s lack of work.' },
      { id: 'Lydia', label: 'Lydia', targetId: 'I', clue: 'Persuasive and relational entrepreneur, quickly gathered community and hosted the early church.' },
      { id: 'Timothy', label: 'Timothy', targetId: 'S', clue: 'Loyal and supportive helper to Paul, served steadily, sensitive and faithful behind the scenes.' },
      { id: 'Thomas', label: 'Thomas', targetId: 'C', clue: 'Questioning and analytical; required empirical proof and detail before committing to belief.' }
    ]
  },
  lsa: {
    title: 'Leadership Strategy Matching Challenge',
    subtitle: 'Match the ministry development scenario to the correct LSA strategy.',
    targets: [
      { id: 'Instructing', label: 'Instructing (High Dir / Low Supp)', desc: 'Best for: Low competence / High commitment (Novice)' },
      { id: 'Developing', label: 'Developing (High Dir / High Supp)', desc: 'Best for: Low/Some competence / Low commitment (Apprentice)' },
      { id: 'Mentoring', label: 'Mentoring (Low Dir / High Supp)', desc: 'Best for: High competence / Variable commitment (Journeyman)' },
      { id: 'Commissioning', label: 'Commissioning (Low Dir / Low Supp)', desc: 'Best for: High competence / High commitment (Master)' }
    ],
    items: [
      { id: 'lsa-1', label: 'James is eager but has never led a Bible study', targetId: 'Instructing', clue: 'High excitement (commitment), but zero experience (competence).' },
      { id: 'lsa-2', label: 'Maria has run youth group for 10 years but is unmotivated', targetId: 'Mentoring', clue: 'Highly experienced, but currently experiencing low energy/drive.' },
      { id: 'lsa-3', label: 'Marcus is growing, wants to lead, but gets anxious preparing', targetId: 'Developing', clue: 'Eager to grow, but has high anxiety and lacks independent skill.' },
      { id: 'lsa-4', label: 'Sarah is a seasoned leader, competent and highly motivated', targetId: 'Commissioning', clue: 'Fully capable and has high motivation. Needs autonomy.' },
      { id: 'lsa-5', label: 'Ken is struggling to teach but is committed to group rules', targetId: 'Instructing', clue: 'High dedication to rules/commitment, but low skill in actual teaching.' },
      { id: 'lsa-6', label: 'Lisa has lost confidence after a conflict with a parent', targetId: 'Mentoring', clue: 'Competent leader, but needs emotional support and reassurance.' },
      { id: 'lsa-7', label: 'Robert is capable but anxious about his new teaching role', targetId: 'Developing', clue: 'Has some ability but needs direction on prep and support for anxiety.' },
      { id: 'lsa-8', label: 'Elena has successfully run the retreat for 3 years independently', targetId: 'Commissioning', clue: 'Master of this task. Let her lead without micro-management.' }
    ]
  },
  biblical: {
    title: 'Core Values Biblical Foundations',
    subtitle: 'Match each of the five DVULI Core Values to its scriptural basis.',
    targets: [
      { id: 'Accountability', label: 'Accountability', desc: 'Galatians 2:11 — Mutual truth-telling to prevent self-deception.' },
      { id: 'Balance', label: 'Balance', desc: 'Exodus 18 — Jethro advising Moses on delegation to prevent burnout.' },
      { id: 'Interdependence', label: 'Interdependence', desc: '1 Corinthians 12 — Body of Christ parts cooperating.' },
      { id: 'Empowerment', label: 'Empowerment', desc: '2 Timothy 2:2 — Entrusting leadership to reliable, teaching mentors.' },
      { id: 'Leverage', label: 'Leverage', desc: 'Matthew 13:31 — The Mustard Seed representing small changes with huge results.' }
    ],
    items: [
      { id: 'bible-1', label: 'Paul confronting Peter face-to-face over hypocrisy in Antioch', targetId: 'Accountability', clue: 'Facing truth, relational checks.' },
      { id: 'bible-2', label: 'Jethro telling Moses: "The work is too heavy... you will wear out"', targetId: 'Balance', clue: 'Preserving energy, delegation.' },
      { id: 'bible-3', label: '"The eye cannot say to the hand, I have no need of you"', targetId: 'Interdependence', clue: 'Mutual reliance, body parts metaphor.' },
      { id: 'bible-4', label: 'Entrusting teachings to faithful people who can teach others', targetId: 'Empowerment', clue: 'Developing capacity in others.' },
      { id: 'bible-5', label: 'The tiny mustard seed growing into a tree where birds nest', targetId: 'Leverage', clue: 'Disproportionate small-input Kingdom impact.' }
    ]
  }
}

function detectGamePreset(blockId, desc) {
  const d = (desc || '').toLowerCase()
  const bid = (blockId || '').toLowerCase()
  if (bid.includes('ch2') || d.includes('biblical character') || d.includes('character disc')) return 'character'
  if (bid.includes('ch3') || d.includes('matching challenge') || d.includes('lsa')) return 'lsa'
  return 'biblical' // default ch5 matching game
}

export default function MatchingGame({ blockId, config }) {
  const presetKey = detectGamePreset(blockId, config.description || '')
  const preset = GAME_PRESETS[presetKey]

  const [deck, setDeck] = useState([])
  const [matches, setMatches] = useState({}) // item.id -> target.id
  const [selectedItem, setSelectedItem] = useState(null)
  const [shakeItemId, setShakeItemId] = useState(null)

  useEffect(() => {
    // Shuffle items
    const shuffled = [...preset.items].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setMatches({})
    setSelectedItem(null)
  }, [presetKey])

  function handleSelectItem(item) {
    if (matches[item.id]) return // already matched
    setSelectedItem(selectedItem?.id === item.id ? null : item)
  }

  function handleSelectTarget(targetId) {
    if (!selectedItem) return

    if (selectedItem.targetId === targetId) {
      // Correct Match!
      setMatches(prev => ({ ...prev, [selectedItem.id]: targetId }))
      setSelectedItem(null)
    } else {
      // Incorrect Match - Trigger shake animation
      setShakeItemId(selectedItem.id)
      setTimeout(() => {
        setShakeItemId(null)
      }, 500)
    }
  }

  // Drag and drop support
  function handleDragStart(e, item) {
    e.dataTransfer.setData('text/plain', item.id)
    setSelectedItem(item)
  }

  function handleDrop(e, targetId) {
    e.preventDefault()
    const itemId = e.dataTransfer.getData('text/plain')
    const item = deck.find(x => x.id === itemId)
    
    if (item && item.targetId === targetId) {
      setMatches(prev => ({ ...prev, [item.id]: targetId }))
    } else if (item) {
      setShakeItemId(item.id)
      setTimeout(() => setShakeItemId(null), 500)
    }
    setSelectedItem(null)
  }

  function resetGame() {
    const shuffled = [...preset.items].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setMatches({})
    setSelectedItem(null)
  }

  const completedCount = Object.keys(matches).length
  const isComplete = completedCount === preset.items.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', fontFamily: "'Fraunces', serif" }}>
          {preset.title}
        </h4>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>
          {completedCount} / {preset.items.length} MATCHED
        </span>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, marginTop: '-8px' }}>
        {preset.subtitle} Click a card on the left, then click its matching bucket on the right.
      </p>

      {/* Selected clue panel */}
      {selectedItem && (
        <div style={{ padding: '12px 14px', background: 'rgba(59,130,246,0.05)', border: '1.5px solid var(--accent)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-main)', animation: 'fadeIn 0.2s' }}>
          💡 <strong>Clue for {selectedItem.label}:</strong> {selectedItem.clue}
        </div>
      )}

      {/* Game Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Cards Deck (2-column layout for 12 cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', alignContent: 'start' }}>
          {deck.map(item => {
            const isMatched = !!matches[item.id]
            const isSelected = selectedItem?.id === item.id
            const isShaking = shakeItemId === item.id
            
            return (
              <div
                key={item.id}
                draggable={!isMatched}
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => handleSelectItem(item)}
                style={{
                  padding: '12px 14px',
                  background: isMatched ? 'var(--green-light)' : isSelected ? 'var(--navy-light)' : '#fff',
                  border: '1.5px solid',
                  borderColor: isMatched ? 'var(--green)' : isSelected ? 'var(--navy)' : 'rgba(228, 223, 217, 0.8)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: isMatched ? 'var(--green-dark)' : '#334155',
                  cursor: isMatched ? 'default' : 'grab',
                  opacity: isMatched ? 0.6 : 1,
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 85, 140, 0.1)' : 'none',
                  animation: isShaking ? 'shake 0.4s ease' : 'none',
                  position: 'relative'
                }}
              >
                {item.label}
                {isMatched && <span style={{ float: 'right', fontWeight: 'bold' }}>✓</span>}
              </div>
            )
          })}
        </div>

        {/* Right Side: Targets / Match Buckets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {preset.targets.map(target => {
            const matchedItems = deck.filter(item => matches[item.id] === target.id)
            
            return (
              <div
                key={target.id}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, target.id)}
                onClick={() => handleSelectTarget(target.id)}
                style={{
                  background: '#fff',
                  border: '2px dashed rgba(228, 223, 217, 0.8)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  minHeight: '80px',
                  transition: 'all 0.25s',
                  cursor: selectedItem ? 'pointer' : 'default',
                  boxShadow: selectedItem ? '0 0 0 2px rgba(0, 85, 140, 0.08)' : 'none',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  {target.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: '8px' }}>
                  {target.desc}
                </div>
                
                {/* Placed matched cards inside the bucket */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matchedItems.map(item => (
                    <span
                      key={item.id}
                      className="widget-chip"
                      style={{
                        fontSize: '11px',
                        background: 'rgba(49, 155, 65, 0.08)',
                        borderColor: 'rgba(49, 155, 65, 0.15)',
                        color: 'var(--green-dark)'
                      }}
                    >
                      {item.label.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {isComplete && (
        <div style={{ padding: '20px', background: 'rgba(49, 155, 65, 0.05)', border: '1.5px solid rgba(49, 155, 65, 0.15)', borderRadius: '16px', animation: 'slideDown 0.3s ease' }}>
          <div style={{ fontWeight: '700', color: 'var(--green-dark)', fontSize: '15px', marginBottom: '6px' }}>
            🎉 Well Done! All Cards Matched!
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--green-dark)', lineHeight: '1.5', margin: 0 }}>
            {presetKey === 'character' && 'DISC biblical character profiling helps connect behavioral strengths to characters in Scripture. Understanding how Deborah, Paul, Barnabas, and Moses led reveals your own style traits.'}
            {presetKey === 'lsa' && 'LSA strategy mapping shows how the four leadership styles (Instructing, Developing, Mentoring, Commissioning) directly align with the maturity level of the leader candidates.'}
            {presetKey === 'biblical' && 'The DVULI Core Values are firmly rooted in biblical narrative. Applying these scriptures keeps our youth ministry strategies grounded in the Word.'}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button type="button" className="widget-reset-btn" onClick={resetGame}>↺ Restart Game</button>
      </div>
    </div>
  )
}
