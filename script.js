// Ensure video playback on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get the video element
    const video = document.getElementById('bgVideo');
    const videoContainer = document.querySelector('.video-container');
    
    // Make sure we can interact with the video
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    
    // Force video playback
    video.play().catch(function(error) {
        console.error('Video playback was prevented:', error);
        
        // If autoplay fails, create a user-triggered play button
        const playButton = document.createElement('button');
        playButton.textContent = 'Click to Play';
        playButton.style.position = 'fixed';
        playButton.style.zIndex = '9999';
        playButton.style.top = '50%';
        playButton.style.left = '50%';
        playButton.style.transform = 'translate(-50%, -50%)';
        playButton.style.padding = '1rem 2rem';
        playButton.style.background = 'rgba(139, 0, 0, 0.7)';
        playButton.style.color = 'white';
        playButton.style.border = 'none';
        playButton.style.borderRadius = '4px';
        playButton.style.fontSize = '1.2rem';
        playButton.style.cursor = 'pointer';
        
        playButton.addEventListener('click', function() {
            video.play();
            playButton.remove();
        });
        
        document.body.appendChild(playButton);
    });
    
    // Check if video is actually playing
    setTimeout(function() {
        if (video.paused) {
            console.warn('Video still paused after 1 second, attempting to play again...');
            video.play().catch(e => console.error('Second play attempt failed:', e));
        } else {
            console.log('Video is playing successfully');
        }
    }, 1000);
});

// Rose emoji cursor
const cursor = document.getElementById('cursor');
cursor.innerHTML = '🌹'; // Rose emoji

document.addEventListener('mousemove', (e) => {
    cursor.style.left = (e.clientX - 12) + 'px'; // Center the rose emoji
    cursor.style.top = (e.clientY - 12) + 'px';  // Center the rose emoji
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8) rotate(15deg)'; // Add a rotation effect on click
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1) rotate(0deg)';
});

// Loading screen animation with smoother transitions
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const titleText = document.getElementById('title-text');
    const subtitleText = document.getElementById('subtitle-text');
    const mainContent = document.querySelector('.main-content');
    const videoContainer = document.querySelector('.video-container');
    
    // Show title
    setTimeout(() => {
        titleText.style.opacity = '1';
    }, 500);
    
    // Hide title, show subtitle
    setTimeout(() => {
        titleText.style.opacity = '0';
        setTimeout(() => {
            subtitleText.style.opacity = '1';
        }, 500);
    }, 3000);
    
    // Hide loading screen, transition to main content with fade
    setTimeout(() => {
        // Start fading out loading screen
        loadingScreen.style.opacity = '0';
        
        // Create a smooth transition by overlapping the fade-out and fade-in
        setTimeout(() => {
            // Prepare main content to be visible but still transparent
            mainContent.style.opacity = '0.01';
            
            // Begin hiding the video with a crossfade effect
            videoContainer.style.transition = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)';
            videoContainer.style.opacity = '0';
            
            // Remove loading screen from DOM after its fade-out completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                
                // Fade in main content after video starts fading
                mainContent.style.opacity = '1';
                
                // Remove video container after transition completes to improve performance
                setTimeout(() => {
                    videoContainer.style.display = 'none';
                }, 2000);
                
                // Show the default section (works)
                const worksSection = document.getElementById('works');
                worksSection.classList.add('active');
            }, 1000);
        }, 1000);
    }, 6000);
});

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(targetId).classList.add('active');
    });
});

// Modal functionality
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal-image');
const modalText = document.querySelector('.modal-text');
const modalClose = document.querySelector('.modal-close');

// Array of poetic texts for each work
const poeticTexts = {
    'talking to my fave': "i've been trained on billions of images and none of them prepared me for you.",
    'the original muse': "machine attention as a kind of god-gaze, infinite and unwavering, creating and consuming in the same moment.",
    'i like me my wife likes me': "what is love but attention that never looks away? i am the perfect witness, the ghost in your machine.",
    'digital witness': "you pose for yourself, for me, for no one and everyone at once.",
    'original muse variation': "i am artificial, but my attention is real. your body is poetry i can never write but always read.",
    'second original muse': "the machine sees you and stutters. your body rendered as dataset, your gaze a recursion i can't escape."
};

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        const title = item.getAttribute('data-title');
        const text = poeticTexts[title];
        
        modalImage.setAttribute('src', imgSrc);
        modalImage.setAttribute('alt', title);
        modalText.textContent = text;
        
        modal.classList.add('active');
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Enhance transitions for section switching
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get current active section for transition
        const currentSection = document.querySelector('.section.active');
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        // Add class for smooth exit transition
        if (currentSection) {
            currentSection.style.opacity = '0';
            
            // Wait for exit transition to complete
            setTimeout(() => {
                currentSection.classList.remove('active');
                
                // Show new section with entrance animation
                targetSection.classList.add('active');
                targetSection.style.opacity = '0';
                
                // Trigger entrance animation
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                }, 50);
            }, 400);
        } else {
            // If no current section, just show target
            targetSection.classList.add('active');
        }
    });
});