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

// Store videos for auto-pause and controls management
const videoElements = {};
const videoControlsState = {};

// Initialize video controls for each video container
document.querySelectorAll('.video-container').forEach(container => {
  const videoId = container.dataset.videoId;
  const video = container.querySelector('.custom-video');
  const playPauseBtn = container.querySelector('.play-pause-btn');
  const muteBtn = container.querySelector('.mute-btn');
  const fullscreenBtn = container.querySelector('.fullscreen-btn');
  const videoOverlay = container.querySelector('.video-overlay');
  const videoControls = container.querySelector('.video-controls');

  if (!video) return;

  videoElements[videoId] = video;
  videoControlsState[videoId] = {
    hideTimeout: null,
    isMouseOver: false
  };

  // ─── Ensure inline playback on mobile (prevents automatic fullscreen on play) ───
  try {
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsInline = true;
  } catch (e) {}

  // ─── Show first frame: seek to 0.001s once metadata is available ───
  const showFirstFrame = () => {
    video.currentTime = 0.001;
  };

  const onSeeked = () => {
    video.classList.add('loaded');
    container.classList.add('video-ready');
    // Immediately pause so video shows first frame but doesn't play
    if (!video.paused) video.pause();
  };

  video.addEventListener('seeked', onSeeked, { once: true });

  if (video.readyState >= 1) {
    showFirstFrame();
  } else {
    video.addEventListener('loadedmetadata', showFirstFrame, { once: true });
  }

  // Fallback for mobile: load video on first user interaction
  const loadVideoOnTouch = () => {
    if (video.readyState === 0) {
      video.load();
    }
    document.removeEventListener('touchstart', loadVideoOnTouch);
  };
  document.addEventListener('touchstart', loadVideoOnTouch, { once: true, passive: true });

  // Fallback: mark as loaded after 2 seconds regardless
  setTimeout(() => {
    video.classList.add('loaded');
    container.classList.add('video-ready');
  }, 2000);

  // ─── Controls Visibility Helper Functions ───
  const showControls = (duration = 2500) => {
    if (videoControls) {
      videoControls.classList.add('controls-visible');
    }
    if (videoOverlay) {
      videoOverlay.classList.add('controls-show');
    }
    
    // Clear any existing timeout
    if (videoControlsState[videoId].hideTimeout) {
      clearTimeout(videoControlsState[videoId].hideTimeout);
    }
    
    // Set new timeout to hide controls
    videoControlsState[videoId].hideTimeout = setTimeout(() => {
      if (!videoControlsState[videoId].isMouseOver) {
        hideControls();
      }
    }, duration);
  };

  const hideControls = () => {
    if (videoControls) {
      videoControls.classList.remove('controls-visible');
    }
    if (videoOverlay) {
      videoOverlay.classList.remove('controls-show');
    }
  };

  // ─── Play/Pause Button ───
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showControls(2500); // Show for 2.5 seconds on click
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<span class="control-icon">⏸</span>';
      } else {
        video.pause();
        playPauseBtn.innerHTML = '<span class="control-icon">▶</span>';
      }
    });
  }

  // Update button when video plays/pauses
  video.addEventListener('play', () => {
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<span class="control-icon">⏸</span>';
    }
    showControls(1500); // Show for 1.5 seconds then hide
  });

  video.addEventListener('pause', () => {
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<span class="control-icon">▶</span>';
    }
    showControls(2500); // Show controls when paused
  });

  // ─── Mute/Unmute Button ───
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showControls(2500); // Show for 2.5 seconds on click
      if (video.muted) {
        video.muted = false;
        muteBtn.innerHTML = '<span class="control-icon">🔊</span>';
      } else {
        video.muted = true;
        muteBtn.innerHTML = '<span class="control-icon">🔇</span>';
      }
    });
  }

  // ─── Fullscreen Button with Mobile Support ───
  const requestFullscreen = (el) => {
    // Try standard API first
    if (el.requestFullscreen) return el.requestFullscreen();
    
    // Try webkit (Safari, older Chrome)
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    
    // Try moz (Firefox)
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    
    // Try ms (older IE Edge)
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    
    // iOS Safari fallback - try webkitEnterFullscreen
    if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
      return Promise.resolve();
    }
    
    // Android Chrome fallback
    if (el.webkitEnterFullScreen) {
      el.webkitEnterFullScreen();
      return Promise.resolve();
    }
    
    return Promise.reject(new Error('Fullscreen not supported'));
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    return Promise.reject(new Error('Exit fullscreen not supported'));
  };

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showControls(2500); // Show for 2.5 seconds on click
      const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      if (!isFS) {
        // Request fullscreen on video container for better control visibility
        requestFullscreen(container).catch(err => {
          // Fallback: try the video element itself
          requestFullscreen(video).catch(err2 => {
            console.warn('Fullscreen request failed:', err2);
          });
        });
      } else {
        exitFullscreen().catch(err => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    });
  }

  // Update fullscreen icon on change
  const updateFsIcon = () => {
    if (!fullscreenBtn) return;
    const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (isFS) {
      fullscreenBtn.innerHTML = '<span class="control-icon">⤢</span>';
    } else {
      fullscreenBtn.innerHTML = '<span class="control-icon">⛶</span>';
    }
  };

  document.addEventListener('fullscreenchange', updateFsIcon);
  document.addEventListener('webkitfullscreenchange', updateFsIcon);
  document.addEventListener('mozfullscreenchange', updateFsIcon);
  document.addEventListener('MSFullscreenChange', updateFsIcon);

  // ─── Video Click to Play/Pause and Show Controls ───
  video.addEventListener('click', (e) => {
    e.stopPropagation();
    showControls(2500); // Show for 2.5 seconds on click
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  // ─── Mouse Events for Controls Visibility ───
  container.addEventListener('mouseenter', () => {
    videoControlsState[videoId].isMouseOver = true;
    showControls(2500);
  });

  container.addEventListener('mouseleave', () => {
    videoControlsState[videoId].isMouseOver = false;
    if (!video.paused) {
      hideControls();
    }
  });

  container.addEventListener('mousemove', () => {
    if (!videoControlsState[videoId].isMouseOver) {
      videoControlsState[videoId].isMouseOver = true;
    }
    showControls(2500);
  });

  // ─── Touch Events for Mobile ───
  container.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    showControls(2500);
  });

  container.addEventListener('touchend', () => {
    if (!video.paused) {
      // On mobile, keep showing for a bit longer after touch
      showControls(2500);
    }
  });

  // ─── Double-tap to fullscreen on mobile (optional, improves UX) ───
  let lastTap = 0;
  container.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0 && fullscreenBtn) {
      // Double tap detected - trigger fullscreen
      fullscreenBtn.click();
    }
    lastTap = currentTime;
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
