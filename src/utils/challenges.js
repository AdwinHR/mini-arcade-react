import { db } from '../firebase'
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const DEBUG = true;
const log = (...args) => {
  if (DEBUG) console.log('[CHALLENGES]', ...args);
};

// Check if Firestore is available
const isFirestoreAvailable = () => {
  try {
    return db !== null && db !== undefined;
  } catch (error) {
    log('Firestore not available:', error);
    return false;
  }
};

// Local storage fallback for challenges
const STORAGE_KEY = 'mini-arcade-challenges';

const saveToLocalStorage = (challengeId, challengeData) => {
  try {
    const challenges = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    challenges[challengeId] = challengeData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    log('Challenge saved to localStorage:', challengeId);
  } catch (error) {
    log('Error saving to localStorage:', error);
  }
};

const getFromLocalStorage = (challengeId) => {
  try {
    const challenges = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return challenges[challengeId] || null;
  } catch (error) {
    log('Error reading from localStorage:', error);
    return null;
  }
};

export const generateChallengeUrl = (challengeId) => {
  const url = `${window.location.origin}/memorycards/challenge/${challengeId}`;
  log('Generated challenge URL:', url);
  return url;
};

export const createChallenge = async (difficulty, creatorMoves, creatorTime, creatorName) => {
  log('Creating challenge:', { difficulty, creatorMoves, creatorTime, creatorName });

  const challengeData = {
    difficulty,
    creatorMoves,
    creatorTime,
    creatorName,
    createdAt: new Date().toISOString(),
    attempts: []
  };

  // Try Firestore first
  if (isFirestoreAvailable()) {
    try {
      log('Attempting Firestore creation');
      const challengesRef = collection(db, 'challenges');
      const docRef = await addDoc(challengesRef, challengeData);
      log('✅ Challenge created in Firestore:', docRef.id);
      return docRef.id;
    } catch (error) {
      log('❌ Firestore error:', error.message);
      // Fall through to localStorage
    }
  } else {
    log('⚠️ Firestore not available, using localStorage');
  }

  // Fallback to localStorage
  const challengeId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  saveToLocalStorage(challengeId, challengeData);
  log('✅ Challenge saved to localStorage:', challengeId);
  
  return challengeId;
};

export const getChallenge = async (challengeId) => {
  log('Getting challenge:', challengeId);

  if (!challengeId) {
    log('❌ No challenge ID provided');
    return null;
  }

  // Check if it's a local challenge
  if (challengeId.startsWith('local-')) {
    log('📦 Fetching from localStorage (local ID)');
    const challengeData = getFromLocalStorage(challengeId);
    
    if (challengeData) {
      log('✅ Challenge found in localStorage');
      return { id: challengeId, ...challengeData };
    }
    log('❌ Challenge not found in localStorage');
    return null;
  }

  // Try Firestore for non-local IDs
  if (isFirestoreAvailable()) {
    try {
      log('📡 Fetching from Firestore');
      const docRef = doc(db, 'challenges', challengeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        log('✅ Challenge found in Firestore');
        return { id: docSnap.id, ...docSnap.data() };
      }
      log('⚠️ Challenge not found in Firestore, trying localStorage');
    } catch (error) {
      log('❌ Firestore error:', error.message);
    }
  }

  // Fallback to localStorage for old challenges
  log('📦 Fetching from localStorage (fallback)');
  const challengeData = getFromLocalStorage(challengeId);
  
  if (challengeData) {
    log('✅ Challenge found in localStorage');
    return { id: challengeId, ...challengeData };
  }

  log('❌ Challenge not found anywhere');
  return null;
};

export const submitChallengeAttempt = async (challengeId, playerName, moves, time, completed) => {
  log('Submitting challenge attempt:', { challengeId, playerName, moves, time, completed });

  const attemptData = {
    playerName,
    moves,
    time,
    completed,
    submittedAt: new Date().toISOString()
  };

  // Check if it's a local challenge
  if (challengeId.startsWith('local-')) {
    log('📦 Submitting to localStorage (local ID)');
    const challengeData = getFromLocalStorage(challengeId);
    
    if (challengeData) {
      if (!challengeData.attempts) {
        challengeData.attempts = [];
      }
      challengeData.attempts.push(attemptData);
      saveToLocalStorage(challengeId, challengeData);
      log('✅ Attempt submitted to localStorage');
      return true;
    }
    log('❌ Challenge not found for attempt submission');
    return false;
  }

  // Try Firestore for non-local IDs
  if (isFirestoreAvailable()) {
    try {
      log('📡 Submitting to Firestore');
      const docRef = doc(db, 'challenges', challengeId);
      await updateDoc(docRef, {
        attempts: arrayUnion(attemptData)
      });
      log('✅ Attempt submitted to Firestore');
      return true;
    } catch (error) {
      log('❌ Firestore error:', error.message);
    }
  }

  // Fallback to localStorage
  log('📦 Submitting to localStorage (fallback)');
  const challengeData = getFromLocalStorage(challengeId);
  
  if (challengeData) {
    if (!challengeData.attempts) {
      challengeData.attempts = [];
    }
    challengeData.attempts.push(attemptData);
    saveToLocalStorage(challengeId, challengeData);
    log('✅ Attempt submitted to localStorage');
    return true;
  }

  log('❌ Challenge not found for attempt submission');
  return false;
};

export const getChallengeLeaderboard = async (challengeId) => {
  log('Getting leaderboard for challenge:', challengeId);

  const challenge = await getChallenge(challengeId);
  
  if (!challenge || !challenge.attempts) {
    log('⚠️ No attempts found');
    return [];
  }

  // Sort by moves (ascending), then by time (ascending)
  const leaderboard = [...challenge.attempts]
    .filter(attempt => attempt.completed)
    .sort((a, b) => {
      if (a.moves !== b.moves) {
        return a.moves - b.moves;
      }
      return a.time - b.time;
    })
    .slice(0, 10); // Top 10

  log('✅ Leaderboard:', leaderboard);
  return leaderboard;
};