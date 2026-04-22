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
import { useSound } from '@/hooks/useSound';
import { Confetti } from '@/components/ui/Confetti';
import { GameMode, Difficulty, Player } from '@/types/game';

export default function TicTacToePage() {
  // Hooks
  const { 
    board, currentPlayer, gameActive, scores, playerNames, 
    status, winningLine, makeMove, resetBoard, undoMove, 
    setPlayerNames, setRoundNumber 
  } = useGame();
  
  const { playMove, playWin, playDraw } = useSound();
  const { getAIMove } = useAI();
  const { 
    roomCode, lobbyStatus, isConnected, myRole, 
    createRoom, joinRoom, sendData, destroyPeer 
  } = useMultiplayer();
  
  const { user, signOut } = useAuth();

  // Local UI State
  const [screen, setScreen] = useState<'setup' | 'game'>('setup');
  const [gameMode, setGameMode] = useState<GameMode>('player');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Sync player name with user info
  useEffect(() => {
    if (user && screen === 'setup') {
      const name = user.user_metadata?.username || user.email?.split('@')[0] || 'Player 1';
      setPlayerNames(prev => ({ ...prev, X: name }));
    }
  }, [user, screen, setPlayerNames]);

  // Audio Effects
  useEffect(() => {
    if (screen === 'game') {
      const moveCount = board.filter(cell => cell !== null).length;
      if (moveCount > 0 && gameActive) {
        playMove();
      }
      
      if (!gameActive) {
        if (winningLine) {
          playWin();
        } else if (board.every(cell => cell !== null)) {
          playDraw();
        }
      }
    }
  }, [board, gameActive, winningLine, screen, playMove, playWin, playDraw]);

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
      <Confetti active={!!winningLine} />
      
      <div className="header-auth">
        {user ? (
          <div className="user-pill glass">
            <div className="avatar">
              {(user.user_metadata?.username || user.email)?.[0].toUpperCase()}
            </div>
            <span className="user-name">
              {user.user_metadata?.username || user.email?.split('@')[0]}
            </span>
            <button 
              onClick={() => signOut()} 
              className="auth-link" 
              style={{ fontSize: '0.75rem', marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <a href="/login" className="user-pill glass auth-link" style={{ fontSize: '0.85rem' }}>
            Sign In
          </a>
        )}
      </div>

      <h1>Tic-Tac-Toe</h1>

      {screen === 'setup' ? (
        <SetupScreen 
          onStart={handleStartGame}
          initialPlayerX={playerNames.X}
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
    </main>
  );
}
