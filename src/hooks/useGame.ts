'use client';

import { useState, useCallback, useEffect } from 'react';
import { Player, GameState, GameMode, Difficulty } from '@/types/game';

const WINNING_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function useGame() {
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(true);
  const [scores, setScores] = useState<Record<Player, number>>({ X: 0, O: 0 });
  const [playerNames, setPlayerNames] = useState<Record<Player, string>>({ X: 'Player 1', O: 'Player 2' });
  const [roundNumber, setRoundNumber] = useState(1);
  const [winStreak, setWinStreak] = useState<{ player: Player | null, count: number }>({ player: null, count: 0 });
  const [moveHistory, setMoveHistory] = useState<{ index: number, player: Player, board: (Player | null)[] }[]>([]);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [status, setStatus] = useState<string>("It's X's turn");

  const checkWinner = (currentBoard: (Player | null)[]) => {
    for (const condition of WINNING_CONDITIONS) {
      const [a, b, c] = condition;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c]) {
        return { winner: currentBoard[a], line: condition };
      }
    }
    if (!currentBoard.includes(null)) {
      return { winner: 'draw' as const, line: null };
    }
    return null;
  };

  const makeMove = useCallback((index: number) => {
    if (board[index] || !gameActive) return false;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    
    setMoveHistory(prev => [...prev, { index, player: currentPlayer, board: [...board] }]);
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setGameActive(false);
      if (result.winner === 'draw') {
        setStatus("😐 It's a Draw!");
        setWinStreak({ player: null, count: 0 });
      } else {
        const winner = result.winner as Player;
        setWinningLine(result.line);
        setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
        setStatus(`🎉 ${playerNames[winner]} Wins!`);
        
        setWinStreak(prev => {
          if (prev.player === winner) {
            return { player: winner, count: prev.count + 1 };
          }
          return { player: winner, count: 1 };
        });
      }
    } else {
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      setStatus(`It's ${playerNames[nextPlayer]}'s turn`);
    }
    return true;
  }, [board, currentPlayer, gameActive, playerNames]);

  const resetBoard = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameActive(true);
    setWinningLine(null);
    setMoveHistory([]);
    setStatus(`It's ${playerNames.X}'s turn`);
  }, [playerNames]);

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0 || !gameActive) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    setBoard(lastMove.board);
    setCurrentPlayer(lastMove.player);
    setMoveHistory(prev => prev.slice(0, -1));
    setStatus(`It's ${playerNames[lastMove.player]}'s turn`);
  }, [moveHistory, gameActive, playerNames]);

  return {
    board,
    currentPlayer,
    gameActive,
    scores,
    playerNames,
    roundNumber,
    winStreak,
    status,
    winningLine,
    makeMove,
    resetBoard,
    undoMove,
    setPlayerNames,
    setRoundNumber,
  };
}
