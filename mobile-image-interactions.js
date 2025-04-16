// Mobile Image Interactions
// Handles showing/hiding captions on mobile when images are clicked

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
        
        // If this item is already active, deactivate it
        if (this.classList.contains('active')) {
          this.classList.remove('active');
        } else {
          // First, deactivate all other items
          galleryItems.forEach(otherItem => {
            otherItem.classList.remove('active');
          });
          
          // Then activate this item
          this.classList.add('active');
        }
      });
    });
    
    // Close caption when clicking elsewhere on the document
    document.addEventListener('click', function() {
      galleryItems.forEach(item => {
        item.classList.remove('active');
      });
    });
    
    // Prevent the modal from opening when clicking an image on mobile
    // (Since we're using the click for captions instead)
    galleryItems.forEach(item => {
      const image = item.querySelector('img');
      if (image) {
        image.addEventListener('click', function(event) {
          event.stopPropagation();
        });
      }
    });
  }
})();
