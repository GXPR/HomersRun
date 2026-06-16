/**
 * Homer's Run - v4 (Final)
 * 
 * Complete redesign matching user layout requirements:
 * - Start overlay with homer_en_lisa.webp + English dynamic instruction (spacebar vs tap)
 * - Thin in-game UI (left score | right best) for maximum play space
 * - Game Over overlay with homer_doh.webp + still feel
 * - All previous improvements retained: irregular spawns, session best score, smooth physics, mobile support
 */

document.addEventListener('DOMContentLoaded', () => {
    // === DOM References ===
    const homer = document.querySelector('.homer');
    const grid = document.querySelector('.grid');
    const desert = document.getElementById('desert');
    const startScreen = document.getElementById('startScreen');
    const gameUI = document.getElementById('gameUI');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const bestScoreDisplay = document.getElementById('bestScoreDisplay');
    const finalScore = document.getElementById('finalScore');
    const finalBestScore = document.getElementById('finalBestScore');
    const restartBtn = document.getElementById('restartGame');
    const startInstruction = document.getElementById('startInstruction');
    const sound = document.getElementById('homerDoh');

    // === Config ===
    const GROUND = 12;
    const HOMER_LEFT = 50;
    const HOMER_WIDTH = 180;
    const LISA_WIDTH = 90;
    const JUMP_VELOCITY = 13.8;
    const GRAVITY = 0.52;
    const INITIAL_SPEED = 7.8;
    const SPEED_INCREASE = 0.00075;
    const BASE_SPAWN_MIN = 1300;
    const BASE_SPAWN_MAX = 2850;
    const MAX_OBSTACLES = 5;

    // === State ===
    let isJumping = false;
    let isGameOver = false;
    let hasStarted = false;
    let velocity = 0;
    let position = GROUND;
    let obstacles = [];
    let score = 0;
    let bestScore = parseInt(sessionStorage.getItem('homerBestScore')) || 0;
    let lastTime = 0;
    let gameSpeed = INITIAL_SPEED;
    let rafId = null;
    let spawnTimeoutId = null;
    let scoreIntervalId = null;

    // Set initial best score
    bestScoreDisplay.textContent = bestScore;

    // === Device detection for instruction text ===
    function setInstructionText() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                      || ('ontouchstart' in window) 
                      || window.innerWidth < 768;

        if (startInstruction) {
            startInstruction.textContent = isMobile 
                ? "Tap screen to start and jump" 
                : "Press spacebar to start and jump";
        }
    }
    setInstructionText();
    window.addEventListener('resize', setInstructionText);

    // === Audio ===
    function playSound() {
        if (!sound) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    // === Input (works on start screen + during game + game over) ===
    function handleInput(e) {
        const isSpace = e.type === 'keydown' && (e.key === ' ' || e.keyCode === 32);
        const isTouchOrClick = e.type === 'touchstart' || e.type === 'pointerdown' || e.type === 'click';

        if (!hasStarted) {
            // First interaction → start the game
            if (isSpace || isTouchOrClick) {
                e.preventDefault();
                startGame();
            }
            return;
        }

        if (!isGameOver) {
            if ((isSpace || isTouchOrClick) && !isJumping) {
                isJumping = true;
                velocity = JUMP_VELOCITY;
                e.preventDefault();
            }
        } else {
            // Game over → restart on space or tap
            if (isSpace || isTouchOrClick) {
                e.preventDefault();
                restartGame();
            }
        }
    }

    document.addEventListener('keydown', handleInput);
    document.addEventListener('touchstart', handleInput, { passive: false });
    document.addEventListener('pointerdown', handleInput, { passive: false });

    // Also allow clicking the restart button (already has onclick)

    // === Create Lisa ===
    function createLisa(startLeft = null) {
        if (isGameOver || obstacles.length >= MAX_OBSTACLES) return;

        const lisa = document.createElement('div');
        lisa.classList.add('lisa');
        grid.appendChild(lisa);

        const leftPos = startLeft !== null ? startLeft : (grid.offsetWidth + 70);
        lisa.style.left = `${leftPos}px`;
        obstacles.push({ el: lisa, left: leftPos });
    }

    // === Irregular spawn ===
    function scheduleNextSpawn() {
        if (isGameOver) return;

        const progress = Math.min(score / 75, 1);
        const minInt = Math.max(850, BASE_SPAWN_MIN - progress * 420);
        const maxInt = Math.max(1350, BASE_SPAWN_MAX - progress * 550);

        const interval = minInt + Math.random() * (maxInt - minInt);

        spawnTimeoutId = setTimeout(() => {
            createLisa();
            scheduleNextSpawn();
        }, interval);
    }

    // === Score + speed ===
    function startScoreCounter() {
        if (scoreIntervalId) clearInterval(scoreIntervalId);
        scoreIntervalId = setInterval(() => {
            if (!isGameOver && hasStarted) {
                score++;
                scoreDisplay.textContent = score;
                gameSpeed = INITIAL_SPEED + (score * SPEED_INCREASE * 60);
            }
        }, 115);
    }

    // === Collision ===
    function checkCollision(obsLeft) {
        // Slightly more forgiving hitbox (user request)
        const homerRight = HOMER_LEFT + HOMER_WIDTH * 0.58;
        const lisaRight = obsLeft + LISA_WIDTH * 0.82;
        return (lisaRight > HOMER_LEFT && obsLeft < homerRight) && (position < 42);
    }

    // === Main Game Loop ===
    function gameLoop(timestamp = 0) {
        if (isGameOver || !hasStarted) return;

        if (!lastTime) lastTime = timestamp;
        lastTime = timestamp;

        // Jump physics
        if (isJumping) {
            position += velocity;
            velocity -= GRAVITY;
            if (position <= GROUND) {
                position = GROUND;
                velocity = 0;
                isJumping = false;
            }
            homer.style.bottom = `${position}px`;
        }

        // Move obstacles + check hit
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.left -= gameSpeed;
            obs.el.style.left = `${obs.left}px`;

            if (checkCollision(obs.left)) {
                endGame();
                return;
            }
            if (obs.left < -LISA_WIDTH - 40) {
                obs.el.remove();
                obstacles.splice(i, 1);
            }
        }

        rafId = requestAnimationFrame(gameLoop);
    }

    // === START THE GAME ===
    function startGame() {
        // Only guard the very first start from input; restarts bypass this
        if (hasStarted && !isGameOver) return;

        hasStarted = true;
        isGameOver = false;

        // Hide start overlay, show thin game UI
        startScreen.style.display = 'none';
        gameUI.style.display = 'flex';

        // Reset game state
        score = 0;
        scoreDisplay.textContent = '0';
        gameSpeed = INITIAL_SPEED;
        position = GROUND;
        velocity = 0;
        isJumping = false;
        obstacles = [];
        lastTime = 0;

        homer.style.display = 'block';
        homer.style.bottom = `${GROUND}px`;
        homer.style.transform = 'none';

        // Clean any leftover Lisas
        document.querySelectorAll('.lisa').forEach(el => el.remove());

        // Start desert animation
        if (desert) desert.style.animationPlayState = 'running';

        // First Lisa + scheduler
        setTimeout(() => {
            if (hasStarted && !isGameOver) createLisa();
        }, 650 + Math.random() * 500);

        scheduleNextSpawn();
        startScoreCounter();

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(gameLoop);
    }

    // === GAME OVER with overlay ===
    function endGame() {
        isGameOver = true;
        hasStarted = true; // keep true so we don't restart accidentally

        // Stop everything
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (spawnTimeoutId) { clearTimeout(spawnTimeoutId); spawnTimeoutId = null; }
        if (scoreIntervalId) { clearInterval(scoreIntervalId); scoreIntervalId = null; }

        playSound();

        // Freeze desert
        if (desert) desert.style.animationPlayState = 'paused';

        // Hide Homer
        homer.style.display = 'none';

        // Remove all current Lisas
        document.querySelectorAll('.lisa').forEach(el => el.remove());
        obstacles = [];

        // Create one big dancing Lisa in the center (taunt)
        const centerLisa = document.createElement('div');
        centerLisa.classList.add('lisa', 'game-over-lisa');
        grid.appendChild(centerLisa);
        const centerX = Math.max(100, Math.floor(grid.offsetWidth * 0.46));
        centerLisa.style.left = `${centerX}px`;

        // Update final scores
        finalScore.textContent = score;
        finalBestScore.textContent = bestScore;

        // Update best score if beaten
        if (score > bestScore) {
            bestScore = score;
            sessionStorage.setItem('homerBestScore', bestScore);
            bestScoreDisplay.textContent = bestScore;
            finalBestScore.textContent = bestScore;
            finalBestScore.style.color = '#00ff9d';
        }

        // Show game over overlay
        gameOverScreen.style.display = 'flex';
        gameUI.style.display = 'none'; // hide thin bar during game over
    }

    // === RESTART ===
    window.restartGame = function() {
        // Cleanup
        if (spawnTimeoutId) clearTimeout(spawnTimeoutId);
        if (scoreIntervalId) clearInterval(scoreIntervalId);
        if (rafId) cancelAnimationFrame(rafId);

        document.querySelectorAll('.lisa').forEach(el => el.remove());

        // Hide game over overlay
        gameOverScreen.style.display = 'none';

        // Reset best score color
        finalBestScore.style.color = '#fff';

        // Restart fresh game
        startGame();
    };

    // === INITIAL STATE ===
    // Show start screen, hide game UI and game over
    startScreen.style.display = 'flex';
    gameUI.style.display = 'none';
    gameOverScreen.style.display = 'none';

    // Hide Homer completely until the game actually starts (no running GIF on start screen)
    if (homer) homer.style.display = 'none';

    // Make sure desert is paused at very beginning (still background on start)
    if (desert) desert.style.animationPlayState = 'paused';

    // Focus for keyboard
    document.body.setAttribute('tabindex', '0');
    document.body.focus();

    // Bonus: allow clicking anywhere on start overlay to begin (already handled by input listener)
});