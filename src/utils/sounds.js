// Simple sound effects using Web Audio API and oscillators

class SoundEffects {
  constructor() {
    this.audioContext = null
    this.enabled = true
    this.initialized = false
  }

  init() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        console.log('Audio context created:', this.audioContext.state)
        
        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().then(() => {
            console.log('Audio context resumed')
            this.initialized = true
          })
        } else {
          this.initialized = true
        }
      } catch (error) {
        console.error('Failed to create audio context:', error)
      }
    }
  }

  // Call this on first user interaction
  async unlock() {
    if (!this.audioContext) {
      this.init()
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
      console.log('Audio unlocked, state:', this.audioContext.state)
    }
    
    // Play a silent sound to unlock audio on iOS - only if audioContext exists
    if (this.audioContext) {
      try {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()
        gainNode.gain.value = 0
        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.01)
      } catch (error) {
        console.error('Error playing unlock sound:', error)
      }
    }
    
    this.initialized = true
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled) {
      console.log('Sound disabled')
      return
    }
    
    this.init()
    
    if (!this.audioContext) {
      console.error('No audio context')
      return
    }

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type
      gainNode.gain.value = volume

      const now = this.audioContext.currentTime
      oscillator.start(now)
      oscillator.stop(now + duration)
      
      // Schedule cleanup to prevent memory leaks
      oscillator.onended = () => {
        try {
          oscillator.disconnect()
          gainNode.disconnect()
        } catch (error) {
          console.error('Error disconnecting nodes:', error)
        }
      }
      
      console.log(`Playing tone: ${frequency}Hz for ${duration}s`)
    } catch (error) {
      console.error('Error playing tone:', error)
    }
  }

  playSequence(notes) {
    if (!this.enabled) {
      console.log('Sound disabled')
      return
    }
    
    this.init()
    
    if (!this.audioContext) {
      console.error('No audio context')
      return
    }

    try {
      let time = this.audioContext.currentTime
      const nodes = []

      notes.forEach(({ frequency, duration, type = 'sine', volume = 0.3, delay = 0 }) => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = type
        gainNode.gain.value = volume

        time += delay
        oscillator.start(time)
        oscillator.stop(time + duration)
        
        // Store references for cleanup
        nodes.push({ oscillator, gainNode, endTime: time + duration })
      })
      
      // Schedule cleanup for all nodes when the last note ends
      const lastEndTime = Math.max(...nodes.map(n => n.endTime))
      setTimeout(() => {
        nodes.forEach(({ oscillator, gainNode }) => {
          try {
            oscillator.disconnect()
            gainNode.disconnect()
          } catch (error) {
            console.error('Error disconnecting nodes:', error)
          }
        })
      }, (lastEndTime - this.audioContext.currentTime) * 1000 + 100)
      
      console.log(`Playing sequence of ${notes.length} notes`)
    } catch (error) {
      console.error('Error playing sequence:', error)
    }
  }

  // RPS Sounds
  rpsWin() {
    console.log('RPS Win sound')
    this.playSequence([
      { frequency: 523.25, duration: 0.1, type: 'square', volume: 0.3 }, // C5
      { frequency: 659.25, duration: 0.1, type: 'square', volume: 0.3, delay: 0.1 }, // E5
      { frequency: 783.99, duration: 0.2, type: 'square', volume: 0.3, delay: 0.1 }, // G5
      { frequency: 1046.50, duration: 0.3, type: 'square', volume: 0.35, delay: 0.1 } // C6
    ])
  }

  rpsLose() {
    console.log('RPS Lose sound')
    this.playSequence([
      { frequency: 392.00, duration: 0.15, type: 'sawtooth', volume: 0.3 }, // G4
      { frequency: 329.63, duration: 0.15, type: 'sawtooth', volume: 0.3, delay: 0.1 }, // E4
      { frequency: 261.63, duration: 0.3, type: 'sawtooth', volume: 0.35, delay: 0.1 } // C4
    ])
  }

  rpsDraw() {
    console.log('RPS Draw sound')
    this.playSequence([
      { frequency: 523.25, duration: 0.1, type: 'triangle', volume: 0.35 }, // C5
      { frequency: 523.25, duration: 0.1, type: 'triangle', volume: 0.35, delay: 0.15 } // C5 again
    ])
  }

  rpsSelect() {
    console.log('RPS Select sound')
    this.playTone(880, 0.05, 'sine', 0.2) // A5 - quick blip
  }

  // Guess Game Sounds
  guessCorrect() {
    console.log('Guess Correct sound')
    this.playSequence([
      { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.3 },
      { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.3, delay: 0.05 },
      { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.3, delay: 0.05 },
      { frequency: 1046.50, duration: 0.25, type: 'sine', volume: 0.35, delay: 0.05 }
    ])
  }

  guessWrong() {
    console.log('Guess Wrong sound')
    this.playTone(200, 0.15, 'sawtooth', 0.25)
  }

  guessHigh() {
    console.log('Guess High sound')
    this.playTone(600, 0.08, 'triangle', 0.2)
  }

  guessLow() {
    console.log('Guess Low sound')
    this.playTone(300, 0.08, 'triangle', 0.2)
  }

  // Memory Game Sounds
  memoryFlip() {
    console.log('Memory Flip sound')
    this.playTone(440, 0.08, 'sine', 0.15) // A4 - soft flip sound
  }

  memoryMatch() {
    console.log('Memory Match sound')
    this.playSequence([
      { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.25 }, // C5
      { frequency: 659.25, duration: 0.15, type: 'sine', volume: 0.3, delay: 0.08 } // E5
    ])
  }

  memoryMismatch() {
    console.log('Memory Mismatch sound')
    this.playSequence([
      { frequency: 392.00, duration: 0.1, type: 'triangle', volume: 0.2 }, // G4
      { frequency: 329.63, duration: 0.1, type: 'triangle', volume: 0.2, delay: 0.08 } // E4
    ])
  }

  memoryWin() {
    console.log('Memory Win sound')
    this.playSequence([
      { frequency: 523.25, duration: 0.1, type: 'square', volume: 0.25 }, // C5
      { frequency: 659.25, duration: 0.1, type: 'square', volume: 0.25, delay: 0.08 }, // E5
      { frequency: 783.99, duration: 0.1, type: 'square', volume: 0.25, delay: 0.08 }, // G5
      { frequency: 1046.50, duration: 0.15, type: 'square', volume: 0.3, delay: 0.08 }, // C6
      { frequency: 1318.51, duration: 0.2, type: 'square', volume: 0.35, delay: 0.08 } // E6
    ])
  }

  toggle() {
    this.enabled = !this.enabled
    console.log('Sound toggled:', this.enabled)
    return this.enabled
  }

  setEnabled(enabled) {
    this.enabled = enabled
    console.log('Sound enabled:', this.enabled)
  }
}

export const soundEffects = new SoundEffects()