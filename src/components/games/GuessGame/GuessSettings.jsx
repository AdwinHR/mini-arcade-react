import React from 'react'
import Button from '../../ui/Button'

const PRESET_RANGES = [
  { label: 'Easy (1-50)', min: 1, max: 50 },
  { label: 'Medium (1-100)', min: 1, max: 100 },
  { label: 'Hard (1-500)', min: 1, max: 500 },
  { label: 'Expert (1-1000)', min: 1, max: 1000 }
]

const GAME_MODES = [
  { id: 'single-player', label: '👤 Single Player', desc: 'Play solo against the computer' },
  { id: 'two-player', label: '👥 Two Player', desc: 'Take turns, first to guess wins' },
  { id: 'couple', label: '💑 Couple Mode', desc: 'Work together, share the same range' }
]

function GuessSettings({ settings, onSettingChange, onStartGame }) {
  const handlePresetClick = (preset) => {
    onSettingChange('minRange', preset.min)
    onSettingChange('maxRange', preset.max)
    onSettingChange('customRange', false)
  }

  const handleCustomToggle = () => {
    onSettingChange('customRange', !settings.customRange)
  }

  const isValidRange = settings.minRange < settings.maxRange && 
                        settings.minRange >= 1 && 
                        settings.maxRange <= 10000

  const needsPlayerNames = settings.gameMode !== 'single-player'

  return (
    <div className="panel">
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
        ⚙️ Game Settings
      </h3>

      {/* Game Mode Selection */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '.85rem', 
          color: 'var(--muted)', 
          marginBottom: '10px',
          fontFamily: 'DM Mono, monospace'
        }}>
          Game Mode
        </label>
        <div style={{ display: 'grid', gap: '10px' }}>
          {GAME_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSettingChange('gameMode', mode.id)}
              className={`mode-btn ${settings.gameMode === mode.id ? 'active' : ''}`}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{mode.label}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Player Names (for multiplayer modes) */}
      {needsPlayerNames && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '.85rem', 
            color: 'var(--muted)', 
            marginBottom: '10px',
            fontFamily: 'DM Mono, monospace'
          }}>
            Player Names
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              value={settings.player1Name || ''}
              onChange={(e) => onSettingChange('player1Name', e.target.value)}
              placeholder="Player 1"
              style={{ fontSize: '.9rem', padding: '10px 12px' }}
            />
            <input
              type="text"
              value={settings.player2Name || ''}
              onChange={(e) => onSettingChange('player2Name', e.target.value)}
              placeholder="Player 2"
              style={{ fontSize: '.9rem', padding: '10px 12px' }}
            />
          </div>
        </div>
      )}

      {/* Preset Ranges */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '.85rem', 
          color: 'var(--muted)', 
          marginBottom: '10px',
          fontFamily: 'DM Mono, monospace'
        }}>
          Quick Start - Preset Ranges
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {PRESET_RANGES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className={`preset-btn ${!settings.customRange && 
                settings.minRange === preset.min && 
                settings.maxRange === preset.max ? 'active' : ''}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Range Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.customRange || false}
            onChange={handleCustomToggle}
          />
          <span>Custom Range</span>
        </label>
      </div>

      {/* Custom Range Inputs */}
      {settings.customRange && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '.8rem', 
                color: 'var(--muted)', 
                marginBottom: '6px',
                fontFamily: 'DM Mono, monospace'
              }}>
                Min Value
              </label>
              <input
                type="number"
                value={settings.minRange || 1}
                onChange={(e) => onSettingChange('minRange', parseInt(e.target.value) || 1)}
                min="1"
                max="9999"
                style={{ fontSize: '1rem', padding: '10px 12px' }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '.8rem', 
                color: 'var(--muted)', 
                marginBottom: '6px',
                fontFamily: 'DM Mono, monospace'
              }}>
                Max Value
              </label>
              <input
                type="number"
                value={settings.maxRange || 100}
                onChange={(e) => onSettingChange('maxRange', parseInt(e.target.value) || 100)}
                min="2"
                max="10000"
                style={{ fontSize: '1rem', padding: '10px 12px' }}
              />
            </div>
          </div>
          {!isValidRange && (
            <p style={{ 
              color: 'var(--accent2)', 
              fontSize: '.8rem', 
              marginTop: '8px',
              fontFamily: 'DM Mono, monospace'
            }}>
              ⚠️ Min must be less than Max (range: 1-10000)
            </p>
          )}
        </div>
      )}

      {/* Display Options */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: 600, 
          marginBottom: '12px',
          color: 'var(--text)'
        }}>
          Display Options
        </h4>
        
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.showRange || false}
            onChange={() => onSettingChange('showRange', !settings.showRange)}
          />
          <span>Show Current Range</span>
        </label>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.showRangeBar || false}
            onChange={() => onSettingChange('showRangeBar', !settings.showRangeBar)}
          />
          <span>Show Range Progress Bar</span>
        </label>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.showHistory || false}
            onChange={() => onSettingChange('showHistory', !settings.showHistory)}
          />
          <span>Show Guess History</span>
        </label>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.showAttempts || false}
            onChange={() => onSettingChange('showAttempts', !settings.showAttempts)}
          />
          <span>Show Attempt Count</span>
        </label>
      </div>

      {/* Difficulty Info */}
      <div className="info-box">
        <div style={{ fontSize: '.85rem', fontFamily: 'DM Mono, monospace' }}>
          <strong>Mode:</strong> {GAME_MODES.find(m => m.id === settings.gameMode)?.label || 'Single Player'}
        </div>
        <div style={{ fontSize: '.85rem', fontFamily: 'DM Mono, monospace', marginTop: '4px' }}>
          <strong>Range:</strong> {settings.minRange || 1} – {settings.maxRange || 100}
        </div>
        <div style={{ fontSize: '.85rem', fontFamily: 'DM Mono, monospace', marginTop: '4px' }}>
          <strong>Possible Numbers:</strong> {(settings.maxRange || 100) - (settings.minRange || 1) + 1}
        </div>
      </div>

      {/* Start Button */}
      <Button 
        onClick={onStartGame} 
        disabled={!isValidRange}
        style={{ width: '100%', marginTop: '16px', fontSize: '1.1rem', padding: '14px' }}
        ariaLabel="Start game"
      >
        Start Game 🎮
      </Button>
    </div>
  )
}

export default GuessSettings