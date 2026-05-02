import React from 'react'
import MemoryCard from './MemoryCard'

function MemoryGrid({ cards, flipped, onFlip }) {
  return (
    <div className="mem-grid">
      {cards.map((card, i) => (
        <MemoryCard
          key={card.id}
          card={card}
          index={i}
          isFlipped={flipped.includes(i)}
          onFlip={onFlip}
        />
      ))}
    </div>
  )
}

export default MemoryGrid