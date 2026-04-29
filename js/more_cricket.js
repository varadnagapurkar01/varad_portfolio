// === more_cricket.js ===

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('[data-aos], .mc-section, .ground-card').forEach(el => {
  observer.observe(el);
});

// Image click → lightbox
const lb = document.getElementById('mc-lightbox');
const lbContent = document.getElementById('mc-lb-content');
const lbClose = document.getElementById('mc-lb-close');

document.querySelectorAll('.img-portrait, .img-landscape').forEach(img => {
  img.addEventListener('click', function() {
    if (!this.src || this.style.display === 'none') return;
    lbContent.innerHTML = `<img src="${this.src}" alt="Cricket Photo"/>`;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lbClose.addEventListener('click', () => {
  lb.classList.remove('active');
  lbContent.innerHTML = '';
  document.body.style.overflow = '';
});

lb.addEventListener('click', (e) => {
  if (e.target === lb) {
    lb.classList.remove('active');
    lbContent.innerHTML = '';
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    lb.classList.remove('active');
    lbContent.innerHTML = '';
    document.body.style.overflow = '';
  }
});

// Image error handling
document.querySelectorAll('.img-portrait, .img-landscape').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    const placeholder = this.nextElementSibling;
    if (placeholder && placeholder.classList.contains('img-placeholder')) {
      placeholder.style.display = 'flex';
    }
  });

  if (!img.getAttribute('src') ||
      img.getAttribute('src').includes('_portrait') ||
      img.getAttribute('src').includes('_landscape')) {
    const testImg = new Image();
    testImg.onerror = () => {
      img.style.display = 'none';
      const placeholder = img.nextElementSibling;
      if (placeholder && placeholder.classList.contains('img-placeholder')) {
        placeholder.style.display = 'flex';
      }
    };
    testImg.src = img.getAttribute('src');
  }
});

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.95)';
});

console.log('%c🏏 Full Cricket Journey — Varad Nagapurkar', 'color:#43e97b;font-size:16px;font-weight:bold;');