// Enhanced Mobile Video Handler
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bgVideo');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobile device detected, applying mobile-specific video handling');
        setupMobileVideo();
    }
});

function setupMobileVideo() {
    const video = document.getElementById('bgVideo');
    
    if (!video) return;
    
    // Apply all the necessary attributes for mobile autoplay
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.muted = true;
    
    // Force play with various fallbacks for mobile browsers
    function attemptAutoplay() {
        // Try to play the video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video playback started successfully');
            }).catch(error => {
                console.warn('Autoplay was prevented, using silent mode:', error);
                
                // If autoplay fails, just hide the video container
                const videoContainer = document.querySelector('.video-container');
                if (videoContainer) {
                    videoContainer.style.opacity = '0.5';
                }
                
                // Just proceed with the site anyway
                setTimeout(() => {
                    proceedWithoutVideo();
                }, 500);
            });
        }
    }
    
    // Function to proceed without the video if autoplay fails
    function proceedWithoutVideo() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            // Make sure the loading screen is visible
            loadingScreen.style.opacity = '1';
        }
    }
    
    // Try to play immediately
    attemptAutoplay();
    
    // Add touch listener to entire document to trigger video play
    document.addEventListener('touchstart', function() {
        video.play().catch(e => console.log('Play on touch failed:', e));
    }, { once: true });
}
