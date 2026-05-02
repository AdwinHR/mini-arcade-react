import React from 'react'
import GameCard from './GameCard'
import PremiumFeatures from './PremiumFeatures'

const GAMES = [
  {
    id: 'guess',
    emoji: '🎯',
    title: 'Guess the Number',
    description: 'Pick a number between 1–100. The game tells you hot or cold. How few guesses can you do it in?'
  },
  {
    id: 'rps',
    emoji: '✊',
    title: 'Rock Paper Scissors',
    description: 'The classic showdown against a machine that never tilts. Rock, paper, scissors — who wins?'
  },
  {
    id: 'memory',
    emoji: '🃏',
    title: 'Memory Cards',
    description: 'Flip a 4×4 grid to find matching pairs. Beat your personal best on moves and time!'
  }
]

function Home({ showGame }) {
  return (
    <div id="home">
      <div className="hero">
        <h1>Mini <em>Arcade</em></h1>
        <p>// three games · no downloads · pure fun</p>
      </div>
      <div className="grid">
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onPlay={() => showGame(game.id)}
          />
        ))}
      </div>
      <PremiumFeatures />
    </div>
  )
}

export default Home