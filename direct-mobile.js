// Direct mobile approach
// This script will bypass the intro sequence only on mobile and directly show the main content

// Execute immediately when script loads
(function() {
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('Mobile device detected, bypassing intro sequence entirely');
    
    // Initialize mobile-specific logic
    initMobile();
  } else {
    console.log('Desktop device detected, using normal sequence');
    // Do nothing on desktop - let the normal desktop process handle it
  }
  
  function initMobile() {
    // Wait for the DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupMobile);
    } else {
      setupMobile();
    }
  }
  
  function setupMobile() {
    console.log('Setting up mobile direct access');
    
    // Get references to critical elements
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    const worksSection = document.getElementById('works');
    
    // Force styles directly
    if (loadingScreen) {
      // Hide loading screen immediately
      loadingScreen.style.display = 'none';
      loadingScreen.style.opacity = '0';
      loadingScreen.style.visibility = 'hidden';
    }
    
    if (mainContent) {
      // Show main content immediately
      mainContent.style.display = 'block';
      mainContent.style.opacity = '1';
      mainContent.style.visibility = 'visible';
    }
    
    if (worksSection) {
      // Activate and show works section immediately
      worksSection.classList.add('active');
      worksSection.style.display = 'flex';
      worksSection.style.opacity = '1';
      worksSection.style.visibility = 'visible';
    }
    
    // Fix any potential z-index issues by adding a specific class
    document.body.classList.add('mobile-direct');
    
    // Make sure the video still plays in the background
    const video = document.getElementById('bgVideo');
    if (video) {
      video.muted = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.play().catch(function(error) {
        console.log('Mobile video play failed:', error);
      });
    }
  }
})();
