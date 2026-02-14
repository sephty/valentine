function updateTime() {
    const now = new Date();

    const taskbarClock = document.getElementById('tb-clock');
    const dateDisplay = document.getElementById('date-display');

    const h = now.getHours();
    const m = now.getMinutes();
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

const photoTiles = document.querySelectorAll('.photo-tile');
const collageTable = document.querySelector('.collage-table');
const overlay = document.getElementById('photo-overlay');
const pickedPhotoHost = document.getElementById('picked-photo-host');

let activePickedPhoto = null;
let isAnimatingPhoto = false;
let closeTimer = null;
let tileLayoutFrame = null;

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function overlapRatio(a, b) {
    const overlapX = Math.max(0, Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left));
    const overlapY = Math.max(0, Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top));
    const overlapArea = overlapX * overlapY;

    if (!overlapArea) return 0;
    const minArea = Math.min(a.width * a.height, b.width * b.height);
    return minArea ? overlapArea / minArea : 0;
}

function randomizeTileLayout() {
    if (!collageTable || !photoTiles.length) return;

    const tableRect = collageTable.getBoundingClientRect();
    const tableWidth = tableRect.width;
    const tableHeight = tableRect.height;
    const margin = 16;
    const placed = [];

    photoTiles.forEach((tile, index) => {
        let src = tile.dataset.src;
        
        if (src) {
            // If the path doesn't already start with imgs/, add it
            if (!src.startsWith('imgs/') && !src.startsWith('http')) {
                src = 'imgs/' + src;
            }
            // Apply the image directly to the element style
            tile.style.setProperty('--photo-image', `url('${src}')`);
            tile.style.backgroundImage = `url('${src}')`; // Force it here too
        }

        const tileWidth = tile.offsetWidth || 120;
        const tileHeight = tile.offsetHeight || 150;
        const maxLeft = Math.max(margin, tableWidth - tileWidth - margin);
        const maxTop = Math.max(margin, tableHeight - tileHeight - margin);

        let bestSpot = {
            left: randomInRange(margin, maxLeft),
            top: randomInRange(margin, maxTop),
            width: tileWidth,
            height: tileHeight
        };

        placed.push(bestSpot);
        tile.style.left = `${bestSpot.left}px`;
        tile.style.top = `${bestSpot.top}px`;
        tile.style.setProperty('--rot', `${Math.round(randomInRange(-12, 12))}deg`);
        tile.style.zIndex = `${2 + index}`;
    });
}
function scheduleTileLayout() {
    if (tileLayoutFrame) {
        cancelAnimationFrame(tileLayoutFrame);
    }

    tileLayoutFrame = requestAnimationFrame(() => {
        randomizeTileLayout();
        tileLayoutFrame = null;
    });
}

function openPhoto(tile) {
    if (!overlay || !pickedPhotoHost || isAnimatingPhoto || activePickedPhoto) return;

    pickedPhotoHost.innerHTML = '';

    const picked = document.createElement('div');
    picked.className = `${tile.className} picked-photo`;
    picked.setAttribute('style', tile.getAttribute('style') || '');

    const label = tile.querySelector('span');
    if (label) {
        picked.appendChild(label.cloneNode(true));
    }

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'picked-photo-close';
    closeButton.innerText = '×';
    closeButton.setAttribute('aria-label', 'Close photo');

    closeButton.addEventListener('click', closePhoto);

    picked.appendChild(closeButton);
    pickedPhotoHost.appendChild(picked);

    isAnimatingPhoto = true;
    overlay.hidden = false;
    activePickedPhoto = picked;

    requestAnimationFrame(() => {
        picked.classList.add('is-open');
        window.setTimeout(() => {
            isAnimatingPhoto = false;
        }, 260);
    });
}

function closePhoto() {
    if (!overlay || !pickedPhotoHost || isAnimatingPhoto) return;
    if (!activePickedPhoto && !overlay.hidden) {
        overlay.hidden = true;
        return;
    }

    isAnimatingPhoto = true;
    activePickedPhoto.classList.remove('is-open');
    activePickedPhoto.classList.add('is-closing');

    if (closeTimer) {
        clearTimeout(closeTimer);
    }

    closeTimer = window.setTimeout(() => {
        pickedPhotoHost.innerHTML = '';
        overlay.hidden = true;
        activePickedPhoto = null;
        isAnimatingPhoto = false;
        closeTimer = null;
    }, 220);
}

photoTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
        openPhoto(tile);
    });
});

window.addEventListener('resize', scheduleTileLayout);

overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) {
        closePhoto();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay && !overlay.hidden) {
        closePhoto();
    }
});

setInterval(updateTime, 1000);
updateTime();
scheduleTileLayout();
