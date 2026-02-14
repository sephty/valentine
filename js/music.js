// --- CONFIGURATION ---
// --- CONFIGURATION ---
const playlist = [
    { title: "Sweet", artist: "Cigarettes After Sex", src: "imgs/music/Cigarettes After Sex - Sweet (SPOTISAVER).mp3" },
    { title: "Hanae", artist: "Hanae", src: "imgs/music/Hanae(SPOTISAVER).mp3" },
    { title: "The Flower Garden", artist: "Joe Hisaishi", src: "imgs/music/Joe Hisaishi - The Flower Garden (SPOTISAVER).mp3" },
    { title: "Love You Anyway", artist: "The Marias", src: "imgs/music/The Marias - Love You Anyway (SPOTISAVER).mp3" },
    { title: "Sienna", artist: "The Marias", src: "imgs/music/The Marias - Sienna (SPOTISAVER).mp3" },
    { title: "soft", artist: "hanbee, woo!", src: "imgs/music/hanbee, woo! - soft (SPOTISAVER).mp3" },
    { title: "love.", artist: "wave to earth", src: "imgs/music/wave to earth - love.(SPOTISAVER).mp3" },
    { title: "blue", artist: "yung kai", src: "imgs/music/yung kai - blue (SPOTISAVER).mp3" }
];

// --- STATE MANAGEMENT ---
// These lines pull the saved data from the browser memory
let songIndex = parseInt(localStorage.getItem('m_idx')) || 0;
let isPlaying = localStorage.getItem('m_play') === 'true';
let seekTime = parseFloat(localStorage.getItem('m_time')) || 0;

const audio = new Audio();
audio.src = playlist[songIndex].src;
audio.currentTime = seekTime;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initPlayer();
    
    // Resume playback if it was playing on the previous page
    if (isPlaying) {
        // We use a small delay because browsers often block audio until a user clicks
        const playAttempt = setInterval(() => {
            audio.play().then(() => {
                clearInterval(playAttempt);
                updatePlayIcons(true);
            }).catch(() => {
                // If blocked, we wait for the first user click anywhere to resume
                document.addEventListener('click', () => {
                   if(isPlaying) audio.play();
                   updatePlayIcons(isPlaying);
                }, { once: true });
            });
        }, 1000);
    }
});

function initPlayer() {
    const logo = document.getElementById('music-logo');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const popup = document.getElementById('music-popup');

    audio.onended = () => changeSong(1);

    logo.onclick = () => popup.classList.toggle('is-open');
    document.getElementById('close-music').onclick = () => popup.classList.remove('is-open');

    playBtn.onclick = togglePlay;
    nextBtn.onclick = () => changeSong(1);
    prevBtn.onclick = () => changeSong(-1);

    const progContainer = document.querySelector('.progress-container');
    progContainer.onclick = (e) => {
        const percent = e.offsetX / progContainer.clientWidth;
        audio.currentTime = percent * audio.duration;
    };

    updateUI();
    setInterval(syncState, 500); // Saves current time every half second
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
    pill.classList.remove('is-visible');
    
    setTimeout(() => {
        songIndex = (songIndex + dir + playlist.length) % playlist.length;
        audio.src = playlist[songIndex].src;
        audio.currentTime = 0;
        if (isPlaying) audio.play();
        
        updateUI();
        pill.classList.add('is-visible');
        
        // SAVE the new song choice to memory
        localStorage.setItem('m_idx', songIndex);
        localStorage.setItem('m_time', 0);
    }, 400);
}

function updateUI() {
    document.getElementById('pill-text').innerText = playlist[songIndex].title;
    document.getElementById('pop-title').innerText = playlist[songIndex].title;
    document.getElementById('pop-artist').innerText = playlist[songIndex].artist;
    updatePlayIcons(isPlaying);
}

function updatePlayIcons(playing) {
    const btn = document.getElementById('play-btn');
    btn.innerText = playing ? '⏸' : '▶';
}

function syncState() {
    if (!audio.paused) {
        // SAVE the current seconds elapsed to memory
        localStorage.setItem('m_time', audio.currentTime);
        
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
