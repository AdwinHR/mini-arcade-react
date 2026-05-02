import React from 'react'
import GameLayout from '../../ui/GameLayout'
import useGuessGame from './useGuessGame'
import GuessSettings from './GuessSettings'
import GuessPanel from './GuessPanel'
import GuessHistory from './GuessHistory'
import TwoPlayerPanel from './TwoPlayerPanel'

function GuessGame() {
  const gameState = useGuessGame()

  return (
    <GameLayout 
      title="🎯 Guess the Number" 
      subtitle="// configure your challenge and start guessing"
    >
      {!gameState.gameStarted ? (
        <GuessSettings 
          settings={gameState.settings}
          onSettingChange={gameState.updateSetting}
          onStartGame={gameState.startGame}
        />
      ) : gameState.settings.gameMode === 'single-player' ? (
        <>
          <GuessPanel {...gameState} />
          {gameState.settings.showHistory && <GuessHistory history={gameState.history} settings={gameState.settings} />}
        </>
      ) : (
        <>
          <TwoPlayerPanel {...gameState} />
          {gameState.settings.showHistory && <GuessHistory history={gameState.history} settings={gameState.settings} />}
        </>
      )}
    </GameLayout>
  )
}

export default GuessGame