import React, { useState, useEffect } from 'react'
import GameLayout from '../../ui/GameLayout'
import { soundEffects } from '../../../utils/sounds'
import Button from '../../ui/Button'

// Emoji sets for different difficulties
const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺']
const emojisMedium = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎹', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶']
const emojisHard = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎹', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎻']
const emojisExpert = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎹', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎻', '🎷', '🥁', '🎪', '🎨', '🎭', '🎸', '🎺', '🎹']

const difficulties = {
  easy: { name: 'Easy', grid: '4x4', pairs: 8, emojis: emojis, cols: 4 },
  medium: { name: 'Medium', grid: '5x6', pairs: 15, emojis: emojisMedium, cols: 5 },
  hard: { name: 'Hard', grid: '4x8', pairs: 16, emojis: emojisHard, cols: 4 },
  expert: { name: 'Expert', grid: '6x8', pairs: 24, emojis: emojisExpert, cols: 6 }
}

function MemoryGame() {
  const [difficulty, setDifficulty] = useState('easy')
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [showSettings, setShowSettings] = useState(true)

  // Unlock audio on component mount
  useEffect(() => {
    soundEffects.unlock()
  }, [])

  // Timer
  useEffect(() => {
    let interval
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameWon])

  // Check for win
  useEffect(() => {
    const currentDiff = difficulties[difficulty]
    if (matched.length === currentDiff.pairs * 2 && cards.length > 0) {
      setGameWon(true)
      setIsPlaying(false)
      soundEffects.memoryWin()
    }
  }, [matched, cards, difficulty])

  const initGame = (diff = difficulty) => {
    const currentDiff = difficulties[diff]
    const shuffled = [...currentDiff.emojis, ...currentDiff.emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
    
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTimer(0)
    setGameWon(false)
    setIsPlaying(false)
    setShowSettings(false)
  }

  const handleCardClick = async (id) => {
    // Unlock audio on first click
    await soundEffects.unlock()
    
    // Start timer on first move
    if (!isPlaying) {
      setIsPlaying(true)
    }
    
    if (flipped.length === 2) return
    if (flipped.includes(id)) return
    if (matched.includes(id)) return

    soundEffects.memoryFlip()
    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      if (firstCard.emoji === secondCard.emoji) {
        soundEffects.memoryMatch()
        setMatched(m => [...m, first, second])
        setFlipped([])
      } else {
        soundEffects.memoryMismatch()
        setTimeout(() => {
          setFlipped([])
        }, 800)
      }
    }
  }

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff)
    initGame(diff)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (showSettings) {
    return (
      <GameLayout 
        title="🧠 Memory Match" 
        subtitle="// choose your difficulty level"
      >
        <div className="panel">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
            Select Difficulty
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(difficulties).map(([key, diff]) => (
              <button
                key={key}
                onClick={() => handleDifficultyChange(key)}
                style={{
                  padding: '1.5rem',
                  background: 'var(--surface2)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {diff.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {diff.grid} grid • {diff.pairs} pairs
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>
                    {key === 'easy' && '😊'}
                    {key === 'medium' && '🤔'}
                    {key === 'hard' && '😰'}
                    {key === 'expert' && '🤯'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="panel" style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
            💡 How to Play
          </h3>
          <ul style={{ 
            fontSize: '.9rem', 
            color: 'var(--muted)', 
            lineHeight: '1.8',
            paddingLeft: '20px'
          }}>
            <li>Click cards to flip them over</li>
            <li>Find matching pairs of emojis</li>
            <li>Try to complete in as few moves as possible</li>
            <li>Beat your best time!</li>
          </ul>
        </div>
      </GameLayout>
    )
  }

  const currentDiff = difficulties[difficulty]

  return (
    <GameLayout 
      title="🧠 Memory Match" 
      subtitle={`// ${currentDiff.name} - ${currentDiff.grid}`}
    >
      <div className="panel">
        {/* Stats */}
        <div className="mem-stats">
          <div className="stat-box">
            <strong>{moves}</strong>
            Moves
          </div>
          <div className="stat-box">
            <strong>{formatTime(timer)}</strong>
            Time
          </div>
          <div className="stat-box">
            <strong>{matched.length / 2}/{currentDiff.pairs}</strong>
            Pairs
          </div>
        </div>

        {/* Game Grid */}
        <div 
          className="mem-grid" 
          style={{ 
            gridTemplateColumns: `repeat(${currentDiff.cols}, 1fr)`,
            marginBottom: '1rem'
          }}
        >
          {cards.map(card => (
            <div
              key={card.id}
              className={`mem-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="mem-card-inner">
                <div className="mem-card-front">
                  <span className="card-back-icon">❓</span>
                </div>
                <div className="mem-card-back">
                  {card.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Button 
            onClick={() => initGame()} 
            variant="ghost"
            ariaLabel="Restart game"
          >
            🔄 Restart
          </Button>
          <Button 
            onClick={() => setShowSettings(true)} 
            variant="ghost"
            ariaLabel="Change difficulty"
          >
            ⚙️ Settings
          </Button>
        </div>
      </div>

      {/* Win Banner */}
      <div className={`win-banner ${gameWon ? 'show' : ''}`}>
        <h3>🎉 You Won!</h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {currentDiff.name} Mode
        </p>
        <p>
          {moves} moves • {formatTime(timer)}
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Button onClick={() => initGame()} ariaLabel="Play again">
            Play Again
          </Button>
          <Button onClick={() => setShowSettings(true)} variant="ghost" ariaLabel="Change difficulty">
            Change Difficulty
          </Button>
        </div>
      </div>
    </GameLayout>
  )
}

export default MemoryGame