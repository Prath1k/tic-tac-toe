# 🎮 Ultimate Tic-Tac-Toe

A feature-rich, beautifully designed Tic-Tac-Toe game built with pure HTML, CSS & JavaScript.

**Created by Prathik**

---

## ✨ Features

### 🕹️ Game Modes
| Mode | Description |
|------|-------------|
| **👥 vs Player** | Classic local 2-player mode |
| **🤖 vs AI** | Play against an AI with 3 difficulty levels |
| **🌐 Online** | Play with anyone worldwide via private 4-digit room codes |

### 🤖 AI Difficulty
- **Easy** — Random moves, great for beginners
- **Medium** — Blocks your wins and seizes its own opportunities
- **Hard** — Unbeatable AI powered by the **Minimax algorithm**

### 🌐 Online Multiplayer
- **Create Room** — Generates a unique 4-digit code to share with a friend
- **Join Room** — Enter a friend's code to connect instantly
- Powered by **PeerJS** (WebRTC) — peer-to-peer, no server required
- Real-time move syncing with disconnect detection

### 🎯 Gameplay
- **Undo** — Step back moves (disabled in online mode)
- **Round Counter** — Tracks the current round
- **Win Streaks** — 🔥 badge for consecutive wins
- **Move Timer** — Optional 15-second per-turn timer with animated progress bar
- **Scoreboard** — Glowing active-player indicators

### 🎨 Visual & Audio
- 🎉 **Confetti** explosion on wins
- 📳 **Board shake** animation on draws
- 🔊 **Sound effects** — click, win fanfare, draw, and undo (Web Audio API)
- 👻 **Hover previews** — ghosted mark preview on empty cells
- ✨ **Glow effects** and smooth transitions
- 📱 **Fully responsive** — works on mobile and desktop

---

## 🚀 Getting Started

### Play Locally
Open `tic tac toe.html` in any modern browser — no build tools or dependencies required.

```bash
open "tic tac toe.html"
```

### Play Online
1. Both players open the file in their browsers
2. **Player 1:** Select **🌐 Online** → **Create Room** → share the 4-digit code
3. **Player 2:** Select **🌐 Online** → **Join Room** → enter the code → **Connect**
4. Game starts automatically once connected!

> **Note:** Online mode requires an internet connection for initial PeerJS signaling. After that, data flows directly between players (P2P).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure & layout |
| **CSS3** | Styling, animations, responsive design |
| **JavaScript** | Game logic, AI engine (Minimax), audio |
| **PeerJS** | Peer-to-peer online multiplayer (WebRTC) |
| **Web Audio API** | Sound effects without external files |
| **Canvas API** | Confetti particle system |

---

## 📁 Project Structure

```
├── tic tac toe.html       # Complete game (single self-contained file)
└── tic-tac-toe-README.md  # This file
```

---

## 🎮 Controls

| Action | How |
|--------|-----|
| Place mark | Click/tap an empty cell |
| Undo move | **↩ Undo** button |
| Reset round | **🔄 Reset** button |
| Back to menu | **⚙ Menu** button |
| Copy room code | **Copy** button on room code display |

---

## 📄 License

This project is open source and available for personal use.
