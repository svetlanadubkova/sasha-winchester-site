// Improved Lazy Loading for Images
// Ensures loading animations properly disappear after images load

(function() {
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBetterLazyLoading);
  } else {
    initBetterLazyLoading();
  }
  
  function initBetterLazyLoading() {
    console.log('Initializing better lazy loading for images');
    
    // Get all images to lazy load
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    // Process each image
    lazyImages.forEach(img => {
      // Set proper loading state class
      img.classList.add('loading');
      
      // Make sure there's a proper loading state
      const galleryItem = img.closest('.gallery-item');
      if (galleryItem) {
        galleryItem.classList.add('is-loading');
      }
      
      // Handle image load event
      img.addEventListener('load', function() {
        // Remove loading state and add loaded state
        img.classList.remove('loading');
        img.classList.add('loaded');
        
        // Also update parent container
        if (galleryItem) {
          galleryItem.classList.remove('is-loading');
          galleryItem.classList.add('is-loaded');
        }
      });
      
      // Handle image error event
      img.addEventListener('error', function() {
        // Remove loading state and add error state
        img.classList.remove('loading');
        img.classList.add('error');
        
        // Update parent container
        if (galleryItem) {
          galleryItem.classList.remove('is-loading');
          galleryItem.classList.add('has-error');
        }
      });
    });
    
    // Set a timeout to make sure all images eventually finish loading
    // This ensures animations don't get stuck if an image load event doesn't fire
    setTimeout(() => {
      document.querySelectorAll('.is-loading').forEach(item => {
        item.classList.remove('is-loading');
        item.classList.add('is-loaded');
      });
      
      document.querySelectorAll('.loading').forEach(img => {
        img.classList.remove('loading');
        img.classList.add('loaded');
      });
    }, 5000); // Give images 5 seconds to load
  }
})();
