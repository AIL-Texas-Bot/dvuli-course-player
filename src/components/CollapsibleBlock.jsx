import { useState } from 'react'

const BLOCK_META = {
  'weekly-challenge': { icon: '🎯', label: 'Weekly Challenge Deck' },
  'discussion':       { icon: '💬', label: 'Group Discussion Prompts' },
  'activity':         { icon: '⚡', label: 'In-Class Interactive Activities' },
  'slides':           { icon: '🖥', label: 'Lesson Presentation Slides' },
}

export default function CollapsibleBlock({ kind, title, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const meta = BLOCK_META[kind] || { icon: '📦', label: 'Interactive Activity' }

  return (
    <div className={`collapsible-block ${isOpen ? 'open' : ''}`}>
      <div 
        className="collapsible-header" 
        onClick={() => setIsOpen(s => !s)}
      >
        <div className="collapsible-header-left">
          <span className="collapsible-header-icon" style={{ fontSize: '20px' }}>
            {meta.icon}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              color: 'var(--text-light)' 
            }}>
              {meta.label}
            </span>
            <span style={{ 
              fontFamily: "'Fraunces', Georgia, serif", 
              fontSize: '16px', 
              fontWeight: '700', 
              color: 'var(--text-primary)' 
            }}>
              {title || 'Interactive Content'}
            </span>
          </div>
        </div>
        <div className={`collapsible-arrow-icon ${isOpen ? 'open' : ''}`} style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          transition: 'transform 0.25s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </div>
      </div>
      
      {isOpen && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  )
}
