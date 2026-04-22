        // ========================
        // CONFETTI ENGINE
        // ========================
        const confettiCanvas = document.getElementById('confetti-canvas');
        const confettiCtx = confettiCanvas.getContext('2d');
        let confettiPieces = [];
        let confettiAnimId = null;

        function resizeConfettiCanvas() {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeConfettiCanvas);
        resizeConfettiCanvas();

        function launchConfetti() {
            confettiPieces = [];
            const colors = ['#4cc9f0', '#f72585', '#ffc300', '#7209b7', '#3a0ca3', '#4361ee', '#e94560'];
            for (let i = 0; i < 150; i++) {
                confettiPieces.push({
                    x: Math.random() * confettiCanvas.width,
                    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
                    w: Math.random() * 10 + 5,
                    h: Math.random() * 6 + 3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 4,
                    vy: Math.random() * 3 + 2,
                    angle: Math.random() * 360,
                    spin: (Math.random() - 0.5) * 10,
                    opacity: 1,
                });
            }
            if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
            animateConfetti();
        }

        function animateConfetti() {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let alive = false;
            confettiPieces.forEach(p => {
                if (p.opacity <= 0) return;
                alive = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.angle += p.spin;
                if (p.y > confettiCanvas.height) p.opacity -= 0.02;
                confettiCtx.save();
                confettiCtx.translate(p.x, p.y);
                confettiCtx.rotate((p.angle * Math.PI) / 180);
                confettiCtx.globalAlpha = Math.max(0, p.opacity);
                confettiCtx.fillStyle = p.color;
                confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                confettiCtx.restore();
            });
            if (alive) {
                confettiAnimId = requestAnimationFrame(animateConfetti);
            } else {
                confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }

