        // ========================
        // SETUP FUNCTIONS
        // ========================
        function setMode(mode) {
            gameMode = mode;
            document.getElementById('modePlayer').classList.toggle('active', mode === 'player');
            document.getElementById('modeAI').classList.toggle('active', mode === 'ai');
            document.getElementById('modeOnline').classList.toggle('active', mode === 'online');
            document.getElementById('difficultySelector').classList.toggle('visible', mode === 'ai');
            document.getElementById('onlineLobby').classList.toggle('visible', mode === 'online');
            const p2Group = document.getElementById('player2Group');
            if (mode === 'ai' || mode === 'online') {
                p2Group.style.display = 'none';
            } else {
                p2Group.style.display = 'block';
            }
            // Cleanup peer on mode switch
            if (mode !== 'online') { destroyPeer(); }
            else { setLobbyTab('create'); }
        }

        function setDifficulty(diff, btn) {
            aiDifficulty = diff;
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }

        // ========================
        // GAME START
        // ========================
        function startGame(onlineNames) {
            const p1 = document.getElementById('playerXName').value.trim();
            const p2 = document.getElementById('playerOName').value.trim();

            if (onlineNames) {
                playerNames.X = onlineNames.X;
                playerNames.O = onlineNames.O;
            } else {
                playerNames.X = p1 || "Player 1";
                playerNames.O = (gameMode === 'ai') ? `AI (${aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)})` : (p2 || "Player 2");
            }

            document.getElementById('pXNameDisplay').innerText = `${playerNames.X} (X)`;
            document.getElementById('pONameDisplay').innerText = `${playerNames.O} (O)`;

            timerEnabled = (gameMode !== 'online') && document.getElementById('timerToggle').checked;
            timerBarContainer.classList.toggle('visible', timerEnabled);
            document.getElementById('onlineBadge').classList.toggle('visible', gameMode === 'online');

            setupScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            gameScreen.style.animation = 'none';
            gameScreen.offsetHeight;
            gameScreen.style.animation = 'fadeSlideUp 0.5s ease';

            scores = { X: 0, O: 0 };
            document.getElementById('scoreX').innerText = '0';
            document.getElementById('scoreO').innerText = '0';
            roundNumber = 1;
            winStreak = { player: null, count: 0 };
            updateRoundBadge();
            updateStreakBadge();
            resetBoard();

            if (gameMode === 'online' && myRole === 'O') {
                lockBoard();
            }
        }

        // ========================
        // CELL CLICK
        // ========================
        function handleCellClick(e) {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            const index = parseInt(cell.getAttribute('data-index'));

            if (gameState[index] !== "" || !gameActive || isAIThinking) return;
            // Online: only allow clicks on your own turn
            if (gameMode === 'online' && currentPlayer !== myRole) return;

            playClickSound();
            makeMove(cell, index);

            // Send move to remote player
            if (gameMode === 'online' && dataConn && dataConn.open) {
                dataConn.send({ type: 'move', index: index });
            }

            if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
                triggerAIMove();
            }
        }

        function makeMove(cell, index) {
            moveHistory.push({ index, player: currentPlayer, state: [...gameState] });
            gameState[index] = currentPlayer;
            cell.innerHTML = `<span>${currentPlayer}</span>`;
            cell.classList.add(currentPlayer.toLowerCase());

            updateUndoButton();
            handleResultValidation();
        }

        // ========================
        // RESULT VALIDATION
        // ========================
        function handleResultValidation() {
            let roundWon = false;
            let winningLine = [];

            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
                if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                    roundWon = true;
                    winningLine = winningConditions[i];
                    break;
                }
            }

            if (roundWon) {
                statusText.innerText = `🎉 ${playerNames[currentPlayer]} Wins!`;
                statusText.className = 'status win-text';
                gameActive = false;
                updateScore(currentPlayer);
                highlightWinner(winningLine);
                playWinSound();
                launchConfetti();
                updateWinStreak(currentPlayer);
                stopTimer();
                lockBoard();
                return;
            }

            if (!gameState.includes("")) {
                statusText.innerText = "😐 It's a Draw!";
                statusText.className = 'status draw-text';
                gameActive = false;
                playDrawSound();
                document.getElementById('board').classList.add('shake');
                setTimeout(() => document.getElementById('board').classList.remove('shake'), 600);
                resetWinStreak();
                stopTimer();
                lockBoard();
                return;
            }

            handlePlayerChange();
        }

        function handlePlayerChange() {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusText.innerText = `It's ${playerNames[currentPlayer]}'s turn`;
            statusText.className = 'status';

            scoreBoxX.className = currentPlayer === 'X' ? 'player-score active-x' : 'player-score';
            scoreBoxO.className = currentPlayer === 'O' ? 'player-score active-o' : 'player-score';

            updateHoverPreviews();

            if (timerEnabled) resetTimer();

            // Online: lock/unlock board based on turn
            if (gameMode === 'online') {
                if (currentPlayer !== myRole) lockBoard();
                else cells.forEach(c => c.classList.remove('locked'));
            }
        }

        function updateHoverPreviews() {
            cells.forEach(cell => {
                cell.classList.remove('preview-x', 'preview-o');
                cell.setAttribute('data-preview', currentPlayer);
                cell.classList.add(`preview-${currentPlayer.toLowerCase()}`);
            });
        }

        // ========================
        // SCORES, ROUNDS, STREAKS
        // ========================
        function updateScore(winner) {
            scores[winner]++;
            document.getElementById(`score${winner}`).innerText = scores[winner];
            roundNumber++;
            updateRoundBadge();
        }

        function updateRoundBadge() {
            roundBadge.innerText = `Round ${roundNumber}`;
        }

        function updateWinStreak(player) {
            if (winStreak.player === player) {
                winStreak.count++;
            } else {
                winStreak.player = player;
                winStreak.count = 1;
            }
            updateStreakBadge();
        }

        function resetWinStreak() {
            winStreak = { player: null, count: 0 };
            updateStreakBadge();
        }

        function updateStreakBadge() {
            if (winStreak.count >= 2) {
                streakBadge.innerText = `🔥 ${winStreak.count}-win streak!`;
                streakBadge.classList.add('visible');
            } else {
                streakBadge.classList.remove('visible');
            }
        }

        // ========================
        // WINNER HIGHLIGHT
        // ========================
        function highlightWinner(indices) {
            indices.forEach(index => {
                cells[index].classList.add('winner');
            });
        }

        function lockBoard() {
            cells.forEach(cell => cell.classList.add('locked'));
        }

        // ========================
        // TIMER
        // ========================
        function resetTimer() {
            stopTimer();
            timeRemaining = 15;
            timerBar.style.width = '100%';
            timerBar.className = 'timer-bar';

            timerInterval = setInterval(() => {
                timeRemaining -= 0.1;
                const pct = (timeRemaining / 15) * 100;
                timerBar.style.width = `${Math.max(0, pct)}%`;

                if (pct < 20) timerBar.className = 'timer-bar danger';
                else if (pct < 50) timerBar.className = 'timer-bar warning';

                if (timeRemaining <= 0) {
                    stopTimer();
                    // Skip turn
                    statusText.innerText = `⏰ ${playerNames[currentPlayer]} ran out of time!`;
                    handlePlayerChange();
                    if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
                        triggerAIMove();
                    }
                }
            }, 100);
        }

        function stopTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }

        // ========================
        // UNDO
        // ========================
        function undoMove() {
            if (moveHistory.length === 0 || !gameActive) return;
            if (isAIThinking) return;
            if (gameMode === 'online') return; // No undo in online

            // In AI mode, undo both AI + player moves
            if (gameMode === 'ai' && moveHistory.length >= 2) {
                undoSingleMove();
                undoSingleMove();
            } else if (gameMode === 'player') {
                undoSingleMove();
            }

            playUndoSound();
            updateUndoButton();
            if (timerEnabled) resetTimer();
        }

        function undoSingleMove() {
            const last = moveHistory.pop();
            if (!last) return;
            gameState[last.index] = "";
            const cell = cells[last.index];
            cell.innerHTML = "";
            cell.classList.remove('x', 'o', 'winner', 'locked');
            currentPlayer = last.player;

            statusText.innerText = `It's ${playerNames[currentPlayer]}'s turn`;
            statusText.className = 'status';
            scoreBoxX.className = currentPlayer === 'X' ? 'player-score active-x' : 'player-score';
            scoreBoxO.className = currentPlayer === 'O' ? 'player-score active-o' : 'player-score';
            updateHoverPreviews();
        }

        function updateUndoButton() {
            const canUndo = moveHistory.length > 0 && gameActive && !isAIThinking;
            undoBtn.disabled = !canUndo;
        }

        // ========================
        // RESET / NEW GAME
        // ========================
        function resetBoard() {
            gameActive = true;
            currentPlayer = "X";
            gameState = ["", "", "", "", "", "", "", "", ""];
            moveHistory = [];
            isAIThinking = false;

            statusText.innerText = `It's ${playerNames.X}'s turn`;
            statusText.className = 'status';
            statusText.style.display = 'block';
            aiThinkingEl.classList.remove('visible');

            scoreBoxX.className = 'player-score active-x';
            scoreBoxO.className = 'player-score';

            cells.forEach(cell => {
                cell.innerHTML = "";
                cell.classList.remove('x', 'o', 'winner', 'locked');
            });

            updateHoverPreviews();
            updateUndoButton();
            stopTimer();
            if (timerEnabled) resetTimer();

            // Online: send reset and lock if not X
            if (gameMode === 'online') {
                if (myRole === 'O') lockBoard();
            }
        }

        function newGame() {
            scores = { X: 0, O: 0 };
            document.getElementById('scoreX').innerText = "0";
            document.getElementById('scoreO').innerText = "0";
            stopTimer();
            destroyPeer();
            gameMode = 'player';
            gameScreen.style.display = 'none';
            setupScreen.style.display = 'block';
            setupScreen.style.animation = 'none';
            setupScreen.offsetHeight;
            setupScreen.style.animation = 'fadeSlideUp 0.5s ease';
            setMode('player');
            resetBoard();
        }

        // ========================
        // EVENT LISTENERS
        // ========================
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        updateHoverPreviews();

