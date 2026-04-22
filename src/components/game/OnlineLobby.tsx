'use client';

import React, { useState } from 'react';

interface OnlineLobbyProps {
  roomCode: string;
  status: string;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onCopyCode: () => void;
}

export const OnlineLobby: React.FC<OnlineLobbyProps> = ({
  roomCode,
  status,
  onCreateRoom,
  onJoinRoom,
  onCopyCode,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [inputCode, setInputCode] = useState('');
  const [copyText, setCopyText] = useState('Copy');

  const handleCopy = () => {
    onCopyCode();
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy'), 2000);
  };

  return (
    <div className="online-lobby visible" id="onlineLobby">
      <div className="lobby-options">
        <button 
          className={`lobby-btn ${tab === 'create' ? 'active' : ''}`} 
          onClick={() => { setTab('create'); onCreateRoom(); }}
        >
          Create Room
        </button>
        <button 
          className={`lobby-btn ${tab === 'join' ? 'active' : ''}`} 
          onClick={() => setTab('join')}
        >
          Join Room
        </button>
      </div>

      {tab === 'create' ? (
        <div id="createPanel">
          <div className="room-code-display" id="roomCodeBox">
            <div className="label">Your Room Code</div>
            <div className="code" id="roomCodeText">{roomCode || '----'}</div>
            <button 
              className={`copy-btn ${copyText === 'Copied!' ? 'copied' : ''}`} 
              onClick={handleCopy}
            >
              {copyText}
            </button>
          </div>
          <div className={`conn-status ${status.includes('Connected') ? 'connected' : 'waiting'}`} id="createStatus">
            <span className="dot"></span> {status || 'Initializing...'}
          </div>
        </div>
      ) : (
        <div id="joinPanel">
          <div className="join-input">
            <input 
              type="text" 
              maxLength={4} 
              placeholder="0000" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <button onClick={() => onJoinRoom(inputCode)} disabled={inputCode.length !== 4}>
              Connect
            </button>
          </div>
          <div className={`conn-status ${status.includes('Connected') ? 'connected' : 'waiting'}`} id="joinStatus">
            <span className="dot"></span> <span className="text">{status || 'Enter code to join'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
