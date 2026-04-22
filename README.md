# 🏆 Ultimate Tic-Tac-Toe: Next.js Edition

A high-performance, full-stack Tic-Tac-Toe game featuring real-time multiplayer, smart AI, and a premium "Sporty Minimalist" design.

![Demo Placeholder](https://via.placeholder.com/1200x600/0a0a0a/ffffff?text=Ultimate+Tic-Tac-Toe+Premium+UI)

## ✨ Features

- **🎮 3 Unique Game Modes**:
  - **Local Multiplayer**: Play with a friend on the same device.
  - **vs AI**: Challenge a smart opponent with 3 difficulty levels (Easy, Medium, Hard).
  - **Online Real-time**: Create or join secret rooms to play with anyone across the globe.
- **🔐 Secure Authentication**: 
  - Powered by **Supabase**.
  - Supports Email/Password registration and **Google OAuth** social login.
  - Personalized profiles to track your identity.
- **🎨 Premium UI/UX**:
  - **Sporty Minimalist Theme**: A clean Black, White, and Red aesthetic.
  - **Procedural Animations**: Lightweight scale, pulse, and confetti effects.
  - **Glassmorphism Lite**: Modern container styles with backdrop blurs.
- **🔊 Immersive Audio**:
  - **Web Audio API**: Mathematically generated sound effects (No external audio files).
  - Custom move, win, and draw sounds.
- **🚀 Vercel Ready**: Fully optimized for one-click deployment.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: Vanilla CSS with modern Flex/Grid layouts.
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Icons**: Custom procedural SVG icons and Emojis.
- **Effects**: HTML5 Canvas for Confetti and Particles.
- **Audio**: Web Audio API (Oscillators/Gain nodes).

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A Supabase Project ([Create one here](https://supabase.com/))

### 2. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 🌍 Deployment

This project is optimized for **Vercel**. To deploy:

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Project Settings.
4. Update the **Site URL** in your Supabase Auth settings to match your Vercel URL.

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
Built with ❤️ by Prathik 
