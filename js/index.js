function updateTime() {
    const now = new Date();

    // Elements
    const bigClock = document.getElementById('clock');
    const taskbarClock = document.getElementById('tb-clock');
    const dateDisplay = document.getElementById('date-display');

    // Time formatting
    let h = now.getHours();
    let m = now.getMinutes();
    const displayH = h < 10 ? '0' + h : h;
    const displayM = m < 10 ? '0' + m : m;

    // AM/PM for taskbar
    const ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    h12 = h12 ? h12 : 12;

    // Set Values
    if (bigClock) {
        bigClock.innerText = `${displayH}:${displayM}`;
    }
    if (taskbarClock) {
        taskbarClock.innerText = `${h12}:${displayM} ${ampm}`;
    }

    // Date
    const dateOptions = { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' };
    if (dateDisplay) {
        dateDisplay.innerText = now.toLocaleDateString('en-US', dateOptions);
    }
}

function createRandomHearts() {
    const heartsLayer = document.getElementById('hearts-layer');
    if (!heartsLayer) return;

    const HEART_COUNT = 18;
    heartsLayer.innerHTML = '';

    for (let i = 0; i < HEART_COUNT; i++) {
        const heart = document.createElement('img');
        heart.src = 'imgs/heart-suit-svgrepo-com.svg';
        heart.alt = 'heart';
        heart.className = 'floating-heart';

        const size = Math.floor(Math.random() * 22) + 20; // 20 - 42
        const left = Math.floor(Math.random() * 92) + 2;
        const rot = Math.floor(Math.random() * 70) - 35;
        const opacity = (Math.random() * 0.35 + 0.25).toFixed(2);
        const drift = Math.floor(Math.random() * 46) - 23;
        const duration = (Math.random() * 5 + 8).toFixed(2);
        const delay = (Math.random() * 6).toFixed(2);

        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${left}%`;
        heart.style.setProperty('--heart-rot', `${rot}deg`);
        heart.style.setProperty('--heart-opacity', opacity);
        heart.style.setProperty('--heart-drift', `${drift}px`);
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `-${delay}s`;

        heartsLayer.appendChild(heart);
    }
}

// Initialize
setInterval(updateTime, 1000);
updateTime();
createRandomHearts();