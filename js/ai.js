        // ========================
        // AI ENGINE
        // ========================
        function triggerAIMove() {
            if (!gameActive) return;
            isAIThinking = true;
            aiThinkingEl.classList.add('visible');
            statusText.style.display = 'none';
            lockBoard();
            stopTimer();

            const delay = aiDifficulty === 'hard' ? 600 : 400;

            setTimeout(() => {
                const move = getAIMove();
                if (move !== -1 && gameActive) {
                    const cell = cells[move];
                    playClickSound();
                    makeMove(cell, move);
                }
                isAIThinking = false;
                aiThinkingEl.classList.remove('visible');
                statusText.style.display = 'block';
                cells.forEach(c => c.classList.remove('locked'));
                updateUndoButton();
                if (timerEnabled && gameActive) resetTimer();
            }, delay);
        }

        function getAIMove() {
            switch (aiDifficulty) {
                case 'easy': return getRandomMove();
                case 'medium': return getMediumMove();
                case 'hard': return getBestMove();
                default: return getRandomMove();
            }
        }

        // --- Easy: Random ---
        function getRandomMove() {
            const empty = gameState.map((v, i) => v === "" ? i : null).filter(v => v !== null);
            return empty.length > 0 ? empty[Math.floor(Math.random() * empty.length)] : -1;
        }

        // --- Medium: Block/Win then random ---
        function getMediumMove() {
            // Try to win
            for (const [a, b, c] of winningConditions) {
                const line = [gameState[a], gameState[b], gameState[c]];
                if (line.filter(v => v === 'O').length === 2 && line.includes('')) {
                    return [a, b, c][line.indexOf('')];
                }
            }
            // Try to block
            for (const [a, b, c] of winningConditions) {
                const line = [gameState[a], gameState[b], gameState[c]];
                if (line.filter(v => v === 'X').length === 2 && line.includes('')) {
                    return [a, b, c][line.indexOf('')];
                }
            }
            // Take center
            if (gameState[4] === '') return 4;
            return getRandomMove();
        }

        // --- Hard: Minimax ---
        function minimax(board, depth, isMaximizing) {
            // Check terminal states
            for (const [a, b, c] of winningConditions) {
                if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
                    return board[a] === 'O' ? 10 - depth : depth - 10;
                }
            }
            if (!board.includes('')) return 0;

            if (isMaximizing) {
                let best = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'O';
                        best = Math.max(best, minimax(board, depth + 1, false));
                        board[i] = '';
                    }
                }
                return best;
            } else {
                let best = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'X';
                        best = Math.min(best, minimax(board, depth + 1, true));
                        board[i] = '';
                    }
                }
                return best;
            }
        }

        function getBestMove() {
            let bestScore = -Infinity;
            let bestMove = -1;
            const board = [...gameState];

            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = minimax(board, 0, false);
                    board[i] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            return bestMove;
        }

