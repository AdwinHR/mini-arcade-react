import React, { useState } from 'react'

const CHOICES = [
  { id: 'rock', emoji: '✊', label: 'ROCK' },
  { id: 'paper', emoji: '✋', label: 'PAPER' },
  { id: 'scissors', emoji: '✌️', label: 'SCISSORS' }
]

function ChoiceButtons({ onPlay, yourChoice, cpuChoice }) {
  const [clickedButton, setClickedButton] = useState(null)

  const handleClick = (choiceId, event) => {
    // Create ripple effect
    const button = event.currentTarget
    const ripple = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.className = 'ripple'
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)

    // Add clicked animation with specific action class
    setClickedButton(choiceId)
    
    // Call the game logic
    onPlay(choiceId)
    
    // Remove clicked class after animation
    setTimeout(() => {
      setClickedButton(null)
    }, 600)
  }

  return (
    <div className="rps-choices">
      {CHOICES.map(choice => (
        <button
          key={choice.id}
          className={`rps-btn 
            ${yourChoice === choice.id ? 'selected' : ''} 
            ${cpuChoice === choice.id ? 'cpu-selected' : ''}
            ${clickedButton === choice.id ? `clicked ${choice.id}-action` : ''}`}
          onClick={(e) => handleClick(choice.id, e)}
          aria-label={`Choose ${choice.label}`}
        >
          {choice.emoji}
          <span>{choice.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ChoiceButtons