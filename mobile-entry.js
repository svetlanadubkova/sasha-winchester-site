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
    
    // First title fade in
    setTimeout(() => {
        if (titleText1) titleText1.style.opacity = '1';
    }, 500);
    
    // Switch to second title
    setTimeout(() => {
        if (titleText1) titleText1.style.opacity = '0';
        setTimeout(() => {
            if (titleText2) titleText2.style.opacity = '1';
        }, 300);
        
        // Auto-proceed after display time
        setTimeout(() => {
            // Always proceed without requiring interaction on mobile
            proceedToContent();
        }, 2000);
    }, 2000);
}

function proceedToContent() {
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    
    // Only proceed once to prevent multiple calls
    if (loadingScreen && loadingScreen.dataset.transitioning !== 'true') {
        loadingScreen.dataset.transitioning = 'true';
        
        // Fade out loading screen
        loadingScreen.style.opacity = '0';
        
        // Show main content after transition
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
            
            // Fade in main content
            if (mainContent) mainContent.style.opacity = '1';
            
            // Activate works section
            const worksSection = document.getElementById('works');
            if (worksSection) worksSection.classList.add('active');
        }, 1000);
    }
}
