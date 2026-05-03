import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from './Navigation'
import GameCard from './GameCard'
import AdBanner from './AdBanner'
import PremiumFeatures from './PremiumFeatures'

const DEBUG = true;
const log = (...args) => {
  if (DEBUG) console.log('[HOME]', ...args);
};

function Home() {
  const navigate = useNavigate()

  log('Home component rendering');

  const handleGameSelect = (gameId) => {
    log('Game selected:', gameId);
    navigate(`/${gameId}`)
  }
  const games = [
    {
      id: 'guess',
      title: '🎯 Guess the Number',
      description: 'Pick a range and guess the secret number. Single or two-player modes!',
      color: 'var(--accent)'
    },
    {
      id: 'rps',
      title: '✊ Rock Paper Scissors',
      description: 'Classic game against the computer. Best of unlimited rounds!',
      color: 'var(--accent2)'
    },
    {
      id: 'memorycards',
      title: '🃏 Memory Cards',
      description: 'Flip and match pairs. Multiple difficulty levels and custom grids!',
      color: 'var(--accent3)'
    }
  ]
  return (
    <div className="app-container">
      <Navigation />
      
      <div className="content-wrapper">
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-emoji">🕹️</span>
            Mini Arcade
          </h1>
          <p className="app-subtitle">
            // three classic games, endless fun
          </p>
        </header>

        <AdBanner slot="home-top" />

        <div className="games-grid">
          {games.map(game => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              color={game.color}
              onClick={() => handleGameSelect(game.id)}
            />
          ))}
        </div>

        <PremiumFeatures />

        <AdBanner slot="home-bottom" />

        <footer className="app-footer">
          <p>Built with React + Vite</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            © 2024 Mini Arcade • All games free to play
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Home