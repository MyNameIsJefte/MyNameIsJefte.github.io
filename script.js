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

// Update dynamically on resize
let viewportHeight = window.innerHeight;

window.addEventListener('resize', () => {
    viewportHeight = window.innerHeight; 
});


function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Apply throttling to the scroll event
const optimizedScrollHandler = throttle(() => {
    // Your scroll logic here
}, 100); // Executes every 100ms
window.addEventListener('scroll', optimizedScrollHandler);


// Smooth scroll function
function scrollToPortfolio() {
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
}


document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project');
    const totalProjects = projects.length;
    const viewportHeight = window.innerHeight;
    const scrollButton = document.getElementById('scrollButton');
    console.log("Parallax footer loaded!");

    // scroll button to the footer
    scrollButton.addEventListener('click', () => {
        footer.scrollIntoView({ behavior: 'smooth' });
    });
    // Initial setup
    projects.forEach((project, index) => {
        const content = project.querySelector('.project-content');
        if (!content) {
            console.warn(`No .project-content found for project at index ${index}`);
            return;
        }
        content.style.transform = `translate3d(0, 0, ${-2000 * index}px)`;
        content.style.opacity = index === 0 ? 1 : 0.3;
    });
    

    window.addEventListener('scroll', () => {
        
        projects.forEach((project, index) => {
            const content = project.querySelector('.project-content');
            if (!content) return;

            // Calculate the center point of each project relative to viewport
            const rect = project.getBoundingClientRect();
            const projectCenter = rect.top + (rect.height / 2);
            const distanceFromCenter = Math.abs(projectCenter - (viewportHeight / 2));
            const maxDistance = viewportHeight / 2;
            
            // Calculate visibility based on distance from center
            const visibility = Math.max(0, Math.min(1, 1 - (distanceFromCenter / maxDistance)));
            const opacity = Math.max(0.3, Math.min(1, visibility));
            
            // Calculate z-position based on distance from center
            const zPosition = -2000 * (1 - visibility);
            const scale = Math.max(0.8, Math.min(1, 0.8 + (visibility * 0.2)));

            // Apply transforms
            content.style.transform = `translate3d(0, 0, ${zPosition}px) scale(${scale})`;
            content.style.opacity = opacity;
        });
    });
});

let isTicking = false;

function updateStyles() {
    projects.forEach((project, index) => {
        const content = cachedContents[index];
        if (!content) return;

        const rect = project.getBoundingClientRect();
        const projectCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(projectCenter - (viewportHeight / 2));
        const maxDistance = viewportHeight / 2;

        const visibility = Math.max(0, Math.min(1, 1 - (distanceFromCenter / maxDistance)));
        const zPosition = -2000 * (1 - visibility);
        const scale = 0.8 + (visibility * 0.2);

        content.style.transform = `translate3d(0, 0, ${zPosition}px) scale(${scale})`;
        content.style.opacity = visibility;
    });
    isTicking = false;
}

window.addEventListener('scroll', () => {
    if (!isTicking) {
        requestAnimationFrame(updateStyles);
        isTicking = true;
    }
});


