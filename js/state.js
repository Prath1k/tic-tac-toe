        // ========================
        // STATE
        // ========================
        let currentPlayer = 'X';
        let gameState = ["", "", "", "", "", "", "", "", ""];
        let gameActive = true;
        let scores = { X: 0, O: 0 };
        let playerNames = { X: "Player 1", O: "Player 2" };
        let gameMode = 'player'; // 'player', 'ai', or 'online'
        let aiDifficulty = 'easy';
        let moveHistory = [];
        let roundNumber = 1;
        let winStreak = { player: null, count: 0 };
        let timerEnabled = false;
        let timerInterval = null;
        let timeRemaining = 15;
        let isAIThinking = false;

        // Online state
        let peer = null;
        let dataConn = null;
        let myRole = null; // 'X' or 'O'
        let roomCode = '';
        let lobbyTab = 'create';

        // ========================
        // DOM ELEMENTS
        // ========================
        const setupScreen = document.getElementById('setupScreen');
        const gameScreen = document.getElementById('gameScreen');
        const statusText = document.getElementById('statusText');
        const cells = document.querySelectorAll('.cell');
        const scoreBoxX = document.getElementById('scoreBoxX');
        const scoreBoxO = document.getElementById('scoreBoxO');
        const roundBadge = document.getElementById('roundBadge');
        const streakBadge = document.getElementById('streakBadge');
        const undoBtn = document.getElementById('undoBtn');
        const timerBarContainer = document.getElementById('timerBarContainer');
        const timerBar = document.getElementById('timerBar');
        const aiThinkingEl = document.getElementById('aiThinking');

        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

