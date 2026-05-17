/* ============================================
   CINEMATIC WELCOME POP-UP JAVASCRIPT
   ============================================ */

(function() {
  'use strict';

  // Configuration - OPTIMIZED for performance
  const CONFIG = {
    typewriterSpeed: 40, // DOUBLED SPEED: Was 80ms, now 40ms = 2x faster typing
    typewriterDelay: 500,
    welcomeMessages: [
      "I just need to know you can ⌨️type. that's it.  👀 ",
      "💎You give me a name. I give you the full, unfiltered VARAD 🚀.",
      "🎯 I HOPE THAT'S WHAT YOU WANT ..." ,
    ],
    particleCount: 50,
    storageKey: 'portfolioVisitorName',
    apiEndpoint: '/api/store-name'
  };

  // State
  let canvas, ctx;
  let particles = [];
  let animationFrame;
  let hasVisited = false;
  let isCanvasActive = false;

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

    // Lock body scroll
    document.body.classList.add('welcome-active');

    // Setup canvas and particles (but don't start immediately)
    setupCanvas();
    
    // Start typewriter effect only
    setTimeout(() => {
      typewriterEffect();
    }, CONFIG.typewriterDelay);

    // Start canvas animation after user focuses input
    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
      nameInput.addEventListener('focus', () => {
        if (!isCanvasActive) {
          isCanvasActive = true;
          createParticles();
          animateParticles();
        }
      }, { once: true });
    }

    // Setup input listener
    setupInputListener();
  }

  // ============================================
  // CANVAS & PARTICLE SYSTEM - OPTIMIZED
  // ============================================

  function setupCanvas() {
    canvas = document.getElementById('galaxyCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d', { alpha: true });
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
        twinkleSpeed: Math.random() * 0.01 + 0.005
      });
    }
  }

  function animateParticles() {
    if (!ctx || !isCanvasActive) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update particles
    particles.forEach((particle, index) => {
      // Twinkling effect
      particle.opacity += particle.twinkleSpeed;
      if (particle.opacity > 0.8 || particle.opacity < 0.2) {
        particle.twinkleSpeed *= -1;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 200, 255, ${particle.opacity})`;
      ctx.fill();

      // Update position with wrapping
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });

    // Only draw connections between every 2nd particle (reduced CPU usage)
    for (let i = 0; i < particles.length; i += 2) {
      const p1 = particles[i];
      for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSquared = dx * dx + dy * dy;
        
        if (distSquared < 22500) { // 150^2
          const distance = Math.sqrt(distSquared);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 200, 255, ${0.1 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

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
        promptElement.style.borderRight = 'none';
        return;
      }

      const fullMessage = CONFIG.welcomeMessages[messageIndex];

      if (charIndex < fullMessage.length) {
        const char = fullMessage[charIndex];
        
        // Check if we're about to type "VARAD" - highlight it
        if (fullMessage.substring(charIndex, charIndex + 5) === 'VARAD') {
          currentMessage += '<span class="highlight-varad">VARAD</span>';
          charIndex += 5;
        } else {
          currentMessage += char;
          charIndex++;
        }
        
        promptElement.innerHTML = currentMessage;
        setTimeout(type, CONFIG.typewriterSpeed);
      } else {
        setTimeout(() => {
          if (messageIndex < CONFIG.welcomeMessages.length - 1) {
            currentMessage += '\n';
            promptElement.innerHTML = currentMessage;
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
    const submitBtn = document.getElementById('submitNameBtn');
    const validationHint = document.getElementById('validationHint');
    
    if (!nameInput) return;

    // Validation function
    function validateName(name) {
      const trimmed = name.trim();
      
      // Block only single character names
      if (trimmed.length === 1) {
        if (validationHint) {
          validationHint.textContent = "that's a letter, not a name 🙃";
          validationHint.style.display = 'block';
        }
        return false;
      }
      
      // Hide hint for valid names (2+ characters)
      if (validationHint) {
        validationHint.style.display = 'none';
      }
      return trimmed.length > 0;
    }

    // Real-time validation on input
    nameInput.addEventListener('input', () => {
      const name = nameInput.value.trim();
      if (name.length === 1) {
        if (validationHint) {
          validationHint.textContent = "that's a letter, not a name 🙃";
          validationHint.style.display = 'block';
        }
      } else {
        if (validationHint) {
          validationHint.style.display = 'none';
        }
      }
    });

    // Enter key support
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const name = nameInput.value.trim();
        if (validateName(name)) {
          handleNameSubmission(name);
        }
      }
    });

    // Button click support
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (validateName(name)) {
          handleNameSubmission(name);
        }
      });
    }

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

    // Hide input form and show welcome reveal
    setTimeout(() => {
      showWelcomeReveal(name);
    }, 300);

    // Transition to portfolio
    setTimeout(() => {
      transitionToPortfolio();
    }, 3500);
  }

  function showWelcomeReveal(name) {
    const welcomeContent = document.querySelector('.welcome-content');
    const welcomeReveal = document.querySelector('.welcome-reveal');
    const visitorNameElement = document.querySelector('.visitor-name');

    if (welcomeContent) welcomeContent.style.opacity = '0';
    
    if (welcomeReveal) {
      welcomeReveal.classList.add('active');
    }

    if (visitorNameElement) {
      visitorNameElement.textContent = name;
    }
  }

  function transitionToPortfolio() {
    const overlay = document.getElementById('welcomeOverlay');
    
    if (overlay) {
      overlay.style.transition = 'opacity 1s ease';
      overlay.style.opacity = '0';

      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.remove();
        
        // Unlock body scroll
        document.body.classList.remove('welcome-active');
        
        // Stop particle animation
        isCanvasActive = false;
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      }, 1000);
    }
  }

  // ============================================
  // STORAGE FUNCTIONS
  // ============================================

  function storeName(name) {
    try {
      localStorage.setItem(CONFIG.storageKey, name);
      localStorage.setItem(CONFIG.storageKey + '_timestamp', Date.now());
    } catch (e) {
      console.warn('localStorage not available:', e);
    }

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
    fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    }).catch(error => {
      console.log('Backend storage pending:', error.message);
    });
  }

  function hideWelcomeOverlay() {
    const overlay = document.getElementById('welcomeOverlay');
    if (overlay) {
      overlay.style.display = 'none';
      // Unlock body scroll
      document.body.classList.remove('welcome-active');
    }
  }

  window.clearWelcomeData = function() {
    localStorage.removeItem(CONFIG.storageKey);
    localStorage.removeItem(CONFIG.storageKey + '_timestamp');
    console.log('Welcome data cleared. Refresh to see the welcome screen again.');
  };

})();
