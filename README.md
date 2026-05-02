# 🕹️ Mini Arcade — React

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Three fully interactive mini games built with React 18 + Vite. Production-ready, component-based architecture with custom hooks and modern React patterns.

## 🎮 Games

- 🎯 **Guess the Number** — Pick a preset or custom range, then guess away
- ✊ **Rock Paper Scissors** — You vs CPU with live scoreboard
- 🃏 **Memory Cards** — 4×4 flip-to-match with move & timer tracking

## ✨ Features

- ⚡️ Lightning-fast with Vite
- 🎨 Modern, dark-themed UI
- 📱 Fully responsive design
- ♿️ Accessible (ARIA labels, keyboard navigation)
- 🧩 Component-based architecture
- 🪝 Custom React hooks for game logic
- 🎭 Smooth animations and transitions
- 🎯 Production-ready code structure

## 📁 Project Structure
```
mini-arcade/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    └── components/
        ├── GameCard.jsx
        ├── GameCard.css
        ├── GuessGame.jsx
        ├── GuessGame.css
        ├── RPSGame.jsx
        ├── RPSGame.css
        ├── MemoryGame.jsx
        └── MemoryGame.css
```

## Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

## Build for Production
```bash
npm run build
npm run preview
```
