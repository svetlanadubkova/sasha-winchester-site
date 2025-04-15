// Mobile Entry Sequence
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobile device detected, applying mobile-specific entry sequence');
        
        // Wait for video events before starting sequence
        document.addEventListener('videoReady', initMobileEntrySequence);
        document.addEventListener('videoFailed', initMobileEntrySequence);
        document.addEventListener('mobileSafetyTimeout', initMobileEntrySequence);
        
        // Fallback in case events don't fire
        setTimeout(initMobileEntrySequence, 3500);
    }
});

// Track if sequence has started to prevent duplicates
let sequenceStarted = false;

function initMobileEntrySequence() {
    // Only run once
    if (sequenceStarted) return;
    sequenceStarted = true;
    
    console.log('Starting mobile entry sequence');
    
    const titleText1 = document.getElementById('title-text-1');
    const titleText2 = document.getElementById('title-text-2');
    
    // Make sure first title starts invisible
    if (titleText1) {
        titleText1.style.opacity = '0';
    }
    
    // Make sure second title starts invisible
    if (titleText2) {
        titleText2.style.opacity = '0';
    }
    
    // First title fade in
    setTimeout(() => {
        console.log('Showing first title');
        if (titleText1) {
            titleText1.style.opacity = '1';
            titleText1.style.transition = 'opacity 1s ease-in';
        }
    }, 1000);
    
    // Switch to second title
    setTimeout(() => {
        console.log('Transitioning to second title');
        if (titleText1) {
            titleText1.style.opacity = '0';
            titleText1.style.transition = 'opacity 0.5s ease-out';
        }
        
        setTimeout(() => {
            if (titleText2) {
                titleText2.style.opacity = '1';
                titleText2.style.transition = 'opacity 1s ease-in';
            }
        }, 600);
        
        // Auto-proceed after display time
        setTimeout(() => {
            console.log('Auto proceeding to content');
            // Always proceed without requiring interaction on mobile
            proceedToContent();
        }, 3000);
    }, 4000);
    
    // Safety timeout - if something breaks, still show content
    setTimeout(() => {
        proceedToContent();
    }, 10000);
}

// Track if transition has happened to prevent duplicates
let hasTransitioned = false;

function proceedToContent() {
    // Ensure we only proceed once
    if (hasTransitioned) return;
    hasTransitioned = true;
    
    console.log('Proceeding to main content');
    
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    
    // Fade out loading screen
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 1.5s ease-out';
    }
    
    // Show main content after transition
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Fade in main content
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 1.5s ease-in';
        }
        
        // Activate works section
        const worksSection = document.getElementById('works');
        if (worksSection) {
            worksSection.classList.add('active');
            
            // Make sure works section is visible
            setTimeout(() => {
                if (worksSection) {
                    worksSection.style.opacity = '1';
                    worksSection.style.display = 'flex';
                }
            }, 100);
        }
    }, 1500);
}

// Add a touch event listener to the entire document to help trigger interaction
document.addEventListener('touchstart', function() {
    // Do nothing, just helps trigger video playback
}, { once: true });
