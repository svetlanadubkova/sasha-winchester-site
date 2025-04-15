// Enhanced Mobile Video Handler
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bgVideo');
    
    // Function to handle mobile video playback
    function setupMobileVideo() {
        if (!video) return;
        
        // Apply all the necessary attributes for mobile autoplay
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.muted = true;
        
        // Force play with various fallbacks for mobile browsers
        function attemptPlay() {
            // Try to play the video
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video playback started successfully');
                }).catch(error => {
                    console.warn('Autoplay was prevented:', error);
                    
                    // If autoplay is prevented, create a simple overlay to tap once
                    const playOverlay = document.createElement('div');
                    playOverlay.id = 'video-play-overlay';
                    playOverlay.style.position = 'fixed';
                    playOverlay.style.top = '0';
                    playOverlay.style.left = '0';
                    playOverlay.style.width = '100%';
                    playOverlay.style.height = '100%';
                    playOverlay.style.background = 'rgba(0,0,0,0.4)';
                    playOverlay.style.zIndex = '9999';
                    playOverlay.style.display = 'flex';
                    playOverlay.style.alignItems = 'center';
                    playOverlay.style.justifyContent = 'center';
                    
                    const tapText = document.createElement('div');
                    tapText.textContent = 'Tap to enter';
                    tapText.style.color = 'white';
                    tapText.style.fontFamily = 'var(--serif-font)';
                    tapText.style.fontSize = '1.5rem';
                    tapText.style.fontStyle = 'italic';
                    
                    playOverlay.appendChild(tapText);
                    document.body.appendChild(playOverlay);
                    
                    // Add tap/click listener to start playback
                    playOverlay.addEventListener('click', function() {
                        video.play().then(() => {
                            playOverlay.remove();
                        }).catch(e => {
                            console.error('Video play attempt failed after tap:', e);
                            // If it still doesn't work, just proceed with the experience
                            playOverlay.remove();
                            proceedToContent();
                        });
                    });
                });
            }
        }
        
        // Try to play immediately
        attemptPlay();
        
        // Retry after a short delay (iOS sometimes needs this)
        setTimeout(attemptPlay, 200);
        
        // Check status after 1 second and retry if needed
        setTimeout(() => {
            if (video.paused) {
                console.log('Video still paused after 1 second, retrying...');
                attemptPlay();
            }
        }, 1000);
        
        // Last resort - setup interaction listeners for first user gesture
        ['touchstart', 'click'].forEach(event => {
            document.addEventListener(event, function startVideoOnUserInteraction() {
                video.play().catch(e => console.log('Play attempt on user interaction failed:', e));
                document.removeEventListener(event, startVideoOnUserInteraction);
            }, { once: true });
        });
    }
    
    // Function to handle non-video fallback if video fails completely
    function setupNonVideoFallback() {
        // After 3 seconds, if video is still paused, fade in main content anyway
        setTimeout(() => {
            if (video && video.paused) {
                console.log('Video failed to play after 3 seconds, proceeding without it');
                proceedToContent();
            }
        }, 3000);
    }
    
    // Function to proceed to main content if the video isn't working
    function proceedToContent() {
        const loadingScreen = document.querySelector('.loading-screen');
        const mainContent = document.querySelector('.main-content');
        
        // Hide loading screen
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }
        
        // Show main content
        if (mainContent) {
            mainContent.style.opacity = '1';
            
            // Activate works section
            const worksSection = document.getElementById('works');
            if (worksSection) {
                worksSection.classList.add('active');
            }
        }
    }
    
    // Detect if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobile device detected, applying special video handling');
        setupMobileVideo();
        setupNonVideoFallback();
    }
});
