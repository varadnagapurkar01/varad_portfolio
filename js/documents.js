// === documents.js ===

// Scroll reveal with stagger
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('[data-aos], .doc-card').forEach(el => {
  observer.observe(el);
});

// Click → open LinkedIn link in new tab
document.querySelectorAll('.doc-card').forEach(card => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-link');
    if (link && link !== 'YOUR_LINKEDIN_LINK_HERE') {
      window.open(link, '_blank');
    } else {
      // Link नाही टाकला तर gentle reminder
      const overlay = card.querySelector('.doc-overlay span');
      if (overlay) {
        overlay.textContent = 'Link not added yet!';
        setTimeout(() => { overlay.textContent = 'View on LinkedIn →'; }, 1500);
      }
    }
  });
});

// Image load check — if image loads, hide placeholder
document.querySelectorAll('.doc-img').forEach(img => {
  if (img.src && img.src !== window.location.href) {
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }

  img.addEventListener('load', function() {
    this.style.display = 'block';
    const placeholder = this.parentElement.querySelector('.doc-placeholder');
    if (placeholder) placeholder.style.display = 'none';
  });

  img.addEventListener('error', function() {
    this.style.display = 'none';
  });
});

// Document count update
const docCount = document.getElementById('doc-count');
if (docCount) {
  const total = document.querySelectorAll('.doc-card').length;
  docCount.textContent = total;
}

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.95)';
});

// Console
console.log('%c📄 RHCSA Sunday Series — Varad Nagapurkar', 'color:#6c63ff;font-size:16px;font-weight:bold;');