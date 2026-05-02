import React, { useState, useEffect } from 'react'
import GameLayout from '../../ui/GameLayout'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'
import { soundEffects } from '../../../utils/sounds'

const choices = ['rock', 'paper', 'scissors']
const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' }

function RPSGame() {
  const [playerChoice, setPlayerChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 })
  const [isAnimating, setIsAnimating] = useState(false)

  // Unlock audio on component mount
  useEffect(() => {
    soundEffects.unlock()
  }, [])

  const determineWinner = (player, computer) => {
    if (player === computer) return 'draw'
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win'
    }
    return 'lose'
  }

  const handleChoice = async (choice) => {
    if (isAnimating) return

    // Unlock audio on first click
    await soundEffects.unlock()
    soundEffects.rpsSelect()
    
    setIsAnimating(true)
    setPlayerChoice(choice)
    setComputerChoice(null)
    setResult(null)

    // Animate computer thinking
    setTimeout(() => {
      const compChoice = choices[Math.floor(Math.random() * choices.length)]
      setComputerChoice(compChoice)

      const outcome = determineWinner(choice, compChoice)
      setResult(outcome)

      // Play appropriate sound
      if (outcome === 'win') {
        soundEffects.rpsWin()
        setScore(prev => ({ ...prev, player: prev.player + 1 }))
      } else if (outcome === 'lose') {
        soundEffects.rpsLose()
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
      } else {
        soundEffects.rpsDraw()
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }))
      }

      setIsAnimating(false)
    }, 800)
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
    setScore({ player: 0, computer: 0, draws: 0 })
  }

  const getResultMessage = () => {
    if (!result) return ''
    if (result === 'win') return '🎉 You Win!'
    if (result === 'lose') return '😢 You Lose!'
    return '🤝 Draw!'
  }

  const getResultClass = () => {
    if (!result) return ''
    if (result === 'win') return 'feedback-win'
    if (result === 'lose') return 'feedback-error'
    return 'feedback-high'
  }

  return (
    <GameLayout 
      title="🪨📄✂️ Rock Paper Scissors" 
      subtitle="// choose your weapon and battle the computer"
    >
      <div className="panel">
        {/* Score Board */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '12px', 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{ 
            padding: '16px', 
            background: 'var(--surface2)', 
            borderRadius: '10px',
            border: '2px solid var(--accent)'
          }}>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: '4px' }}>You</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
              {score.player}
            </div>
          </div>
          
          <div style={{ 
            padding: '16px', 
            background: 'var(--surface2)', 
            borderRadius: '10px',
            border: '2px solid var(--border)'
          }}>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: '4px' }}>Draws</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
              {score.draws}
            </div>
          </div>

          <div style={{ 
            padding: '16px', 
            background: 'var(--surface2)', 
            borderRadius: '10px',
            border: '2px solid var(--accent2)'
          }}>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: '4px' }}>Computer</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent2)' }}>
              {score.computer}
            </div>
          </div>
        </div>

        {/* Battle Area */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          gap: '16px', 
          alignItems: 'center',
          marginBottom: '24px',
          minHeight: '120px'
        }}>
          {/* Player Choice */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '8px' }}>
              Your Choice
            </div>
            <div style={{ 
              fontSize: '4rem', 
              animation: playerChoice && isAnimating ? 'bounce 0.5s ease' : 'none'
            }}>
              {playerChoice ? emojis[playerChoice] : '❓'}
            </div>
          </div>

          {/* VS */}
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: 'var(--muted)',
            fontFamily: 'DM Mono, monospace'
          }}>
            VS
          </div>

          {/* Computer Choice */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '8px' }}>
              Computer
            </div>
            <div style={{ 
              fontSize: '4rem',
              animation: computerChoice ? 'bounce 0.5s ease' : isAnimating ? 'pulse 0.5s ease infinite' : 'none'
            }}>
              {computerChoice ? emojis[computerChoice] : '❓'}
            </div>
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <div className={getResultClass()} style={{ 
            marginBottom: '24px', 
            fontSize: '1.5rem', 
            fontWeight: 800,
            textAlign: 'center',
            padding: '16px',
            borderRadius: '10px'
          }}>
            {getResultMessage()}
          </div>
        )}

        {/* Choice Buttons */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            fontSize: '.9rem', 
            color: 'var(--muted)', 
            marginBottom: '12px',
            textAlign: 'center',
            fontFamily: 'DM Mono, monospace'
          }}>
            Choose your weapon:
          </div>
          <div className="rps-choices">
            {choices.map(choice => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                disabled={isAnimating}
                className="rps-choice-btn"
                style={{
                  flex: 1,
                  padding: '20px',
                  fontSize: '3rem',
                  background: playerChoice === choice ? 'var(--accent)' : 'var(--surface2)',
                  border: `2px solid ${playerChoice === choice ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isAnimating ? 0.6 : 1,
                  transform: playerChoice === choice ? 'scale(1.05)' : 'scale(1)'
                }}
                aria-label={`Choose ${choice}`}
              >
                {emojis[choice]}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button 
          variant="ghost" 
          onClick={resetGame}
          style={{ width: '100%' }}
          ariaLabel="Reset game"
        >
          Reset Score
        </Button>
      </div>

      {/* Game Rules */}
      <div className="panel" style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
          📋 Rules
        </h3>
        <ul style={{ 
          fontSize: '.9rem', 
          color: 'var(--muted)', 
          lineHeight: '1.8',
          paddingLeft: '20px'
        }}>
          <li>🪨 Rock crushes Scissors</li>
          <li>📄 Paper covers Rock</li>
          <li>✂️ Scissors cuts Paper</li>
        </ul>
      </div>
    </GameLayout>
  )
}

export default RPSGame