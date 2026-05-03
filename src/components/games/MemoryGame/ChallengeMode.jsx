import React, { useState, useEffect } from 'react'
import Button from '../../ui/Button'
import { getChallenge, getChallengeLeaderboard } from '../../../utils/challenges'

function ChallengeMode({ challengeId, onBack, onStartChallenge }) {
  const [challenge, setChallenge] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChallenge()
  }, [challengeId])

  const loadChallenge = async () => {
    try {
      setLoading(true)
      const challengeData = await getChallenge(challengeId)
      
      if (!challengeData) {
        alert('Challenge not found!')
        onBack()
        return
      }

      setChallenge(challengeData)
      const leaderboardData = await getChallengeLeaderboard(challengeId)
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Failed to load challenge:', error)
      alert('Failed to load challenge')
      onBack()
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyLabel = (diff) => {
    const labels = {
      easy: '🟢 Easy (4×4)',
      medium: '🟡 Medium (5×6)',
      hard: '🔴 Hard (6×8)'
    }
    return labels[diff] || diff
  }

  if (loading) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <div>Loading challenge...</div>
      </div>
    )
  }

  return (
    <div className="panel">
      {/* Challenge Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,105,180,0.2))',
        borderRadius: '12px',
        border: '2px solid var(--accent)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Challenge by {challenge.creatorName}
        </h2>
        <div style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
          {getDifficultyLabel(challenge.difficulty)}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          fontSize: '1.1rem'
        }}>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Target Moves</div>
            <div style={{ fontWeight: 800, color: 'var(--accent)' }}>
              {challenge.creatorMoves}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Target Time</div>
            <div style={{ fontWeight: 800, color: 'var(--accent2)' }}>
              {formatTime(challenge.creatorTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            🏅 Leaderboard
          </h3>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: index < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  background: entry.isCreator ? 'rgba(255,215,0,0.1)' : 'transparent'
                }}
              >
                <div style={{
                  width: '2rem',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'var(--muted)'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1, fontWeight: 600 }}>
                  {entry.playerName}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--muted)'
                }}>
                  <div>
                    <span style={{ color: 'var(--accent)' }}>{entry.moves}</span> moves
                  </div>
                  <div>
                    <span style={{ color: 'var(--accent2)' }}>{formatTime(entry.time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          onClick={() => onStartChallenge(challenge)}
          style={{
            flex: 1,
            padding: '1.25rem',
            fontSize: '1.1rem',
            background: 'var(--accent)'
          }}
        >
          🎮 Start Challenge
        </Button>
        <Button
          onClick={onBack}
          variant="secondary"
          style={{ flex: 1 }}
        >
          Back
        </Button>
      </div>
    </div>
  )
}

export default ChallengeMode