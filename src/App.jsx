import React, { useState, useEffect } from 'react'
import './styles/index.css'
import Navigation from './components/Navigation'
import Home from './components/Home'
import GuessGame from './components/games/GuessGame'
import RPSGame from './components/games/RPSGame'
import MemoryGame from './components/games/MemoryGame'
import AdBanner from './components/AdBanner'
import { trackPageView, trackGamePlay } from './utils/analytics.js'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const showGame = (gameId) => {
    setCurrentView(gameId)
    trackGamePlay(gameId)
  }

  const goHome = () => {
    setCurrentView('home')
  }

  useEffect(() => {
    trackPageView(currentView === 'home' ? 'home' : `game_${currentView}`)
  }, [currentView])

  return (
    <div className="app">
      <AdBanner adSlot="1234567890" className="top-ad" />
      <Navigation currentView={currentView} goHome={goHome} />
      
      {currentView === 'home' && <Home showGame={showGame} />}
      {currentView === 'guess' && <GuessGame />}
      {currentView === 'rps' && <RPSGame />}
      {currentView === 'memory' && <MemoryGame />}
      
      <AdBanner adSlot="0987654321" className="bottom-ad" />
    </div>
  )
}

export default App