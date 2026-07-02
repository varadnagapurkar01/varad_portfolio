document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('mentor-app');
  if (!appContainer) return;

  const mentorName = appContainer.dataset.mentor || "Mentor";
  const videoFile = appContainer.dataset.video || "https://www.w3schools.com/html/mov_bbb.mp4";
  const portfolioUrl = "../../index.html";

  // Build the UI
  appContainer.innerHTML = `
    <!-- Step 2: Welcome Card -->
    <div class="glass-card" id="welcomeCard">
      <h1 class="greeting-title">Welcome, ${mentorName}</h1>
      <h2 class="greeting-subtitle">Thank You For Guiding Me</h2>
      
      <div class="private-badge">
        <i class="fa-solid fa-check-circle"></i> Accessed Via Private Mentor Link
      </div>

      <p class="exclusive-message">
        This appreciation page has been created exclusively for you.<br><br>
        It is not available through my public portfolio and can only be accessed through the private QR code or private link shared with you.<br><br>
        Thank you for being an important part of my learning journey.
      </p>

      <button class="btn btn-play" id="startVideoBtn">
        <i class="fa-solid fa-play"></i> Play Appreciation Video
      </button>
    </div>

    <!-- Step 3: Cinematic Transition -->
    <div class="transition-container" id="transitionContainer">
      <div class="transition-particles"></div>
      <div class="transition-text">Thank You</div>
    </div>

    <!-- Step 4: Video Page -->
    <div class="video-page" id="videoPage">
      <div class="video-wrapper is-paused" id="videoWrapper">
        <video id="mentorVideo" src="${videoFile}" preload="metadata" playsinline></video>
        
        <div class="progress-container" id="progressContainer">
          <div class="progress-bar" id="progressBar"></div>
        </div>

        <div class="custom-controls">
          <div class="controls-left">
            <button class="control-btn" id="playPauseBtn" title="Play/Pause"><i class="fa-solid fa-play"></i></button>
            <button class="control-btn" id="rewindBtn" title="Backward 10s"><i class="fa-solid fa-rotate-left"></i></button>
            <button class="control-btn" id="forwardBtn" title="Forward 10s"><i class="fa-solid fa-rotate-right"></i></button>
            <button class="control-btn" id="muteBtn" title="Mute/Unmute"><i class="fa-solid fa-volume-high"></i></button>
            <button class="control-btn" id="replayBtnCtrl" title="Replay"><i class="fa-solid fa-arrow-rotate-left"></i></button>
          </div>
          <div class="controls-right">
            <button class="control-btn" id="fullscreenBtn" title="Fullscreen"><i class="fa-solid fa-expand"></i></button>
          </div>
        </div>

        <!-- End Screen Overlay -->
        <div class="end-screen" id="endScreen">
          <div class="end-message-top">
            ✨ Thank You For Being Part Of My Journey ✨
          </div>
          <div class="end-buttons">
            <button class="btn" id="replayEndBtn">
              <i class="fa-solid fa-arrow-rotate-left"></i> Replay Video
            </button>
            <a href="${videoFile}" download="Varad_Appreciation_${mentorName.replace(/\s+/g, '_')}.mp4" class="btn btn-secondary">
              <i class="fa-solid fa-download"></i> Download Video
            </a>
            <a href="${portfolioUrl}" class="btn btn-secondary">
              <i class="fa-solid fa-house"></i> Return To Portfolio
            </a>
          </div>
        </div>
      </div>

      <!-- Action Buttons always visible below video -->
      <div class="post-video-actions">
        <a href="${videoFile}" download="Varad_Appreciation_${mentorName.replace(/\s+/g, '_')}.mp4" class="btn">
          <i class="fa-solid fa-download"></i> Download Video
        </a>
        <a href="${portfolioUrl}" class="btn btn-secondary">
          <i class="fa-solid fa-house"></i> Return To Varad Portfolio
        </a>
      </div>
    </div>
  `;

  // Elements
  const welcomeCard = document.getElementById('welcomeCard');
  const transitionContainer = document.getElementById('transitionContainer');
  const videoPage = document.getElementById('videoPage');
  
  const startVideoBtn = document.getElementById('startVideoBtn');
  const videoWrapper = document.getElementById('videoWrapper');
  const video = document.getElementById('mentorVideo');
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = playPauseBtn.querySelector('i');
  const rewindBtn = document.getElementById('rewindBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  const muteBtn = document.getElementById('muteBtn');
  const muteIcon = muteBtn.querySelector('i');
  const replayBtnCtrl = document.getElementById('replayBtnCtrl');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  
  const endScreen = document.getElementById('endScreen');
  const replayEndBtn = document.getElementById('replayEndBtn');

  // Welcome sequence -> Cinematic Transition -> Video
  startVideoBtn.addEventListener('click', () => {
    // Hide welcome card
    welcomeCard.style.display = 'none';
    
    // Show 3D Transition Animation
    transitionContainer.style.display = 'flex';
    transitionContainer.classList.add('active');

    // After 2.5 seconds, hide transition and show video page
    setTimeout(() => {
      transitionContainer.style.display = 'none';
      videoPage.style.display = 'flex';
      videoPage.classList.add('active');
      
      // Auto play video
      setTimeout(() => {
        togglePlay();
      }, 300);
    }, 2500);
  });

  // Play/Pause logic
  function togglePlay() {
    if (video.paused) {
      video.play();
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
      videoWrapper.classList.remove('is-paused');
      endScreen.classList.remove('visible');
    } else {
      video.pause();
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
      videoWrapper.classList.add('is-paused');
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // Rewind/Forward
  rewindBtn.addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
  });
  
  forwardBtn.addEventListener('click', () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  });

  // Mute/Unmute
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      muteIcon.classList.remove('fa-volume-high');
      muteIcon.classList.add('fa-volume-xmark');
    } else {
      muteIcon.classList.remove('fa-volume-xmark');
      muteIcon.classList.add('fa-volume-high');
    }
  });

  // Replay Control Button
  replayBtnCtrl.addEventListener('click', () => {
    video.currentTime = 0;
    if (video.paused) togglePlay();
  });

  // Progress Bar
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progress}%`;
  });

  progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  });

  // Fullscreen Logic
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      if (videoWrapper.requestFullscreen) {
        videoWrapper.requestFullscreen();
      } else if (videoWrapper.webkitRequestFullscreen) {
        videoWrapper.webkitRequestFullscreen();
      } else if (videoWrapper.msRequestFullscreen) {
        videoWrapper.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  });

  // Video End Logic
  video.addEventListener('ended', () => {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    videoWrapper.classList.add('is-paused');
    
    // Automatically exit fullscreen if video ends
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }

    // Trigger end screen
    endScreen.classList.add('visible');
  });

  // Replay End Screen Button
  replayEndBtn.addEventListener('click', () => {
    endScreen.classList.remove('visible');
    video.currentTime = 0;
    togglePlay();
  });

});
