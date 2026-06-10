import { useState } from 'react'

function parseSteps(desc, blockId) {
  const bid = (blockId || '').toLowerCase()
  
  // 1. Ladder of Inference (ch6-widget-2)
  if (bid === 'ch6-widget-2' || desc.toLowerCase().includes('ladder of inference')) {
    return [
      { num: 1, label: 'Observable Data (Rung 1)', prompt: 'Observable Data: What did you actually see or hear? List only the raw, objective, video-camera facts without any interpretation.' },
      { num: 2, label: 'Selected Data (Rung 2)', prompt: 'Selected Data: What parts of the situation did you choose to pay attention to? What facts did you ignore?' },
      { num: 3, label: 'Added Meanings (Rung 3)', prompt: 'Added Meanings: What personal or cultural meaning did you add to the selected data? What did you assume they meant?' },
      { num: 4, label: 'Assumptions (Rung 4)', prompt: 'Assumptions: What leaps of logic did you make? What motives did you attribute to the other person?' },
      { num: 5, label: 'Conclusions (Rung 5)', prompt: 'Conclusions: What final conclusions did you draw about the situation, the person, or their attitude?' },
      { num: 6, label: 'Beliefs (Rung 6)', prompt: 'Beliefs: How does this conclusion reinforce or shape your wider beliefs about relationships, authority, or this person?' },
      { num: 7, label: 'Actions (Rung 7)', prompt: 'Actions: What action did you take based on those beliefs? How does this action co-create the next cycle of observable data?' }
    ]
  }

  // 2. Empowerment Pipeline (ch7-widget-1)
  if (bid === 'ch7-widget-1' || desc.toLowerCase().includes('empowerment pipeline')) {
    return [
      { num: 1, label: 'Identifying', prompt: 'Identifying: How do you identify potential leaders? What characteristics, behaviors, or signs of faithfulness do you look for in youth?' },
      { num: 2, label: 'Equipping', prompt: 'Equipping: What tools, skills, and relational training do you provide? How do you prepare them for active service?' },
      { num: 3, label: 'Mobilizing', prompt: 'Mobilizing: How do you release authority and tasks to them? How do you transition them from followers to active leaders?' },
      { num: 4, label: 'Supporting', prompt: 'Supporting: What ongoing encouragement, feedback, and resource network do you provide to keep them motivated and growing?' }
    ]
  }

  // 3. Breakthrough Arc (ch8-widget-2)
  if (bid === 'ch8-widget-2' || desc.toLowerCase().includes('breakthrough arc')) {
    return [
      { num: 1, label: 'Personal Calling', prompt: 'Personal Calling: Describe how your unique calling (PAM dimensions) anchors this breakthrough project.' },
      { num: 2, label: 'Ministry Context', prompt: 'Ministry Context: What structural levels of the Systems Iceberg are you addressing in your community?' },
      { num: 3, label: 'Strategic Question', prompt: 'Strategic Question: What is the focusing "How might we..." question guiding your initiative?' },
      { num: 4, label: 'Breakthrough Goals', prompt: 'Breakthrough Goals: What are your specific, significant, and sustainable breakthrough goals?' },
      { num: 5, label: 'Leverage Points', prompt: 'Leverage Points: What are the high-leverage actions that will multiply the impact of your plan?' },
      { num: 6, label: 'Action Plan', prompt: 'Action Plan: Detail the immediate steps, timelines, and resources needed to launch your plan.' },
      { num: 7, label: 'Peer Accountability', prompt: 'Peer Accountability: How will your city group community of practice help sustain this plan over time?' }
    ]
  }

  const matches = [...desc.matchAll(/Step\s+(\d+)[:\s—–-]+([^.!?]{8,120})/gi)]
  if (matches.length >= 2) {
    return matches.slice(0, 7).map(m => ({
      num: parseInt(m[1]),
      label: m[2].trim(),
      prompt: '',
    }))
  }

  const phases = [...desc.matchAll(/—\s+(See [^:]+|Adjust [^:]+|[A-Z][^—:]{4,30}):\s*'([^']+)'/g)]
  if (phases.length >= 2) {
    return phases.slice(0, 6).map((m, i) => ({
      num: i + 1,
      label: m[1].trim(),
      prompt: m[2].trim(),
    }))
  }

  // SAM process
  if (desc.toLowerCase().includes('sam process') || desc.toLowerCase().includes('see others')) {
    return [
      { num: 1, label: 'See Others', prompt: 'Write three things you now believe to be true about this person\'s needs, pressures, and challenges that you had not previously considered.' },
      { num: 2, label: 'Adjust Effort', prompt: 'What is one concrete change you will make in how you engage this person — in your tone, your timing, or your approach?' },
      { num: 3, label: 'Maintain Accountability', prompt: 'What boundaries or agreements will you maintain even as you change your approach? What does accountability look like here?' },
    ]
  }

  // Collusion Diagram
  if (desc.toLowerCase().includes('collusion')) {
    return [
      { num: 1, label: 'Their Action', prompt: 'What did the other person do (from your perspective)?' },
      { num: 2, label: 'Your Interpretation', prompt: 'How did you interpret their action? What story did you tell yourself?' },
      { num: 3, label: 'Your Response', prompt: 'What did you do in response to that interpretation?' },
      { num: 4, label: 'Their Perception', prompt: 'How do you think they perceived your response?' },
    ]
  }

  // Fast Forward Planning
  if (desc.toLowerCase().includes('fast forward') || desc.toLowerCase().includes('focusing question')) {
    return [
      { num: 1, label: 'Focusing Question', prompt: 'Frame a strategic (not operational) question about your ministry\'s most important challenge. Start with "How might we…"' },
      { num: 2, label: 'Driving Forces', prompt: 'List 5–8 external and internal forces that will shape the answer to your focusing question over the next 3–5 years.' },
      { num: 3, label: 'Critical Uncertainties', prompt: 'Which 2 forces are most uncertain AND most impactful? These become your scenario axes.' },
      { num: 4, label: 'Scenario Stories', prompt: 'Name and describe each of your 4 possible futures. Give each a vivid title and 2–3 sentence narrative.' },
      { num: 5, label: 'Strategic Options', prompt: 'Across all four scenarios, what 3 strategies would serve you well in ANY future? These are your "no-regrets" moves.' },
    ]
  }

  // Story workshop / narrative arc
  if (desc.toLowerCase().includes('narrative arc') || desc.toLowerCase().includes('story')) {
    return [
      { num: 1, label: 'Introduction', prompt: 'Describe a specific person, time, and place. Ground the reader in a concrete moment.' },
      { num: 2, label: 'Rising Action', prompt: 'What circumstances created the need? What tension or gap was present before your ministry intervened?' },
      { num: 3, label: 'Climax', prompt: 'What was the moment of crisis or turning point? What was at stake?' },
      { num: 4, label: 'Descending Action', prompt: 'What happened as a result of your ministry\'s work? What changed?' },
      { num: 5, label: 'Resolution', prompt: 'Where is this person or community now? What transformation is visible?' },
    ]
  }

  // Iceberg model
  if (desc.toLowerCase().includes('iceberg')) {
    return [
      { num: 1, label: 'Events (Tip)', prompt: 'What happened? Describe the visible event or incident you are analyzing.' },
      { num: 2, label: 'Patterns', prompt: 'What recurring patterns or trends have you noticed around this kind of event?' },
      { num: 3, label: 'Structures', prompt: 'What systems, policies, or structures create these patterns?' },
      { num: 4, label: 'Mental Models', prompt: 'What assumptions, beliefs, or worldviews underlie these structures?' },
      { num: 5, label: 'Sources', prompt: 'What are the deepest root causes — historical, spiritual, or relational?' },
    ]
  }

  // Generic numbered steps
  return [
    { num: 1, label: 'Step One', prompt: 'Reflect on the first phase of this process…' },
    { num: 2, label: 'Step Two', prompt: 'Continue your reflection here…' },
    { num: 3, label: 'Step Three', prompt: 'Complete your response…' },
  ]
}

