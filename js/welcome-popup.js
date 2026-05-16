/* ============================================
   CINEMATIC WELCOME POP-UP JAVASCRIPT
   ============================================ */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    typewriterSpeed: 80,
    typewriterDelay: 500,
welcomeMessages: [

  "✋ no tricks. just one tiny thing.",
  "I just need to know you can ⌨️type. that's it.  👀 ",
  "💎You give me a name. I give you the full, unfiltered VARAD 🚀.",   //the work, the vibe, everything
  "🎯 I HOPE THAT'S WHAT YOU WANT ..." ,
],
    particleCount: 100,
    storageKey: 'portfolioVisitorName',
    apiEndpoint: '/api/store-name' // For future backend integration
  };

  // State
  let canvas, ctx;
  let particles = [];
  let animationFrame;
  let hasVisited = false;

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Check if user has already visited
    const storedName = getStoredName();
    if (storedName) {
      hasVisited = true;
      hideWelcomeOverlay();
      return;
    }

    // Setup canvas and particles
    setupCanvas();
    createParticles();
    animateParticles();

    // Start typewriter effect
    setTimeout(() => {
      typewriterEffect();
    }, CONFIG.typewriterDelay);

    // Setup input listener
    setupInputListener();
  }

  // ============================================
  // CANVAS & PARTICLE SYSTEM
  // ============================================

  function setupCanvas() {
    canvas = document.getElementById('galaxyCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 150;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  function animateParticles() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections between nearby particles
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 200, 255, ${0.15 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    // Draw and update particles
    particles.forEach(particle => {
      // Twinkling effect
      particle.opacity += particle.twinkleSpeed;
      if (particle.opacity > 1 || particle.opacity < 0.3) {
        particle.twinkleSpeed *= -1;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 200, 255, ${particle.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 200, 255, 0.8)';
      ctx.fill();

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });

    animationFrame = requestAnimationFrame(animateParticles);
  }

  // ============================================
  // TYPEWRITER EFFECT
  // ============================================

  function typewriterEffect() {
    const promptElement = document.querySelector('.typewriter-text');
    if (!promptElement) return;

    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = '';

    function type() {
      if (messageIndex >= CONFIG.welcomeMessages.length) {
        // Finished typing all messages
        promptElement.style.borderRight = 'none';
        return;
      }

      const fullMessage = CONFIG.welcomeMessages[messageIndex];

      if (charIndex < fullMessage.length) {
        currentMessage += fullMessage[charIndex];
        promptElement.textContent = currentMessage;
        charIndex++;
        setTimeout(type, CONFIG.typewriterSpeed);
      } else {
        // Finished current message, pause then continue
        setTimeout(() => {
          if (messageIndex < CONFIG.welcomeMessages.length - 1) {
            currentMessage += '\n';
            promptElement.textContent = currentMessage;
          }
          messageIndex++;
          charIndex = 0;
          setTimeout(type, 500);
        }, 800);
      }
    }

    type();
  }

  // ============================================
  // INPUT HANDLING
  // ============================================

  function setupInputListener() {
    const nameInput = document.getElementById('nameInput');
    if (!nameInput) return;

    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const name = nameInput.value.trim();
        if (name.length > 0) {
          handleNameSubmission(name);
        }
      }
    });

    // Focus input after typewriter completes
    setTimeout(() => {
      nameInput.focus();
    }, 5000);
  }

  // ============================================
  // NAME SUBMISSION & WOW MOMENT
  // ============================================

  function handleNameSubmission(name) {
    const nameInput = document.getElementById('nameInput');
    nameInput.disabled = true;

    // Store the name
    storeName(name);

    // Trigger shockwave effect
    createShockwave();

    // Create particle burst
    createParticleBurst();

    // Hide input form and show welcome reveal
    setTimeout(() => {
      showWelcomeReveal(name);
    }, 800);

    // Transition to portfolio
    setTimeout(() => {
      transitionToPortfolio();
    }, 4500);
  }

  function createShockwave() {
    const overlay = document.getElementById('welcomeOverlay');
    const shockwave = document.createElement('div');
    shockwave.className = 'shockwave active';
    overlay.appendChild(shockwave);

    setTimeout(() => {
      shockwave.remove();
    }, 1500);
  }

  function createParticleBurst() {
    const overlay = document.getElementById('welcomeOverlay');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const angle = (Math.PI * 2 * i) / CONFIG.particleCount;
      const velocity = 3 + Math.random() * 5;
      const distance = 200 + Math.random() * 300;
      
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';

      overlay.appendChild(particle);

      // Animate particle
      particle.animate([
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        { 
          transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      setTimeout(() => {
        particle.remove();
      }, 1500);
    }
  }

  function showWelcomeReveal(name) {
    const welcomeContent = document.querySelector('.welcome-content');
    const welcomeReveal = document.querySelector('.welcome-reveal');
    const visitorNameElement = document.querySelector('.visitor-name');
    const welcomeMessage = document.querySelector('.welcome-message');

    if (welcomeContent) welcomeContent.style.opacity = '0';
    
    if (welcomeReveal) {
      welcomeReveal.classList.add('active');
    }

    if (visitorNameElement) {
      visitorNameElement.textContent = name;
    }

    if (welcomeMessage) {
      setTimeout(() => {
        welcomeMessage.classList.add('show');
      }, 200);
    }
  }

  function transitionToPortfolio() {
    const overlay = document.getElementById('welcomeOverlay');
    
    if (overlay) {
      overlay.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(1.2)';

      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.remove();
        
        // Stop particle animation
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      }, 1500);
    }
  }

  // ============================================
  // STORAGE FUNCTIONS
  // ============================================

  function storeName(name) {
    // Store in localStorage
    try {
      localStorage.setItem(CONFIG.storageKey, name);
      localStorage.setItem(CONFIG.storageKey + '_timestamp', Date.now());
    } catch (e) {
      console.warn('localStorage not available:', e);
    }

    // Send to backend (if available)
    sendToBackend(name);
  }

  function getStoredName() {
    try {
      return localStorage.getItem(CONFIG.storageKey);
    } catch (e) {
      return null;
    }
  }

  function sendToBackend(name) {
    // This will work when you set up the backend
    fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Name stored successfully:', data);
    })
    .catch(error => {
      // Backend not available yet, that's okay
      console.log('Backend storage pending:', error.message);
    });
  }

  function hideWelcomeOverlay() {
    const overlay = document.getElementById('welcomeOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  // ============================================
  // UTILITY: Clear stored name (for testing)
  // ============================================
  window.clearWelcomeData = function() {
    localStorage.removeItem(CONFIG.storageKey);
    localStorage.removeItem(CONFIG.storageKey + '_timestamp');
    console.log('Welcome data cleared. Refresh to see the welcome screen again.');
  };

})();
