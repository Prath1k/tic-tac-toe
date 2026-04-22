'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SetupScreen } from '@/components/game/SetupScreen';
import { Board } from '@/components/game/Board';
import { Scoreboard } from '@/components/game/Scoreboard';
import { OnlineLobby } from '@/components/game/OnlineLobby';
import { useGame } from '@/hooks/useGame';
import { useAI } from '@/hooks/useAI';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useAuth } from '@/hooks/useAuth';
import { GameMode, Difficulty, Player } from '@/types/game';

export default function TicTacToePage() {
  // Hooks
  const { 
    board, currentPlayer, gameActive, scores, playerNames, 
    status, winningLine, makeMove, resetBoard, undoMove, 
    setPlayerNames, setRoundNumber 
  } = useGame();
  
  const { getAIMove } = useAI();
  const { 
    roomCode, lobbyStatus, isConnected, myRole, 
    createRoom, joinRoom, sendData, destroyPeer 
  } = useMultiplayer();
  
  const { user, signInAnonymously, signInWithGoogle } = useAuth();

  // Local UI State
  const [screen, setScreen] = useState<'setup' | 'game'>('setup');
  const [gameMode, setGameMode] = useState<GameMode>('player');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Handle Game Start
  const handleStartGame = (config: {
    mode: GameMode;
    difficulty: Difficulty;
    playerXName: string;
    playerOName: string;
  }) => {
    setGameMode(config.mode);
    setDifficulty(config.difficulty);
    setPlayerNames({ X: config.playerXName, O: config.playerOName });
    setScreen('game');
    resetBoard();
  };

  // AI Turn Logic
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && gameActive && !isAiThinking) {
      setIsAiThinking(true);
      setTimeout(() => {
        const move = getAIMove(board, difficulty);
        if (move !== -1) {
          makeMove(move);
        }
        setIsAiThinking(false);
      }, 600);
    }
  }, [gameMode, currentPlayer, gameActive, board, difficulty, getAIMove, makeMove, isAiThinking]);

  // Multiplayer Move Sync
  useEffect(() => {
    // This is a simplified sync logic. In a real app, you'd handle this via useMultiplayer data listeners.
  }, [isConnected]);

  return (
    <main>
      <h1>Tic-Tac-Toe <span>Next.js Edition</span></h1>

      {screen === 'setup' ? (
        <SetupScreen 
          onStart={handleStartGame}
          onlineLobbyContent={
            <OnlineLobby 
              roomCode={roomCode}
              status={lobbyStatus}
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
              onCopyCode={() => navigator.clipboard.writeText(roomCode)}
            />
          }
        />
      ) : (
        <div className="game-container">
          <div className="round-info">
            <span className="round-badge">Round 1</span>
            {gameMode === 'online' && <span className="online-badge visible">🌐 ONLINE</span>}
          </div>

          <Scoreboard 
            scores={scores} 
            playerNames={playerNames} 
            currentPlayer={currentPlayer} 
          />

          <div className="status">{status}</div>
          
          {isAiThinking && (
            <div className="ai-thinking visible">
              🤖 AI is thinking
              <div className="thinking-dots"><span></span><span></span><span></span></div>
            </div>
          )}

          <Board 
            board={board}
            currentPlayer={currentPlayer}
            winningLine={winningLine}
            isLocked={!gameActive || isAiThinking || (gameMode === 'online' && currentPlayer !== myRole)}
            onCellClick={makeMove}
          />

          <div className="controls">
            <button 
              className="game-btn undo-btn" 
              onClick={undoMove} 
              disabled={!gameActive || gameMode === 'online'}
            >
              ↩ Undo
            </button>
            <button className="game-btn reset-btn" onClick={resetBoard}>🔄 Reset</button>
            <button className="game-btn new-game-btn" onClick={() => setScreen('setup')}>⚙ Menu</button>
          </div>
        </div>
      )}

      {/* Confetti and other global effects would go here */}
    </main>
  );
}
