// Hero Video Background Handler
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video video');
    
    if (heroVideo) {
        console.log('Hero video found:', heroVideo.src);
        
        // Ensure video properties are set correctly
        heroVideo.muted = true;
        heroVideo.autoplay = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        
        // Add loading event listeners
        heroVideo.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });
        
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Video data loaded');
        });
        
        heroVideo.addEventListener('canplay', function() {
            console.log('Video can start playing');
            // Attempt to play the video
            playVideo();
        });
        
        heroVideo.addEventListener('error', function(e) {
            console.error('Video error:', e);
            console.error('Error details:', heroVideo.error);
        });
        
        // Function to attempt video playback
        function playVideo() {
            const playPromise = heroVideo.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Video is playing successfully');
                    })
                    .catch(error => {
                        console.error('Video play failed:', error);
                        
                        // If autoplay fails, try to play on user interaction
                        document.addEventListener('click', function() {
                            heroVideo.play().catch(console.error);
                        }, { once: true });
                        
                        document.addEventListener('touchstart', function() {
                            heroVideo.play().catch(console.error);
                        }, { once: true });
                    });
            }
        }
        
        // Try to load and play the video
        heroVideo.load();
    } else {
        console.log('No hero video found on this page');
    }
});