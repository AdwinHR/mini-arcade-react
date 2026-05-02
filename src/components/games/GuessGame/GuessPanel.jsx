import React from 'react'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'

function GuessPanel({
  settings,
  attempts,
  lo,
  hi,
  feedback,
  feedbackClass,
  disabled,
  shake,
  rangePercentage,
  inputRef,
  submitGuess,
  resetGuess,
  handleKeyDown
}) {
  return (
    <div className={`panel ${shake ? 'shake' : ''}`}>
      {/* Stats Badges */}
      {(settings.showAttempts || settings.showRange) && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          {settings.showAttempts && (
            <Badge variant="yellow">Attempts: {attempts}</Badge>
          )}
          {settings.showRange && (
            <Badge variant="green">Range: {lo} – {hi}</Badge>
          )}
        </div>
      )}

      {/* Range Progress Bar */}
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

      {/* Input */}
      <input
        ref={inputRef}
        type="number"
        placeholder={`Type your guess (${settings.minRange}-${settings.maxRange})…`}
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
    </div>
  )
}

export default GuessPanel