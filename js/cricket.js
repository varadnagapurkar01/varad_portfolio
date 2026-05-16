// === cricket.js ===

// ─── Scroll reveal ────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-aos], .trait-card, .bpl-card, .timeline-item').forEach(el => {
  observer.observe(el);
});

// ─── Navbar scroll ────────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.95)';
});

// ─── Cricket ball follow cursor ───────────────────────────────────────────────
const ball = document.querySelector('.cricket-ball');
const hero = document.querySelector('.cricket-hero');
if (hero && ball) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    ball.style.transition = 'left 0.8s ease, top 0.8s ease';
    ball.style.left  = (e.clientX - rect.left - 40) + 'px';
    ball.style.top   = (e.clientY - rect.top  - 40) + 'px';
    ball.style.right = 'auto';
    ball.style.bottom = 'auto';
  });
  hero.addEventListener('mouseleave', () => {
    ball.style.transition = 'all 1s ease';
    ball.style.left = 'auto';
    ball.style.top  = 'auto';
    ball.style.right  = '80px';
    ball.style.bottom = '60px';
  });
}

// ─── Pop animation text map ───────────────────────────────────────────────────
const popTextMap = {
  shegao: '50 RUNS! ⭐',
  nashik: '4 SIXES IN A ROW! 🔥',
  jppl:   'EXCELLENT 4! 🏏'
};

function showPop(parent, text) {
  const pop = document.createElement('div');
  pop.textContent = text;
  pop.style.cssText = `
    position:absolute; top:40%; left:50%;
    transform:translate(-50%,-50%);
    color:#fff; font-size:20px; font-weight:900;
    text-shadow:0 0 20px #ffd700,2px 2px #000;
    z-index:200; pointer-events:none;
    white-space:nowrap;
    font-family:'Montserrat',sans-serif;
    letter-spacing:2px;
  `;
  parent.appendChild(pop);
  pop.animate([
    { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 1 },
    { transform: 'translate(-50%,-230%) scale(2)',  opacity: 0 }
  ], { duration: 1400, easing: 'ease-out', fill: 'forwards' });
  setTimeout(() => pop.remove(), 1400);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

// ─── VIDEO PLAY / PAUSE — inline timeline ────────────────────────────────────
document.querySelectorAll('.video-box').forEach(box => {
  const video    = box.querySelector('.timeline-video');
  const btn      = box.querySelector('.video-ctrl-btn');
  const icon     = btn  ? btn.querySelector('.play-icon') : null;
  const label    = btn  ? btn.querySelector('.btn-text')  : null;
  const zoomBtn  = box.querySelector('.video-zoom-btn');
  const matchKey = box.getAttribute('data-match') || '';
  const title    = box.getAttribute('data-title')  || 'Video';
  const src      = box.getAttribute('data-src')    || '';

  if (!video || !btn) return;

  // Play / Pause toggle
  function togglePlay() {
    if (video.paused) {
      video.play();
      box.classList.add('is-playing');
      if (icon)  icon.textContent  = '⏸';
      if (label) label.textContent = 'PAUSE';
      showPop(box, popTextMap[matchKey] || 'PLAYING! 🎬');
    } else {
      video.pause();
      box.classList.remove('is-playing');
      if (icon)  icon.textContent  = '▶';
      if (label) label.textContent = 'PLAY';
    }
  }

  btn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
  video.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });

  video.addEventListener('ended', () => {
    box.classList.remove('is-playing');
    if (icon)  icon.textContent  = '▶';
    if (label) label.textContent = 'PLAY';
  });

  // Zoom button → open video modal
  if (zoomBtn) {
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openVideoModal(src, title, video.currentTime);
    });
  }
});

