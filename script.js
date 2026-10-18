
const overlay = document.getElementById('flashlight-overlay');
window.addEventListener('mousemove', (e) => {
    overlay.style.setProperty('--x', `${e.clientX}px`);
    overlay.style.setProperty('--y', `${e.clientY}px`);
});

const introScreen = document.getElementById('intro-screen');
const startBtn = document.getElementById('start-btn');
const scoreCounter = document.getElementById('score-counter');
const scoreDisplay = document.getElementById('current-score');
const batsContainer = document.getElementById('bats-container');

const MAX_BATS = 10;
let score = 0;

const bgMusic = new Audio('imgs/spooky.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

window.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.currentTime = 3.3;
        bgMusic.play().catch(err => console.log("Audio block:", err));
    }
}, { once: true });

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freqStart, freqEnd, type, duration = 0.12) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
}

startBtn.addEventListener('click', () => {
    introScreen.style.display = 'none';
    scoreCounter.style.display = 'block';
    initGame();
});

function getRandomPos() {
    return {
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 70) + 15
    };
}

function initGame() {
    batsContainer.innerHTML = '';
    score = 0;
    scoreDisplay.textContent = score;

    for (let i = 0; i < MAX_BATS; i++) {
        const bat = document.createElement('div');
        bat.className = 'bat';
        bat.innerHTML = '<img src="imgs/bat.png" alt="bat">';

        const pos = getRandomPos();
        bat.style.position = 'absolute';
        bat.style.left = `${pos.x}vw`;
        bat.style.top = `${pos.y}vh`;

        bat.addEventListener('click', () => {
            if (bat.classList.contains('caught')) return;

           
            playTone(1000, 900, 'sine');
            setTimeout(() => playTone(800, 1320, 'triangle', 0.1), 30);

           
            bat.classList.add('caught');
            bat.style.opacity = '0';
            bat.style.pointerEvents = 'none';

            score++;
            scoreDisplay.textContent = score;

           
            if (score === MAX_BATS) {
                setTimeout(() => {
                    alert("GG! You found all the hidden bats!");
                }, 300);
            }
        });

        batsContainer.appendChild(bat);
    }
}
