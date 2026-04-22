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
  initialPlayerX?: string;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onlineLobbyContent, initialPlayerX }) => {
  const [mode, setMode] = useState<GameMode>('player');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [playerXName, setPlayerXName] = useState(initialPlayerX || 'Player 1');
  const [playerOName, setPlayerOName] = useState('Player 2');
  const [timerEnabled, setTimerEnabled] = useState(false);

  React.useEffect(() => {
    if (initialPlayerX) {
      setPlayerXName(initialPlayerX);
    }
  }, [initialPlayerX]);

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
    <div className="setup-container glass" id="setupScreen">
      <h2>Game Setup</h2>

      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'player' ? 'active' : ''}`} 
          onClick={() => setMode('player')}
        >
          Local
        </button>
        <button 
          className={`mode-btn ${mode === 'ai' ? 'active' : ''}`} 
          onClick={() => setMode('ai')}
        >
          vs AI
        </button>
        <button 
          className={`mode-btn ${mode === 'online' ? 'active' : ''}`} 
          onClick={() => setMode('online')}
        >
          Online
        </button>
      </div>

      {mode === 'online' && onlineLobbyContent}

      {mode === 'ai' && (
        <div className="difficulty-selector">
          <label>Select Difficulty</label>
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
      )}

      <div className="flex-column" style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Player X Name" 
            value={playerXName} 
            onChange={(e) => setPlayerXName(e.target.value)}
          />
        </div>
        
        {mode === 'player' && (
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Player O Name" 
              value={playerOName} 
              onChange={(e) => setPlayerOName(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="timer-toggle">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
          Enable 15s Timer
        </span>
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={timerEnabled} 
            onChange={(e) => setTimerEnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <button className="start-btn" onClick={handleStart}>Launch Game</button>
    </div>
  );
};
