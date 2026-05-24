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
    ball.style.left = (e.clientX - rect.left - 40) + 'px';
    ball.style.top = (e.clientY - rect.top - 40) + 'px';
    ball.style.right = 'auto';
    ball.style.bottom = 'auto';
  });
  hero.addEventListener('mouseleave', () => {
    ball.style.transition = 'all 1s ease';
    ball.style.left = 'auto';
    ball.style.top = 'auto';
    ball.style.right = '80px';
    ball.style.bottom = '60px';
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM VIDEO CONTROLS - Play/Pause, Mute/Unmute, Fullscreen
// ═══════════════════════════════════════════════════════════════════════════════

// Store videos for auto-pause
const videoElements = {};

// Initialize video controls for each video container
document.querySelectorAll('.video-container').forEach(container => {
  const videoId = container.dataset.videoId;
  const video = container.querySelector('.custom-video');
  const playPauseBtn = container.querySelector('.play-pause-btn');
  const muteBtn = container.querySelector('.mute-btn');
  const fullscreenBtn = container.querySelector('.fullscreen-btn');

  if (!video) return;

  videoElements[videoId] = video;

  // Ensure inline playback on mobile (prevents automatic fullscreen on play)
  try {
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsInline = true;
  } catch (e) {}

  // Generate poster image from first video frame so it doesn't show a black screen
  const generatePosterFromFrame = () => {
    try {
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 360;
      if (!w || !h) return;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      const data = canvas.toDataURL('image/jpeg', 0.85);
      if (data) video.setAttribute('poster', data);
    } catch (err) {
      // ignore errors (cross-origin or video decode issues)
    }
  };

  if (video.readyState >= 2) {
    generatePosterFromFrame();
  } else {
    const onLoaded = () => { generatePosterFromFrame(); video.removeEventListener('loadeddata', onLoaded); };
    video.addEventListener('loadeddata', onLoaded);
    const onMeta = () => { generatePosterFromFrame(); video.removeEventListener('loadedmetadata', onMeta); };
    video.addEventListener('loadedmetadata', onMeta);
  }

  // ─── Play/Pause Button ───
  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.paused) {
      video.play();
      playPauseBtn.innerHTML = '<span class="control-icon">⏸</span>';
    } else {
      video.pause();
      playPauseBtn.innerHTML = '<span class="control-icon">▶</span>';
    }
  });

  // Update button when video plays/pauses
  video.addEventListener('play', () => {
    playPauseBtn.innerHTML = '<span class="control-icon">⏸</span>';
  });

  video.addEventListener('pause', () => {
    playPauseBtn.innerHTML = '<span class="control-icon">▶</span>';
  });

  // ─── Mute/Unmute Button ───
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.muted) {
      video.muted = false;
      muteBtn.innerHTML = '<span class="control-icon">🔊</span>';
    } else {
      video.muted = true;
      muteBtn.innerHTML = '<span class="control-icon">🔇</span>';
    }
  });

  // ─── Fullscreen Button ───
  fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.log('Fullscreen request denied:', err);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // ─── Video Click to Play/Pause ───
  video.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
});

// ─── Auto-pause videos when out of view ───
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (!entry.isIntersecting) {
      // Video is out of view - pause it
      if (!video.paused) {
        video.pause();
      }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.custom-video').forEach(video => {
  videoObserver.observe(video);
});

// ─── IMAGE LIGHTBOX ───────────────────────────────────────────────────────────
const lb = document.getElementById('lightbox');
const lbContent = document.getElementById('lightbox-content');
const lbClose = document.getElementById('close-lightbox');

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
  }
});

// ─── Console branding ─────────────────────────────────────────────────────────
console.log('%c🏏 Varad Nagapurkar — Cricketer', 'color:#43e97b;font-size:16px;font-weight:bold;');
console.log('%cDistrict Player | 3 College Titles | BPL Man of the Match', 'color:#9090aa;font-size:13px;');
