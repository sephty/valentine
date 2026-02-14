function updateTime() {
    const now = new Date();

    const taskbarClock = document.getElementById('tb-clock');
    const dateDisplay = document.getElementById('date-display');

    let h = now.getHours();
    let m = now.getMinutes();
    const displayM = m < 10 ? '0' + m : m;

    const ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    h12 = h12 ? h12 : 12;

    if (taskbarClock) {
        taskbarClock.innerText = `${h12}:${displayM} ${ampm}`;
    }

    const dateOptions = { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' };
    if (dateDisplay) {
        dateDisplay.innerText = now.toLocaleDateString('en-US', dateOptions);
    }
}

function createCornerFlowers() {
    const layer = document.getElementById('flowers-layer');
    if (!layer) return;

    const flowerIcons = [
        'imgs/flower-svgrepo-com.svg',
        'imgs/flower-orange-organic-svgrepo-com.svg'
    ];

    const rect = layer.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const cornerZones = [
        { x: [8, Math.max(16, w * 0.22)], y: [8, Math.max(16, h * 0.24)] }, // top-left
        { x: [Math.max(8, w * 0.78), Math.max(20, w - 30)], y: [8, Math.max(16, h * 0.24)] }, // top-right
        { x: [8, Math.max(16, w * 0.22)], y: [Math.max(8, h * 0.74), Math.max(20, h - 30)] }, // bottom-left
        { x: [Math.max(8, w * 0.78), Math.max(20, w - 30)], y: [Math.max(8, h * 0.74), Math.max(20, h - 30)] } // bottom-right
    ];

    const placedFlowers = [];

    function isColliding(x, y, size) {
        const r = size / 2;
        return placedFlowers.some((other) => {
            const dx = x - other.x;
            const dy = y - other.y;
            const minDist = r + other.r + 6;
            return (dx * dx) + (dy * dy) < (minDist * minDist);
        });
    }

    layer.innerHTML = '';

    cornerZones.forEach((zone) => {
        for (let i = 0; i < 4; i++) {
            const size = Math.floor(Math.random() * 15) + 16;
            const half = size / 2;
            let px = 0;
            let py = 0;
            let placed = false;

            for (let attempt = 0; attempt < 30; attempt++) {
                const x = Math.random() * (zone.x[1] - zone.x[0]) + zone.x[0];
                const y = Math.random() * (zone.y[1] - zone.y[0]) + zone.y[0];

                if (!isColliding(x, y, size)) {
                    px = x - half;
                    py = y - half;
                    placedFlowers.push({ x, y, r: half });
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                continue;
            }

            const flower = document.createElement('img');
            flower.className = 'corner-flower';
            flower.src = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
            flower.alt = 'flower';

            const rot = Math.floor(Math.random() * 50) - 25;
            const opacity = (Math.random() * 0.35 + 0.4).toFixed(2);

            flower.style.width = `${size}px`;
            flower.style.height = `${size}px`;
            flower.style.top = `${py}px`;
            flower.style.left = `${px}px`;
            flower.style.transform = `rotate(${rot}deg)`;
            flower.style.opacity = opacity;

            layer.appendChild(flower);
        }
    });
}

const diaryEntries = [
    {
        title: 'Dear Diary — How much I love her',
        body: [
        `My love,
        
        Honestly, sometimes it really does feel like a dream. We met on such a random day. Nothing big, nothing planned, just casually talking and then calling to watch Kamisama pfft. And yet somehow, that ordinary day became one of the most important days of my life. I had no idea I was about to meet someone this special!`,
        
        `You are such a blessing to me, honey. I truly thank God for you. For your heart, your softness, your strength, and the way you care for people so naturally and with such light. The way you work so hard, giving them your time and patience… it says so much about who you are. You have such a gentle spirit. It’s so beautiful to see.`,
        
        `Even with the temporary distance between us, the little things mean everything. Those silly games we’ve played, from Roblox to even Heartopia! the long calls that somehow turn into hours, the random laughs, the comfortable silence… those moments will always stay with me. They make the distance feel smaller. They make my heart feel close to yours.`,
        
        `I love how many things we share in common, and how our dreams match so perfectly. I love hearing you talk about baking and the way you get excited about it. It’s so cute, and it’s so you! Everything you do, you do with such care and sweetness, and that’s one of the many reasons I admire you.`,
        
        `There’s even a verse that reminds me of you: “Every good and perfect gift is from above.” — James 1:17
        
        And that’s exactly how I see you. A gift I didn’t expect, but one I’m deeply grateful for. So happy Valentine’s Day, mi hermosa y preciosa futura esposa. Even from far away, you still give me so many butterflies, and I’m so so thankful that out of all the people in the world and even the universe, I get to love you. ❤️`
        ]
        
    },
    {
        title: 'Date nights!',
        body: [
            `There's still so many things I want to do with you. I really loved our little date nights. The aquarium one, when we discovered heartopiaaa, even watching the meteor shower together there! that was so cool! Moments like that make me realize how special this is. I loved being there with you, even through a screen, and I want to experience so much more with you.`,

            `I can't wait for more silly, cozy nights. Streaming while I cook for you muehehe, more virtual dates, more random ideas we come up with at midnight. And when we finally meet... oh, I want to do everything. Star gazing under the sky, picnics, cooking together, baking together (yippeeeeee), drawing side by side, restaurant dates, theme park dates, aquarium dates! just living those little moments together. There's so much I want to experience with you, and the best part is that I want to experience it all with you.` 

        ],
        photos: [
            { src: 'imgs/aquarium.png', caption: 'Our aquarium date', tilt: '-5deg' },
            { src: 'imgs/nightwatching.jpg', caption: 'yippeee', tilt: '3deg' },
            { src: 'imgs/one-thingy.jpg', caption: 'A tiny snapshot', tilt: '-2deg' },
            { src: 'imgs/cute_drawing_shedid.jpg', caption: 'cute frame', tilt: '4deg' },
            { src: 'imgs/water.jpg', caption: 'Water memories', tilt: '-3deg' },
            { src: 'imgs/love-language.gif', caption: 'Love language', tilt: '2deg' }
        ]
    },
    {
        title: 'Little things I love about Her',
        body: [
    '• Your sincerity. The way you mean what you say and feel things so genuinely.',
    '• Your kindness. It’s not loud or showy, it’s just naturally part of you.',
    '• How hardworking you are. You give your best, especially with the kids you care for.',
    '• The effort you put into us. Into our calls, our time, our little dates.',
    '• Your softness and patience.',
    '• The way you get excited about baking and the little things.',
    '• Your faith and the light you carry.',
    '• The way you make me feel safe, heard, and loved.',
    '• Your laugh. Yes, that too.',
    '• And the way you somehow make my heart feel full even from miles away.'
],
        photos: [
            { src: 'imgs/besos.gif', caption: 'soft mood', tilt: '3deg' },
            { src: 'imgs/cute_drawing_shedid.jpg', caption: 'cute frame', tilt: '-2deg' }
        ]
    }
];

const entriesList = document.getElementById('entries-list');
const listView = document.getElementById('diary-list-view');
const detailView = document.getElementById('diary-detail-view');
const addPopup = document.getElementById('add-entry-popup');
const detailTitle = document.getElementById('detail-title');
const detailBody = document.getElementById('detail-body');
const detailPhotos = document.getElementById('detail-photos');

const addToggleBtn = document.getElementById('toggle-add-entry');
const addEntryForm = document.getElementById('add-entry-form');
const entryTitleInput = document.getElementById('entry-title');
const entryBodyInput = document.getElementById('entry-body');

const detailCloseBtn = document.getElementById('detail-close-btn');
const addCloseBtn = document.getElementById('add-close-btn');

function playPopIn(element) {
    element.classList.remove('is-closing');
    element.classList.remove('is-popping');
    void element.offsetWidth;
    element.classList.add('is-popping');
}

function playPopOut(element, onDone) {
    element.classList.remove('is-popping');
    element.classList.add('is-closing');

    window.setTimeout(() => {
        element.classList.remove('is-closing');
        onDone?.();
    }, 200);
}

function setListDimmed(dimmed) {
    listView.classList.toggle('is-dimmed', dimmed);
}

function renderEntries() {
    entriesList.innerHTML = '';

    diaryEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'entry-item';
        li.innerHTML = `<strong>${entry.title}</strong><small>Click to open entry</small>`;
        li.addEventListener('click', () => openEntry(index));
        entriesList.appendChild(li);
    });
}

