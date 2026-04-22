'use client';

import React from 'react';
import { Player } from '@/types/game';
import { Cell } from './Cell';

interface BoardProps {
  board: (Player | null)[];
  currentPlayer: Player;
  winningLine: number[] | null;
  isLocked: boolean;
  onCellClick: (index: number) => void;
  shake?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  winningLine,
  isLocked,
  onCellClick,
  shake
}) => {
  return (
    <div className={`board ${shake ? 'shake' : ''}`} id="board">
      {board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          preview={currentPlayer}
          isWinningCell={winningLine?.includes(index) ?? false}
          isLocked={isLocked}
          onClick={() => onCellClick(index)}
        />
      ))}
    </div>
  );
};
