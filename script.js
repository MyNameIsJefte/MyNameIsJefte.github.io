// Text animation initialization
function initTextAnimation() {
    const container = document.getElementById('textContainer');
    const word = "Welcome";
    
    word.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.className = 'letter';
        span.style.animationDelay = `${index * 0.15}s`;
        
        // Add decorative elements
        if(index % 2 === 0) {
          span.innerHTML = `
            ${letter}
            <span class="letter-shadow" 
                  style="animation-delay: ${index * 0.15 + 0.1}s"></span>
          `;
        }
        
        container.appendChild(span);
      });
}
// Add after initTextAnimation()
function initScrollFade() {
    const entranceAnim = document.getElementById('entranceAnimation');
    let lastScroll = 0;
    let animationCompleted = false;
  
    // Wait for initial animation to complete
    setTimeout(() => animationCompleted = true, 1500);
  
    window.addEventListener('scroll', () => {
      if (!animationCompleted) return;
      
      const scrollY = window.scrollY;
      const fadeStart = 100; // Start fading after 100px scroll
      const fadeDistance = 300; // Full fade after 300px
      
      const opacity = 1 - Math.min((scrollY - fadeStart) / fadeDistance, 1);
      entranceAnim.style.opacity = opacity;
  
      // Hide completely when fully faded
      if (opacity <= 0) {
        entranceAnim.classList.add('hidden');
      }
    });
  }

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






//content scrolls and 3d effect
document.addEventListener('DOMContentLoaded', () => {
        initTextAnimation();
        initScrollFade();
        const projects = document.querySelectorAll('.project');
        const viewportHeight = window.innerHeight;
        console.log("Parallax head loaded!");
        console.log("Parallax footer loaded!");
        

    // Apply throttling to the scroll event
        const optimizedScrollHandler = throttle(() => {
    // Your scroll logic here
    }, 100); // Executes every 100ms
    window.addEventListener('scroll', optimizedScrollHandler);

    
    window.addEventListener('scroll', () => {
        
        projects.forEach((project) => {
            const content = project.querySelector('.project-content');
            if (!content);

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









