// === VARAD NAGAPURKAR — script.js ===

// Defer animations until page is loaded
let animationsReady = false;

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.85)';
});

// Defer hover effects until page is loaded
window.addEventListener('load', () => {
  animationsReady = true;
  
  document.querySelectorAll('.sec-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-4px) scale(1.03)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.transform = "scale(1.05)";
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = "scale(1)";
    });
  });

  document.querySelectorAll('.bio-section').forEach(section => {
    section.addEventListener('mouseenter', () => {
      section.style.transform = "translateX(6px)";
    });
    section.addEventListener('mouseleave', () => {
      section.style.transform = "translateX(0)";
    });
  });
});

// Console message for recruiters
console.log('%c👋 Hey Recruiter!', 'color:#6c63ff;font-size:22px;font-weight:bold;');
console.log('%cBuilt by Varad Nagapurkar — DevOps | Cricket | पौरोहित्य', 'color:#ff6584;font-size:13px;');
console.log('%cLet\'s connect! 🚀', 'color:#43e97b;font-size:13px;');


(function() { 
 
  const logoData = { 
  tux:       { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linux.svg',        color: '#FFD700', name: 'LINUX'      }, 
  aws:       { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg',    color: '#FF9900', name: 'AWS'        }, 
  redhat:    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/redhat.svg',       color: '#EE0000', name: 'REDHAT'     }, 
  ansible:   { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ansible.svg',      color: '#EE0000', name: 'ANSIBLE'    }, 
  docker:    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg',       color: '#2496ED', name: 'DOCKER'     }, 
  k8s:       { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/kubernetes.svg',   color: '#326CE5', name: 'K8S'        }, 
  git:       { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/git.svg',          color: '#F05032', name: 'GIT'        }, 
  podman:    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/podman.svg',       color: '#892CA0', name: 'PODMAN'     }, 
  ubuntu:    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ubuntu.svg',       color: '#E95420', name: 'UBUNTU'     }, 
  python:    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg',       color: '#3776AB', name: 'PYTHON'     }, 
  terraform: { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/terraform.svg',   color: '#7B42BC', name: 'TERRA'      }, 
  bash:      { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gnubash.svg',      color: '#4EAA25', name: 'BASH'       }, 
  github:    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg',       color: '#ffffff', name: 'GITHUB'     }, 
  jenkins:   { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jenkins.svg',      color: '#D24939', name: 'JENKINS'    }, 
  prometheus:{ src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/prometheus.svg',   color: '#E6522C', name: 'PROMETHEUS' }, 
}; 

// V A R A D 
const row1 = [ 
  { l: 'V', logo: 'tux'       }, 
  { l: 'A', logo: 'aws'       }, 
  { l: 'R', logo: 'redhat'    }, 
  { l: 'A', logo: 'ansible'   }, 
  { l: 'D', logo: 'docker'    }, 
]; 

// N A G A P U R K A R 
const row2 = [ 
  { l: 'N', logo: 'k8s'       }, 
  { l: 'A', logo: 'git'       }, 
  { l: 'G', logo: 'podman'    }, 
  { l: 'A', logo: 'ubuntu'    }, 
  { l: 'P', logo: 'python'    }, 
  { l: 'U', logo: 'terraform' }, 
  { l: 'R', logo: 'bash'      }, 
  { l: 'K', logo: 'github'    }, 
  { l: 'A', logo: 'jenkins'   }, 
  { l: 'R', logo: 'prometheus'}, 
];

  function buildRow(rowData, containerId, ltrClass) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const cells = [];

    rowData.forEach(({ l, logo }) => {
      const cell = document.createElement('div');
      cell.className = 'dn-cell';

      const ld = logoData[logo];
      const logoBox = document.createElement('div');
      logoBox.className = 'dn-logo';

      const img = document.createElement('img');
      img.src = ld.src;
      img.loading = 'lazy'; // Lazy load images
      img.style.cssText = `filter: invert(1) sepia(1) saturate(5) hue-rotate(0deg); opacity:0.9;`;

      const toolLabel = document.createElement('div');
      toolLabel.className = 'dn-tool';
      toolLabel.textContent = ld.name;
      toolLabel.style.color = ld.color;

      logoBox.appendChild(img);
      logoBox.appendChild(toolLabel);

      const ltrEl = document.createElement('div');
      ltrEl.className = `dn-ltr ${ltrClass}`;
      ltrEl.textContent = l;

      cell.appendChild(logoBox);
      cell.appendChild(ltrEl);
      container.appendChild(cell);
      cells.push({ logoBox, ltrEl });
    });

    return cells;
  }

  // Defer name animation until page is loaded
  let animationStarted = false;
  
  function startNameAnimation() {
    if (animationStarted) return;
    animationStarted = true;
    
    const cells1 = buildRow(row1, 'nameRow1', 'row1-ltr');
    const cells2 = buildRow(row2, 'nameRow2', 'row2-ltr');
    const allCells = [...cells1, ...cells2];

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function animate() {
      for (let c of allCells) {
        c.logoBox.classList.remove('show', 'hide');
        c.ltrEl.classList.remove('show');
      }

      await sleep(200);

      // Logo flow — continuous, no pause
      allCells.forEach((c, i) => {
        setTimeout(() => {
          c.logoBox.classList.add('show');
        }, i * 180);
      });

      // Letter flow — starts 1 second after logo flow, continuous
      allCells.forEach((c, i) => {
        setTimeout(() => {
          c.logoBox.classList.add('hide');
          c.logoBox.classList.remove('show');
          setTimeout(() => {
            c.ltrEl.classList.add('show');
          }, 500);
        }, 1000 + i * 180);
      });

      // Total time = 1000 + 15*180 + 150 + buffer = ~4500ms → then 5sec pause → loop
      const totalTime = 1000 + (allCells.length * 180) + 500;
      setTimeout(() => {
        sleep(4000).then(() => animate());
      }, totalTime);
    }
    animate();
  }

  // Start animation after page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startNameAnimation);
  } else {
    startNameAnimation();
  }

})();

