const DEBUG = true;

const log = (...args) => {
  if (DEBUG) console.log('[SOUNDS]', ...args);
};

// Simple sound system that works without audio files
let audioUnlocked = false;
let soundEnabled = true;

const unlockAudio = async () => {
  if (audioUnlocked) return;
  audioUnlocked = true;
  log('Audio unlocked');
};

const playSound = (soundName) => {
  if (!soundEnabled) return;
  log(`Playing sound: ${soundName}`);
  // Visual feedback instead of actual sound for now
};

const toggleSound = (enabled) => {
  soundEnabled = enabled;
  log(`Sound ${enabled ? 'enabled' : 'disabled'}`);
};

// soundEffects object for compatibility
export const soundEffects = {
  unlock: unlockAudio,
  
  // Memory game
  flip: () => playSound('flip'),
  match: () => playSound('match'),
  wrong: () => playSound('wrong'),
  win: () => playSound('win'),
  click: () => playSound('click'),
  
  // Guess game
  guessCorrect: () => playSound('guessCorrect'),
  guessWrong: () => playSound('guessWrong'),
  guessHigh: () => playSound('guessHigh'),
  guessLow: () => playSound('guessLow'),
  
  // RPS game
  rpsSelect: () => playSound('rpsSelect'),
  rpsWin: () => playSound('rpsWin'),
  rpsLose: () => playSound('rpsLose'),
  rpsDraw: () => playSound('rpsDraw')
};

export { playSound, toggleSound };

export default { playSound, toggleSound, soundEffects };