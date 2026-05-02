import { useState, useEffect, useRef, useCallback } from 'react'

const MEM_EMOJIS = ['🍕', '🎸', '🚀', '🐙', '🌈', '🦊', '💎', '🎩']

function useMemoryGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [lock, setLock] = useState(false)
  const [showWin, setShowWin] = useState(false)
  const timerRef = useRef(null)

  const initMemory = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setFlipped([])
    setMatched(0)
    setMoves(0)
    setTimer(0)
    setLock(false)
    setShowWin(false)

    const shuffled = [...MEM_EMOJIS, ...MEM_EMOJIS]
      .map((e, i) => ({ id: i, emoji: e, matched: false }))
      .sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }, [])

  useEffect(() => {
    initMemory()
    return () => clearInterval(timerRef.current)
  }, [initMemory])

  useEffect(() => {
    if (flipped.length === 1 && timer === 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    }
  }, [flipped.length, timer])

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(m => m + 1)
      setLock(true)
      const [a, b] = flipped

      if (cards[a]?.emoji === cards[b]?.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === a || i === b ? { ...c, matched: true } : c
          ))
          setMatched(m => {
            const newMatched = m + 1
            if (newMatched === 8) {
              clearInterval(timerRef.current)
              setShowWin(true)
            }
            return newMatched
          })
          setFlipped([])
          setLock(false)
        }, 500)
      } else {
        setTimeout(() => {
          setFlipped([])
          setLock(false)
        }, 900)
      }
    }
  }, [flipped, cards])

  const flipCard = useCallback((i) => {
    if (lock || flipped.includes(i) || cards[i]?.matched) return
    setFlipped(prev => [...prev, i])
  }, [lock, flipped, cards])

  const m = Math.floor(timer / 60)
  const s = timer % 60
  const timeStr = `${m}:${s.toString().padStart(2, '0')}`

  return {
    cards,
    flipped,
    matched,
    moves,
    timeStr,
    showWin,
    flipCard,
    initMemory
  }
}

export default useMemoryGame