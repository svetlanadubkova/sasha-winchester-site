// Mobile Entry Sequence
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobile device detected, applying mobile-specific entry sequence');
        initMobileEntrySequence();
    }
});

function initMobileEntrySequence() {
    const titleText1 = document.getElementById('title-text-1');
    const titleText2 = document.getElementById('title-text-2');
    const loadingScreen = document.querySelector('.loading-screen');
    const video = document.getElementById('bgVideo');
    
    // Create a simpler automatic entry sequence for mobile
    // First title fade in
    setTimeout(() => {
        titleText1.style.opacity = '1';
    }, 500);
    
    // Switch to second title
    setTimeout(() => {
        titleText1.style.opacity = '0';
        setTimeout(() => {
            titleText2.style.opacity = '1';
        }, 300);
        
        // Add an auto-entry after a reasonable time
        setTimeout(() => {
            // If video is playing, make a simple entry button
            if (video && !video.paused) {
                const enterButton = document.createElement('button');
                enterButton.classList.add('enter-button');
                enterButton.textContent = 'enter';
                enterButton.addEventListener('click', proceedToContent);
                loadingScreen.appendChild(enterButton);
                
                requestAnimationFrame(() => {
                    enterButton.style.opacity = '1';
                });
                
                // Auto-proceed if button isn't clicked after another delay
                setTimeout(() => {
                    if (document.querySelector('.enter-button')) {
                        proceedToContent();
                    }
                }, 4000);
            } else {
                // If video isn't playing, just proceed to content
                proceedToContent();
            }
        }, 2500);
    }, 2000);
    
    // Handle mobile touch events
    document.addEventListener('touchstart', () => {
        video.play().catch(e => console.log('Play on touch failed:', e));
    }, { once: true });
}

function proceedToContent() {
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    const enterButton = document.querySelector('.enter-button');
    
    // Remove button if it exists
    if (enterButton) {
        enterButton.style.opacity = '0';
    }
    
    // Fade out loading screen
    loadingScreen.style.opacity = '0';
    
    // Show main content after transition
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        
        // Fade in main content
        mainContent.style.opacity = '1';
        
        // Activate works section
        const worksSection = document.getElementById('works');
        worksSection.classList.add('active');
    }, 1000);
}
