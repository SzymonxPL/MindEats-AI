document.addEventListener('DOMContentLoaded', function () {
    const introContainer = document.querySelector('.intro-container');
    const contentBox = document.querySelector('.content-box');
    let isAnimating = false;

    // Initialize particles
    initParticles();

    // Handle click to continue
    function handleContinue() {
        if (isAnimating) return;
        isAnimating = true;

        // Add exit animation
        introContainer.style.animation = 'fadeOutUp 0.8s ease-in-out forwards';

        // Cleanup and redirect after animation completes
        setTimeout(() => {
            cleanupEventListeners();
            window.location.href = 'index.html';
        }, 800);
    }

    // Add click event - using capture phase to prevent multiple handlers
    introContainer.addEventListener('click', handleContinue, true);

    // Add keyboard support
    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter' || e.keyCode === 32 || e.keyCode === 13) {
            e.preventDefault();
            handleContinue();
        } else if (e.key === 'Escape' || e.keyCode === 27) {
            // Allow quick exit with Escape key
            window.location.href = 'index.html';
        }
    });

    // Auto-redirect after 15 seconds of inactivity
    const autoCloseTimer = setTimeout(handleContinue, 15000);

    // Reset timer on specific user interactions
    function handleUserInteraction(e) {
        // Only reset timer on these specific interactions
        if (e.type === 'click' || e.type === 'keydown' || e.type === 'touchstart') {
            clearTimeout(autoCloseTimer);
        }
    }

    // Add event listeners for specific interactions only
    const interactionEvents = ['click', 'keydown', 'touchstart'];
    interactionEvents.forEach(event => {
        document.addEventListener(event, handleUserInteraction);
    });

    // Cleanup function to remove event listeners
    function cleanupEventListeners() {
        interactionEvents.forEach(event => {
            document.removeEventListener(event, handleUserInteraction);
        });
        document.removeEventListener('keydown', handleContinue);
        introContainer.removeEventListener('click', handleContinue, true);
    }

    // Static transform for content box
    if (contentBox) {
        contentBox.style.transform = 'translateZ(20px)';
    }

    // Initialize particles effect - completely independent of mouse movement
    function initParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 30; // Reduced number of particles for better performance

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Create particles with more controlled behavior
        function createParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1, // Smaller particles
                    speedX: (Math.random() - 0.5) * 0.5, // Slower movement
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})` // More transparent
                });
            }
        }

        // Animate particles - simplified without any interaction
        function animateParticles() {
            if (!canvas.parentNode) return; // Stop if canvas was removed

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Update position
                p.x += p.speedX;
                p.y += p.speedY;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            requestAnimationFrame(animateParticles);
        }

        // Initialize
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            // Remove any existing canvas
            while (particlesContainer.firstChild) {
                particlesContainer.removeChild(particlesContainer.firstChild);
            }

            resizeCanvas();
            particlesContainer.appendChild(canvas);
            createParticles();

            // Start animation
            let animationId = requestAnimationFrame(animateParticles);

            // Handle window resize - debounced
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (canvas.parentNode) { // Check if still in DOM
                        resizeCanvas();
                        // Reset particles on resize
                        particles.length = 0;
                        createParticles();
                    }
                }, 100);
            });
        }
    }

    // Add fade in animation for content
    setTimeout(() => {
        contentBox.style.opacity = '1';
    }, 100);
});
