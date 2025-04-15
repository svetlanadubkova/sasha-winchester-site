// Super-simple mobile entry sequence
// This is a completely simplified version with no dependencies or complex events

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking if mobile...');
  
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('Mobile device detected, applying simple mobile entry');
    
    // Get references to critical elements
    const video = document.getElementById('bgVideo');
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    const worksSection = document.getElementById('works');
    const titleText1 = document.getElementById('title-text-1');
    const titleText2 = document.getElementById('title-text-2');
    
    // Force video to play
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
    
    // Show title 1 soon after page load
    setTimeout(function() {
      console.log('Showing title 1');
      if (titleText1) {
        titleText1.style.opacity = '1';
        titleText1.style.display = 'block';
      }
    }, 1500);
    
    // Switch to title 2
    setTimeout(function() {
      console.log('Hiding title 1');
      if (titleText1) {
        titleText1.style.opacity = '0';
      }
      
      setTimeout(function() {
        console.log('Showing title 2');
        if (titleText2) {
          titleText2.style.opacity = '1';
          titleText2.style.display = 'block';
        }
      }, 500);
    }, 4000);
    
    // Finally, proceed to main content
    setTimeout(function() {
      console.log('Proceeding to main content');
      
      // Hide loading screen
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        
        setTimeout(function() {
          loadingScreen.style.display = 'none';
        }, 1000);
      }
      
      // Show main content
      if (mainContent) {
        mainContent.style.opacity = '1';
        mainContent.style.display = 'block';
      }
      
      // Activate works section
      if (worksSection) {
        worksSection.classList.add('active');
        worksSection.style.opacity = '1';
        worksSection.style.display = 'flex';
      }
    }, 7000);
    
    // Extreme fallback - if nothing happens after 10 seconds, force show content
    setTimeout(function() {
      console.log('Fallback timer: forcing content display');
      
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
      
      if (mainContent) {
        mainContent.style.opacity = '1';
        mainContent.style.display = 'block';
      }
      
      if (worksSection) {
        worksSection.classList.add('active');
        worksSection.style.opacity = '1';
        worksSection.style.display = 'flex';
      }
    }, 10000);
  }
});
