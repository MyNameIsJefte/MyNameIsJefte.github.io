function setThemeBasedOnTime() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 8 && hour < 20) {
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

// throttle the process
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


// Smooth scroll function
function scrollToPortfolio() {
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
}



//content scrolls and 3d effect
document.addEventListener('DOMContentLoaded', () => {
        const projects = document.querySelectorAll('.project');
        const totalProjects = projects.length;
        const viewportHeight = window.innerHeight;
        console.log("Parallax head loaded!");
        console.log("Parallax footer loaded!");
        

    // Apply throttling to the scroll event
        const optimizedScrollHandler = throttle(() => {
    // Your scroll logic here
    }, 100); // Executes every 100ms
    window.addEventListener('scroll', optimizedScrollHandler);

    
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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Generate random positions and scales for the boxes
function generateTileAnimationData(numBoxes, viewportWidth, viewportH) {
    const data = [];
    for (let i = 0; i < numBoxes; i++) {
        const x = Math.random() * viewportWidth; // Random x position
        const y = Math.random() * viewportH; // Random y position
        const scale = Math.random() * (1.5 - 0.5) + 0.5; // Random scale between 0.5x and 1.5x
        data.push({ x, y, scale });
    }
    return data;
}

// Initialize animation data
const numBoxes = document.querySelectorAll('.box').length;
const viewportWidth = window.innerWidth;
const viewportH = window.innerHeight;

const animationData = generateTileAnimationData(numBoxes, viewportWidth, viewportH);

// Apply initial random positions and scales to the boxes
document.querySelectorAll('.box').forEach((box, index) => {
    const { x, y, scale } = animationData[index];
    gsap.set(box, {
        x,
        y,
        scale,
    });
});

// Animate the boxes to stack and fill the viewport when scrolling
gsap.to('.box', {
    scrollTrigger: {
        trigger: '.container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
    },
    x: (i) => (i % Math.ceil(viewportWidth / 100)) * 100, // Stack horizontally in rows
    y: (i) => Math.floor(i / Math.ceil(viewportWidth / 100)) * 100, // Stack vertically in columns
    scale: 1, // Reset scale to normal
    opacity: 1, // Fade in to full visibility
    duration: 2,
    ease: 'power2.out',
});


