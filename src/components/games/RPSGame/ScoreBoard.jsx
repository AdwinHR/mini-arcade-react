import React, { useEffect, useState } from 'react'

function ScoreBoard({ scores }) {
  const [updatedScore, setUpdatedScore] = useState(null)

  useEffect(() => {
    // Detect which score changed
    const prevScores = JSON.parse(sessionStorage.getItem('rpsScores') || '{"you":0,"cpu":0,"draw":0}')
    
    if (scores.you > prevScores.you) setUpdatedScore('you')
    else if (scores.cpu > prevScores.cpu) setUpdatedScore('cpu')
    else if (scores.draw > prevScores.draw) setUpdatedScore('draw')

    sessionStorage.setItem('rpsScores', JSON.stringify(scores))

    // Remove animation class after animation completes
    const timer = setTimeout(() => setUpdatedScore(null), 500)
    return () => clearTimeout(timer)
  }, [scores])

  return (
    <div className="score-row">
      <div className={`score-box ${updatedScore === 'you' ? 'updated' : ''}`}>
        <div className="val" style={{ color: 'var(--accent3)' }}>{scores.you}</div>
        <div className="lbl">YOU</div>
      </div>
      <div className={`score-box ${updatedScore === 'draw' ? 'updated' : ''}`}>
        <div className="val" style={{ color: 'var(--muted)' }}>{scores.draw}</div>
        <div className="lbl">DRAW</div>
      </div>
      <div className={`score-box ${updatedScore === 'cpu' ? 'updated' : ''}`}>
        <div className="val" style={{ color: 'var(--accent2)' }}>{scores.cpu}</div>
        <div className="lbl">CPU</div>
      </div>
    </div>
  )
}

export default ScoreBoard