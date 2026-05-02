import React from 'react'

function MemoryStats({ moves, timeStr, matched }) {
  return (
    <div className="mem-stats">
      <div className="stat-box">
        <strong>{moves}</strong>
        Moves
      </div>
      <div className="stat-box">
        <strong>{timeStr}</strong>
        Time
      </div>
      <div className="stat-box">
        <strong>{matched}/8</strong>
        Pairs
      </div>
    </div>
  )
}

export default MemoryStats