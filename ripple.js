/* script.js */

// Global variables for the canvas, context, simulation, and animation control
let canvas, ctx;
let strings = []; // Array of string arrays
let mouse = { x: 0, y: 0 };
let lastMouseY;
let lastTouchY;

const influenceRadius = 50;     // Pointer influence radius in pixels
const SPRING = 0.02;            // Spring force constant
const SPREAD = 0.02;            // Neighbor influence factor
const DAMPING = 0.9;            // Damping for velocity
const FORCE_FACTOR = 0.5;       // Force scaling factor

const numStrings = 50;          // Number of horizontal strings
const horizontalSpacing = 4;    // Spacing between points on a string

// Animation control variables
let animationFrameId;
let animationRunning = false;
let inactivityTimer;

//-------------------------------------------------------------------------
// Global function: startRippleEffect()
// Starts the simulation and resets the inactivity timer.
function startRippleEffect() {
  // If already running, just reset the inactivity timer.
  resetInactivityTimer();
  if (!animationRunning) {
    animationRunning = true;
    animate();
  }
}

// Global function: stopRippleEffect()
// Stops the animation loop.
function stopRippleEffect() {
  animationRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

// Reset the inactivity timer to stop the ripple after 15 seconds of no pointer activity.
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    stopRippleEffect();
  }, 15000);
}

// Initialize canvas, strings, event listeners, and start the ripple effect.
function init() {
  canvas = document.getElementById('rippleCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  initStrings();
  addEventListeners();
  startRippleEffect();
}

// Adjust canvas size and reinitialize the strings.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStrings();
}

// Create the string arrays. Each string is an array of points spanning the canvas width.
function initStrings() {
  strings = [];
  let gapY = canvas.height / (numStrings + 1);
  for (let i = 1; i <= numStrings; i++) {
    let points = [];
    let baseY = gapY * i;
    for (let x = 0; x <= canvas.width; x += horizontalSpacing) {
      points.push({
        x: x,
        y: baseY,
        baseY: baseY,
        vy: 0
      });
    }
    strings.push(points);
  }
}

// Add event listeners for resize, mouse and touch movement.
function addEventListeners() {
  window.addEventListener('resize', resizeCanvas);

  // Mouse movement
  canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (typeof lastMouseY !== 'undefined') {
      let deltaY = e.clientY - lastMouseY;
      applyForce(mouse.x, mouse.y, deltaY);
    }
    lastMouseY = e.clientY;
    resetInactivityTimer();
    // Restart ripple effect if it was stopped
    if (!animationRunning) {
      startRippleEffect();
    }
  });

  // Touch movement (prevent default to avoid scrolling)
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    let touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    if (typeof lastTouchY !== 'undefined') {
      let deltaY = touch.clientY - lastTouchY;
      applyForce(mouse.x, mouse.y, deltaY);
    }
    lastTouchY = touch.clientY;
    resetInactivityTimer();
    if (!animationRunning) {
      startRippleEffect();
    }
  }, { passive: false });
}

// Apply a vertical force to points near the pointer.
function applyForce(x, y, force) {
  for (let s = 0; s < strings.length; s++) {
    let points = strings[s];
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      let dx = point.x - x;
      let dy = point.y - y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < influenceRadius) {
        let effect = (influenceRadius - dist) / influenceRadius;
        point.vy += force * effect * FORCE_FACTOR;
      }
    }
  }
}

// Update physics for each point: apply spring force, neighbor influence, and damping.
function updatePhysics() {
  for (let s = 0; s < strings.length; s++) {
    let points = strings[s];
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      let springForce = (point.baseY - point.y) * SPRING;
      point.vy += springForce;
      if (i > 0) {
        let leftDelta = points[i - 1].y - point.y;
        point.vy += leftDelta * SPREAD;
      }
      if (i < points.length - 1) {
        let rightDelta = points[i + 1].y - point.y;
        point.vy += rightDelta * SPREAD;
      }
      point.vy *= DAMPING;
    }
    for (let i = 0; i < points.length; i++) {
      points[i].y += points[i].vy;
    }
  }
}

// Redraw all the strings using quadratic curves for smoothness.
function drawStrings() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 2;
  for (let s = 0; s < strings.length; s++) {
    let points = strings[s];
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      let prevPoint = points[i - 1];
      let currentPoint = points[i];
      let cx = (prevPoint.x + currentPoint.x) / 2;
      let cy = (prevPoint.y + currentPoint.y) / 2;
      ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cx, cy);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
  }
}

// The main animation loop which updates physics and redraws the strings.
function animate() {
  // Request the next frame if the animation is active.
  animationFrameId = requestAnimationFrame(animate);
  updatePhysics();
  drawStrings();
}

// Initialize the simulation when the DOM is fully loaded.
window.addEventListener('load', init);
