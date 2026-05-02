import React from 'react'

function MemoryCard({ card, index, isFlipped, onFlip }) {
  const handleClick = () => {
    onFlip(index)
  }

  return (
    <div
      className={`mem-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Memory card ${index + 1}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
    >
      <div className="mem-card-inner">
        <div className="mem-card-front">
          <span className="card-back-icon">❓</span>
        </div>
        <div className="mem-card-back">{card.emoji}</div>
      </div>
    </div>
  )
}

export default MemoryCard