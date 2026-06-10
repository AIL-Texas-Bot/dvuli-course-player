export default function KeyConceptsBlock({ block }) {
  const concepts = block.concepts || []
  return (
    <div className="concepts-block">
      <div className="block-label">
        <span className="block-label-dot" style={{ background: 'var(--navy)' }} />
        Key Concepts
      </div>
      <div className="concepts-grid">
        {concepts.map((concept, i) => (
          <div key={i} className="concept-card">{concept}</div>
        ))}
      </div>
    </div>
  )
}
