import React from 'react'

function GameCard({ game, onPlay }) {
  return (
    <div className="card" onClick={onPlay}>
      <div className="card-emoji">{game.emoji}</div>
      <div className="card-title">{game.title}</div>
      <div className="card-desc">{game.description}</div>
      <button className="card-btn" aria-label={`Play ${game.title}`}>
        Play Now →
      </button>
    </div>
  )
}

export default GameCard