// intro animation
document.addEventListener('DOMContentLoaded', () => {
    const customEase = "power4.inOut";
    const timeline = gsap.timeline({ defaults: { ease: customEase } });

    // Initial fade-in animation
    timeline.fromTo([".name-container", ".surname-container"], 
        { opacity: 0 },
        {
            opacity: 1,
            duration: 0.01, // Instant visibility for child animations
            onStart: () => {
                gsap.set(".intro-name, .intro-surname", { y: 0 });
            }
        }
    )
    .fromTo(".intro-name", 
        { y: -100, opacity: 0 },
        { 
            y: -30,
            opacity: 1,
            duration: 1.8,
            stagger: 0.08,
            ease: "power4.out"
        },
        "start"
    )
    .fromTo(".intro-surname",
        { y: 100, opacity: 0 },
        {
            y: 30,
            opacity: 1,
            duration: 1.8,
            stagger: 0.08,
            ease: "power4.out"
        },
        "start+=0.2"
    )
    // Screen split effect
    .to(".name-container", {
        x: "-100vw",
        duration: 1.2,
        ease: "power4.in"
    }, "+=2")
    .to(".surname-container", {
        x: "100vw",
        duration: 1.2,
        ease: "power4.in",
        onComplete: () => {
            document.querySelector('.intro-overlay').style.display = 'none';
            document.querySelector('.front-page').style.display = 'block';
            window.scrollTo(0, 0);
        }
    }, "<");
});



//Sections navigation
// ================
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for active dots
    const sections = document.querySelectorAll('.viewport-section');
    const dots = document.querySelectorAll('.nav-dot');
    const options = { threshold: 0.5 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const sectionId = entry.target.dataset.section;
                dots.forEach(dot => {
                    const morphShape = dot.classList.contains('active') ? 
                        'M16 6C21 6 26 10 26 16S21 26 16 26 6 22 6 16 11 6 16 6' :
                        'M16 6C10 6 6 10 6 16S10 26 16 26 26 22 26 16 22 6 16 6';
                    gsap.to(dot.querySelector('circle'), {
                        duration: 0.3,
                        attr: { d: morphShape }
                    });
                    dot.classList.toggle('active', dot.dataset.section === sectionId);
                });
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));
     // Dot navigation click handlers
     dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = document.querySelector(`[data-section="${dot.dataset.section}"]`);
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Set launch date (YYYY, MM-1, DD)
// Variables to store previous countdown values for change detection
let prevDays, prevHours, prevMinutes, prevSeconds;

const launchDate = new Date(2025, 4, 7).getTime();

const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Get the countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Function to trigger updating animation on the parent element
    function applyUpdateEffect(elem, newValue, prevValue) {
        // Only trigger if value has changed (skip first render)
        if (prevValue !== undefined && newValue !== prevValue) {
            const parent = elem.parentElement;
            parent.classList.add('updating');
            // Remove the class after the animation ends (600ms, matching CSS)
            setTimeout(() => parent.classList.remove('updating'), 600);
        }
    }

    applyUpdateEffect(daysEl, days, prevDays);
    applyUpdateEffect(hoursEl, hours, prevHours);
    applyUpdateEffect(minutesEl, minutes, prevMinutes);
    applyUpdateEffect(secondsEl, seconds, prevSeconds);

    // Update the countdown values
    daysEl.innerHTML = days;
    hoursEl.innerHTML = hours;
    minutesEl.innerHTML = minutes;
    secondsEl.innerHTML = seconds;

    // Store current values for next comparison
    prevDays = days;
    prevHours = hours;
    prevMinutes = minutes;
    prevSeconds = seconds;

    // If the countdown is finished, clear the timer and display launch message
    if (distance < 0) {
        clearInterval(timer);
        document.querySelector('.countdown').innerHTML = "<h2>Welcome!</h2>";
    }
}, 1000);


   // AUTO-HOVER SEQUENCER  // NEW: Automatic hover system
// ================
let currentFocusIndex = 0;
const countdownItems = document.querySelectorAll('.countdown-item');

function startAutoHoverSequence() {
  setInterval(() => {
    countdownItems.forEach(item => item.classList.remove('auto-hover'));
    
    countdownItems[currentFocusIndex].classList.add('auto-hover');
    currentFocusIndex = (currentFocusIndex + 1) % countdownItems.length;
    
  }, 2500); // 2-second interval between transitions
}
// Initialize systems
document.addEventListener('DOMContentLoaded', () => {
    startAutoHoverSequence();
  });

// IRASEVOL
document.addEventListener('DOMContentLoaded', () => {
    const targetSection = document.querySelector('#text-animations');
  
    if (targetSection) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          // When at least 50% of our target is in view:
          if (entry.isIntersecting) {
            // Start anim-item animations inside the section
            targetSection.querySelectorAll('.anim-item').forEach(item => {
              item.classList.add('start-animation');
            });
  
            // Optionally, unobserve so that this only happens once
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 1 });
    
      observer.observe(targetSection);
    }
  });
// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select all animated text items and the display image
    const animItems = document.querySelectorAll('.anim-item');
    const displayImage = document.getElementById('display-image');
  
    // Add click event for each animated item to update the image
    animItems.forEach(item => {
      item.addEventListener('click', function() {
        // Optionally, remove an active state from all items for visual feedback
        animItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
  
        // Retrieve the image URL stored in the data attribute
        const newImageSrc = item.getAttribute('data-image');
  
        // Add a fade effect to smoothly transition the image
        displayImage.classList.add('fade');
  
        // After a short delay, change the image source then remove the fade effect
        setTimeout(() => {
          displayImage.src = newImageSrc;
          displayImage.classList.remove('fade');
        }, 300); // Delay matches the CSS transition time
      });
    });
});





