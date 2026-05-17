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
// YOUTUBE VIDEO SECTION - No custom controls needed, YouTube handles playback
// ═══════════════════════════════════════════════════════════════════════════════
// YouTube iframes are embedded with responsive wrapper
// No custom play buttons or overlays - YouTube's native controls are used

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
