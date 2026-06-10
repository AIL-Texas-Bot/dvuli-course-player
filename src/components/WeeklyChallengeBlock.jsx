import { useState, useMemo } from 'react'

const SCORE_WEIGHTS = {
  low: { correct: 10, incorrect: 0, label: 'Low Confidence (10 / 0 pts)' },
  medium: { correct: 20, incorrect: -5, label: 'Medium Confidence (20 / -5 pts)' },
  high: { correct: 30, incorrect: -15, label: 'High Confidence (30 / -15 pts)' }
}

function MatrixRow({ statement, index, selection, onChange, disabled, showResults }) {
  const options = ['always', 'sometimes', 'never']
  const isCorrect = selection === statement.correct

  return (
    <tr className="matrix-row">
      <td className="matrix-stmt-text">{statement.text}</td>
      {options.map(opt => {
        let btnCls = 'matrix-opt-btn'
        if (selection === opt) {
          btnCls += ' selected'
          if (showResults) {
            btnCls += isCorrect ? ' correct' : ' incorrect'
          }
        }
        return (
          <td key={opt} style={{ textAlign: 'center' }}>
            <button
              type="button"
              className={btnCls}
              onClick={() => onChange(index, opt)}
              disabled={disabled}
            >
              {opt.toUpperCase()}
            </button>
          </td>
        )
      })}
      {showResults && (
        <td className="matrix-row-feedback">
          {isCorrect ? (
            <span style={{ color: 'var(--correct)' }}>✓ Correct</span>
          ) : (
            <span style={{ color: 'var(--incorrect)' }}>
              ✗ Correct: {statement.correct.toUpperCase()}
            </span>
          )}
        </td>
      )}
    </tr>
  )
}

