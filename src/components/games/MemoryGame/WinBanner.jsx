import React from 'react'
import Button from '../../ui/Button'

function WinBanner({ moves, timeStr, onPlayAgain }) {
  return (
    <div className="win-banner show">
      <h3>🎉 You Won!</h3>
      <p>Completed in {moves} moves and {timeStr}</p>
      <Button 
        style={{ marginTop: '16px' }} 
        onClick={onPlayAgain}
        ariaLabel="Play again"
      >
        Play Again
      </Button>
    </div>
  )
}

export default WinBanner