// === VARAD NAGAPURKAR — script.js ===

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.85)';
});

// Section buttons — hover sound feel (visual pulse)
document.querySelectorAll('.sec-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-4px) scale(1.03)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// Console message for recruiters
console.log('%c👋 Hey Recruiter!', 'color:#6c63ff;font-size:22px;font-weight:bold;');
console.log('%cBuilt by Varad Nagapurkar — DevOps | Cricket | पौरोहित्य', 'color:#ff6584;font-size:13px;');
console.log('%cLet\'s connect! 🚀', 'color:#43e97b;font-size:13px;');