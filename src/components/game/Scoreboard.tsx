'use client';

import React from 'react';
import { Player } from '@/types/game';

interface ScoreboardProps {
  scores: Record<Player, number>;
  playerNames: Record<Player, string>;
  currentPlayer: Player;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  scores,
  playerNames,
  currentPlayer,
}) => {
  return (
    <div className="scoreboard" style={{ gap: '12px', maxWidth: '400px', width: '100%', marginBottom: '20px' }}>
      <div 
        className={`player-score glass`} 
        style={{ 
          borderBottom: currentPlayer === 'X' ? '2px solid #fff' : '2px solid transparent',
          opacity: currentPlayer === 'X' ? 1 : 0.6,
          transition: 'all 0.3s'
        }}
      >
        <div className="name" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PLAYER X</div>
        <div className="score-val" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{scores.X}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{playerNames.X}</div>
      </div>
      <div 
        className={`player-score glass`} 
        style={{ 
          borderBottom: currentPlayer === 'O' ? '2px solid var(--accent-color)' : '2px solid transparent',
          opacity: currentPlayer === 'O' ? 1 : 0.6,
          transition: 'all 0.3s'
        }}
      >
        <div className="name" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PLAYER O</div>
        <div className="score-val" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-color)' }}>{scores.O}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{playerNames.O}</div>
      </div>
    </div>
  );
};
