import React, { useEffect, useState } from 'react'
import { RPS_EMOJI } from './useRPSGame'

function VSDisplay({ yourChoice, cpuChoice }) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (yourChoice || cpuChoice) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [yourChoice, cpuChoice])

  return (
    <div className={`rps-vs ${isActive ? 'active' : ''}`}>
      <div className={`rps-pick ${yourChoice ? 'reveal' : ''}`}>
        <span className="emoji">{yourChoice ? RPS_EMOJI[yourChoice] : '❓'}</span>
        <div className="label">YOU</div>
      </div>
      <div className="rps-divider">VS</div>
      <div className={`rps-pick ${cpuChoice ? 'reveal' : 'thinking'}`}>
        <span className="emoji">{cpuChoice ? RPS_EMOJI[cpuChoice] : '❓'}</span>
        <div className="label">CPU</div>
      </div>
    </div>
  )
}

export default VSDisplay