export default function StepJourney({ config, blockId }) {
  const steps = parseSteps(config.description || '', blockId)
  const [texts, setTexts] = useState(() => steps.map(() => ''))
  const [done, setDone] = useState(() => steps.map(() => false))
  const [activeStep, setActiveStep] = useState(0)

  const completedCount = done.filter(Boolean).length
  const allComplete = completedCount === steps.length

  function markDone(i) {
    if (texts[i].trim().length < 5) return
    setDone(d => {
      const copy = [...d]
      copy[i] = true
      return copy
    })
    if (i + 1 < steps.length) {
      setActiveStep(i + 1)
    }
  }

  function reset() {
    setTexts(steps.map(() => ''))
    setDone(steps.map(() => false))
    setActiveStep(0)
  }

  return (
    <div>
      {/* Progress Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: '600' }}>
          <span>{completedCount} of {steps.length} steps completed</span>
          {allComplete && <span style={{ color: 'var(--correct)', fontWeight: '700' }}>✨ Journey Complete!</span>}
        </div>
        <div style={{ height: 6, background: 'rgba(228, 223, 217, 0.5)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(completedCount / steps.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--navy) 0%, var(--green) 100%)',
            borderRadius: 99,
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
      </div>

      {/* Vertical Timeline Steps */}
      <div className="sj-steps">
        {steps.map((step, i) => {
          const isDone = done[i]
          const isActive = i === activeStep
          const isLocked = i > activeStep

          return (
            <div key={i} className={`sj-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}>
              <div className="sj-step-left">
                <div className="sj-step-num" onClick={() => !isLocked && setActiveStep(i)}>
                  {isDone ? '✓' : step.num}
                </div>
              </div>
              <div className="sj-step-body">
                <div 
                  className="sj-step-label"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isLocked ? 'not-allowed' : 'pointer' }}
                  onClick={() => !isLocked && setActiveStep(i)}
                >
                  <span>{step.label}</span>
                  {isLocked && <span style={{ fontSize: '11px', color: '#cbd5e1' }}>🔒 Locked</span>}
                </div>
                
                {(isActive || isDone) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                    {step.prompt && (
                      <p className="sj-step-prompt" style={{ marginBottom: 0 }}>{step.prompt}</p>
                    )}
                    <textarea
                      className="widget-textarea"
                      placeholder={`Provide your answer for this stage...`}
                      value={texts[i]}
                      disabled={isDone}
                      onChange={e => setTexts(t => {
                        const copy = [...t]
                        copy[i] = e.target.value
                        return copy
                      })}
                      style={{ minHeight: '80px' }}
                    />
                    
                    {!isDone && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                          type="button"
                          className="widget-save-btn"
                          disabled={texts[i].trim().length < 5}
                          style={{
                            background: texts[i].trim().length < 5 ? '#cbd5e1' : 'var(--navy)',
                            boxShadow: texts[i].trim().length < 5 ? 'none' : undefined,
                            cursor: texts[i].trim().length < 5 ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => markDone(i)}
                        >
                          Next Step →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion summary box */}
      {allComplete && (
        <div style={{ marginTop: 24, padding: 24, background: 'rgba(49, 155, 65, 0.05)', borderRadius: 16, border: '1px solid rgba(49, 155, 65, 0.15)', animation: 'slideDown 0.4s ease' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6 }}>🎉 Complete Journey Pathway!</p>
          <p style={{ fontSize: 14, color: 'var(--green-dark)', lineHeight: 1.6, marginBottom: 16 }}>
            Excellent job! You have fully reflected through all steps of this session process.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="widget-reset-btn" onClick={reset}>↺ Reset Process</button>
          </div>
        </div>
      )}
    </div>
  )
}