export default function WeeklyChallengeBlock({ block }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // { [idx]: { correct: bool, score: number, details: obj } }
  
  // MCQ state
  const [selectedOption, setSelectedOption] = useState(null)
  
  // Two-Stage / Boss state
  const [stage, setStage] = useState(1)
  const [selectedJustification, setSelectedJustification] = useState(null)
  
  // Confidence-Weighted state
  const [selectedConfidence, setSelectedConfidence] = useState('medium')
  
  // Slider state
  const [sliderVal, setSliderVal] = useState(null)
  
  // Matrix state
  const [matrixSelections, setMatrixSelections] = useState({}) // { [stmtIdx]: 'always'|'sometimes'|'never' }

  const questions = useMemo(() => {
    return block.questions || []
  }, [block.questions])

  if (questions.length === 0) {
    return (
      <div className="challenge-block empty">
        <p>No questions found in this weekly challenge.</p>
      </div>
    )
  }

  const q = questions[currentIdx]
  const isAnswered = answers[currentIdx] !== undefined

  // Compute total score and stats
  const totalScore = Object.values(answers).reduce((sum, a) => sum + (a.score || 0), 0)
  const answeredCount = Object.keys(answers).length
  const correctCount = Object.values(answers).filter(a => a.correct).length

  // Initialize slider value if it's slider-estimation
  if (q.type === 'slider-estimation' && sliderVal === null) {
    const min = q.sliderMin !== undefined ? q.sliderMin : 0
    const max = q.sliderMax !== undefined ? q.sliderMax : 100
    setSliderVal(Math.round((min + max) / 2))
  }

  function handleMcqSubmit(optionIdx) {
    if (isAnswered) return
    
    if (q.type === 'mcq') {
      const correct = optionIdx === q.correctIndex
      setAnswers(prev => ({
        ...prev,
        [currentIdx]: {
          correct,
          score: correct ? 20 : 0,
          details: { chosen: optionIdx }
        }
      }))
    }
  }

  function handleConfidenceSubmit() {
    if (selectedOption === null || isAnswered) return
    const correct = selectedOption === q.correctIndex
    const weight = SCORE_WEIGHTS[selectedConfidence]
    const score = correct ? weight.correct : weight.incorrect

    setAnswers(prev => ({
      ...prev,
      [currentIdx]: {
        correct,
        score,
        details: { chosen: selectedOption, confidence: selectedConfidence }
      }
    }))
  }

  function handleTwoStageOptionSubmit(optionIdx) {
    setSelectedOption(optionIdx)
    const isOptionCorrect = optionIdx === q.correctIndex
    if (!isOptionCorrect) {
      // Failed on first stage, lock in incorrect answer
      setAnswers(prev => ({
        ...prev,
        [currentIdx]: {
          correct: false,
          score: 0,
          details: { chosenOption: optionIdx, stageFailed: 1 }
        }
      }))
    } else {
      // Correct on first stage, advance to justification stage
      setStage(2)
    }
  }

  function handleTwoStageJustificationSubmit(justIdx) {
    setSelectedJustification(justIdx)
    const correct = justIdx === q.correctJustificationIndex
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: {
        correct,
        score: correct ? 30 : 10, // Partial credit for correct option
        details: { chosenOption: selectedOption, chosenJustification: justIdx }
      }
    }))
  }

  function handleSliderSubmit() {
    if (isAnswered) return
    const val = Number(sliderVal)
    const isCorrect = val === q.correctValue || 
      (q.acceptableRange && val >= q.acceptableRange[0] && val <= q.acceptableRange[1])
    
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: {
        correct: isCorrect,
        score: isCorrect ? 20 : Math.max(0, 20 - Math.abs(val - q.correctValue) * 2),
        details: { value: val }
      }
    }))
  }

  function handleMatrixChange(stmtIdx, choice) {
    setMatrixSelections(prev => ({ ...prev, [stmtIdx]: choice }))
  }

  function handleMatrixSubmit() {
    const stmts = q.statements || []
    if (stmts.length === 0 || isAnswered) return

    let correctRows = 0
    stmts.forEach((stmt, sIdx) => {
      if (matrixSelections[sIdx] === stmt.correct) {
        correctRows++
      }
    })

    const isAllCorrect = correctRows === stmts.length
    const score = Math.round((correctRows / stmts.length) * 30) // Out of 30 pts

    setAnswers(prev => ({
      ...prev,
      [currentIdx]: {
        correct: isAllCorrect,
        score,
        details: { correctRows, totalRows: stmts.length }
      }
    }))
  }

  function handleAssertionReasonSubmit(relation) {
    if (isAnswered) return
    const correct = relation === q.correctRelationship
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: {
        correct,
        score: correct ? 25 : 0,
        details: { chosen: relation }
      }
    }))
  }

  function nextQuestion() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
      // Reset local states
      setSelectedOption(null)
      setSelectedJustification(null)
      setStage(1)
      setSelectedConfidence('medium')
      setSliderVal(null)
      setMatrixSelections({})
    }
  }

  function prevQuestion() {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1)
      // Reset local states or read from saved answers if we wanted to allow changes,
      // but simple reset is fine since it re-initializes or lets them see completed state.
      setSelectedOption(null)
      setSelectedJustification(null)
      setStage(1)
      setSelectedConfidence('medium')
      setSliderVal(null)
      setMatrixSelections({})
    }
  }

  function resetDeck() {
    setAnswers({})
    setCurrentIdx(0)
    setSelectedOption(null)
    setSelectedJustification(null)
    setStage(1)
    setSelectedConfidence('medium')
    setSliderVal(null)
    setMatrixSelections({})
  }

  return (
    <div className="challenge-block">
      <style dangerouslySetInnerHTML={{ __html: `
        .challenge-block {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .challenge-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }
        .challenge-title-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .challenge-meta-badges {
          display: flex;
          gap: 8px;
        }
        .challenge-badge {
          background: var(--bg-tag);
          color: var(--text-main);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        .challenge-deck-container {
          position: relative;
        }
        .challenge-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .challenge-card.boss-card {
          border: 2px dashed rgba(239, 68, 68, 0.4);
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, rgba(220, 38, 38, 0.05) 100%);
        }
        .boss-indicator {
          color: #ef4444;
          font-weight: 800;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: pulse 2s infinite;
        }
        .challenge-card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .challenge-stem {
          font-size: 16px;
          line-height: 1.5;
          color: var(--text-main);
          margin-bottom: 18px;
        }
        .challenge-sub-stem {
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid var(--accent);
          padding: 10px 14px;
          margin-bottom: 16px;
          font-style: italic;
          font-size: 14px;
        }
        .challenge-options-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }
        .challenge-opt-button {
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .challenge-opt-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--text-muted);
        }
        .challenge-opt-button.selected {
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.08);
        }
        .challenge-opt-button.correct {
          background: rgba(16, 185, 129, 0.1) !important;
          border-color: var(--correct) !important;
        }
        .challenge-opt-button.incorrect {
          background: rgba(239, 68, 68, 0.1) !important;
          border-color: var(--incorrect) !important;
        }
        .challenge-opt-letter {
          background: rgba(255, 255, 255, 0.06);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
        }
        /* Slider Styles */
        .challenge-slider-container {
          margin: 30px 10px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .challenge-slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }
        .challenge-range-input {
          width: 100%;
          accent-color: var(--accent);
          cursor: pointer;
        }
        .challenge-slider-value {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          color: var(--accent);
        }
        /* Confidence Weighted Selector */
        .confidence-weighted-selector {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          margin-top: 14px;
        }
        .confidence-title {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 10px;
        }
        .confidence-options {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .confidence-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 8px;
          font-size: 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .confidence-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .confidence-btn.selected {
          background: var(--accent);
          border-color: var(--accent);
          font-weight: 600;
        }
        /* Matrix Table Styles */
        .matrix-container {
          overflow-x: auto;
          margin-bottom: 16px;
        }
        .matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .matrix-table th {
          border-bottom: 2px solid var(--border-color);
          padding: 8px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .matrix-row td {
          border-bottom: 1px solid var(--border-color);
          padding: 12px 8px;
          color: var(--text-main);
        }
        .matrix-opt-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .matrix-opt-btn.selected {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        .matrix-opt-btn.selected.correct {
          background: var(--correct);
          border-color: var(--correct);
        }
        .matrix-opt-btn.selected.incorrect {
          background: var(--incorrect);
          border-color: var(--incorrect);
        }
        /* Feedback */
        .challenge-feedback {
          margin-top: 16px;
          padding: 14px;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.5;
        }
        .challenge-feedback.correct {
          background: rgba(16, 185, 129, 0.08);
          border-left: 4px solid var(--correct);
          color: var(--correct);
        }
        .challenge-feedback.incorrect {
          background: rgba(239, 68, 68, 0.08);
          border-left: 4px solid var(--incorrect);
          color: var(--incorrect);
        }
        .challenge-score-note {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        /* Action buttons */
        .challenge-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        .deck-nav-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .deck-nav-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
        }
        .deck-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .submit-challenge-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .submit-challenge-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .submit-challenge-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .deck-summary {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          margin-bottom: 16px;
        }
        .summary-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 10px;
          border-radius: 6px;
        }
        .stat-num {
          font-size: 18px;
          font-weight: 700;
          color: var(--accent);
        }
        .stat-lbl {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}} />

      <div className="challenge-header-row">
        <div className="challenge-title-text">🎯 {block.title || 'Weekly Challenge Deck'}</div>
        <div className="challenge-meta-badges">
          <span className="challenge-badge">Total Score: {totalScore} pts</span>
          {answeredCount > 0 && (
            <span className="challenge-badge">
              {correctCount} / {answeredCount} Correct
            </span>
          )}
        </div>
      </div>

      <div className="challenge-deck-container">
        {/* Completed Deck Summary */}
        {answeredCount === questions.length && currentIdx === questions.length - 1 && isAnswered && (
          <div className="deck-summary">
            <h3>🎉 Challenge Deck Completed!</h3>
            <p style={{ color: 'var(--text-muted)' }}>You have submitted answers to all questions in this session.</p>
            <div className="summary-stats">
              <div className="stat-card">
                <div className="stat-num">{totalScore}</div>
                <div className="stat-lbl">Final Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{correctCount} / {questions.length}</div>
                <div className="stat-lbl">Accuracy</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">
                  {Math.round((correctCount / questions.length) * 100)}%
                </div>
                <div className="stat-lbl">Score Rate</div>
              </div>
            </div>
            <button
              type="button"
              className="deck-nav-btn"
              style={{ marginTop: 16, borderColor: 'var(--accent)', color: 'var(--accent)' }}
              onClick={resetDeck}
            >
              ↺ Restart Challenge
            </button>
          </div>
        )}

        {/* Active Question Card */}
        <div className={`challenge-card ${q.tier === 'boss' ? 'boss-card' : ''}`}>
          {q.tier === 'boss' && (
            <div className="boss-indicator">
              ⚔️ Boss Encounter · High Stakes
            </div>
          )}
          <div className="challenge-card-meta">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span style={{ textTransform: 'capitalize' }}>
              Type: {q.type.replace('-', ' ')}
            </span>
          </div>

          <div className="challenge-stem">{q.stem}</div>

          {/* Render MCQ Question */}
          {q.type === 'mcq' && (
            <div className="challenge-options-grid">
              {(q.options || []).map((opt, i) => {
                let btnCls = 'challenge-opt-button'
                if (isAnswered) {
                  if (i === q.correctIndex) btnCls += ' correct'
                  else if (answers[currentIdx].details?.chosen === i) btnCls += ' incorrect'
                }
                return (
                  <button
                    key={i}
                    type="button"
                    className={btnCls}
                    disabled={isAnswered}
                    onClick={() => handleMcqSubmit(i)}
                  >
                    <span className="challenge-opt-letter">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {/* Render Confidence Weighted Question */}
          {q.type === 'confidence-weighted' && (
            <div>
              <div className="challenge-options-grid">
                {(q.options || []).map((opt, i) => {
                  let btnCls = 'challenge-opt-button'
                  if (isAnswered) {
                    if (i === q.correctIndex) btnCls += ' correct'
                    else if (answers[currentIdx].details?.chosen === i) btnCls += ' incorrect'
                  } else if (selectedOption === i) {
                    btnCls += ' selected'
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      className={btnCls}
                      disabled={isAnswered}
                      onClick={() => setSelectedOption(i)}
                    >
                      <span className="challenge-opt-letter">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {!isAnswered && selectedOption !== null && (
                <div className="confidence-weighted-selector">
                  <div className="confidence-title">Choose Confidence Level:</div>
                  <div className="confidence-options">
                    {Object.keys(SCORE_WEIGHTS).map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        className={`confidence-btn ${selectedConfidence === lvl ? 'selected' : ''}`}
                        onClick={() => setSelectedConfidence(lvl)}
                      >
                        {SCORE_WEIGHTS[lvl].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Render Two-Stage or Boss Question */}
          {(q.type === 'two-stage' || q.type === 'boss') && (
            <div>
              {stage === 1 ? (
                <div>
                  <div className="challenge-options-grid">
                    {(q.options || []).map((opt, i) => {
                      let btnCls = 'challenge-opt-button'
                      if (isAnswered) {
                        if (i === q.correctIndex) btnCls += ' correct'
                        else if (answers[currentIdx].details?.chosenOption === i) btnCls += ' incorrect'
                      }
                      return (
                        <button
                          key={i}
                          type="button"
                          className={btnCls}
                          disabled={isAnswered}
                          onClick={() => handleTwoStageOptionSubmit(i)}
                        >
                          <span className="challenge-opt-letter">{String.fromCharCode(65 + i)}</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="challenge-sub-stem">
                    <strong>Selected Answer:</strong> {q.options[selectedOption]}
                  </div>
                  <div className="challenge-stem" style={{ fontSize: '14px', fontWeight: 600 }}>
                    Select the correct theological or conceptual justification:
                  </div>
                  <div className="challenge-options-grid">
                    {(q.justifications || []).map((just, i) => {
                      let btnCls = 'challenge-opt-button'
                      if (isAnswered) {
                        if (i === q.correctJustificationIndex) btnCls += ' correct'
                        else if (answers[currentIdx].details?.chosenJustification === i) btnCls += ' incorrect'
                      }
                      return (
                        <button
                          key={i}
                          type="button"
                          className={btnCls}
                          disabled={isAnswered}
                          onClick={() => handleTwoStageJustificationSubmit(i)}
                        >
                          <span className="challenge-opt-letter">{i + 1}</span>
                          {just}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Render Slider Estimation Question */}
          {q.type === 'slider-estimation' && (
            <div>
              <div className="challenge-slider-container">
                <div className="challenge-slider-value">
                  {sliderVal} {q.unit || ''}
                </div>
                <input
                  type="range"
                  className="challenge-range-input"
                  min={q.sliderMin !== undefined ? q.sliderMin : 0}
                  max={q.sliderMax !== undefined ? q.sliderMax : 100}
                  value={sliderVal || 0}
                  disabled={isAnswered}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                />
                <div className="challenge-slider-labels">
                  <span>Min: {q.sliderMin !== undefined ? q.sliderMin : 0}</span>
                  <span>Max: {q.sliderMax !== undefined ? q.sliderMax : 100}</span>
                </div>
              </div>
            </div>
          )}

          {/* Render Agreement Matrix Question */}
          {q.type === 'agreement-matrix' && (
            <div className="matrix-container">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Statement</th>
                    <th>Always</th>
                    <th>Sometimes</th>
                    <th>Never</th>
                    {isAnswered && <th>Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {(q.statements || []).map((stmt, i) => (
                    <MatrixRow
                      key={i}
                      statement={stmt}
                      index={i}
                      selection={matrixSelections[i]}
                      onChange={handleMatrixChange}
                      disabled={isAnswered}
                      showResults={isAnswered}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Render Assertion Reason Question */}
          {q.type === 'assertion-reason' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid var(--accent)' }}>
                  <strong style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ASSERTION</strong>
                  <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{q.assertion}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                  <strong style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>REASON</strong>
                  <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{q.reason}</span>
                </div>
              </div>
              <div className="challenge-options-grid">
                {[
                  { key: 'both-true-reason-explains', label: 'Both statements are true, and the Reason explains the Assertion' },
                  { key: 'both-true-reason-does-not-explain', label: 'Both statements are true, but the Reason does NOT explain the Assertion' },
                  { key: 'assertion-true-reason-false', label: 'Assertion is true, but the Reason is false' },
                  { key: 'assertion-false-reason-true', label: 'Assertion is false, but the Reason is true' },
                  { key: 'both-false', label: 'Both statements are false' }
                ].map((opt) => {
                  let btnCls = 'challenge-opt-button'
                  if (isAnswered) {
                    if (opt.key === q.correctRelationship) btnCls += ' correct'
                    else if (answers[currentIdx].details?.chosen === opt.key) btnCls += ' incorrect'
                  }
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      className={btnCls}
                      disabled={isAnswered}
                      onClick={() => handleAssertionReasonSubmit(opt.key)}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Submit/Feedback Area */}
          {isAnswered ? (
            <div className={`challenge-feedback ${answers[currentIdx].correct ? 'correct' : 'incorrect'}`}>
              <div className="challenge-score-note">
                {answers[currentIdx].correct ? '✓ Correct Answer!' : '✗ Incorrect or Partial Answer.'}
                {' '}• Score: {answers[currentIdx].score} pts
              </div>
              <div>
                {answers[currentIdx].correct
                  ? q.feedback?.correct || 'Your estimation or choice was correct!'
                  : q.feedback?.incorrect || 'Your estimation or choice was incorrect.'}
              </div>
            </div>
          ) : (
            /* Explicit Submit buttons for non-click-triggered questions */
            (q.type === 'slider-estimation' || q.type === 'agreement-matrix' || q.type === 'confidence-weighted') && (
              <div style={{ textAlign: 'right', marginTop: '12px' }}>
                <button
                  type="button"
                  className="submit-challenge-btn"
                  onClick={
                    q.type === 'slider-estimation' ? handleSliderSubmit :
                    q.type === 'agreement-matrix' ? handleMatrixSubmit :
                    handleConfidenceSubmit
                  }
                  disabled={
                    (q.type === 'confidence-weighted' && selectedOption === null) ||
                    (q.type === 'agreement-matrix' && Object.keys(matrixSelections).length < (q.statements || []).length)
                  }
                >
                  Submit Answer
                </button>
              </div>
            )
          )}
        </div>

        {/* Card Navigation */}
        <div className="challenge-actions">
          <button
            type="button"
            className="deck-nav-btn"
            onClick={prevQuestion}
            disabled={currentIdx === 0}
          >
            ← Previous Question
          </button>
          
          <button
            type="button"
            className="deck-nav-btn"
            onClick={nextQuestion}
            disabled={currentIdx === questions.length - 1 || !isAnswered}
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  )
}
