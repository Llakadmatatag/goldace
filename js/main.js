document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar on mobile
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    // Toggle sidebar on button click
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            content.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggleButton = event.target === sidebarCollapse || sidebarCollapse.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggleButton && window.innerWidth <= 992) {
            sidebar.classList.remove('active');
            content.classList.remove('active');
        }
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
            content.classList.remove('active');
        }
    }
    
    // Add smooth scroll to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close sidebar on mobile after clicking a link
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                    content.classList.remove('active');
                }
            }
        });
    });
    
    // Add active class to current section in sidebar
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.parentElement.classList.add('active');
            }
        });
    });
    
    // Initialize with first section active
    if (sections.length > 0) {
        const firstSectionId = '#' + sections[0].getAttribute('id');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === firstSectionId) {
                link.parentElement.classList.add('active');
            }
        });
    }
    
    // Add window resize event listener
    window.addEventListener('resize', handleResize);
    
    // Initialize tooltips for social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            const platform = this.querySelector('i').className.split(' ')[1].replace('fa-', '');
            this.setAttribute('data-tooltip', platform.charAt(0).toUpperCase() + platform.slice(1));
        });
    });

    // Load YouTube videos
    loadYouTubeVideos();
});

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.tournament-card, .match-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Function to fetch video title from YouTube
async function fetchVideoTitle(videoId) {
    try {
        // Using a CORS proxy to avoid CORS issues
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await response.json();
        return data.title || `Video ${videoId}`; // Fallback to video ID if title not found
    } catch (error) {
        console.error('Error fetching video title:', error);
        return `Video ${videoId}`; // Fallback to video ID on error
    }
}

// Function to load YouTube videos
async function loadYouTubeVideos() {
    const videosContainer = document.getElementById('youtubeVideos');
    if (!videosContainer) return;

    // Array of video IDs - you'll need to manually add your video IDs here
    const videoIds = [
        'c6vbDKYM04Q',  // Replace with your video IDs
        'Lr8Bpt4DurE',  // Example: 'abc123xyz',
        'KFyGFQmTni8',  // 'def456uvw',
        'AGswivR6Rio',  // 'ghi789rst',
        'CPAMcURcZXM'   // 'jkl012mno'
    ];

    // Clear loading state
    videosContainer.innerHTML = '';

    // Fetch all video data first
    const videoPromises = videoIds.map(async (videoId, index) => {
        const title = await fetchVideoTitle(videoId);
        return { videoId, title, index: index + 1 };
    });

    try {
        const videosData = await Promise.all(videoPromises);
        
        // Create video cards with actual titles
        videosData.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-embed">
                    <iframe 
                        width="100%" 
                        height="200" 
                        src="https://www.youtube.com/embed/${video.videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-info">
                    <h3 class="video-title" title="${video.title}">${video.title}</h3>
                    <div class="video-actions">
                        <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" rel="noopener noreferrer" class="btn btn-small">
                            Watch on YouTube
                        </a>
                    </div>
                </div>
            `;
            
            videosContainer.appendChild(videoCard);
        });
    } catch (error) {
        console.error('Error loading videos:', error);
        videosContainer.innerHTML = '<p class="error-message">Error loading video titles. Please try again later.</p>';
    }
}

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.tournament-card, .match-item');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});
