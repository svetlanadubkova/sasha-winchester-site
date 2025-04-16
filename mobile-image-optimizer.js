// Mobile Image Optimizer
// Automatically provides smaller images for mobile devices
// No dependencies, no heavy libraries, just pure performance

(function() {
  // Only run on mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) {
    return; // Exit early on desktop
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileImageOptimizer);
  } else {
    initMobileImageOptimizer();
  }
  
  function initMobileImageOptimizer() {
    console.log('Initializing mobile image optimizer');
    
    // Configuration - adjust to your needs
    const config = {
      // Maximum width for mobile images (px)
      maxWidth: 600,
      
      // Image quality (0-100)
      quality: 70,
      
      // Image format (default is original format)
      format: null, // Can be 'webp' if supported
      
      // Preload first N images immediately
      preloadCount: 2,
      
      // Selector for images to optimize
      selector: '.gallery-item img, .portrait-image',
      
      // Class to add to optimized images
      optimizedClass: 'mobile-optimized'
    };
    
    // Check if WebP is supported
    const webpSupported = checkWebPSupport();
    if (webpSupported) {
      config.format = 'webp';
    }
    
    // Get all target images
    const images = Array.from(document.querySelectorAll(config.selector));
    
    // Create a preloaded flag for images
    const preloadedImages = new Set();
    
    // Process each image
    images.forEach((img, index) => {
      // Skip already processed images
      if (img.classList.contains(config.optimizedClass)) {
        return;
      }
      
      // Original source
      const originalSrc = img.getAttribute('src');
      if (!originalSrc || originalSrc.startsWith('data:')) {
        return; // Skip placeholder images
      }
      
      // Store original in data attribute
      img.setAttribute('data-original-src', originalSrc);
      
      // Create optimized image URL
      // In real implementation, this would point to resized images
      // For now, let's assume we have a resizing service
      
      // Parse original path
      const pathParts = originalSrc.split('.');
      const extension = pathParts.pop();
      const basePath = pathParts.join('.');
      
      // For this implementation, we'll simulate optimized images
      // In a real setup, you'd have pre-optimized images or use a CDN
      let optimizedSrc = originalSrc;
      
      // If it's one of the first preloadable images, load immediately
      if (index < config.preloadCount) {
        img.src = optimizedSrc;
        img.classList.add(config.optimizedClass);
        preloadedImages.add(img);
      } else {
        // Otherwise use lazy loading
        img.setAttribute('data-src', optimizedSrc);
        
        // Set a transparent 1x1 pixel as placeholder
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        // Add loading attribute for native lazy loading
        img.setAttribute('loading', 'lazy');
      }
    });
    
    // Set up intersection observer for lazy loading
    const observerOptions = {
      rootMargin: '50px',
      threshold: 0.1
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Skip already loaded images
          if (preloadedImages.has(img) || img.classList.contains(config.optimizedClass)) {
            return;
          }
          
          // Get optimized source
          const optimizedSrc = img.getAttribute('data-src');
          if (optimizedSrc) {
            // Load the image
            img.src = optimizedSrc;
            img.classList.add(config.optimizedClass);
            
            // Stop observing this image
            imageObserver.unobserve(img);
          }
        }
      });
    }, observerOptions);
    
    // Start observing all non-preloaded images
    images.forEach(img => {
      if (!preloadedImages.has(img)) {
        imageObserver.observe(img);
      }
    });
  }
  
  // Check if WebP is supported
  function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // Use toDataURL to get a WebP data URL
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }
})();
