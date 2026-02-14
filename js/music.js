// --- CONFIGURATION ---
const playlist = [
    { title: "Aquarium Dreams", artist: "Candy", src: "imgs/music/aquarium.mp3" },
    { title: "Night Watching", artist: "Sweetheart", src: "imgs/music/night.mp3" },
    { title: "Love Language", artist: "Honey", src: "imgs/music/love.mp3" }
    // Add more here. It's just one line per song!
];

// --- STATE MANAGEMENT ---
let songIndex = parseInt(localStorage.getItem('m_idx')) || 0;
let isPlaying = localStorage.getItem('m_play') === 'true';
let seekTime = parseFloat(localStorage.getItem('m_time')) || 0;

const audio = new Audio();
audio.src = playlist[songIndex].src;
audio.currentTime = seekTime;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initPlayer();
    if (isPlaying) {
        // Most browsers block autoplay until a click happens
        const playAttempt = setInterval(() => {
            audio.play().then(() => {
                clearInterval(playAttempt);
                updatePlayIcons(true);
            }).catch(() => { /* Waiting for user click */ });
        }, 1000);
    }
});

function initPlayer() {
    const logo = document.getElementById('music-logo');
    const pill = document.getElementById('song-pill');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const popup = document.getElementById('music-popup');

    // Toggle Popup
    logo.onclick = () => popup.classList.toggle('is-open');
    document.getElementById('close-music').onclick = () => popup.classList.remove('is-open');

    // Controls
    playBtn.onclick = togglePlay;
    nextBtn.onclick = () => changeSong(1);
    prevBtn.onclick = () => changeSong(-1);

    // Progress Bar Logic
    const progContainer = document.querySelector('.progress-container');
    progContainer.onclick = (e) => {
        const percent = e.offsetX / progContainer.clientWidth;
        audio.currentTime = percent * audio.duration;
    };

    updateUI();
    setInterval(syncState, 500);
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        isPlaying = true;
    } else {
        audio.pause();
        isPlaying = false;
    }
    updatePlayIcons(isPlaying);
    localStorage.setItem('m_play', isPlaying);
}

function changeSong(dir) {
    const pill = document.getElementById('song-pill');
    // Slide In animation
    pill.classList.remove('is-visible');
    
    setTimeout(() => {
        songIndex = (songIndex + dir + playlist.length) % playlist.length;
        audio.src = playlist[songIndex].src;
        audio.currentTime = 0;
        if (isPlaying) audio.play();
        
        updateUI();
        pill.classList.add('is-visible');
        localStorage.setItem('m_idx', songIndex);
    }, 400); // Matches CSS transition
}

function updateUI() {
    document.getElementById('pill-text').innerText = playlist[songIndex].title;
    document.getElementById('pop-title').innerText = playlist[songIndex].title;
    document.getElementById('pop-artist').innerText = playlist[songIndex].artist;
    updatePlayIcons(isPlaying);
}

function updatePlayIcons(playing) {
    const btn = document.getElementById('play-btn');
    const popBtn = document.getElementById('pop-play-btn'); // optional if you add one to popup
    btn.innerText = playing ? '⏸' : '▶';
}

function syncState() {
    if (!audio.paused) {
        localStorage.setItem('m_time', audio.currentTime);
        
        // Update Popup Bars
        const bar = document.getElementById('music-progress');
        const currTxt = document.getElementById('time-curr');
        const totalTxt = document.getElementById('time-total');
        
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            bar.style.width = pct + '%';
            currTxt.innerText = formatTime(audio.currentTime);
            totalTxt.innerText = formatTime(audio.duration);
        }
    }
}

function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
