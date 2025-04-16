// Lazy Loading for Images
// This script implements lazy loading and progressive image loading
// to improve perceived performance on mobile devices

(function() {
  // Run on both mobile and desktop, but with different thresholds
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
  } else {
    initLazyLoading();
  }
  
  function initLazyLoading() {
    console.log('Initializing lazy loading for images');
    
    // Get all images in gallery
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    
    // Add the data-src attribute to all images and replace src with a tiny placeholder
    galleryImages.forEach(img => {
      // Skip if already processed
      if (img.getAttribute('data-src')) return;
      
      // Store original src in data-src
      const originalSrc = img.getAttribute('src');
      img.setAttribute('data-src', originalSrc);
      
      // Set a tiny transparent placeholder
      img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      
      // Add loading="lazy" attribute
      img.setAttribute('loading', 'lazy');
      
      // Add a CSS class for styling
      img.classList.add('lazy-image');
    });
    
    // Create an intersection observer to load images as they come into view
    const observerOptions = {
      rootMargin: isMobile ? '50px' : '100px', // Load slightly earlier on mobile
      threshold: 0.1
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Get the real image source from data-src
          const src = img.getAttribute('data-src');
          
          if (src) {
            // Create a new image object to preload
            const preloadImg = new Image();
            
            // When image is loaded, update the visible image
            preloadImg.onload = function() {
              // Smoothly fade in the image
              img.src = src;
              img.classList.add('loaded');
            };
            
            // Begin loading the real image
            preloadImg.src = src;
            
            // Remove this image from observation
            observer.unobserve(img);
          }
        }
      });
    }, observerOptions);
    
    // Observe all gallery images
    galleryImages.forEach(img => {
      imageObserver.observe(img);
    });
    
    // Prioritize loading the first few images immediately (above the fold)
    if (galleryImages.length > 0) {
      // Load the first 2 images immediately
      const priorityImages = galleryImages.slice(0, 2);
      
      priorityImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }
  }
})();
