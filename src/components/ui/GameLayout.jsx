import React from 'react'

function GameLayout({ title, subtitle, children }) {
  return (
    <div className="game-view active">
      <div className="game-title">{title}</div>
      <div className="game-subtitle">{subtitle}</div>
      {children}
    </div>
  )
}

export default GameLayout