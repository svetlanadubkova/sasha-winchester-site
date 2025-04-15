// Enhanced Mobile Video Handler
document.addEventListener('DOMContentLoaded', () => {
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
                // Signal video is ready for title sequence to begin
                document.dispatchEvent(new CustomEvent('videoReady'));
            }).catch(error => {
                console.warn('Autoplay was prevented, using silent mode:', error);
                
                // Signal video failed but we should proceed anyway
                document.dispatchEvent(new CustomEvent('videoFailed'));
            });
        } else {
            // No promise returned (old browser), assume it's playing and signal ready
            document.dispatchEvent(new CustomEvent('videoReady'));
        }
    }
    
    // Try to play immediately
    attemptAutoplay();
    
    // Add touch listener to entire document to trigger video play
    document.addEventListener('touchstart', function() {
        video.play().catch(e => {
            console.log('Play on touch failed:', e);
            // Signal we should proceed even though video might not be playing
            document.dispatchEvent(new CustomEvent('videoFailed'));
        });
    }, { once: true });
    
    // Safety timeout - if no events fire within 3 seconds, force proceed
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('mobileSafetyTimeout'));
    }, 3000);
}
