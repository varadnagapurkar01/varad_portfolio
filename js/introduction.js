// === about.js ===

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos], .about-card').forEach(el => {
  observer.observe(el);
});

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.95)';
});

// Hobby chips — random glow on hover
const chips = document.querySelectorAll('.hobby-chip');
const colors = ['#6c63ff','#ff6584','#43e97b','#ffd700','#50c8ff','#ffa050'];
chips.forEach((chip, i) => {
  chip.addEventListener('mouseenter', () => {
    chip.style.borderColor = colors[i % colors.length];
    chip.style.color = colors[i % colors.length];
    chip.style.boxShadow = `0 0 16px ${colors[i % colors.length]}40`;
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.borderColor = '';
    chip.style.color = '';
    chip.style.boxShadow = '';
  });
});

// Counter animation for edu stats
const counters = document.querySelectorAll('.edu-stat span');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const val = el.textContent;
      if (!isNaN(parseFloat(val))) {
        const target = parseFloat(val);
        const isDecimal = val.includes('.');
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
        }, 30);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// Console
console.log('%c👤 Varad Vishwas Nagapurkar', 'color:#6c63ff;font-size:18px;font-weight:bold;');
console.log('%cDevOps | Cricket | Purohitya | Never Give Up', 'color:#ff6584;font-size:13px;');