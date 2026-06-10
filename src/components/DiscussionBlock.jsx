export default function DiscussionBlock({ block }) {
  const prompts = block.prompts || []
  return (
    <div className="discussion-block">
      <div className="discussion-header">
        <div className="discussion-header-title">💬 {block.title || 'Discussion'}</div>
      </div>
      <div className="discussion-list">
        {prompts.map((item, i) => (
          <div key={i} className="discussion-item">
            <div>
              {item.hook && <div className="discussion-hook">{item.hook}</div>}
              <div className="discussion-prompt">{item.prompt || item}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
