import { useState, useMemo } from 'react'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function QuizQuestion({ item, index, selected, onAnswer }) {
  const answered = selected !== undefined && selected !== null
  const correct = answered && selected === item.correctIndex

  function handleSelect(i) {
    if (answered) return
    onAnswer(i, i === item.correctIndex)
  }

  const feedbackText = answered
    ? (item.feedbacks ? item.feedbacks[selected] : (correct ? item.feedback?.correct : item.feedback?.incorrect))
    : ''

  return (
    <div className="quiz-question" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
      <div className="quiz-q-meta">
        <span className="quiz-q-num">Question {index + 1}</span>
        {item.tier && (
          <span className="quiz-tier-badge">
            {item.tier === 'warmup' ? '⚡ Warm-up' : '🧠 Core'}
          </span>
        )}
      </div>
      <div className="quiz-stem">{item.stem}</div>
      <div className="quiz-options">
        {(item.options || []).map((opt, i) => {
          let cls = 'quiz-option'
          if (answered) {
            cls += ' answered'
            if (i === item.correctIndex) cls += ' correct'
            else if (i === selected)      cls += ' incorrect'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={answered}
            >
              <span className="option-letter">{LETTERS[i]}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && feedbackText && (
        <div className={`quiz-feedback ${correct ? 'correct' : 'incorrect'}`}>
          {correct ? '✓ ' : '✗ '}
          {feedbackText}
        </div>
      )}
    </div>
  )
}

export default function QuizBlock({ block }) {
  const [answers, setAnswers] = useState({}) // { [qIdx]: isCorrect }
  const [selectedOptions, setSelectedOptions] = useState({}) // { [qIdx]: selectedOptionIdx }
  const [currentIdx, setCurrentIdx] = useState(0)
  const [quizKey, setQuizKey] = useState(0)

  const items = useMemo(() => {
    const rawList = block.questions || block.items || []
    return rawList.map((q, idx) => {
      if (q.stem && q.options) {
        return {
          stem: q.stem,
          options: q.options,
          correctIndex: q.correctIndex,
          feedback: q.feedback || { correct: 'Correct!', incorrect: 'Incorrect.' }
        }
      }
      
      const stem = q.question || ''
      const correctAnswer = q.correctAnswer || ''
      const distractors = q.distractors || []

      const optionsList = [
        { text: correctAnswer, isCorrect: true, feedback: q.correctFeedback || 'Correct!' },
        ...distractors.map(d => ({
          text: typeof d === 'string' ? d : (d.text || ''),
          isCorrect: false,
          feedback: typeof d === 'string' ? 'Incorrect.' : (d.feedback || 'Incorrect.')
        }))
      ]

      // Stable seeded pseudo-random shuffle
      const shuffledList = optionsList
        .map((opt, i) => ({ opt, rand: Math.sin(idx + i * 9.7) }))
        .sort((a, b) => a.rand - b.rand)
        .map(x => x.opt)

      return {
        stem,
        options: shuffledList.map(o => o.text),
        correctIndex: shuffledList.findIndex(o => o.isCorrect),
        feedbacks: shuffledList.map(o => o.feedback)
      }
    })
  }, [block.questions, block.items])

  const answeredCount = Object.keys(answers).length
  const correctCount  = Object.values(answers).filter(Boolean).length
  const allDone       = items.length > 0 && answeredCount === items.length
  const progressPct   = items.length > 0 ? (answeredCount / items.length) * 100 : 0
  const isCurrentAnswered = answers[currentIdx] !== undefined

  function handleAnswer(qIdx, selectedOptIdx, isCorrect) {
    setSelectedOptions(prev => ({ ...prev, [qIdx]: selectedOptIdx }))
    setAnswers(prev => ({ ...prev, [qIdx]: isCorrect }))
  }

  function nextQuestion() {
    if (currentIdx < items.length - 1) {
      setCurrentIdx(idx => idx + 1)
    }
  }

  function prevQuestion() {
    if (currentIdx > 0) {
      setCurrentIdx(idx => idx - 1)
    }
  }

  function reset() {
    setAnswers({})
    setSelectedOptions({})
    setCurrentIdx(0)
    setQuizKey(k => k + 1)
  }

  if (items.length === 0) {
    return (
      <div className="quiz-block">
        <div className="quiz-body">No questions found in this quiz.</div>
      </div>
    )
  }

  return (
    <div className="quiz-block">
      <div className="quiz-header">
        <div className="quiz-header-title">📝 {block.title || 'In-Class Quiz'}</div>
        <div className="quiz-progress-wrap">
          {answeredCount > 0 && (
            <div className="quiz-score-badge">
              {correctCount}/{answeredCount} correct
            </div>
          )}
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>
      <div className="quiz-body" key={quizKey}>
        {/* Completed Quiz Summary Screen */}
        {allDone && currentIdx === items.length - 1 && isCurrentAnswered ? (
          <div className="quiz-completed-summary" style={{ textAlign: 'center', padding: '12px 0' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: 'var(--navy-dark)', marginBottom: '8px' }}>
              🎉 Quiz Completed!
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              You scored {correctCount} out of {items.length} questions correctly.
            </p>
            <div style={{
              display: 'inline-block',
              background: 'var(--navy-light)',
              color: 'var(--navy-dark)',
              fontWeight: 'bold',
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '20px'
            }}>
              Accuracy: {Math.round((correctCount / items.length) * 100)}%
            </div>
          </div>
        ) : (
          <QuizQuestion
            key={`${quizKey}-${currentIdx}`}
            item={items[currentIdx]}
            index={currentIdx}
            selected={selectedOptions[currentIdx]}
            onAnswer={(selectedOptIdx, isCorrect) => handleAnswer(currentIdx, selectedOptIdx, isCorrect)}
          />
        )}
      </div>
      <div className="quiz-footer" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="quiz-reset" 
            onClick={prevQuestion} 
            disabled={currentIdx === 0 || allDone}
            style={{ opacity: (currentIdx === 0 || allDone) ? 0.4 : 1, cursor: (currentIdx === 0 || allDone) ? 'not-allowed' : 'pointer' }}
          >
            ← Prev
          </button>
          
          <button 
            className="quiz-reset" 
            onClick={nextQuestion} 
            disabled={currentIdx === items.length - 1 || !isCurrentAnswered || allDone}
            style={{
              opacity: (currentIdx === items.length - 1 || !isCurrentAnswered || allDone) ? 0.4 : 1,
              cursor: (currentIdx === items.length - 1 || !isCurrentAnswered || allDone) ? 'not-allowed' : 'pointer',
              borderColor: (isCurrentAnswered && currentIdx < items.length - 1 && !allDone) ? 'var(--navy)' : 'var(--border)',
              color: (isCurrentAnswered && currentIdx < items.length - 1 && !allDone) ? 'var(--navy)' : 'var(--text-muted)',
              fontWeight: isCurrentAnswered ? '600' : '500'
            }}
          >
            Next →
          </button>
        </div>
        
        <button className="quiz-reset" onClick={reset}>↺ Reset Quiz</button>
      </div>
    </div>
  )
}
