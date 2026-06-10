import { useState } from 'react'

export default function AudioBlock({ block }) {
  const [showTranscript, setShowTranscript] = useState(false)

  return (
    <div className="audio-block" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '24px'
    }}>
      <div className="audio-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="audio-icon" style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--navy-light)',
            color: 'var(--navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>🎧</div>
          <div className="audio-header-text">
            <div className="audio-header-label" style={{
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-light)'
            }}>Audiobook</div>
            <div className="audio-header-title" style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>{block.title || 'Session Narration'}</div>
          </div>
        </div>
        <button
          className="audio-transcript-toggle"
          onClick={() => setShowTranscript(s => !s)}
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {showTranscript ? 'Hide Transcript' : 'Read Transcript'}
        </button>
      </div>

      {/* Real Audio Player */}
      {block.audioDataUri ? (
        <div style={{ width: '100%', marginBottom: '8px' }}>
          <audio 
            controls 
            src={block.audioDataUri} 
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
      ) : (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(217, 119, 6, 0.08)',
          border: '1px dashed var(--amber)',
          borderRadius: '8px',
          fontSize: '13.5px',
          color: 'var(--amber)',
          fontWeight: '500'
        }}>
          ⚠️ Audio narration coming soon for this session. Transcript is available below.
        </div>
      )}

      {showTranscript && block.transcript && (
        <div className="audio-transcript" style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-light)',
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          <p className="audio-transcript-text" style={{
            fontSize: '14px',
            lineHeight: '1.65',
            color: 'var(--text-muted)',
            whiteSpace: 'pre-wrap'
          }}>{block.transcript}</p>
        </div>
      )}
    </div>
  )
}
