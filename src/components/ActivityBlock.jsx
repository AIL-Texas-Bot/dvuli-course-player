import { useState } from 'react'

function ActivityItem({ activity, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="activity-item">
      <div className="activity-item-header" onClick={() => setOpen(o => !o)}>
        <div className="activity-item-title">{index + 1}. {activity.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activity.duration && (
            <span className="activity-duration">⏱ {activity.duration}</span>
          )}
          <span className={`activity-chevron ${open ? 'open' : ''}`}>▾</span>
        </div>
      </div>
      {open && (
        <div className="activity-body">
          <p className="activity-desc">{activity.description}</p>
          <div className="activity-meta">
            {activity.materials && (
              <div className="activity-meta-item">
                <div className="activity-meta-label">Materials</div>
                <div className="activity-meta-value">{activity.materials}</div>
              </div>
            )}
            {activity.learningGoal && (
              <div className="activity-meta-item">
                <div className="activity-meta-label">Learning Goal</div>
                <div className="activity-meta-value">{activity.learningGoal}</div>
              </div>
            )}
            {activity.scalingNotes && (
              <div className="activity-meta-item" style={{ gridColumn: '1 / -1' }}>
                <div className="activity-meta-label">Scaling Notes</div>
                <div className="activity-meta-value">{activity.scalingNotes}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ActivityBlock({ block }) {
  const activities = block.activities || []
  return (
    <div className="activity-block">
      <div className="activity-header">
        <div className="activity-header-title">🎯 {block.title || 'Activities'}</div>
      </div>
      <div className="activity-list">
        {activities.map((act, i) => (
          <ActivityItem key={i} activity={act} index={i} />
        ))}
      </div>
    </div>
  )
}
