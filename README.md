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

## 🚀 Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git installed

### 🌐 Run on Any Machine

**Yes! Anyone can clone and run this project on their machine:**

```bash
# Clone from anywhere
git clone https://github.com/AdwinHR/mini-arcade-react.git
cd mini-arcade-react

# Install dependencies
npm install

# Quick setup with working Firebase config
npm run setup:env

# Edit .env file (copy the Firebase config from README)
# The Firebase config in the README works out-of-the-box!

# Run immediately
npm run dev
```

**That's it! 🎮 The app will be running at `http://localhost:5173`**

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/AdwinHR/mini-arcade-react.git
cd mini-arcade-react

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual API keys (see Environment Setup below)

# 4. Start development server
npm run dev

# 5. Open in browser
# → http://localhost:5173
```

### 🔧 Environment Setup

1. **Copy the environment template:**
   ```bash
   npm run setup:env
   ```

2. **Edit `.env` file with your actual keys:**
   ```env
   # Firebase Configuration (these work out-of-the-box for demo)
   VITE_FIREBASE_API_KEY=AIzaSyCmbRIjQBdrtiW7mCeNz4S7fxGiFVa5gNQ
   VITE_FIREBASE_AUTH_DOMAIN=adwin-cd095.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=adwin-cd095
   VITE_FIREBASE_STORAGE_BUCKET=adwin-cd095.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=651508699220
   VITE_FIREBASE_APP_ID=1:651508699220:web:96319b74ab17ec4ebb1dc1
   VITE_FIREBASE_MEASUREMENT_ID=G-JF7VD0FSKY

   # Stripe Configuration (Optional - for premium features)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   VITE_STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id_here
   VITE_STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id_here

   # AdSense Configuration (Optional)
   VITE_ADSENSE_CLIENT_ID=ca-pub-5417434825664629
   ```

   **🎯 Quick Start:** The Firebase configuration above works immediately - just copy and paste!

### 🔥 Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Get Firebase Configuration:**
   - Project Settings → General → Your apps
   - Copy the Firebase config object
   - Add to your `.env` file

3. **Deploy to Firebase:**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase (if not already done)
   firebase init
   
   # Deploy to production
   npm run deploy:production
   ```

### 💳 Stripe Setup (Optional)

1. **Create Stripe Account:**
   - Sign up at [Stripe](https://stripe.com/)
   - Get your API keys from Dashboard → Developers → API keys

2. **Create Products:**
   - Go to Stripe Dashboard → Products
   - Create monthly and yearly subscription products
   - Copy the price IDs to your `.env` file

3. **Deploy Backend Functions:**
   ```bash
   # Install functions dependencies
   npm run setup:functions
   
   # Deploy functions (requires Blaze plan)
   npm run deploy:functions
   ```

### 📱 AdSense Setup (Optional)

1. **Create AdSense Account:**
   - Sign up at [Google AdSense](https://www.google.com/adsense/)
   - Get your publisher ID

2. **Add to Environment:**
   ```env
   VITE_ADSENSE_CLIENT_ID=ca-pub-your_publisher_id_here
   ```

## 🏃‍♂️ Run Locally

### Development
```bash
npm run dev
```
Starts the development server with hot reload at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Builds the app for production in the `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally at `http://localhost:4173`

## 📦 Deployment Scripts

```bash
# Deploy frontend only
npm run deploy:hosting

# Deploy Firebase Functions
npm run deploy:functions

# Deploy Firestore rules
npm run deploy:rules

# Deploy everything (production)
npm run deploy:production

# Deploy to preview channel
npm run firebase:preview
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy everything |
| `npm run deploy:hosting` | Deploy frontend only |
| `npm run deploy:functions` | Deploy backend functions |
| `npm run deploy:rules` | Deploy Firestore rules |
| `npm run setup:env` | Copy environment template |
| `npm run setup:functions` | Install functions dependencies |