// ─── VIDEO MODAL PLAYER ───────────────────────────────────────────────────────
const videoModal    = document.getElementById('video-modal');
const modalVideo    = document.getElementById('modal-video');
const modalSrc      = document.getElementById('modal-video-src');
const modalTitle    = document.getElementById('video-modal-title');
const modalClose    = document.getElementById('video-modal-close');
const vmcPlay       = document.getElementById('vmc-play');
const vmcBack       = document.getElementById('vmc-back');
const vmcFwd        = document.getElementById('vmc-fwd');
const vmcFs         = document.getElementById('vmc-fs');
const vmcProgress   = document.getElementById('vmc-progress');
const vmcCurrent    = document.getElementById('vmc-current');
const vmcDuration   = document.getElementById('vmc-duration');

function openVideoModal(src, title, startTime) {
  if (!videoModal || !modalVideo) return;
  modalSrc.src = src;
  modalVideo.load();
  modalTitle.textContent = title || 'Video';
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  modalVideo.addEventListener('loadedmetadata', () => {
    vmcProgress.max = modalVideo.duration;
    vmcDuration.textContent = formatTime(modalVideo.duration);
    if (startTime) modalVideo.currentTime = startTime;
    modalVideo.play();
    vmcPlay.textContent = '⏸ Pause';
  }, { once: true });
}

function closeVideoModal() {
  videoModal.classList.remove('active');
  modalVideo.pause();
  modalSrc.src = '';
  modalVideo.load();
  document.body.style.overflow = '';
}

// Modal controls
if (vmcPlay) {
  vmcPlay.addEventListener('click', () => {
    if (modalVideo.paused) {
      modalVideo.play();
      vmcPlay.textContent = '⏸ Pause';
    } else {
      modalVideo.pause();
      vmcPlay.textContent = '▶ Play';
    }
  });
}

if (vmcBack) vmcBack.addEventListener('click', () => {
  modalVideo.currentTime = Math.max(0, modalVideo.currentTime - 10);
});

if (vmcFwd) vmcFwd.addEventListener('click', () => {
  modalVideo.currentTime = Math.min(modalVideo.duration, modalVideo.currentTime + 10);
});

if (vmcFs) vmcFs.addEventListener('click', () => {
  if (modalVideo.requestFullscreen) modalVideo.requestFullscreen();
  else if (modalVideo.webkitRequestFullscreen) modalVideo.webkitRequestFullscreen();
  else if (modalVideo.webkitEnterFullscreen)  modalVideo.webkitEnterFullscreen();
});

// Progress bar sync
if (modalVideo) {
  modalVideo.addEventListener('timeupdate', () => {
    if (!modalVideo.duration) return;
    vmcProgress.value = modalVideo.currentTime;
    vmcCurrent.textContent = formatTime(modalVideo.currentTime);
  });

  modalVideo.addEventListener('loadedmetadata', () => {
    vmcProgress.max = modalVideo.duration;
    vmcDuration.textContent = formatTime(modalVideo.duration);
  });

  modalVideo.addEventListener('ended', () => {
    vmcPlay.textContent = '▶ Play';
  });
}

if (vmcProgress) {
  vmcProgress.addEventListener('input', () => {
    modalVideo.currentTime = vmcProgress.value;
  });
}

// Close modal
if (modalClose) modalClose.addEventListener('click', closeVideoModal);
if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });
}

// ─── IMAGE LIGHTBOX ───────────────────────────────────────────────────────────
const lb        = document.getElementById('lightbox');
const lbContent = document.getElementById('lightbox-content');
const lbClose   = document.getElementById('close-lightbox');

document.querySelectorAll('.media-box img').forEach(img => {
  img.addEventListener('click', function () {
    lbContent.innerHTML = '';
    const big = this.cloneNode(true);
    big.style.cursor = 'default';
    big.style.transform = 'none';
    lbContent.appendChild(big);
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lb.classList.remove('active');
  lbContent.innerHTML = '';
  document.body.style.overflow = '';
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

// ─── Escape key closes everything ────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeVideoModal();
  }
});

// ─── Console branding ─────────────────────────────────────────────────────────
console.log('%c🏏 Varad Nagapurkar — Cricketer', 'color:#43e97b;font-size:16px;font-weight:bold;');
console.log('%cDistrict Player | 3 College Titles | BPL Man of the Match', 'color:#9090aa;font-size:13px;');
