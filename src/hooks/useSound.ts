'use client';

import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  };

  const playSound = useCallback((frequency: number, type: OscillatorType, duration: number, volume: number) => {
    initAudio();
    if (!audioCtx.current) return;

    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);

    gain.gain.setValueAtTime(volume, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  }, []);

  const playMove = useCallback(() => {
    playSound(600, 'sine', 0.1, 0.1);
  }, [playSound]);

  const playWin = useCallback(() => {
    initAudio();
    const now = audioCtx.current!.currentTime;
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => {
        playSound(freq, 'triangle', 0.3, 0.1);
      }, i * 100);
    });
  }, [playSound]);

  const playDraw = useCallback(() => {
    playSound(150, 'square', 0.2, 0.05);
  }, [playSound]);

  return { playMove, playWin, playDraw };
};
