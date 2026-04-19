// === projects.js ===

// Project details for modal
const projectDetails = {
  zenity: {
    icon: '🐧',
    name: 'Zenity — Linux GUI Automation',
    status: 'live',
    desc: 'A Linux automation project using Zenity — users interact with a GUI popup, and shell scripts run Linux commands automatically in the background.',
    points: [
      '<strong>Add User</strong> — GUI popup asks for username → script creates user automatically',
      '<strong>Create Partition</strong> — GUI selects disk size → script handles fdisk commands',
      '<strong>Add Group</strong> — Enter group name in popup → script creates group via CLI',
      '<strong>Zero Terminal Knowledge</strong> — End user never touches the command line',
      '<strong>Shell Scripts</strong> — All background automation written in Bash',
      '<strong>Error Handling</strong> — GUI shows success/failure messages automatically'
    ],
    tech: ['Zenity','Linux','Bash','Shell Script','GUI','Automation','CLI'],
    github: 'YOUR_GITHUB_LINK_HERE'
  },
  vm: {
    icon: '🖥️',
    name: 'Virtual Machine Infrastructure',
    status: 'live',
    desc: 'Three virtual machines created and configured entirely from command line — no GUI tools used at any stage.',
    points: [
      '<strong>VM 1 — Web Server</strong> — Apache/Nginx configured via CLI only',
      '<strong>VM 2 — Database</strong> — MySQL/PostgreSQL setup through commands',
      '<strong>VM 3 — Load Balancer</strong> — Traffic routing configured manually',
      '<strong>SSH Communication</strong> — All 3 VMs connected via SSH key pairs',
      '<strong>Network Config</strong> — IP addressing and routing set via command line',
      '<strong>User Management</strong> — Users, groups, and permissions fully managed',
      '<strong>Storage</strong> — Disk partitioning and mounting done manually'
    ],
    tech: ['Linux','CLI','SSH','Networking','VM','Services','Storage','User Mgmt'],
    github: 'YOUR_GITHUB_LINK_HERE'
  },
  hotel: {
    icon: '🏨',
    name: 'Hotel Management System',
    status: 'indev',
    desc: 'End-to-end hotel management application currently in active development.',
    points: [
      '<strong>Room Booking</strong> — Real-time availability and reservation system',
      '<strong>Guest Records</strong> — Complete profile and stay history',
      '<strong>Billing</strong> — Automated invoice and payment processing',
      '<strong>Staff Portal</strong> — Scheduling and task management',
      '<strong>Analytics</strong> — Occupancy reports and revenue tracking'
    ],
    tech: ['HTML/CSS','JavaScript','Backend','Database','REST API'],
    github: null
  },
  bank: {
    icon: '🏦',
    name: 'Bank Management System',
    status: 'indev',
    desc: 'Complete banking application with security-first architecture. Planning phase in progress.',
    points: [
      '<strong>Account Management</strong> — Create, manage, and close accounts',
      '<strong>Transactions</strong> — Secure transfers and transaction history',
      '<strong>Loan Processing</strong> — Application and EMI calculation',
      '<strong>Customer Portal</strong> — Self-service banking interface',
      '<strong>Security</strong> — Multi-layer auth and encryption'
    ],
    tech: ['HTML/CSS','JavaScript','Security','Database','Encryption'],
    github: null
  },
  hospital: {
    icon: '🏥',
    name: 'Hospital Management System',
    status: 'indev',
    desc: 'Full hospital management with healthcare-grade security. Architecture defined — development beginning soon.',
    points: [
      '<strong>Patient Records</strong> — Electronic Health Records (EHR)',
      '<strong>Doctor Scheduling</strong> — Appointment and OPD management',
      '<strong>Pharmacy</strong> — Medicine inventory and prescriptions',
      '<strong>Billing</strong> — Insurance and payment management',
      '<strong>Emergency</strong> — Triage and emergency patient flow'
    ],
    tech: ['HTML/CSS','JavaScript','Healthcare','Database','Security'],
    github: null
  }
};

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

document.querySelectorAll('[data-aos], .proj-card').forEach(el => {
  observer.observe(el);
});

// Video clip play/pause
document.querySelectorAll('.clip-box').forEach(box => {
  const video = box.querySelector('.clip-video');
  const btn = box.querySelector('.clip-play-btn');
  const placeholder = box.querySelector('.clip-placeholder');

  if (!video || !btn) return;

  // Check if video src exists
  if (video.src && video.src !== window.location.href && !video.src.endsWith('/')) {
    video.classList.add('loaded');
    if (placeholder) placeholder.style.display = 'none';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.paused) {
      // Pause all other videos first
      document.querySelectorAll('.clip-video').forEach(v => {
        if (v !== video) { v.pause(); }
      });
      document.querySelectorAll('.clip-play-btn').forEach(b => {
        if (b !== btn) b.textContent = '▶ Play';
      });
      video.play();
      btn.textContent = '⏸ Pause';
    } else {
      video.pause();
      btn.textContent = '▶ Play';
    }
  });

  // Click on video box → open fullscreen lightbox
  box.addEventListener('click', function() {
    if (!video.src || video.src === window.location.href) return;
    openVideoLightbox(video.src);
  });
});

