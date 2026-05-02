import React from 'react'

function Navigation({ currentView, goHome }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        🕹️ <span>ARCADE</span>
      </div>
      <button 
        className={`nav-back ${currentView !== 'home' ? 'visible' : ''}`}
        onClick={goHome}
        aria-label="Go back to home"
      >
        ← All Games
      </button>
    </nav>
  )
}

export default Navigation