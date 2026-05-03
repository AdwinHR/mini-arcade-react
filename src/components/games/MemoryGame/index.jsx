import MemoryGameBoard from './MemoryGameBoard'
import { useParams, useNavigate } from 'react-router-dom'
import ChallengeMode from './ChallengeMode'
import React, { useState, useEffect } from 'react'
import GameLayout from '../../ui/GameLayout'
import ShareChallengeModal from './ShareChallengeModal'

export default function MemoryGame({ onBack }) {
  const { challengeId } = useParams()
  const navigate = useNavigate()
  
  const [gameState, setGameState] = useState('menu') // menu, playing, challenge, share
  const [difficulty, setDifficulty] = useState('easy')
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [completedGame, setCompletedGame] = useState(null)

  useEffect(() => {
    // Handle challenge URL
    if (challengeId) {
      setGameState('challenge')
    }
  }, [challengeId])

  const handleStartGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty)
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
            className="btn btn-primary"
            onClick={() => handleStartGame('easy')}
            style={{
              padding: '1.5rem',
              fontSize: '1.1rem'
            }}
          >
            🟢 Easy (4×4)
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
            🟡 Medium (6×6)
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
        </div>
      </div>
    </GameLayout>
  )
}