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
  const [showInstructions, setShowInstructions] = useState(false)

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

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <button
            className="btn"
            onClick={() => setShowInstructions(true)}
            style={{
              padding: '1rem',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              color: 'white',
              border: 'none'
            }}
          >
            📖 How to Play
          </button>
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

      {/* Instructions Modal */}
      {showInstructions && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '2px solid var(--accent)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                How to Play Memory Match
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', minWidth: '2rem' }}>1️⃣</div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Choose Your Difficulty</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Select from Practice (2×2), Easy (4×4), Medium (5×6), Hard (8×8), or create your own custom grid.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', minWidth: '2rem' }}>2️⃣</div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Memorize the Cards</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Click any card to flip it and reveal the emoji. Try to remember where each emoji is located.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', minWidth: '2rem' }}>3️⃣</div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Find Matching Pairs</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Click two cards to find matching pairs. If they match, they stay revealed. If not, they flip back.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', minWidth: '2rem' }}>4️⃣</div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Complete the Game</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Find all matching pairs to win! Try to complete the game in as few moves and as little time as possible.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', minWidth: '2rem' }}>🏆</div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Challenge Mode</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Create challenges for friends or beat their scores! Share your challenge URL and compete on the leaderboard.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center' }}>💡 Pro Tips</h4>
              <ul style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0, paddingLeft: '1.5rem' }}>
                <li>Start with the corners and edges - they're easier to remember</li>
                <li>Group similar emojis together in your mind</li>
                <li>Take your time - speed comes with practice</li>
                <li>Use the sound effects to help remember matches</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowInstructions(false)}
                style={{ flex: 1 }}
              >
                Got it! Let's Play 🎮
              </button>
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  )
}