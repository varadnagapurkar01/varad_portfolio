// === certifications.js ===

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

document.querySelectorAll('[data-aos], .cert-card').forEach(el => {
  observer.observe(el);
});

// Image load check
document.querySelectorAll('.cert-img').forEach(img => {
  img.addEventListener('load', function() {
    this.style.display = 'block';
    const ph = this.parentElement.querySelector('.cert-placeholder');
    if (ph) ph.style.display = 'none';
  });
  img.addEventListener('error', function() {
    this.style.display = 'none';
  });
  if (!img.getAttribute('src') || img.getAttribute('src') === '') {
    img.style.display = 'none';
  }
});

// PDF Lightbox
const lightbox = document.getElementById('pdf-lightbox');
const pdfFrame = document.getElementById('pdf-frame');
const pdfClose = document.getElementById('pdf-close');
const pdfOverlay = document.getElementById('pdf-overlay');

document.querySelectorAll('.cert-view-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const pdfPath = this.getAttribute('data-pdf');
    if (!pdfPath || pdfPath === '' || pdfPath.includes('cert6.pdf')) {
      alert('Certificate PDF not added yet! \nPDF path add करायचा असेल तर:\ncert-view-btn च्या data-pdf="" मध्ये path टाक');
      return;
    }
    pdfFrame.src = pdfPath;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  pdfFrame.src = '';
  document.body.style.overflow = '';
}

pdfClose.addEventListener('click', closeLightbox);
pdfOverlay.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.95)';
});

console.log('%c🏅 Certifications — Varad Nagapurkar', 'color:#ffd700;font-size:16px;font-weight:bold;');