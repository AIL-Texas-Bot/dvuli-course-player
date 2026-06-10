import { useState } from 'react'

export default function SmartGoalAgenda({ blockId, config }) {
  const isGoal = blockId?.includes('widget-2') || config?.description?.toLowerCase().includes('smart')
  
  const [step, setStep] = useState(0)

  // 1. SMART GOAL BUILDER STATE
  const [goalText, setGoalText] = useState('')
  const [smartChecks, setSmartChecks] = useState({
    S: null, // null=unanswered, true=yes, false=no
    M: null,
    A: null,
    R: null,
    T: null
  })
  const [goalSpecifics, setGoalSpecifics] = useState({
    who: '',
    what: '',
    when: '',
    why: ''
  })
  const [completedGoal, setCompletedGoal] = useState(false)

  // 2. AGENDA FOR CHANGE STATE
  const [agenda, setAgenda] = useState({
    coreValue: 'Accountability',
    truthText: '',
    severity: 'minor', // minor / significant / crisis
    costText: '',
    actionText: '',
    deadline: ''
  })
  const [completedAgenda, setCompletedAgenda] = useState(false)

  function resetAll() {
    setStep(0)
    setGoalText('')
    setSmartChecks({ S: null, M: null, A: null, R: null, T: null })
    setGoalSpecifics({ who: '', what: '', when: '', why: '' })
    setCompletedGoal(false)
    setAgenda({ coreValue: 'Accountability', truthText: '', severity: 'minor', costText: '', actionText: '', deadline: '' })
    setCompletedAgenda(false)
  }

  // ─── MODE A: SMART GOAL BUILDER ─────────────────
  if (isGoal) {
    const questions = [
      { key: 'S', title: 'Specific', prompt: 'Is the goal clear and specific? Does it name the exact task, who is doing it, and how it will run?', field: 'who', placeholder: 'Who is leading this task? (e.g. Mentor James)' },
      { key: 'M', title: 'Motivating', prompt: 'Is it motivating? Does the person responsible care about this task and feel excited to lead it?', field: 'what', placeholder: 'What makes this task motivating for them?' },
      { key: 'A', title: 'Attainable', prompt: 'Is it attainable? Is the scope realistic given their current competence, hours, and resources?', field: 'why', placeholder: 'Why is this scope realistic for them?' },
      { key: 'R', title: 'Relevant', prompt: 'Is it relevant? Does this goal directly support your ministry\'s core mission or CYD vision?', field: 'relevant', placeholder: 'How does it connect to the mission?' },
      { key: 'T', title: 'Time-Bound', prompt: 'Is it time-bound? Is there a clear target deadline and scheduled weekly progress check-ins?', field: 'when', placeholder: 'When is the deadline? (e.g. Dec 15th)' }
    ]

    const activeQ = questions[step]
    const allChecked = Object.values(smartChecks).every(x => x !== null)

    function handleCheck(val) {
      setSmartChecks(prev => ({ ...prev, [activeQ.key]: val }))
      if (step + 1 < questions.length) {
        setStep(step + 1)
      } else {
        setCompletedGoal(true)
      }
    }

    if (completedGoal) {
      const fails = Object.keys(smartChecks).filter(k => smartChecks[k] === false)
      const isSmart = fails.length === 0
      
      const generatedGoal = `By ${goalSpecifics.when || '[Date]'}, ${goalSpecifics.who || '[Leader]'} will lead ${goalText || '[Task]'} in order to achieve ${goalSpecifics.what || '[discipleship objective]'}.`

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="cr-summary-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: isSmart ? 'var(--green-dark)' : 'var(--amber)', fontFamily: "'Fraunces', serif" }}>
              {isSmart ? '✅ SMART Goal Formed!' : '⚠️ Goal Needs Revisions'}
            </h4>
            
            <div style={{ background: '#fff', border: '1.5px solid rgba(228,223,217,0.8)', padding: '16px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', color: '#0f172a', fontStyle: 'italic', lineHeight: 1.6 }}>
              "{generatedGoal}"
            </div>

            {isSmart ? (
              <p style={{ fontSize: '13px', color: 'var(--green-dark)', margin: 0 }}>
                This goal satisfies all SMART criteria! You can now map this task to your candidate\'s LSA developmental step (Novice, Apprentice, Journeyman, or Master).
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--incorrect)' }}>Required Adjustments:</div>
                {fails.map(k => {
                  const titles = { S: 'Specific', M: 'Motivating', A: 'Attainable', R: 'Relevant', T: 'Time-Bound' }
                  const advices = {
                    S: 'Rephrase to specify exactly WHO will lead and WHERE it will run.',
                    M: 'Ensure the candidate is personally invested and cares about this task.',
                    A: 'Reduce the scope or provide more resource support to make it realistic.',
                    R: 'Ensure the task directly aligns with the Core Values or community breakthrough.',
                    T: 'Add a clear date deadline and schedule a weekly check-in checkpoint.'
                  }
                  return (
                    <div key={k} style={{ fontSize: '12.5px', color: 'var(--incorrect)', paddingLeft: '10px', borderLeft: '3px solid var(--incorrect)' }}>
                      <strong>{titles[k]}:</strong> {advices[k]}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="widget-reset-btn" onClick={resetAll}>↺ Rebuild Goal</button>
          </div>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)', fontWeight: '700' }}>
          <span>STEP {step + 1} OF 5</span>
          <span>SMART GOAL BUILDER</span>
        </div>

        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Draft your core ministry task:</label>
            <input
              className="widget-input"
              placeholder="e.g. Recruit 5 volunteer coaches"
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
            />
          </div>
        )}

        <div style={{ background: '#faf8f5', border: '1px solid rgba(228,223,217,0.8)', padding: '18px', borderRadius: '12px' }}>
          <h5 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', marginBottom: '6px' }}>
            {activeQ.title} Criterion Check
          </h5>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            {activeQ.prompt}
          </p>
        </div>

        {/* Dynamic Detail input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input
            className="widget-input"
            placeholder={activeQ.placeholder}
            value={goalSpecifics[activeQ.field] || ''}
            onChange={e => setGoalSpecifics({ ...goalSpecifics, [activeQ.field]: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            className="widget-save-btn"
            style={{ flex: 1, background: 'var(--green)', boxShadow: 'none' }}
            onClick={() => handleCheck(true)}
          >
            ✓ Yes, it matches
          </button>
          <button
            type="button"
            className="widget-save-btn"
            style={{ flex: 1, background: 'var(--amber)', boxShadow: 'none' }}
            onClick={() => handleCheck(false)}
          >
            ✗ No, needs adjustment
          </button>
        </div>
      </div>
    )
  }

  // ─── MODE B: AGENDA FOR CHANGE ─────────────────
  const agendaSteps = [
    { title: 'Facing the Truth', desc: 'Identify one Core Value where you are experiencing a breakthrough or boundary breakdown. Describe the situation honestly.' },
    { title: 'Committing to Change', desc: 'Reflect on the consequences of NOT acting. What is the cost of inaction on your health, family, or team?' },
    { title: 'Taking Charge', desc: 'Define one specific action step to address this concern, along with a deadline and helper candidate.' }
  ]

  const activeStep = agendaSteps[step]

  function handleAgendaNext() {
    if (step + 1 < agendaSteps.length) {
      setStep(step + 1)
    } else {
      setCompletedAgenda(true)
    }
  }

  if (completedAgenda) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="cr-summary-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '14px', background: 'linear-gradient(135deg, rgba(232, 242, 249, 0.4) 0%, #fff 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--navy)', fontFamily: "'Fraunces', serif" }}>
              📋 Agenda for Change: {agenda.coreValue}
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 'bold', background: agenda.severity === 'crisis' ? '#fee2e2' : agenda.severity === 'significant' ? '#fef3c7' : '#e0f2fe',
              color: agenda.severity === 'crisis' ? '#dc2626' : agenda.severity === 'significant' ? '#b45309' : '#0369a1',
              padding: '3px 10px', borderRadius: '99px', textTransform: 'uppercase'
            }}>
              {agenda.severity} Priority
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <div style={{ fontSize: '13px' }}>
              <strong>1. Faced Truth:</strong> <span style={{ color: '#334155' }}>{agenda.truthText}</span>
            </div>
            <div style={{ fontSize: '13px' }}>
              <strong>2. Cost of Inaction:</strong> <span style={{ color: '#334155' }}>{agenda.costText}</span>
            </div>
            <div style={{ fontSize: '13px' }}>
              <strong>3. Action Target:</strong> <span style={{ color: 'var(--navy)', fontWeight: '600' }}>{agenda.actionText}</span> by <strong>{agenda.deadline || '[Date]'}</strong>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="widget-reset-btn" onClick={resetAll}>↺ Rebuild Agenda</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)', fontWeight: '700' }}>
        <span>STEP {step + 1} OF 3</span>
        <span>AGENDA FOR CHANGE</span>
      </div>

      <div style={{ background: '#faf8f5', border: '1px solid rgba(228, 223, 217, 0.8)', padding: '18px', borderRadius: '12px' }}>
        <h5 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', marginBottom: '6px' }}>
          {activeStep.title}
        </h5>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
          {activeStep.desc}
        </p>
      </div>

      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Target Core Value:</span>
            <select
              className="widget-input"
              style={{ width: '200px', padding: '6px 10px' }}
              value={agenda.coreValue}
              onChange={e => setAgenda({ ...agenda, coreValue: e.target.value })}
            >
              {['Accountability', 'Balance', 'Interdependence', 'Empowerment', 'Leverage'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Describe the truth / situation:</label>
            <textarea
              className="widget-textarea"
              placeholder="Be brutally honest about the issue..."
              value={agenda.truthText}
              onChange={e => setAgenda({ ...agenda, truthText: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Priority Level:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['minor', 'significant', 'crisis'].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setAgenda({ ...agenda, severity: lvl })}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '99px',
                    border: '1px solid',
                    borderColor: agenda.severity === lvl ? 'var(--navy)' : '#cbd5e1',
                    background: agenda.severity === lvl ? 'var(--navy-light)' : '#fff',
                    color: agenda.severity === lvl ? 'var(--navy)' : 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>What is the cost of NOT making this change?</label>
          <textarea
            className="widget-textarea"
            placeholder="e.g. Relationship strain, ministry stagnation, physical burnout..."
            value={agenda.costText}
            onChange={e => setAgenda({ ...agenda, costText: e.target.value })}
          />
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>One specific action step:</label>
            <textarea
              className="widget-textarea"
              placeholder="What specific task will you execute?"
              value={agenda.actionText}
              onChange={e => setAgenda({ ...agenda, actionText: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Target Deadline:</span>
            <input
              type="text"
              className="widget-input"
              style={{ width: '160px', padding: '6px 10px' }}
              placeholder="e.g. Next Tuesday"
              value={agenda.deadline}
              onChange={e => setAgenda({ ...agenda, deadline: e.target.value })}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button
          type="button"
          className="widget-save-btn"
          disabled={(step === 0 && !agenda.truthText) || (step === 1 && !agenda.costText) || (step === 2 && !agenda.actionText)}
          onClick={handleAgendaNext}
        >
          {step === 2 ? 'Compile Agenda ✓' : 'Next Step →'}
        </button>
      </div>
    </div>
  )
}
