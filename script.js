function setThemeBasedOnTime() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 6 && hour < 18) {
        body.classList.remove('night-theme');
        body.classList.add('day-theme');
    } else {
        body.classList.remove('day-theme');
        body.classList.add('night-theme');
    }
}

// Initialize theme
setThemeBasedOnTime();

// Update theme every minute
setInterval(setThemeBasedOnTime, 60000);

// Smooth scroll function
function scrollToPortfolio() {
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
}



document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project');
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    const totalProjects = projects.length;
    const viewportHeight = window.innerHeight;
    
    // Initial setup
    projects.forEach((project, index) => {
        project.style.zIndex = totalProjects - index;
        const content = project.querySelector('.project-content');
        if (content) {
            content.style.transform = `translate3d(0, 0, ${-2000 * index}px)`;
            content.style.opacity = index === 0 ? 1 : 0.3;
        }
    });

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        projects.forEach((project, index) => {
            const content = project.querySelector('.project-content');
            if (!content) return;

            // Calculate the center point of each project relative to viewport
            const rect = project.getBoundingClientRect();
            const projectCenter = rect.top + (rect.height / 2);
            const distanceFromCenter = Math.abs(projectCenter - (viewportHeight / 2));
            const maxDistance = viewportHeight / 2;
            
            // Calculate visibility based on distance from center
            const visibility = 1 - (distanceFromCenter / maxDistance);
            const opacity = Math.max(0.3, Math.min(1, visibility));
            
            // Calculate z-position based on distance from center
            const zPosition = -2000 * (1 - visibility);
            const scale = 0.8 + (visibility * 0.2); // Scale between 0.8 and 1

            // Apply transforms
            content.style.transform = `translate3d(0, 0, ${zPosition}px) scale(${scale})`;
            content.style.opacity = opacity;
        });
    });
});


