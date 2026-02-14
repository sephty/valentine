const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    let gameState = 'START';
    let score = 0;
    const WIN_SCORE = 15;
    let player;
    let stars = [];
    let particles = [];

    const loveMeter = document.getElementById('love-fill');
    const startScreen = document.getElementById('start-screen');
    const proposalScreen = document.getElementById('proposal-screen');
    const celebrationScreen = document.getElementById('celebration-screen');
    const noScreen = document.getElementById('no-screen');
    const startBtn = document.getElementById('start-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const backBtn = document.getElementById('back-btn');

    function resize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (player) player.y = canvas.height - 52;
    }

    window.addEventListener('resize', resize);

    class Player {
        constructor() {
            this.w = 95;
            this.h = 22;
            this.x = canvas.width / 2 - this.w / 2;
            this.y = canvas.height - 52;
        }

        draw() {
            const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
            grad.addColorStop(0, '#ffd166');
            grad.addColorStop(1, '#f7c948');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.w, this.h, 12);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(this.x + 8, this.y - 8, this.w - 16, 12, 10);
            ctx.stroke();
        }
    }

    class Star {
        constructor() {
            this.size = Math.random() * 16 + 14;
            this.x = Math.random() * (canvas.width - this.size * 2) + this.size;
            this.y = -this.size;
            this.speed = Math.random() * 2.4 + 1.7;
            this.color = Math.random() > 0.5 ? '#ffd166' : '#f9e27d';
        }

        draw() {
            drawStar(this.x, this.y, 5, this.size, this.size * 0.45, this.color);
        }

        update() {
            this.y += this.speed;
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.r = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 3;
            this.life = 50;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 1;
        }

        draw() {
            ctx.globalAlpha = Math.max(this.life / 50, 0);
            ctx.fillStyle = '#fff4bf';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

function drawSkyDots() {
    // I increased the count to 55 to make the background look a bit more magical
    for (let i = 0; i < 55; i++) {
        // Pseudo-random math to keep stars in the same spot so they don't flicker
        const x = (i * 137) % canvas.width;
        const y = (i * 89) % (canvas.height * 0.8);
        
        // Vary the size slightly (between 2 and 4 pixels)
        const outerRadius = (i % 3) + 2; 
        const innerRadius = outerRadius * 0.45;
        const spikes = 5;
        const color = 'rgba(255, 255, 255, 0.35)'; // The same soft tiny color as the dots

        // cx, cy, spikes, outerRadius, innerRadius, color
        drawStar(x, y, spikes, outerRadius, innerRadius, color);
    }
}

    function spawnStar() {
        if (Math.random() < 0.04) stars.push(new Star());
    }

    function createParticles(x, y) {
        for (let i = 0; i < 8; i++) particles.push(new Particle(x, y));
    }

    function updateScore() {
        const percentage = (score / WIN_SCORE) * 100;
        if (loveMeter) loveMeter.style.width = `${percentage}%`;
    }

    function triggerProposal() {
        gameState = 'PROPOSAL';
        setTimeout(() => {
            proposalScreen?.classList.remove('hidden');
        }, 350);
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSkyDots();

        if (gameState === 'PLAYING') {
            player.draw();
            spawnStar();

            stars.forEach((star, index) => {
                star.update();
                star.draw();

                const catches =
                    star.y + star.size > player.y &&
                    star.x > player.x &&
                    star.x < player.x + player.w;

                if (catches) {
                    createParticles(star.x, star.y);
                    stars.splice(index, 1);
                    score += 1;
                    updateScore();
                    if (score >= WIN_SCORE) triggerProposal();
                } else if (star.y > canvas.height + 25) {
                    stars.splice(index, 1);
                }
            });

            particles.forEach((p, idx) => {
                p.update();
                p.draw();
                if (p.life <= 0) particles.splice(idx, 1);
            });
        }

        requestAnimationFrame(updateGame);
    }

    function startGame() {
        resize();
        score = 0;
        updateScore();
        stars = [];
        particles = [];
        player = new Player();
        gameState = 'PLAYING';
        startScreen?.classList.add('hidden');
    }

    function movePlayer(event) {
        if (!player) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
        player.x = clientX - rect.left - player.w / 2;
        if (player.x < 0) player.x = 0;
        if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
    }

    startBtn?.addEventListener('click', startGame);
    yesBtn?.addEventListener('click', () => {
        proposalScreen?.classList.add('hidden');
        celebrationScreen?.classList.remove('hidden');
    });
    noBtn?.addEventListener('click', () => {
        proposalScreen?.classList.add('hidden');
        noScreen?.classList.remove('hidden');
    });
    backBtn?.addEventListener('click', () => {
        noScreen?.classList.add('hidden');
        proposalScreen?.classList.remove('hidden');
    });
    window.addEventListener('mousemove', movePlayer);
    window.addEventListener('touchmove', movePlayer, { passive: true });

    resize();
    updateGame();
}
