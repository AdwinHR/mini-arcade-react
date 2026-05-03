import React from 'react'

function GameCard({ emoji, title, description, path, color, onClick }) {
  return (
    <div 
      className="card"
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div 
        className="card-icon"
        style={{ 
          fontSize: '3rem',
          marginBottom: '1rem'
        }}
      >
        {emoji}
      </div>
      <h3 
        className="card-title"
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          color: color || 'var(--accent)'
        }}
      >
        {title}
      </h3>
      <p 
        className="card-desc"
        style={{
          color: 'var(--muted)',
          fontSize: '0.95rem',
          lineHeight: 1.5
        }}
      >
        {description}
      </p>
    </div>
  )
}

export default GameCard