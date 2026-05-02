import React from 'react'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import { soundEffects } from '../../../utils/sounds'

function SinglePlayerPanel({
  settings,
  attempts,
  lo,
  hi,
  feedback,
  feedbackClass,
  disabled,
  shake,
  rangePercentage,
  history,
  inputRef,
  submitGuess,
  resetGuess,
  handleKeyDown
}) {
  return (
    <div className={`panel ${shake ? 'shake' : ''}`}>
      {/* Attempts Counter */}
      {settings.showAttempts && (
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <Badge variant="yellow">Attempts: {attempts}</Badge>
        </div>
      )}

      {/* Range Display */}
      {settings.showRange && (
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="green">Range: {lo} – {hi}</Badge>
          {settings.showRangeBar && (
            <>
              <div className="guess-range-bar">
                <div className="guess-range-fill" style={{ width: `${rangePercentage}%` }} />
              </div>
              <div className="range-labels">
                <span>{lo}</span>
                <span>{hi}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Input */}
      <input
        ref={inputRef}
        type="number"
        placeholder="Enter your guess..."
        min={settings.minRange}
        max={settings.maxRange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Enter your guess"
      />

      {/* Feedback */}
      <div className={feedbackClass} style={{ margin: '12px 0', minHeight: '1.5em', fontSize: '1.1rem', fontWeight: 700 }}>
        {feedback}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
        <Button onClick={submitGuess} disabled={disabled} ariaLabel="Submit guess">
          Guess →
        </Button>
        <Button variant="ghost" onClick={resetGuess} ariaLabel="Start new game">
          New Game
        </Button>
      </div>

      {/* History */}
      {settings.showHistory && history.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '10px', color: 'var(--muted)' }}>
            History
          </h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '6px',
            maxHeight: '120px',
            overflowY: 'auto',
            padding: '8px',
            background: 'var(--surface2)',
            borderRadius: '8px'
          }}>
            {history.map(h => (
              <span 
                key={h.num}
                style={{
                  padding: '4px 10px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '.8rem',
                  fontFamily: 'DM Mono, monospace',
                  color: 'var(--muted)'
                }}
              >
                {h.val}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SinglePlayerPanel