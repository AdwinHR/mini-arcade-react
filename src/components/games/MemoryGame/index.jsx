import MemoryGameBoard from './MemoryGameBoard'
import { useParams, useNavigate } from 'react-router-dom'
import ChallengeMode from './ChallengeMode'
import React, { useState, useEffect } from 'react'
import GameLayout from '../../ui/GameLayout'
import ShareChallengeModal from './ShareChallengeModal'

export default function MemoryGame({ onBack }) {
  const { challengeId } = useParams()
  const navigate = useNavigate()
  
  const [gameState, setGameState] = useState('menu') // menu, playing, challenge, share, custom
  const [difficulty, setDifficulty] = useState('easy')
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [completedGame, setCompletedGame] = useState(null)
  const [customRows, setCustomRows] = useState(4)
  const [customCols, setCustomCols] = useState(4)

  useEffect(() => {
    // Handle challenge URL
    if (challengeId) {
      setGameState('challenge')
    }
  }, [challengeId])

  const handleStartGame = (selectedDifficulty) => {
    if (selectedDifficulty === 'custom') {
      setGameState('custom')
    } else {
      setDifficulty(selectedDifficulty)
      setGameState('playing')
      setCurrentChallenge(null)
    }
  }

  const handleStartCustomGame = () => {
    setDifficulty('custom')
    setGameState('playing')
    setCurrentChallenge(null)
  }

  const handleStartChallenge = (challenge) => {
    setCurrentChallenge(challenge)
    setDifficulty(challenge.difficulty)
    setGameState('playing')
  }

  const handleGameComplete = (moves, time) => {
    setCompletedGame({ moves, time, difficulty })
    setGameState('share')
  }

  const handleBackToMenu = () => {
    setGameState('menu')
    setCurrentChallenge(null)
    setCompletedGame(null)
    navigate('/memorycards')
  }

  const handleChallengeCreated = (newChallengeId) => {
    // Don't navigate immediately - let user see the URL first
    console.log('Challenge created, staying on share screen:', newChallengeId)
  }

  const handleBackFromChallenge = () => {
    navigate('/memorycards')
    handleBackToMenu()
  }

  if (gameState === 'challenge') {
    return (
      <GameLayout title="Memory Match" onBack={onBack}>
        <ChallengeMode
          challengeId={challengeId}
          onBack={handleBackFromChallenge}
          onStartChallenge={handleStartChallenge}
        />
      </GameLayout>
    )
  }

  if (gameState === 'custom') {
    return (
      <GameLayout title="Memory Match" onBack={onBack}>
        <div className="panel">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Custom Grid Size
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Choose your grid size (up to 8×8)
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '.85rem', 
                color: 'var(--muted)', 
                marginBottom: '8px',
                fontFamily: 'DM Mono, monospace'
              }}>
                Rows (2-8)
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={customRows}
                onChange={(e) => setCustomRows(Math.min(8, Math.max(2, parseInt(e.target.value) || 2)))}
                style={{ 
                  width: '100%', 
                  fontSize: '1rem', 
                  padding: '12px', 
                  borderRadius: '8px',
                  border: '2px solid var(--accent)',
                  background: 'var(--surface)',
                  color: 'white'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '.85rem', 
                color: 'var(--muted)', 
                marginBottom: '8px',
                fontFamily: 'DM Mono, monospace'
              }}>
                Columns (2-8)
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={customCols}
                onChange={(e) => setCustomCols(Math.min(8, Math.max(2, parseInt(e.target.value) || 2)))}
                style={{ 
                  width: '100%', 
                  fontSize: '1rem', 
                  padding: '12px', 
                  borderRadius: '8px',
                  border: '2px solid var(--accent)',
                  background: 'var(--surface)',
                  color: 'white'
                }}
              />
            </div>

            <div style={{
              padding: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Grid Size: {customRows}×{customCols}
              </div>
              <div style={{ color: 'var(--muted)' }}>
                Total Cards: {customRows * customCols} ({(customRows * customCols) / 2} pairs)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleStartCustomGame}
              style={{ flex: 1 }}
            >
              🎮 Start Game
            </button>
            <button
              className="btn"
              onClick={handleBackToMenu}
              style={{ flex: 1 }}
            >
              ← Back
            </button>
          </div>
        </div>
      </GameLayout>
    )
  }

  if (gameState === 'share') {
    return (
      <GameLayout title="Memory Match" onBack={onBack}>
        <ShareChallengeModal
          moves={completedGame.moves}
          time={completedGame.time}
          difficulty={completedGame.difficulty}
          onClose={handleBackToMenu}
          onChallengeCreated={handleChallengeCreated}
        />
      </GameLayout>
    )
  }

  if (gameState === 'playing') {
    return (
      <GameLayout title="Memory Match" onBack={handleBackToMenu}>
        <MemoryGameBoard
          difficulty={difficulty}
          customRows={difficulty === 'custom' ? customRows : undefined}
          customCols={difficulty === 'custom' ? customCols : undefined}
          onBack={handleBackToMenu}
          onComplete={handleGameComplete}
          challenge={currentChallenge}
        />
      </GameLayout>
    )
  }

  // Menu
  return (
    <GameLayout title="Memory Match" onBack={onBack}>
      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧠</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Memory Match
          </h2>
          <p style={{ color: 'var(--muted)' }}>
            Find all matching pairs!
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <button
            className="btn"
            onClick={() => handleStartGame('practice')}
            style={{
              padding: '1.5rem',
              fontSize: '1.1rem',
              background: 'var(--success)',
              color: 'white'
            }}
          >
            🟢 Practice (2×2)
          </button>

          <button
            className="btn btn-primary"
            onClick={() => handleStartGame('easy')}
            style={{
              padding: '1.5rem',
              fontSize: '1.1rem'
            }}
          >
            � Easy (4×4)
          </button>

          <button
            className="btn"
            onClick={() => handleStartGame('medium')}
            style={{
              padding: '1.5rem',
              fontSize: '1.1rem',
              background: 'var(--accent2)',
              color: 'white'
            }}
          >
            � Medium (5×6)
          </button>

          <button
            className="btn"
            onClick={() => handleStartGame('hard')}
            style={{
              padding: '1.5rem',
              fontSize: '1.1rem',
              background: 'var(--error)',
              color: 'white'
            }}
          >
            🔴 Hard (8×8)
          </button>

          <button
            className="btn"
            onClick={() => handleStartGame('custom')}
            style={{
              padding: '1.5rem',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              color: 'white'
            }}
          >
            ⚙️ Custom (up to 8×8)
          </button>
        </div>
      </div>
    </GameLayout>
  )
}