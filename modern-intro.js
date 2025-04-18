// Modern Intro Animations - Subtle & Smooth
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create particles on desktop only
    if (!isMobile) {
        createParticles();
    }
    
    // Ensure video plays on all devices
    ensureVideoIsPlaying();
    
    // Run the intro sequence for all devices
    sequenceIntro();
});

function ensureVideoIsPlaying() {
    const video = document.getElementById('bgVideo');
    
    if (video) {
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.muted = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Video playback failed initially, retrying...", error);
                document.addEventListener('click', function playVideoOnClick() {
                    video.play().then(() => {
                        document.removeEventListener('click', playVideoOnClick);
                    }).catch(err => {
                        console.error("Video still can't play:", err);
                    });
                }, { once: true });
            });
        }
    }
}

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        const delay = Math.random() * 5;
        const duration = Math.random() * 5 + 10;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
    }
}

function autoTransitionToContent() {
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    const videoContainer = document.querySelector('.video-container');
    
    // Fade out loading screen and video
    loadingScreen.style.transition = 'opacity 2s ease-out';
    videoContainer.style.transition = 'opacity 2s ease-out';
    loadingScreen.style.opacity = '0';
    videoContainer.style.opacity = '0';
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.opacity = '1';
        mainContent.style.transition = 'opacity 1.5s ease-in';
        
        const worksSection = document.getElementById('works');
        worksSection.style.opacity = '0';
        worksSection.classList.add('active');
        worksSection.style.transition = 'opacity 1.5s ease-in';
        
        requestAnimationFrame(() => {
            worksSection.style.opacity = '1';
        });
    }, 2000);
}

function sequenceIntro() {
    const titleText1 = document.getElementById('title-text-1');
    const titleText2 = document.getElementById('title-text-2');
    const loadingScreen = document.querySelector('.loading-screen');
    const videoContainer = document.querySelector('.video-container');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Initial fade in of video
    videoContainer.style.opacity = '0';
    videoContainer.style.transition = 'opacity 2s ease-in';
    requestAnimationFrame(() => {
        videoContainer.style.opacity = '1';
    });
    
    // Mobile gets a faster intro
    if (isMobile) {
        // Shorter intro for mobile - just show the second title briefly and go to content
        titleText2.style.opacity = '0';
        titleText2.classList.add('visible');
        titleText2.style.transition = 'opacity 1s ease-in-out';
        
        requestAnimationFrame(() => {
            titleText2.style.opacity = '1';
        });
        
        // Go directly to main content after 2 seconds
        setTimeout(() => {
            autoTransitionToContent();
        }, 2000);
        
        return;
    }
    
    // Desktop gets the full fancy intro
    setTimeout(() => {
        titleText1.style.opacity = '0';
        titleText1.classList.add('visible');
        titleText1.style.transition = 'opacity 1.5s ease-in-out';
        
        requestAnimationFrame(() => {
            titleText1.style.opacity = '1';
        });
        
        setTimeout(() => {
            titleText1.style.opacity = '0';
            titleText1.style.transition = 'opacity 1s ease-out';
            
            setTimeout(() => {
                titleText1.classList.remove('visible');
                titleText2.style.opacity = '0';
                titleText2.classList.add('visible');
                titleText2.style.transition = 'opacity 1.5s ease-in-out';
                
                requestAnimationFrame(() => {
                    titleText2.style.opacity = '1';
                });
                
                // Auto-transition after displaying the second title
                setTimeout(() => {
                    autoTransitionToContent();
                }, 3000);
            }, 500);
        }, 3000);
    }, 1000);
}

// Failsafe: if for some reason the intro gets stuck, force transition to main content after 10 seconds
setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    
    if (loadingScreen && loadingScreen.style.opacity !== '0' && mainContent) {
        console.log('Failsafe: Forcing transition to main content');
        autoTransitionToContent();
    }
}, 10000);