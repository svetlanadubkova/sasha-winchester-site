// Mobile Image Interactions
// Handles showing/hiding captions on mobile when images are clicked
// with magical animations

// Execute immediately when script loads
(function() {
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('Mobile device detected, initializing mobile image interactions');
    
    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMobileImageInteractions);
    } else {
      initMobileImageInteractions();
    }
  }
  
  function initMobileImageInteractions() {
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add click event listeners to each gallery item
    galleryItems.forEach(item => {
      item.addEventListener('click', function(event) {
        // Prevent event from bubbling up to document
        event.stopPropagation();
        
        // Create a magical effect by adding/removing active class
        if (this.classList.contains('active')) {
          // If already active, remove active class with a slight delay
          setTimeout(() => {
            this.classList.remove('active');
          }, 50);
        } else {
          // First, deactivate all other items
          galleryItems.forEach(otherItem => {
            otherItem.classList.remove('active');
          });
          
          // Apply a tiny delay before showing the caption for a magical effect
          setTimeout(() => {
            // Then activate this item
            this.classList.add('active');
          }, 50);
        }
      });
    });
    
    // Close caption when clicking elsewhere on the document
    document.addEventListener('click', function() {
      galleryItems.forEach(item => {
        item.classList.remove('active');
      });
    });
    
    // Add tap feedback effect
    galleryItems.forEach(item => {
      const image = item.querySelector('img');
      
      if (image) {
        // Add a touch ripple effect when tapping
        image.addEventListener('touchstart', function() {
          // Add a ripple element
          const ripple = document.createElement('div');
          ripple.classList.add('touch-ripple');
          
          // Position it at the center of the image
          ripple.style.top = '50%';
          ripple.style.left = '50%';
          
          // Add it to the image container
          item.appendChild(ripple);
          
          // Remove after animation completes
          setTimeout(() => {
            ripple.remove();
          }, 500);
          
          // Prevent default to avoid browser's native touch behavior
          return false;
        }, { passive: true });
      }
    });
    
    // Prevent the modal from opening when clicking an image on mobile
    // (Since we're using the click for captions instead)
    const modal = document.querySelector('.modal');
    if (modal) {
      galleryItems.forEach(item => {
        const image = item.querySelector('img');
        if (image) {
          image.addEventListener('click', function(event) {
            event.stopPropagation();
          });
        }
      });
    }
  }
})();
