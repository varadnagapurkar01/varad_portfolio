// === cricket.js ===

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 120);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-aos], .trait-card, .bpl-card, .timeline-item').forEach(el => {
  observer.observe(el);
});

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.95)';
});

// Cricket ball follow cursor on hero
const ball = document.querySelector('.cricket-ball');
const hero = document.querySelector('.cricket-hero');
if (hero && ball) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ball.style.transition = 'left 0.8s ease, top 0.8s ease';
    ball.style.left = (x - 40) + 'px';
    ball.style.top = (y - 40) + 'px';
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

// Console
console.log('%c🏏 Varad Nagapurkar — Cricketer', 'color:#43e97b;font-size:16px;font-weight:bold;');
console.log('%cDistrict Player | 3 College Titles | BPL Man of the Match', 'color:#9090aa;font-size:13px;');


// Video Play/Pause Logic
document.querySelectorAll('.video-box').forEach(box => {
    const video = box.querySelector('.timeline-video');
    const btn = box.querySelector('.video-ctrl-btn');

    if (video && btn) {
        btn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                btn.textContent = 'Pause';
                btn.style.opacity = '0'; // Hide button while playing
            } else {
                video.pause();
                btn.textContent = 'Play';
                btn.style.opacity = '1';
            }
        });

        // Show button again when video is hovered or paused
        box.addEventListener('mouseenter', () => { btn.style.opacity = '1'; });
        box.addEventListener('mouseleave', () => { 
            if (!video.paused) btn.style.opacity = '0'; 
        });
    }
});

const lb = document.getElementById('lightbox');
const lbContent = document.getElementById('lightbox-content');
const lbClose = document.getElementById('close-lightbox');

document.querySelectorAll('.media-box img, .timeline-video').forEach(el => {
  el.addEventListener('click', function() {
    lbContent.innerHTML = ''; 
    const big = this.cloneNode(true);
    if (big.tagName === 'VIDEO') { big.controls = true; big.muted = false; }
    lbContent.appendChild(big);
    lb.classList.add('active');
    if (big.tagName === 'VIDEO') big.play();
  });
});

lbClose.onclick = () => { lb.classList.remove('active'); lbContent.innerHTML = ''; };
lb.onclick = (e) => { if(e.target == lb) lbClose.onclick(); };

document.querySelectorAll('.video-ctrl-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const parent = this.parentElement;
    const video = parent.querySelector('video');
    const videoSrc = video.querySelector('source').src.toLowerCase();
    
    // Play/Pause Logic
    if (video.paused) {
      video.play();
      this.innerText = "PAUSE";
    } else {
      video.pause();
      this.innerText = "PLAY";
    }

    // Identify which text to show based on file name
    let popText = "PLAYING..."; 
    if (videoSrc.includes('shegao')) {
      popText = "50 RUNS! ⭐";
    } else if (videoSrc.includes('nashik')) {
      popText = "4 SIXES IN A ROW! 🔥";
    } else if (videoSrc.includes('jppl')) {
      popText = "EXCELLENT 4! 🏏";
    }

    // Create the 3D Pop Effect
    const pop = document.createElement('div');
    pop.innerText = popText;
    pop.style.cssText = `
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 24px;
      font-weight: 900;
      text-shadow: 0 0 20px #ffd700, 2px 2px #000;
      z-index: 100;
      pointer-events: none;
      white-space: nowrap;
      font-family: sans-serif;
    `;
    parent.appendChild(pop);

    // 3D Flying Animation
    pop.animate([
      { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 1 },
      { transform: 'translate(-50%, -180%) scale(2)', opacity: 0 }
    ], { 
      duration: 1500, 
      easing: 'ease-out' 
    });

    setTimeout(() => pop.remove(), 1500);
  });
});

// Video Play/Pause Logic
document.querySelectorAll('.video-box').forEach(box => {
    const video = box.querySelector('.timeline-video');
    const btn = box.querySelector('.video-ctrl-btn');

    if (video && btn) {
        btn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                btn.textContent = 'Pause';
                btn.style.opacity = '0'; // Hide button while playing
            } else {
                video.pause();
                btn.textContent = 'Play';
                btn.style.opacity = '1';
            }
        });

        // Show button again when video is hovered or paused
        box.addEventListener('mouseenter', () => { btn.style.opacity = '1'; });
        box.addEventListener('mouseleave', () => { 
            if (!video.paused) btn.style.opacity = '0'; 
        });
    }
});