function openEntry(index) {
    const entry = diaryEntries[index];
    if (!entry) return;

    detailTitle.textContent = entry.title;

    detailBody.innerHTML = '';
    entry.body.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        detailBody.appendChild(p);
    });

    detailPhotos.innerHTML = '';
    if (entry.photos?.length) {
        entry.photos.forEach((photo) => {
            const frame = document.createElement('figure');
            frame.className = 'camera-photo';
            frame.style.setProperty('--tilt', photo.tilt || '0deg');
            frame.innerHTML = `
                <img src="${photo.src}" alt="diary photo">
                <span>${photo.caption || 'memory'}</span>
            `;
            detailPhotos.appendChild(frame);
        });
    }

    setListDimmed(true);
    detailView.hidden = false;
    playPopIn(detailView);
}

function returnToList() {
    playPopOut(detailView, () => {
        detailView.hidden = true;
        setListDimmed(false);
    });
}

addToggleBtn?.addEventListener('click', () => {
    if (addPopup.hidden) {
        setListDimmed(true);
        addPopup.hidden = false;
        playPopIn(addPopup);
    } else {
        playPopOut(addPopup, () => {
            addPopup.hidden = true;
            setListDimmed(false);
        });
    }
});

addEntryForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = entryTitleInput.value.trim();
    const body = entryBodyInput.value.trim();
    if (!title || !body) return;

    const bodyParagraphs = body
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    diaryEntries.unshift({
        title,
        body: bodyParagraphs.length ? bodyParagraphs : [body]
    });

    addEntryForm.reset();
    playPopOut(addPopup, () => {
        addPopup.hidden = true;
        setListDimmed(false);
    });
    renderEntries();
});

detailCloseBtn?.addEventListener('click', returnToList);
addCloseBtn?.addEventListener('click', () => {
    playPopOut(addPopup, () => {
        addPopup.hidden = true;
        setListDimmed(false);
    });
});

renderEntries();
setInterval(updateTime, 1000);
updateTime();
createCornerFlowers();
