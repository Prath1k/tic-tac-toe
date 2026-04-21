        // ========================
        // SOUND ENGINE (Web Audio)
        // ========================
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        let audioCtx = null;

        function ensureAudioCtx() {
            if (!audioCtx) audioCtx = new AudioCtx();
        }

        function playTone(freq, duration, type = 'sine', volume = 0.15) {
            ensureAudioCtx();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(volume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        }

        function playClickSound() { playTone(600, 0.1, 'sine', 0.1); }
        function playWinSound() {
            playTone(523, 0.15, 'sine', 0.12);
            setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100);
            setTimeout(() => playTone(784, 0.3, 'sine', 0.15), 200);
        }
        function playDrawSound() { playTone(300, 0.3, 'triangle', 0.1); }
        function playUndoSound() { playTone(400, 0.08, 'sine', 0.08); }

