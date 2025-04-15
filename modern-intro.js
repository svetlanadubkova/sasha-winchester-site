// Modern Intro Animations - Subtle & Smooth
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        // Only run desktop intro sequence on desktop devices
        createParticles();
        ensureVideoIsPlaying();
        sequenceIntro();
    }
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
                console.warn("Desktop video playback failed initially, retrying...", error);
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

function createEnterButton() {
    const button = document.createElement('button');
    button.classList.add('enter-button');
    button.textContent = 'enter';
    button.style.opacity = '0';
    
    button.addEventListener('click', () => {
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
    });
    
    return button;
}

function sequenceIntro() {
    const titleText1 = document.getElementById('title-text-1');
    const titleText2 = document.getElementById('title-text-2');
    const loadingScreen = document.querySelector('.loading-screen');
    const videoContainer = document.querySelector('.video-container');
    
    // Initial fade in of video
    videoContainer.style.opacity = '0';
    videoContainer.style.transition = 'opacity 2s ease-in';
    requestAnimationFrame(() => {
        videoContainer.style.opacity = '1';
    });
    
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
                
                setTimeout(() => {
                    const enterButton = createEnterButton();
                    loadingScreen.appendChild(enterButton);
                    enterButton.style.transition = 'opacity 1s ease-in';
                    
                    requestAnimationFrame(() => {
                        enterButton.style.opacity = '1';
                    });
                }, 3000);
            }, 500);
        }, 3000);
    }, 1000);
}
