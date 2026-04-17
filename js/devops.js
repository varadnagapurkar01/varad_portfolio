// === devops.js — Scroll Animations ===

const toolRows = document.querySelectorAll('[data-tool]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
    }
  });
}, {
  threshold: 0.15
});

toolRows.forEach(row => observer.observe(row));

// Glow color change per tool on hover
const glowColors = {
  0: 'rgba(30,150,255,0.25)',   // Docker - blue
  1: 'rgba(130,80,255,0.25)',   // Podman - purple
  2: 'rgba(0,200,180,0.25)',    // Containerd - teal
  3: 'rgba(255,100,50,0.25)',   // Skopeo - orange
  4: 'rgba(255,60,100,0.25)',   // Buildah - pink
  5: 'rgba(50,180,255,0.25)',   // Kubernetes - blue
  6: 'rgba(120,80,255,0.25)',   // Terraform - purple
  7: 'rgba(255,160,30,0.25)',   // AWS - orange
};

toolRows.forEach((row, i) => {
  const glow = row.querySelector('.img-glow');
  if (!glow) return;
  row.addEventListener('mouseenter', () => {
    glow.style.background = `radial-gradient(circle, ${glowColors[i]} 0%, transparent 70%)`;
  });
  row.addEventListener('mouseleave', () => {
    glow.style.background = 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)';
  });
});

// Console
console.log('%c⚙️ DevOps Stack — Varad Nagapurkar', 'color:#6c63ff;font-size:16px;font-weight:bold;');