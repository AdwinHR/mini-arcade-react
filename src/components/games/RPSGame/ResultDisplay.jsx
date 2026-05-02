import React, { useEffect, useState } from 'react'

function ResultDisplay({ result, resultColor }) {
  const [resultClass, setResultClass] = useState('')

  useEffect(() => {
    if (result) {
      // Determine result type for animation
      if (result.includes('Win')) {
        setResultClass('win')
      } else if (result.includes('CPU Wins')) {
        setResultClass('lose')
      } else if (result.includes('Draw')) {
        setResultClass('draw')
      } else {
        setResultClass('')
      }
    }
  }, [result])

  if (!result) return null
  return (
    <div 
      className={`rps-result ${resultClass}`}
      style={{ 
        fontSize: '1.4rem', 
        fontWeight: 800, 
        textAlign: 'center', 
        margin: '20px 0',
        color: resultColor,
        textShadow: resultClass === 'win' ? '0 0 20px rgba(107,255,200,.5)' : 'none'
      }}
    >
      {result}
    </div>
  )
}

export default ResultDisplay