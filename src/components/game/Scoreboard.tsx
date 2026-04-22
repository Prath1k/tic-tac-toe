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
    <div className="scoreboard">
      <div className={`player-score ${currentPlayer === 'X' ? 'active-x' : ''}`} id="scoreBoxX">
        <div className="name" id="pXNameDisplay">{playerNames.X} (X)</div>
        <div className="score-val" id="scoreX">{scores.X}</div>
      </div>
      <div className={`player-score ${currentPlayer === 'O' ? 'active-o' : ''}`} id="scoreBoxO">
        <div className="name" id="pONameDisplay">{playerNames.O} (O)</div>
        <div className="score-val" id="scoreO">{scores.O}</div>
      </div>
    </div>
  );
};
