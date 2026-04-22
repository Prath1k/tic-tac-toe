'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '@/types/game';
import Peer, { DataConnection } from 'peerjs';

export function useMultiplayer() {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [myRole, setMyRole] = useState<Player | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');
  const [lobbyStatus, setLobbyStatus] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  
  const connectionRef = useRef<DataConnection | null>(null);

  const generateCode = () => String(Math.floor(1000 + Math.random() * 9000));

  const initPeer = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // In a real app, you might want to use a custom PeerJS server
    // but the default PeerJS Cloud server works for demo purposes.
  }, []);

  const createRoom = useCallback(() => {
    const code = generateCode();
    setRoomCode(code);
    setLobbyStatus('Waiting for opponent...');
    
    const newPeer = new Peer(`ttt-${code}`);
    setPeer(newPeer);
    setMyRole('X');

    newPeer.on('connection', (conn) => {
      setConnection(conn);
      connectionRef.current = conn;
      setIsConnected(true);
      setLobbyStatus('Opponent connected!');
    });

    newPeer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        // Retry with a new code if ID is taken
        createRoom();
      } else {
        setLobbyStatus('Connection error. Try again.');
      }
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  const joinRoom = useCallback((code: string) => {
    const newPeer = new Peer();
    setPeer(newPeer);
    setMyRole('O');
    setLobbyStatus('Connecting...');

    newPeer.on('open', () => {
      const conn = newPeer.connect(`ttt-${code}`, { reliable: true });
      setConnection(conn);
      connectionRef.current = conn;

      conn.on('open', () => {
        setIsConnected(true);
        setLobbyStatus('Connected!');
      });

      conn.on('error', () => {
        setLobbyStatus('Failed to connect');
      });
    });

    newPeer.on('error', () => {
      setLobbyStatus('Room not found');
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  const sendData = (data: any) => {
    if (connectionRef.current && connectionRef.current.open) {
      connectionRef.current.send(data);
    }
  };

  const destroyPeer = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
    setIsConnected(false);
    setConnection(null);
  };

  return {
    peer,
    connection,
    myRole,
    roomCode,
    lobbyStatus,
    isConnected,
    createRoom,
    joinRoom,
    sendData,
    destroyPeer,
  };
}
