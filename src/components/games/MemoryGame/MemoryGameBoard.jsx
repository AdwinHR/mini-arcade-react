import { submitChallengeAttempt } from '../../../utils/challenges'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { playSound } from '../../../utils/sounds'
import Button from '../../ui/Button'

const log = (...args) => console.log('[MemoryGameBoard]', ...args);

function MemoryGameBoard({ difficulty = 'easy', customRows, customCols, onBack, onComplete, challenge }) {
  log('Component mounted with props:', { difficulty, customRows, customCols, hasChallenge: !!challenge });

  // Grid configuration
  const getGridConfig = () => {
    if (customRows && customCols) {
      return { rows: customRows, cols: customCols };
    }
    
    const configs = {
      easy: { rows: 4, cols: 4 },
      medium: { rows: 6, cols: 6 },
      hard: { rows: 8, cols: 8 }
    };
    
    return configs[difficulty] || configs.easy;
  };

  const { rows, cols } = getGridConfig();
  const totalPairs = (rows * cols) / 2;

  // Game state
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [challengeSubmitted, setCharlengeSubmitted] = useState(false);
  
  const timerRef = useRef(null);
  const isProcessing = useRef(false);

  // Emoji sets for different grid sizes
  const getEmojiSet = () => {
    const baseEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤'];
    const extendedEmojis = [...baseEmojis, '🎸', '🎹', '🎺', '🎻', '🥁', '🎼', '🎧', '🎵'];
    const fullEmojis = [...extendedEmojis, '🎶', '🎙️', '📻', '📺', '📷', '📸', '📹', '📼', '🔊', '🔉', '🔈', '📢', '📣', '📯', '🔔', '🔕'];
    
    if (totalPairs <= 8) return baseEmojis;
    if (totalPairs <= 16) return extendedEmojis;
    return fullEmojis;
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    log('Initializing game');
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset state
    setFlipped([]);
    setMatched(0);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameWon(false);
    setCharlengeSubmitted(false);
    isProcessing.current = false;

    // Create card pairs
    const emojiSet = getEmojiSet();
    const selectedEmojis = emojiSet.slice(0, totalPairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    const shuffled = cardPairs
      .map((emoji, index) => ({ id: index, emoji, matched: false }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    log('Game initialized with', shuffled.length, 'cards');
  }, [totalPairs]);

  // Initialize on mount and when difficulty changes
  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initializeGame]);

  // Start timer on first flip
  useEffect(() => {
    if (flipped.length === 1 && !gameStarted && !timerRef.current) {
      log('Starting timer');
      setGameStarted(true);
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
  }, [flipped.length, gameStarted]);

  // Handle card matching
  useEffect(() => {
    if (flipped.length === 2 && !isProcessing.current) {
      isProcessing.current = true;
      setMoves(m => m + 1);
      
      const [firstIndex, secondIndex] = flipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      log('Checking match:', firstCard?.emoji, 'vs', secondCard?.emoji);

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        playSound('match');
        
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex 
              ? { ...card, matched: true } 
              : card
          ));
          
          setMatched(m => {
            const newMatched = m + 1;
            log('Matched pairs:', newMatched, '/', totalPairs);
            
            // Check for win
            if (newMatched === totalPairs) {
              log('Game won!');
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                log('Timer stopped');
              }
              setGameWon(true);
              playSound('win');
              
              // Call onComplete after a short delay
              setTimeout(() => {
                if (onComplete) {
                  onComplete(moves + 1, time); // +1 because moves state hasn't updated yet
                }
              }, 500);
            }
            
            return newMatched;
          });
          
          setFlipped([]);
          isProcessing.current = false;
        }, 500);
      } else {
        // No match
        playSound('error');
        
        setTimeout(() => {
          setFlipped([]);
          isProcessing.current = false;
        }, 1000);
      }
    }
  }, [flipped, cards, moves, time, totalPairs, onComplete]);

  // Submit challenge attempt when game is won
  useEffect(() => {
    if (gameWon && challenge && !challengeSubmitted) {
      log('Submitting challenge attempt');
      setCharlengeSubmitted(true);
      
      // Determine if player beat the challenge
      const playerMoves = moves;
      const playerTime = time;
      const creatorMoves = challenge.creatorMoves;
      const creatorTime = challenge.creatorTime;
      
      // Player wins if they have fewer moves, or same moves but less time
      const playerWon = playerMoves < creatorMoves || 
                       (playerMoves === creatorMoves && playerTime < creatorTime);
      
      log('Challenge result:', {
        playerMoves,
        playerTime,
        creatorMoves,
        creatorTime,
        playerWon
      });

      // Submit attempt (you can add player name input later)
      submitChallengeAttempt(
        challenge.id,
        'Player', // TODO: Get player name
        playerMoves,
        playerTime,
        true // completed
      ).then(() => {
        log('Challenge submitted successfully');
      }).catch(error => {
        log('Error submitting challenge:', error);
      });
    }
  }, [gameWon, challenge, challengeSubmitted, moves, time]);

  // Handle card flip
  const handleCardClick = (index) => {
    if (isProcessing.current) return;
    if (flipped.includes(index)) return;
    if (cards[index]?.matched) return;
    if (flipped.length >= 2) return;

    playSound('click');
    setFlipped(prev => [...prev, index]);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render state logging
  log('Rendering with state:', {
    cardsCount: cards.length,
    flipped: flipped.length,
    matched,
    moves,
    time,
    gameStarted,
    gameWon
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Challenge Info Banner */}
      {challenge && !gameWon && (
        <div style={{
          padding: '1rem',
          background: 'rgba(255,215,0,0.1)',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          border: '2px solid rgba(255,215,0,0.3)'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🏆 Challenge Mode
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            Beat <strong>{challenge.creatorName}</strong>'s score of{' '}
            <strong>{challenge.creatorMoves} moves</strong> in{' '}
            <strong>{formatTime(challenge.creatorTime)}</strong>
          </div>
        </div>
      )}

      {/* Challenge Result Banner */}
      {gameWon && challenge && (
        <div style={{
          padding: '1.5rem',
          background: moves < challenge.creatorMoves || (moves === challenge.creatorMoves && time < challenge.creatorTime)
            ? 'rgba(0,255,136,0.1)'
            : 'rgba(255,100,100,0.1)',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          border: `2px solid ${
            moves < challenge.creatorMoves || (moves === challenge.creatorMoves && time < challenge.creatorTime)
              ? 'var(--success)'
              : 'var(--error)'
          }`,
          animation: 'pop 0.3s ease-out'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {moves < challenge.creatorMoves || (moves === challenge.creatorMoves && time < challenge.creatorTime) ? '🎉' : '💪'}
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 800, 
            marginBottom: '0.5rem',
            color: moves < challenge.creatorMoves || (moves === challenge.creatorMoves && time < challenge.creatorTime)
              ? 'var(--success)'
              : 'var(--error)'
          }}>
            {moves < challenge.creatorMoves || (moves === challenge.creatorMoves && time < challenge.creatorTime)
              ? '✅ You Beat the Challenge!'
              : '❌ Challenge Not Beaten'}
          </div>
          <div style={{ color: 'var(--muted)' }}>
            Your score: <strong>{moves} moves</strong> in <strong>{formatTime(time)}</strong>
            <br />
            {challenge.creatorName}'s score: <strong>{challenge.creatorMoves} moves</strong> in <strong>{formatTime(challenge.creatorTime)}</strong>
          </div>
        </div>
      )}

      {/* Stats Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="stat-card">
          <div className="stat-label">Moves</div>
          <div className="stat-value">{moves}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Matched</div>
          <div className="stat-value">{matched}/{totalPairs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Time</div>
          <div className="stat-value">{formatTime(time)}</div>
        </div>
      </div>

      {/* Game Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = card.matched;
          
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={isMatched || isFlipped}
              style={{
                aspectRatio: '1',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                background: isMatched 
                  ? 'linear-gradient(135deg, rgba(0,255,136,0.3), rgba(0,200,100,0.3))' 
                  : isFlipped
                  ? 'linear-gradient(135deg, rgba(255,215,0,0.4), rgba(255,180,0,0.4))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                border: isMatched
                  ? '3px solid var(--success)'
                  : isFlipped
                  ? '3px solid var(--accent)'
                  : '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                cursor: isMatched || isFlipped ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFlipped || isMatched ? 'scale(1.05)' : 'scale(1)',
                opacity: isMatched ? 0.7 : 1,
                boxShadow: isFlipped 
                  ? '0 8px 16px rgba(255,215,0,0.3), 0 0 20px rgba(255,215,0,0.2)' 
                  : isMatched
                  ? '0 8px 16px rgba(0,255,136,0.3), 0 0 20px rgba(0,255,136,0.2)'
                  : '0 4px 8px rgba(0,0,0,0.3)',
                color: 'white',
                fontWeight: 'bold',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isMatched && !isFlipped) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMatched && !isFlipped) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }
              }}
            >
              {/* Shimmer effect for flipped cards */}
              {isFlipped && !isMatched && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 1.5s infinite'
                }} />
              )}
              
              {/* Card content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                filter: isFlipped || isMatched ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'none'
              }}>
                {(isFlipped || isMatched) ? card.emoji : '❓'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          onClick={initializeGame}
          variant="secondary"
          style={{ flex: 1 }}
        >
          🔄 New Game
        </Button>
        <Button
          onClick={onBack}
          variant="ghost"
          style={{ flex: 1 }}
        >
          ← Back
        </Button>
      </div>
    </div>
  );
}

export default MemoryGameBoard;