// Fixed Mobile Image Interactions
// Ensures captions work properly on mobile when images are clicked

(function() {
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('Mobile device detected, initializing mobile image interactions');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', initMobileImageInteractions);
  }
  
  function initMobileImageInteractions() {
    console.log('Setting up mobile image interactions');
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add click event listeners to each gallery item
    galleryItems.forEach(item => {
      item.addEventListener('click', handleItemClick);
    });
    
    // Close all captions when clicking elsewhere on the document
    document.addEventListener('click', function(event) {
      // Only if not clicking a gallery item
      if (!event.target.closest('.gallery-item')) {
        galleryItems.forEach(item => {
          item.classList.remove('active');
        });
      }
    });
    
    // Prevent modal opening on mobile
    preventModalOnMobile();
  }
  
  function handleItemClick(event) {
    // Prevent event from bubbling up to document
    event.stopPropagation();
    
    // Get gallery item (this element or its parent)
    const galleryItem = this.closest('.gallery-item');
    
    // Toggle active class - add if not present, remove if present
    if (galleryItem.classList.contains('active')) {
      galleryItem.classList.remove('active');
    } else {
      // First, deactivate all other items
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Then activate this item
      galleryItem.classList.add('active');
      
      // Add a touch ripple effect at click position
      addRippleEffect(event, galleryItem);
    }
  }
  
  function addRippleEffect(event, element) {
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.classList.add('touch-ripple');
    
    // Get click position relative to the element
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Position it at click coordinates
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // Add it to the element
    element.appendChild(ripple);
    
    // Remove after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  function preventModalOnMobile() {
    // Get all gallery item images
    const galleryItemImages = document.querySelectorAll('.gallery-item img');
    
    // Prevent click events from propagating to avoid modal opening
    galleryItemImages.forEach(img => {
      img.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    });
    
    // Also prevent entire gallery items from opening modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    });
  }
})();
