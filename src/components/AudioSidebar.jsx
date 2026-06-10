import { useState } from 'react'

export default function AudioSidebar({ block }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  if (!block) return null

  return (
    <div className={`audio-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Toggle Button floating on the left side of the panel */}
      <button 
        className="audio-sidebar-toggle" 
        onClick={() => setIsOpen(open => !open)}
        title={isOpen ? 'Collapse player' : 'Listen to audiobook'}
        aria-label={isOpen ? 'Collapse player' : 'Listen to audiobook'}
      >
        {isOpen ? '✕' : '🎧'}
      </button>

      {/* Sidebar Header */}
      <div className="audio-sidebar-header">
        <span style={{ fontSize: '18px' }}>🎧</span>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <span className="audio-sidebar-eyebrow">Audiobook Playback</span>
          <span className="audio-sidebar-title">{block.title || 'Session Narration'}</span>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="audio-sidebar-body">
        {(block.audioDataUri && block.audioDataUri.startsWith('data:')) || block.src ? (
          <div className="audio-player-wrapper">
            <audio 
              controls 
              src={block.audioDataUri && block.audioDataUri.startsWith('data:') ? block.audioDataUri : block.src} 
              className="audio-player-element"
            />
          </div>
        ) : (
          <div className="audio-sidebar-warning">
            ⚠️ Audio narration coming soon. Transcript is available below.
          </div>
        )}

        {/* Transcript Toggle & Box */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          <button
            className="audio-sidebar-transcript-btn"
            onClick={() => setShowTranscript(s => !s)}
          >
            {showTranscript ? '▼ Hide Text Transcript' : '▶ Read Text Transcript'}
          </button>
          
          {showTranscript && block.transcript && (
            <div className="audio-sidebar-transcript-box">
              <p className="audio-sidebar-transcript-text">
                {block.transcript}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
