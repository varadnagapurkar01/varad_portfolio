/* ============================================
   CINEMATIC WELCOME POP-UP JAVASCRIPT
   ============================================ */

(function() {
  'use strict';

  // Configuration - OPTIMIZED for performance
  const CONFIG = {
    typewriterSpeed: 28, // Faster typing: 28ms per character
    typewriterDelay: 200, // Start typewriter sooner
    welcomeMessages: [
      "I just need to know you can ⌨️type. that's it.  👀 ",
      "💎You give me a name. I give you the full, unfiltered VARAD 🚀.",
      "🎯 I HOPE THAT'S WHAT YOU WANT ..." ,
    ],
    particleCount: 50,
    storageKey: 'portfolioVisitorName',
    apiEndpoint: '/api/store-name'
  };

  const ANONYMOUS_LINES = [
    { text: "Bro Entered Like a Secret Boss 😎", type: "cool" },
    { text: "Unknown Legend Has Joined 🔥", type: "legend" },
    { text: "Silent Entry. Heavy Aura. ✨", type: "silent" },
    { text: "Someone Cool Just Spawned 👀", type: "cool" },
    { text: "Mystery Person Detected 🚨", type: "danger" },
    { text: "Bro Chose Stealth Mode 😌", type: "silent" },
    { text: "A Different Breed Entered 💀", type: "mystery" },
    { text: "No Name. Pure Presence.", type: "legend" },
    { text: "Stranger Energy Activated ⚡", type: "main-character" },
    { text: "Someone Interesting Is Watching 👁️", type: "mystery" },
    { text: "Lowkey Main Character Arrived 🎬", type: "main-character" },
    { text: "Hidden Player Unlocked 🔓", type: "mystery" },
    { text: "This Visitor Feels Dangerous 😏", type: "danger" },
    { text: "Unknown But Confident 🔥", type: "legend" },
    { text: "Bro Said “Identity Optional” 😭", type: "cool" },
    { text: "A Silent Legend Appears…", type: "silent" },
    { text: "Vibes Entered Before The Name ✨", type: "legend" },
    { text: "Suspiciously Cool Visitor Detected 👀", type: "mystery" },
    { text: "Anonymous… But Not Ordinary 😎", type: "cool" },
    { text: "Some Enter Names. Some Enter History. 🔥", type: "legend" },
    { text: "Quiet Entry. Loud Personality.", type: "silent" },
    { text: "Bro Entered With Aura Enabled ⚡", type: "main-character" },
    { text: "This Human Feels Important 👁️", type: "legend" },
    { text: "Stealth Visitor With Main Character Energy 🎬", type: "main-character" },
    { text: "Unknown Visitor. Premium Vibes Only. ✨", type: "legend" }
  ];

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
          setTimeout(type, 300); // Reduced from 500ms
        }, 500); // Reduced from 800ms
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
    }, 3500);

    // Anonymous entry button
    const anonymousBtn = document.getElementById('anonymousBtn');
    if (anonymousBtn) {
      anonymousBtn.addEventListener('click', () => {
        const randomObj = ANONYMOUS_LINES[Math.floor(Math.random() * ANONYMOUS_LINES.length)];
        handleNameSubmission(randomObj.text, true, randomObj.type);
      });
    }
  }

  // ============================================
  // NAME SUBMISSION & WOW MOMENT
  // ============================================

  function handleNameSubmission(name, isAnonymous = false, personalityType = 'default') {
    const nameInput = document.getElementById('nameInput');
    if (nameInput) nameInput.disabled = true;

    // Store the name
    storeName(name, isAnonymous);

    // Hide input form and show welcome reveal
    setTimeout(() => {
      showWelcomeReveal(name, personalityType);
    }, 300);

    // Transition to portfolio via Logo Intro
    setTimeout(() => {
      showLogoIntro();
    }, 3500);
  }

  function showLogoIntro() {
    const overlay = document.createElement('div');
    overlay.className = 'logo-intro-overlay';
    
    const logo = document.createElement('img');
    // Using the exact logo file as requested
    logo.src = 'varad_brand_logo-removebg-preview (1).png';
    logo.className = 'logo-intro-img';
    
    overlay.appendChild(logo);
    document.body.appendChild(overlay);

    // Phase 1: Fade in overlay
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    // Phase 2: Play logo animation
    setTimeout(() => {
      logo.classList.add('animate');
    }, 400);

    // Phase 3: Transition to portfolio
    setTimeout(() => {
      overlay.classList.remove('active');
      transitionToPortfolio();
      
      setTimeout(() => {
        overlay.remove();
      }, 500);
    }, 2000); // 400ms delay + 1.5s animation = ~1.9s, round to 2s
  }

  function showWelcomeReveal(name, personalityType = 'default') {
    const welcomeContent = document.querySelector('.welcome-content');
    const welcomeReveal = document.querySelector('.welcome-reveal');
    const visitorNameElement = document.querySelector('.visitor-name');

    if (welcomeContent) welcomeContent.style.opacity = '0';
    
    if (welcomeReveal) {
      welcomeReveal.classList.add('active');
    }

    if (visitorNameElement) {
      // Clear previous personality classes
      visitorNameElement.className = 'visitor-name';
      
      // Apply personality class
      if (personalityType !== 'default') {
        visitorNameElement.classList.add(`personality-${personalityType}`);
      }

      // Wrap emojis in span to preserve original colors and rendering
      const nameWithEmojis = name.replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu, '<span class="emoji">$1</span>');
      visitorNameElement.innerHTML = nameWithEmojis;
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

  function storeName(name, isAnonymous = false) {
    try {
      if (isAnonymous) {
        sessionStorage.setItem(CONFIG.storageKey, name);
      } else {
        localStorage.setItem(CONFIG.storageKey, name);
        localStorage.setItem(CONFIG.storageKey + '_timestamp', Date.now());
      }
    } catch (e) {
      console.warn('Storage not available:', e);
    }

    sendToBackend(name);
  }

  function getStoredName() {
    try {
      return localStorage.getItem(CONFIG.storageKey) || sessionStorage.getItem(CONFIG.storageKey);
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
    sessionStorage.removeItem(CONFIG.storageKey);
    console.log('Welcome data cleared. Refresh to see the welcome screen again.');
  };

})();
