import React from 'react'

function GuessHistory({ history, settings }) {
  if (!settings.showHistory || history.length === 0) return null

  const isMultiplayer = settings.gameMode !== 'single-player'

  return (
    <div className="panel">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
        📜 Guess History
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {history.map((entry) => (
          <div
            key={entry.num}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: 'var(--surface2)',
              borderRadius: '8px',
              fontFamily: 'DM Mono, monospace',
              fontSize: '.9rem'
            }}
          >
            <span style={{ color: 'var(--muted)' }}>#{entry.num}</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{entry.val}</span>
            {isMultiplayer && entry.playerName && (
              <span style={{ 
                color: entry.player === 1 ? 'var(--accent)' : 'var(--accent3)',
                fontSize: '.85rem'
              }}>
                {entry.playerName}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuessHistory