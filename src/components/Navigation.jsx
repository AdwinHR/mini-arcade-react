import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navigation({ isHome, onNavigate }) {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }
  return (
    <nav className="nav">
      <div 
        className="nav-logo" 
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      >
        🕹️ <span>ARCADE</span>
      </div>
      {!isHome && (
        <button 
          className="nav-back visible"
          onClick={onNavigate}
        >
          ← All Games
        </button>
      )}
    </nav>
  )
}

export default Navigation