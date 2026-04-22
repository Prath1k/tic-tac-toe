'use client';

import { Player, Difficulty } from '@/types/game';

const WINNING_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function useAI() {
  const getRandomMove = (board: (Player | null)[]) => {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);
    
    if (emptyIndices.length === 0) return -1;
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  const getMediumMove = (board: (Player | null)[]) => {
    // Try to win
    for (const [a, b, c] of WINNING_CONDITIONS) {
      const line = [board[a], board[b], board[c]];
      if (line.filter(v => v === 'O').length === 2 && line.includes(null)) {
        return [a, b, c][line.indexOf(null)];
      }
    }
    // Try to block player
    for (const [a, b, c] of WINNING_CONDITIONS) {
      const line = [board[a], board[b], board[c]];
      if (line.filter(v => v === 'X').length === 2 && line.includes(null)) {
        return [a, b, c][line.indexOf(null)];
      }
    }
    // Take center
    if (board[4] === null) return 4;
    return getRandomMove(board);
  };

  const minimax = (board: (Player | null)[], depth: number, isMaximizing: boolean): number => {
    // Terminal states
    for (const [a, b, c] of WINNING_CONDITIONS) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a] === 'O' ? 10 - depth : depth - 10;
      }
    }
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = null;
        }
      }
      return best;
    }
  };

  const getBestMove = (board: (Player | null)[]) => {
    let bestScore = -Infinity;
    let bestMove = -1;
    const currentBoard = [...board];

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'O';
        const score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const getAIMove = (board: (Player | null)[], difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return getRandomMove(board);
      case 'medium': return getMediumMove(board);
      case 'hard': return getBestMove(board);
      default: return getRandomMove(board);
    }
  };

  return { getAIMove };
}
