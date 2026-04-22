'use client';

import React, { useState } from 'react';
import { GameMode, Difficulty } from '@/types/game';

interface SetupScreenProps {
  onStart: (config: {
    mode: GameMode;
    difficulty: Difficulty;
    playerXName: string;
    playerOName: string;
    timerEnabled: boolean;
  }) => void;
  onlineLobbyContent?: React.ReactNode;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onlineLobbyContent }) => {
  const [mode, setMode] = useState<GameMode>('player');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [playerXName, setPlayerXName] = useState('Player 1');
  const [playerOName, setPlayerOName] = useState('Player 2');
  const [timerEnabled, setTimerEnabled] = useState(false);

  const handleStart = () => {
    onStart({
      mode,
      difficulty,
      playerXName,
      playerOName: mode === 'ai' ? `AI (${difficulty.toUpperCase()})` : playerOName,
      timerEnabled: mode !== 'online' && timerEnabled,
    });
  };

  return (
    <div className="setup-container" id="setupScreen">
      <h2>Game Setup</h2>

      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'player' ? 'active' : ''}`} 
          onClick={() => setMode('player')}
        >
          👥 vs Player
        </button>
        <button 
          className={`mode-btn ${mode === 'ai' ? 'active' : ''}`} 
          onClick={() => setMode('ai')}
        >
          🤖 vs AI
        </button>
        <button 
          className={`mode-btn ${mode === 'online' ? 'active' : ''}`} 
          onClick={() => setMode('online')}
        >
          🌐 Online
        </button>
      </div>

      {mode === 'online' && onlineLobbyContent}

      <div className={`difficulty-selector ${mode === 'ai' ? 'visible' : ''}`}>
        <label>AI Difficulty</label>
        <div className="diff-buttons">
          <button 
            className={`diff-btn ${difficulty === 'easy' ? 'active' : ''}`} 
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </button>
          <button 
            className={`diff-btn ${difficulty === 'medium' ? 'active' : ''}`} 
            onClick={() => setDifficulty('medium')}
          >
            Medium
          </button>
          <button 
            className={`diff-btn ${difficulty === 'hard' ? 'active' : ''}`} 
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </button>
        </div>
      </div>

      <div className="input-group">
        <input 
          type="text" 
          placeholder="Your Name (X)" 
          value={playerXName} 
          onChange={(e) => setPlayerXName(e.target.value)}
        />
      </div>
      
      {mode === 'player' && (
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Player 2 (O)" 
            value={playerOName} 
            onChange={(e) => setPlayerOName(e.target.value)}
          />
        </div>
      )}

      <div className="timer-toggle">
        <span>⏱ Move Timer (15s)</span>
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={timerEnabled} 
            onChange={(e) => setTimerEnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <button className="start-btn" onClick={handleStart}>Start Game</button>
    </div>
  );
};
