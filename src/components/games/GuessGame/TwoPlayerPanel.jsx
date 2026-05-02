import React from 'react'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'

function TwoPlayerPanel({
  settings,
  currentPlayer,
  player1Attempts,
  player2Attempts,
  player1Lo,
  player1Hi,
  player2Lo,
  player2Hi,
  feedback,
  feedbackClass,
  disabled,
  shake,
  player1RangePercentage,
  player2RangePercentage,
  winner,
  coupleSetupPhase,
  setupStep,
  player1Secret,
  player2Secret,
  inputRef,
  submitTwoPlayerGuess,
  setSecretNumber,
  resetGuess,
  handleKeyDown
}) {
  const isCouple = settings.gameMode === 'couple'
  const activePlayer = currentPlayer === 1 ? settings.player1Name : settings.player2Name

  // Couple mode setup phase
  if (isCouple && coupleSetupPhase) {
    const currentSetter = setupStep === 1 ? settings.player1Name : settings.player2Name
    const otherPlayer = setupStep === 1 ? settings.player2Name : settings.player1Name
    
    return (
      <div className="panel">
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          padding: '20px',
          background: setupStep === 1 ? 'rgba(240,192,64,.1)' : 'rgba(107,255,200,.1)',
          borderRadius: '12px',
          border: `2px solid ${setupStep === 1 ? 'var(--accent)' : 'var(--accent3)'}`
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            💑 Couple Mode Setup - Step {setupStep}/2
          </div>
          <div style={{ fontSize: '.95rem', color: 'var(--muted)', marginBottom: '8px' }}>
            {currentSetter}, set a secret number for {otherPlayer} to guess!
          </div>
          {setupStep === 2 && (
            <div style={{ fontSize: '.85rem', color: 'var(--accent)', marginTop: '8px' }}>
              ✅ {settings.player1Name} has set their number
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '.9rem', 
            color: 'var(--muted)', 
            marginBottom: '8px',
            fontFamily: 'DM Mono, monospace'
          }}>
            {currentSetter}, enter your secret number ({settings.minRange} - {settings.maxRange})
          </label>
          <input
            ref={inputRef}
            type="number"
            placeholder="Enter secret number..."
            min={settings.minRange}
            max={settings.maxRange}
            onKeyDown={(e) => e.key === 'Enter' && setSecretNumber()}
            aria-label="Enter secret number"
            style={{ marginBottom: '12px' }}
          />
        </div>

        {feedback && (
          <div className={feedbackClass} style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>
            {feedback}
          </div>
        )}

        <Button 
          onClick={setSecretNumber}
          style={{ width: '100%', marginBottom: '12px' }}
          ariaLabel="Set secret number"
        >
          Set Number →
        </Button>

        <Button 
          variant="ghost" 
          onClick={resetGuess} 
          style={{ width: '100%' }}
          ariaLabel="Back to settings"
        >
          ← Back to Settings
        </Button>
      </div>
    )
  }

  // Regular gameplay
  return (
    <div className={`panel ${shake ? 'shake' : ''}`}>
      {/* Current Turn Indicator */}
      {!disabled && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '16px',
          padding: '12px',
          background: currentPlayer === 1 ? 'rgba(240,192,64,.1)' : 'rgba(107,255,200,.1)',
          borderRadius: '10px',
          border: `2px solid ${currentPlayer === 1 ? 'var(--accent)' : 'var(--accent3)'}`,
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {activePlayer}'s Turn
          </div>
          {isCouple && (
            <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '4px' }}>
              Guessing {currentPlayer === 1 ? settings.player2Name : settings.player1Name}'s number
            </div>
          )}
        </div>
      )}

      {/* Player Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div className={`player-stat ${currentPlayer === 1 && !disabled ? 'active' : ''} ${winner === 1 ? 'winner' : ''}`}
          style={{
            background: 'var(--surface2)',
            border: `2px solid ${currentPlayer === 1 && !disabled ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'center',
            transition: 'all .2s'
          }}>
          <div style={{ fontSize: '.75rem', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            {settings.player1Name}
            {isCouple && <span style={{ marginLeft: '4px' }}>🎯</span>}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
            {player1Attempts}
          </div>
          <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>attempts</div>
          
          {settings.showRange && (
            <>
              <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '8px' }}>
                Range: {player1Lo} – {player1Hi}
              </div>
              {settings.showRangeBar && (
                <div className="guess-range-bar" style={{ marginTop: '6px', height: '4px' }}>
                  <div className="guess-range-fill" style={{ width: `${player1RangePercentage}%` }} />
                </div>
              )}
            </>
          )}
        </div>

        <div className={`player-stat ${currentPlayer === 2 && !disabled ? 'active' : ''} ${winner === 2 ? 'winner' : ''}`}
          style={{
            background: 'var(--surface2)',
            border: `2px solid ${currentPlayer === 2 && !disabled ? 'var(--accent3)' : 'var(--border)'}`,
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'center',
            transition: 'all .2s'
          }}>
          <div style={{ fontSize: '.75rem', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            {settings.player2Name}
            {isCouple && <span style={{ marginLeft: '4px' }}>🎯</span>}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent3)' }}>
            {player2Attempts}
          </div>
          <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>attempts</div>
          
          {settings.showRange && (
            <>
              <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '8px' }}>
                Range: {player2Lo} – {player2Hi}
              </div>
              {settings.showRangeBar && (
                <div className="guess-range-bar" style={{ marginTop: '6px', height: '4px' }}>
                  <div className="guess-range-fill" style={{ width: `${player2RangePercentage}%`, background: 'linear-gradient(90deg, #6bb8ff, var(--accent3))' }} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="number"
        placeholder={`${activePlayer}, enter your guess...`}
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
        <Button onClick={submitTwoPlayerGuess} disabled={disabled} ariaLabel="Submit guess">
          Guess →
        </Button>
        <Button variant="ghost" onClick={resetGuess} ariaLabel="Start new game">
          New Game
        </Button>
      </div>
    </div>
  )
}

export default TwoPlayerPanel