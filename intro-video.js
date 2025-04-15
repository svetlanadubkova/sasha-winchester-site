// Modern Intro Video Animations
document.addEventListener('DOMContentLoaded', () => {
    // Create particles
    createParticles();
    
    // Create sparkles for magical effect
    createSparkles();
    
    // Make sure video is playing from the start
    ensureVideoIsPlaying();
    
    // Sequence the intro animations
    sequenceIntro();
});

// Make sure video plays immediately
function ensureVideoIsPlaying() {
    const video = document.getElementById('bgVideo');
    
    if (video) {
        // Set attributes to ensure playback
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.muted = true; // Extra muted setting for iOS
        
        // Force play (with fallbacks)
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Video playback failed initially, retrying...", error);
                
                // Add a click listener to the document to start playback on user interaction
                document.addEventListener('click', function playVideoOnClick() {
                    video.play().then(() => {
                        // Remove the click listener once video is playing
                        document.removeEventListener('click', playVideoOnClick);
                    }).catch(err => {
                        console.error("Video still can't play:", err);
                    });
                }, { once: true });
            });
        }
        
        // Double-check after a short delay
        setTimeout(() => {
            if (video.paused) {
                console.warn("Video still paused, trying again...");
                video.play().catch(e => console.error("Still can't play video:", e));
            }
        }, 500);
    }
}

// Create sparkles for sasha winchester text
function createSparkles() {
    const titleContainer = document.querySelector('.title-container');
    if (!titleContainer) return;
    
    // Number of sparkles
    const sparkleCount = window.innerWidth < 768 ? 10 : 20;
    
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            createSingleSparkle(titleContainer);
        }, i * 300); // Stagger the creation
    }
    
    // Continue creating sparkles while title is visible
    setInterval(() => {
        const titleText1 = document.getElementById('title-text-1');
        if (titleText1 && titleText1.classList.contains('visible')) {
            createSingleSparkle(titleContainer);
        }
    }, 500);
}

// Create a single sparkle
function createSingleSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    // Random position relative to the container
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    
    // Position around the text area
    const posX = centerX - 200 + Math.random() * 400;
    const posY = containerRect.height / 2 - 50 + Math.random() * 100;
    
    sparkle.style.left = `${posX}px`;
    sparkle.style.top = `${posY}px`;
    
    // Random delay and size
    const delay = Math.random() * 3;
    const size = Math.random() * 3 + 2;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.animationDelay = `${delay}s`;
    
    // Add to container
    container.appendChild(sparkle);
    
    // Remove after animation completes
    setTimeout(() => {
        sparkle.remove();
    }, delay * 1000 + 3000);
}

// Create floating particles for subtle atmosphere
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 1px and 3px
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay and duration
        const delay = Math.random() * 5;
        const duration = Math.random() * 5 + 10;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // Add to container
        container.appendChild(particle);
    }
}

// Sequence the intro animations with elegant timing
function sequenceIntro() {
    const titleText1 = document.getElementById('title-text-1');
    const titleText2 = document.getElementById('title-text-2');
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    
    // Show the first title immediately
    titleText1.classList.add('visible');
    
    // Transition to the second title
    setTimeout(() => {
        titleText1.classList.remove('visible');
        
        setTimeout(() => {
            titleText2.classList.add('visible');
            
            // Begin transition to main content
            setTimeout(() => {
                // Fade out loading screen overlay
                loadingScreen.style.opacity = '0';
                
                // Fade in main content
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainContent.style.opacity = '1';
                    
                    // Show the default section (works)
                    const worksSection = document.getElementById('works');
                    worksSection.classList.add('active');
                }, 1000);
            }, 2000);
        }, 500);
    }, 2000);
}