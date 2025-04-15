// Minimal Intro Animations
document.addEventListener('DOMContentLoaded', () => {
    // Create particles
    createParticles();
    
    // Sequence the intro animations
    sequenceIntro();
});

// Create floating particles for subtle atmosphere
function createParticles() {
    const container = document.getElementById('particles-container');
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
    const titleText = document.getElementById('title-text');
    const subtitleText = document.getElementById('subtitle-text');
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    const videoContainer = document.querySelector('.video-container');
    
    // Show the title with elegant fade in
    setTimeout(() => {
        titleText.classList.add('visible');
        
        // Hide title, show subtitle with elegant fade - but in the same position
        setTimeout(() => {
            titleText.style.opacity = '0';
            
            setTimeout(() => {
                // Make subtitle appear in exactly the same position
                subtitleText.classList.add('visible');
                
                // Begin transition to main content after subtitle has been visible
                setTimeout(() => {
                    // Start fading out loading screen with a longer transition
                    loadingScreen.style.opacity = '0';
                    
                    // Create a smooth transition by overlapping the fade-out and fade-in
                    setTimeout(() => {
                        // Prepare main content to be visible but still transparent
                        mainContent.style.opacity = '0.01';
                        
                        // Remove loading screen from DOM after its fade-out completes
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            
                            // Fade in main content
                            mainContent.style.opacity = '1';
                            
                            // Show the default section (works)
                            const worksSection = document.getElementById('works');
                            worksSection.classList.add('active');
                        }, 1000);
                    }, 1000);
                }, 3000);
            }, 500);
        }, 3000);
    }, 1000);
}