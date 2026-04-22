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
    <div className="online-lobby" id="onlineLobby">
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
        <div id="createPanel" style={{ animation: 'setup-slide 0.3s ease' }}>
          <div className="room-code-display" id="roomCodeBox">
            <div className="label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '8px' }}>ROOM CODE</div>
            <div className="code" id="roomCodeText">{roomCode || '----'}</div>
            <button 
              className={`copy-btn ${copyText === 'Copied!' ? 'copied' : ''}`} 
              onClick={handleCopy}
              style={{ position: 'static', marginTop: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: '8px', color: '#fff', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
            >
              {copyText.toUpperCase()}
            </button>
          </div>
          <div className={`conn-status ${status.includes('Connected') ? 'connected' : 'waiting'}`} style={{ marginTop: '15px', fontSize: '0.8rem', fontWeight: 700, color: status.includes('Connected') ? '#4ade80' : '#fbbf24' }}>
            {status.toUpperCase() || 'INITIALIZING...'}
          </div>
        </div>
      ) : (
        <div id="joinPanel" style={{ animation: 'setup-slide 0.3s ease' }}>
          <div className="join-input" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              maxLength={4} 
              placeholder="0000" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/[^0-9]/g, ''))}
              style={{ textAlign: 'center', letterSpacing: '10px', fontSize: '1.5rem' }}
            />
            <button 
              className="start-btn" 
              style={{ padding: '12px' }}
              onClick={() => onJoinRoom(inputCode)} 
              disabled={inputCode.length !== 4}
            >
              JOIN ROOM
            </button>
          </div>
          <div className={`conn-status ${status.includes('Connected') ? 'connected' : 'waiting'}`} style={{ marginTop: '15px', fontSize: '0.8rem', fontWeight: 700, color: status.includes('Connected') ? '#4ade80' : '#fbbf24' }}>
             {status.toUpperCase() || 'ENTER CODE'}
          </div>
        </div>
      )}
    </div>
  );
};
