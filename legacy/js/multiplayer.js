        // ========================
        // ONLINE MULTIPLAYER (PeerJS)
        // ========================
        function setLobbyTab(tab) {
            lobbyTab = tab;
            document.getElementById('lobbyCreate').classList.toggle('active', tab === 'create');
            document.getElementById('lobbyJoin').classList.toggle('active', tab === 'join');
            document.getElementById('createPanel').style.display = tab === 'create' ? 'block' : 'none';
            document.getElementById('joinPanel').style.display = tab === 'join' ? 'block' : 'none';
            if (tab === 'create') initCreateRoom();
            else destroyPeer();
        }

        function generateCode() {
            return String(Math.floor(1000 + Math.random() * 9000));
        }

        function destroyPeer() {
            if (dataConn) { try { dataConn.close(); } catch(e){} dataConn = null; }
            if (peer) { try { peer.destroy(); } catch(e){} peer = null; }
        }

        function initCreateRoom() {
            destroyPeer();
            roomCode = generateCode();
            document.getElementById('roomCodeText').innerText = roomCode;
            const status = document.getElementById('createStatus');
            status.className = 'conn-status waiting';
            status.innerHTML = '<span class="dot"></span> Waiting for opponent...';

            const peerId = 'ttt-' + roomCode;
            peer = new Peer(peerId);

            peer.on('open', () => {
                status.className = 'conn-status waiting';
                status.innerHTML = '<span class="dot"></span> Waiting for opponent...';
            });

            peer.on('connection', (conn) => {
                dataConn = conn;
                myRole = 'X';
                setupDataConnection(conn);
                conn.on('open', () => {
                    status.className = 'conn-status connected';
                    status.innerHTML = '<span class="dot"></span> Opponent connected!';
                    // Exchange names
                    const myName = document.getElementById('playerXName').value.trim() || 'Player 1';
                    conn.send({ type: 'hello', name: myName });
                });
            });

            peer.on('error', (err) => {
                if (err.type === 'unavailable-id') {
                    roomCode = generateCode();
                    document.getElementById('roomCodeText').innerText = roomCode;
                    setTimeout(initCreateRoom, 500);
                } else {
                    status.className = 'conn-status error';
                    status.innerHTML = '<span class="dot"></span> Connection error. Try again.';
                }
            });
        }

        function joinRoom() {
            const code = document.getElementById('joinCodeInput').value.trim();
            if (code.length !== 4) return;
            destroyPeer();

            const status = document.getElementById('joinStatus');
            status.style.display = 'flex';
            status.className = 'conn-status waiting';
            status.innerHTML = '<span class="dot"></span> <span class="text">Connecting...</span>';
            document.getElementById('joinBtn').disabled = true;

            roomCode = code;
            peer = new Peer();

            peer.on('open', () => {
                const conn = peer.connect('ttt-' + code, { reliable: true });
                dataConn = conn;
                myRole = 'O';

                conn.on('open', () => {
                    status.className = 'conn-status connected';
                    status.innerHTML = '<span class="dot"></span> <span class="text">Connected!</span>';
                    const myName = document.getElementById('playerXName').value.trim() || 'Player 2';
                    conn.send({ type: 'hello', name: myName });
                    setupDataConnection(conn);
                });

                conn.on('error', () => {
                    status.className = 'conn-status error';
                    status.innerHTML = '<span class="dot"></span> <span class="text">Failed to connect</span>';
                    document.getElementById('joinBtn').disabled = false;
                });
            });

            peer.on('error', (err) => {
                status.className = 'conn-status error';
                status.innerHTML = '<span class="dot"></span> <span class="text">Room not found</span>';
                document.getElementById('joinBtn').disabled = false;
            });
        }

        function setupDataConnection(conn) {
            let remoteName = 'Opponent';

            conn.on('data', (data) => {
                switch (data.type) {
                    case 'hello':
                        remoteName = data.name;
                        if (myRole === 'X') {
                            // Host starts the game
                            const myName = document.getElementById('playerXName').value.trim() || 'Player 1';
                            setTimeout(() => {
                                gameMode = 'online';
                                startGame({ X: myName, O: remoteName });
                            }, 600);
                        } else {
                            // Guest waits for host hello, already got it
                            conn.send({ type: 'hello', name: document.getElementById('playerXName').value.trim() || 'Player 2' });
                        }
                        break;
                    case 'start':
                        gameMode = 'online';
                        startGame({ X: data.names.X, O: data.names.O });
                        break;
                    case 'move':
                        if (gameState[data.index] === '' && gameActive) {
                            playClickSound();
                            const cell = cells[data.index];
                            makeMove(cell, data.index);
                        }
                        break;
                    case 'reset':
                        resetBoard();
                        break;
                    case 'rematch':
                        resetBoard();
                        break;
                }
            });

            conn.on('close', () => showDisconnectOverlay());
        }

        // Override resetBoard click for online sync
        const _origResetBoard = resetBoard;
        const boardResetBtn = document.querySelector('.reset-btn');
        boardResetBtn.addEventListener('click', () => {
            if (gameMode === 'online' && dataConn && dataConn.open) {
                dataConn.send({ type: 'reset' });
            }
        }, true);

        function showDisconnectOverlay() {
            document.getElementById('disconnectOverlay').classList.add('visible');
        }

        function closeDisconnectOverlay() {
            document.getElementById('disconnectOverlay').classList.remove('visible');
            newGame();
        }

        function copyRoomCode() {
            navigator.clipboard.writeText(roomCode).then(() => {
                const btn = document.getElementById('copyBtn');
                btn.innerText = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => { btn.innerText = 'Copy'; btn.classList.remove('copied'); }, 2000);
            });
        }
