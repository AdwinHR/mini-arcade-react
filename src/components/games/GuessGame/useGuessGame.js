import { useState, useRef, useCallback } from 'react'
import { soundEffects } from '../../../utils/sounds'

const DEFAULT_SETTINGS = {
  minRange: 1,
  maxRange: 100,
  customRange: false,
  showRange: true,
  showRangeBar: true,
  showHistory: true,
  showAttempts: true,
  gameMode: 'single-player',
  player1Name: 'Player 1',
  player2Name: 'Player 2'
}

function useGuessGame() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [gameStarted, setGameStarted] = useState(false)
  const [secret, setSecret] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [lo, setLo] = useState(1)
  const [hi, setHi] = useState(100)
  const [feedback, setFeedback] = useState('')
  const [feedbackClass, setFeedbackClass] = useState('')
  const [history, setHistory] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  // Two-player specific state
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [player1Attempts, setPlayer1Attempts] = useState(0)
  const [player2Attempts, setPlayer2Attempts] = useState(0)
  const [player1Lo, setPlayer1Lo] = useState(1)
  const [player1Hi, setPlayer1Hi] = useState(100)
  const [player2Lo, setPlayer2Lo] = useState(1)
  const [player2Hi, setPlayer2Hi] = useState(100)
  const [winner, setWinner] = useState(null)
  
  // Couple mode specific state - each player sets a number for the other
  const [coupleSetupPhase, setCoupleSetupPhase] = useState(true)
  const [player1Secret, setPlayer1Secret] = useState(null) // Number Player 1 sets for Player 2
  const [player2Secret, setPlayer2Secret] = useState(null) // Number Player 2 sets for Player 1
  const [setupStep, setSetupStep] = useState(1) // 1 = P1 sets, 2 = P2 sets

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const startGame = useCallback(() => {
    if (settings.gameMode === 'couple') {
      // In couple mode, start with setup phase
      setCoupleSetupPhase(true)
      setSetupStep(1)
      setPlayer1Secret(null)
      setPlayer2Secret(null)
      setSecret(null)
    } else {
      // For other modes, generate random number
      const randomNum = Math.floor(
        Math.random() * (settings.maxRange - settings.minRange + 1)
      ) + settings.minRange
      setSecret(randomNum)
      setCoupleSetupPhase(false)
    }
    
    setLo(settings.minRange)
    setHi(settings.maxRange)
    setPlayer1Lo(settings.minRange)
    setPlayer1Hi(settings.maxRange)
    setPlayer2Lo(settings.minRange)
    setPlayer2Hi(settings.maxRange)
    setGameStarted(true)
    setAttempts(0)
    setPlayer1Attempts(0)
    setPlayer2Attempts(0)
    setCurrentPlayer(1)
    setHistory([])
    setFeedback('')
    setFeedbackClass('')
    setDisabled(false)
    setWinner(null)
  }, [settings.minRange, settings.maxRange, settings.gameMode])

  const setSecretNumber = useCallback(() => {
    const val = parseInt(inputRef.current?.value)
    
    if (isNaN(val) || val < settings.minRange || val > settings.maxRange) {
      soundEffects.guessWrong()
      setFeedback(`⚠️ Enter a number between ${settings.minRange} and ${settings.maxRange}`)
      setFeedbackClass('feedback-error')
      return
    }

    if (setupStep === 1) {
      // Player 1 sets number for Player 2 to guess
      setPlayer1Secret(val)
      setSetupStep(2)
      setFeedback(`✅ ${settings.player1Name} set their number! Now ${settings.player2Name}, set yours...`)
      setFeedbackClass('feedback-win')
    } else {
      // Player 2 sets number for Player 1 to guess
      setPlayer2Secret(val)
      setCoupleSetupPhase(false)
      setCurrentPlayer(1) // Player 1 starts guessing
      setFeedback(`🎮 Both numbers set! ${settings.player1Name}, start guessing!`)
      setFeedbackClass('feedback-win')
    }
    
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [setupStep, settings])

  const resetGuess = useCallback(() => {
    setGameStarted(false)
    setSecret(null)
    setAttempts(0)
    setPlayer1Attempts(0)
    setPlayer2Attempts(0)
    setCurrentPlayer(1)
    setLo(settings.minRange)
    setHi(settings.maxRange)
    setPlayer1Lo(settings.minRange)
    setPlayer1Hi(settings.maxRange)
    setPlayer2Lo(settings.minRange)
    setPlayer2Hi(settings.maxRange)
    setFeedback('')
    setFeedbackClass('')
    setHistory([])
    setDisabled(false)
    setWinner(null)
    setCoupleSetupPhase(true)
    setPlayer1Secret(null)
    setPlayer2Secret(null)
    setSetupStep(1)
    if (inputRef.current) inputRef.current.value = ''
  }, [settings.minRange, settings.maxRange])

  const triggerShake = useCallback(() => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }, [])

  const submitGuess = useCallback(() => {
    const val = parseInt(inputRef.current?.value)
    
    if (isNaN(val) || val < settings.minRange || val > settings.maxRange) {
      triggerShake()
      soundEffects.guessWrong()
      setFeedback(`⚠️ Enter a number between ${settings.minRange} and ${settings.maxRange}`)
      setFeedbackClass('feedback-error')
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    setHistory(prev => [...prev, { num: newAttempts, val }])

    if (val === secret) {
      soundEffects.guessCorrect()
      setFeedback(`🎉 Correct! It was ${secret}! (${newAttempts} ${newAttempts === 1 ? 'attempt' : 'attempts'})`)
      setFeedbackClass('feedback-win')
      setDisabled(true)
    } else if (val > secret) {
      soundEffects.guessHigh()
      setFeedback('⬇️  Too High!')
      setFeedbackClass('feedback-high')
      setHi(Math.min(hi, val - 1))
      triggerShake()
    } else {
      soundEffects.guessLow()
      setFeedback('⬆️  Too Low!')
      setFeedbackClass('feedback-low')
      setLo(Math.max(lo, val + 1))
      triggerShake()
    }

    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }, [attempts, secret, hi, lo, settings.minRange, settings.maxRange, triggerShake])

  const submitTwoPlayerGuess = useCallback(() => {
    const val = parseInt(inputRef.current?.value)
    
    if (isNaN(val) || val < settings.minRange || val > settings.maxRange) {
      triggerShake()
      soundEffects.guessWrong()
      setFeedback(`⚠️ Enter a number between ${settings.minRange} and ${settings.maxRange}`)
      setFeedbackClass('feedback-error')
      return
    }

    const isCouple = settings.gameMode === 'couple'
    const playerName = currentPlayer === 1 ? settings.player1Name : settings.player2Name
    
    // In couple mode, each player guesses the other's number
    const targetSecret = currentPlayer === 1 ? player1Secret : player2Secret
    const currentLo = currentPlayer === 1 ? player1Lo : player2Lo
    const currentHi = currentPlayer === 1 ? player1Hi : player2Hi
    
    const newAttempts = currentPlayer === 1 ? player1Attempts + 1 : player2Attempts + 1
    
    if (currentPlayer === 1) {
      setPlayer1Attempts(newAttempts)
    } else {
      setPlayer2Attempts(newAttempts)
    }

    setHistory(prev => [...prev, { 
      num: prev.length + 1, 
      val, 
      player: currentPlayer,
      playerName 
    }])

    if (val === targetSecret) {
      soundEffects.guessCorrect()
      if (isCouple) {
        setFeedback(`🎉 ${playerName} found it! The number was ${targetSecret}! (${newAttempts} ${newAttempts === 1 ? 'attempt' : 'attempts'})`)
      } else {
        setFeedback(`🎉 ${playerName} Wins! It was ${targetSecret}! (${newAttempts} ${newAttempts === 1 ? 'attempt' : 'attempts'})`)
      }
      setFeedbackClass('feedback-win')
      setDisabled(true)
      setWinner(currentPlayer)
    } else if (val > targetSecret) {
      soundEffects.guessHigh()
      setFeedback(`⬇️ Too High, ${playerName}!`)
      setFeedbackClass('feedback-high')
      
      if (isCouple) {
        // Update the current player's range
        const newHi = Math.max(settings.minRange, Math.min(currentHi, val - 1))
        if (currentPlayer === 1) {
          setPlayer1Hi(newHi)
        } else {
          setPlayer2Hi(newHi)
        }
      } else {
        // Two-player mode: separate ranges
        if (currentPlayer === 1) {
          setPlayer1Hi(Math.max(settings.minRange, Math.min(player1Hi, val - 1)))
        } else {
          setPlayer2Hi(Math.max(settings.minRange, Math.min(player2Hi, val - 1)))
        }
      }
      
      triggerShake()
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    } else {
      soundEffects.guessLow()
      setFeedback(`⬆️ Too Low, ${playerName}!`)
      setFeedbackClass('feedback-low')
      
      if (isCouple) {
        // Update the current player's range
        const newLo = Math.min(settings.maxRange, Math.max(currentLo, val + 1))
        if (currentPlayer === 1) {
          setPlayer1Lo(newLo)
        } else {
          setPlayer2Lo(newLo)
        }
      } else {
        // Two-player mode: separate ranges
        if (currentPlayer === 1) {
          setPlayer1Lo(Math.min(settings.maxRange, Math.max(player1Lo, val + 1)))
        } else {
          setPlayer2Lo(Math.min(settings.maxRange, Math.max(player2Lo, val + 1)))
        }
      }
      
      triggerShake()
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    }

    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }, [currentPlayer, player1Secret, player2Secret, player1Attempts, player2Attempts, player1Hi, player1Lo, player2Hi, player2Lo, settings, triggerShake])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (settings.gameMode === 'single-player') {
        submitGuess()
      } else {
        submitTwoPlayerGuess()
      }
    }
  }, [submitGuess, submitTwoPlayerGuess, settings.gameMode])

  const span = hi - lo
  const totalRange = settings.maxRange - settings.minRange
  const rangePercentage = totalRange > 0 ? Math.round((span / totalRange) * 100) : 0

  const player1Span = player1Hi - player1Lo
  const player1RangePercentage = totalRange > 0 ? Math.round((player1Span / totalRange) * 100) : 0
  
  const player2Span = player2Hi - player2Lo
  const player2RangePercentage = totalRange > 0 ? Math.round((player2Span / totalRange) * 100) : 0

  return {
    settings,
    gameStarted,
    secret,
    attempts,
    lo,
    hi,
    feedback,
    feedbackClass,
    history,
    disabled,
    shake,
    rangePercentage,
    inputRef,
    // Two-player specific
    currentPlayer,
    player1Attempts,
    player2Attempts,
    player1Lo,
    player1Hi,
    player2Lo,
    player2Hi,
    player1RangePercentage,
    player2RangePercentage,
    winner,
    // Couple mode specific
    coupleSetupPhase,
    setupStep,
    player1Secret,
    player2Secret,
    // Methods
    updateSetting,
    startGame,
    submitGuess,
    submitTwoPlayerGuess,
    setSecretNumber,
    resetGuess,
    handleKeyDown
  }
}

export default useGuessGame