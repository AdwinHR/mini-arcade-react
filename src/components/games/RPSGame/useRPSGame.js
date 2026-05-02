import { useState, useCallback } from 'react'

const RPS_EMOJI = { rock: '✊', paper: '✋', scissors: '✌️' }
const RPS_CHOICES = ['rock', 'paper', 'scissors']

function useRPSGame() {
  const [scores, setScores] = useState({ you: 0, cpu: 0, draw: 0 })
  const [result, setResult] = useState('')
  const [resultColor, setResultColor] = useState('')
  const [yourChoice, setYourChoice] = useState(null)
  const [cpuChoice, setCpuChoice] = useState(null)
  const [showVS, setShowVS] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const resetRPS = useCallback(() => {
    setScores({ you: 0, cpu: 0, draw: 0 })
    setResult('')
    setShowVS(false)
    setYourChoice(null)
    setCpuChoice(null)
    setIsAnimating(false)
  }, [])

  const determineWinner = useCallback((player, cpu) => {
    if (player === cpu) return 'draw'
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    }
    
    return winConditions[player] === cpu ? 'you' : 'cpu'
  }, [])

  const playRPS = useCallback((choice) => {
    if (isAnimating) return // Prevent multiple clicks during animation
    
    setIsAnimating(true)
    const cpu = RPS_CHOICES[Math.floor(Math.random() * 3)]
    
    // Set player choice immediately
    setYourChoice(choice)
    setCpuChoice(null)
    setShowVS(true)
    setResult('🎲 CPU is choosing...')
    setResultColor('var(--muted)')

    // Delay CPU choice for suspense
    setTimeout(() => {
      setCpuChoice(cpu)
      
      const winner = determineWinner(choice, cpu)
      const newScores = { ...scores }

      switch (winner) {
        case 'draw':
          setResult("🤝 It's a Draw!")
          setResultColor('var(--muted)')
          newScores.draw++
          break
        case 'you':
          setResult('🏆 You Win!')
          setResultColor('var(--accent3)')
          newScores.you++
          break
        case 'cpu':
          setResult('💀 CPU Wins!')
          setResultColor('var(--accent2)')
          newScores.cpu++
          break
        default:
          break
      }

      setScores(newScores)
      setIsAnimating(false)
    }, 800) // 800ms delay for CPU reveal
  }, [scores, determineWinner, isAnimating])

  return {
    scores,
    result,
    resultColor,
    yourChoice,
    cpuChoice,
    showVS,
    isAnimating,
    playRPS,
    resetRPS,
    RPS_EMOJI
  }
}

export default useRPSGame
export { RPS_EMOJI }