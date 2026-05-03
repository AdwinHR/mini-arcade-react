import React, { useState } from 'react'
import { createChallenge, generateChallengeUrl } from '../../../utils/challenges'
import { playSound } from '../../../utils/sounds'
import Button from '../../ui/Button'

function ShareChallengeModal({ moves, time, difficulty, onClose, onChallengeCreated }) {
  const [playerName, setPlayerName] = useState('')
  const [creating, setCreating] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const [copied, setCopied] = useState(false)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCreateChallenge = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name')
      return
    }

    try {
      setCreating(true)
      console.log('Creating challenge with:', { difficulty, moves, time, playerName: playerName.trim() })
      
      const newChallengeId = await createChallenge(difficulty, moves, time, playerName.trim())
      console.log('Challenge created with ID:', newChallengeId)
      
      const url = generateChallengeUrl(newChallengeId)
      console.log('Generated URL:', url)
      
      setChallengeId(newChallengeId)
      setChallengeUrl(url)
      playSound('win')
      
      // Notify parent component
      if (onChallengeCreated) {
        onChallengeCreated(newChallengeId)
      }
    } catch (error) {
      console.error('Failed to create challenge:', error)
      alert('Failed to create challenge. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(challengeUrl)
    setCopied(true)
    playSound('click')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Memory Match Challenge',
          text: `Can you beat my score of ${moves} moves in ${formatTime(time)}?`,
          url: challengeUrl
        })
        playSound('click')
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      handleCopyLink()
    }
  }

  const handleViewChallenge = () => {
    window.open(challengeUrl, '_blank')
  }

  return (
    <div className="panel">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Great Job!
        </h2>
        <div style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>
          {moves} moves • {formatTime(time)}
        </div>
      </div>

      {!challengeUrl ? (
        <div>
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: '2px solid rgba(255,215,0,0.3)'
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              🏆 Create a Challenge
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              Challenge your friends to beat your score!
            </div>
          </div>

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !creating && handleCreateChallenge()}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              marginBottom: '1rem',
              outline: 'none'
            }}
            autoFocus
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleCreateChallenge}
              disabled={creating || !playerName.trim()}
              style={{ 
                flex: 1,
                opacity: (!playerName.trim() || creating) ? 0.5 : 1
              }}
            >
              {creating ? '⏳ Creating...' : '✨ Create Challenge'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div style={{ animation: 'slideUp 0.5s ease-out' }}>
          <div style={{
            padding: '1.5rem',
            background: 'rgba(0,255,136,0.1)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: '2px solid var(--success)',
            animation: 'pop 0.3s ease-out'
          }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 800, 
              marginBottom: '1rem', 
              color: 'var(--success)'
            }}>
              ✅ Challenge Created!
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '8px',
              wordBreak: 'break-all',
              fontSize: '0.85rem',
              color: 'var(--accent)',
              fontFamily: 'monospace',
              border: '1px solid rgba(255,215,0,0.2)',
              userSelect: 'all'
            }}>
              {challengeUrl}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              className="btn"
              onClick={handleCopyLink}
              style={{
                background: copied ? 'var(--success)' : 'var(--accent2)',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Link'}
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                className="btn"
                onClick={handleShare}
                style={{ 
                  background: 'var(--accent3)',
                  color: '#000'
                }}
              >
                📤 Share
              </button>
              
              <button
                className="btn"
                onClick={handleViewChallenge}
                style={{ 
                  background: 'var(--accent)',
                  color: '#000'
                }}
              >
                👁️ View
              </button>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}

export default ShareChallengeModal