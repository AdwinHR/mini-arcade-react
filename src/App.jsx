import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import GuessGame from './components/games/GuessGame'
import RPSGame from './components/games/RPSGame'
import MemoryGame from './components/games/MemoryGame'

const DEBUG = true;
const log = (...args) => {
  if (DEBUG) console.log('[APP]', ...args);
};

function App() {
  log('App component rendering');

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guess" element={<GuessGame />} />
      <Route path="/rps" element={<RPSGame />} />
      <Route path="/memorycards" element={<MemoryGame />} />
      <Route path="/memorycards/challenge/:challengeId" element={<MemoryGame />} />
    </Routes>
  )
}

export default App