// Video fullscreen lightbox
function openVideoLightbox(src) {
  const existing = document.getElementById('video-lightbox');
  if (existing) existing.remove();

  const lb = document.createElement('div');
  lb.id = 'video-lightbox';
  lb.style.cssText = `
    position:fixed;inset:0;z-index:10000;
    background:rgba(0,0,0,0.95);
    display:flex;align-items:center;justify-content:center;
  `;

  lb.innerHTML = `
    <video src="${src}" controls autoplay
           style="width:85vw;max-height:85vh;border-radius:16px;background:#000;">
    </video>
    <button onclick="this.parentElement.remove()"
            style="position:absolute;top:20px;right:24px;
                   background:#ff6584;border:none;color:#fff;
                   font-family:Montserrat,sans-serif;font-weight:800;
                   font-size:0.8rem;padding:10px 20px;border-radius:30px;
                   cursor:pointer;letter-spacing:1px;">
      ✕ Close
    </button>
  `;

  lb.addEventListener('click', (e) => {
    if (e.target === lb) lb.remove();
  });

  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', esc); }
  });

  document.body.appendChild(lb);
}

// Screenshot click → fullscreen
document.querySelectorAll('.screenshot-box img').forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', function() {
    if (!this.src) return;
    const lb = document.createElement('div');
    lb.style.cssText = `
      position:fixed;inset:0;z-index:10000;
      background:rgba(0,0,0,0.95);
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;
    `;
    lb.innerHTML = `
      <img src="${this.src}"
           style="max-width:88vw;max-height:88vh;
                  border-radius:12px;object-fit:contain;">
    `;
    lb.addEventListener('click', () => lb.remove());
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', esc); }
    });
    document.body.appendChild(lb);
  });
});

// Filter tabs
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.getAttribute('data-filter');

    document.querySelectorAll('.proj-card').forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

// GitHub open
function openGithub(btn) {
  const link = btn.getAttribute('data-github');
  if (!link || link === 'YOUR_GITHUB_LINK_HERE') {
    alert('GitHub link अजून add केला नाही!\ndata-github="" मध्ये तुझा GitHub URL टाक');
    return;
  }
  window.open(link, '_blank');
}

// Detail modal
function openDetail(key) {
  const data = projectDetails[key];
  if (!data) return;

  const modal = document.getElementById('proj-modal');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div style="font-size:2.8rem;margin-bottom:10px">${data.icon}</div>
    <div class="status-badge ${data.status === 'live' ? 'badge-live' : 'badge-indev'}">
      ${data.status === 'live' ? '● LIVE' : '🔨 IN DEVELOPMENT'}
    </div>
    <h2>${data.name}</h2>
    <p>${data.desc}</p>
    <ul>${data.points.map(p => `<li>${p}</li>`).join('')}</ul>
    <div class="modal-tech-wrap">
      ${data.tech.map(t => `<span>${t}</span>`).join('')}
    </div>
    ${data.github && data.github !== 'YOUR_GITHUB_LINK_HERE'
      ? `<br/><a href="${data.github}" target="_blank"
            style="display:inline-flex;align-items:center;gap:8px;
                   margin-top:16px;padding:12px 26px;
                   background:var(--accent);color:#fff;
                   border-radius:50px;font-family:Montserrat,sans-serif;
                   font-size:0.8rem;font-weight:800;letter-spacing:1px;
                   text-decoration:none;transition:all 0.3s;">
           View on GitHub →
         </a>`
      : data.github === null
        ? `<p style="margin-top:16px;color:var(--accent2);font-size:0.82rem;">
             🔨 In development — GitHub link will be added once ready.
           </p>`
        : `<p style="margin-top:16px;color:var(--muted);font-size:0.82rem;">
             GitHub link coming soon.
           </p>`
    }
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('proj-modal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Floating particles
const container = document.getElementById('particles');
if (container) {
  const colors = ['#6c63ff','#ff6584','#43e97b','#ffd700','#50c8ff'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (7 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    const size = (2 + Math.random() * 3) + 'px';
    p.style.width = p.style.height = size;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }
}

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.95)';
});

console.log('%c🚀 Projects — Varad Nagapurkar', 'color:#6c63ff;font-size:16px;font-weight:bold;');