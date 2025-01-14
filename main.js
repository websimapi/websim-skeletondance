class ParticleSystem {
  constructor() {
    this.container = document.querySelector('.magic-particles');
    this.particles = [];
    this.maxParticles = 50;
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 10 + 5;
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + size;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    this.container.appendChild(particle);
    
    const animation = particle.animate([
      { transform: `translate(0, 0)`, opacity: particle.style.opacity },
      { transform: `translate(${(Math.random() - 0.5) * 200}px, ${-window.innerHeight - size}px)`, opacity: 0 }
    ], {
      duration: Math.random() * 3000 + 2000,
      easing: 'linear'
    });
    
    animation.onfinish = () => {
      particle.remove();
      this.particles = this.particles.filter(p => p !== particle);
    };
    
    this.particles.push(particle);
  }

  start() {
    setInterval(() => {
      if (this.particles.length < this.maxParticles) {
        this.createParticle();
      }
    }, 100);
  }
}

class SkeletonController {
  constructor() {
    this.skeleton = document.querySelector('.skeleton');
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
    this.sensitivity = 0.05; // Adjust this value to change movement sensitivity
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Mouse movement control
    document.addEventListener('mousemove', (e) => {
      this.handleMovement(
        (e.clientX - this.centerX) * this.sensitivity,
        (e.clientY - this.centerY) * this.sensitivity
      );
    });

    // Device orientation control
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.beta && e.gamma) {
          // Convert device tilt to position offset
          const xOffset = e.gamma * 2; // Left/Right tilt
          const yOffset = (e.beta - 45) * 2; // Front/Back tilt
          this.handleMovement(xOffset, yOffset);
        }
      });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
      this.centerX = window.innerWidth / 2;
      this.centerY = window.innerHeight / 2;
    });
  }

  handleMovement(xOffset, yOffset) {
    // Calculate new position with boundaries
    const maxOffset = 100; // Maximum pixels to move from center
    xOffset = Math.max(Math.min(xOffset, maxOffset), -maxOffset);
    yOffset = Math.max(Math.min(yOffset, maxOffset), -maxOffset);

    // Apply smooth movement transform
    this.skeleton.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('.scene');
  const playButton = document.getElementById('playButton');
  const musicTrack = document.getElementById('musicTrack');
  const particles = new ParticleSystem();
  const skeletonController = new SkeletonController();

  let isPlaying = false;

  playButton.addEventListener('click', () => {
    if (!isPlaying) {
      scene.classList.add('dancing');
      musicTrack.play();
      particles.start();
      playButton.innerHTML = '<span class="play-icon">⏸</span> Pause';
    } else {
      scene.classList.remove('dancing');
      musicTrack.pause();
      playButton.innerHTML = '<span class="play-icon">▶</span> Start the Dance!';
    }
    isPlaying = !isPlaying;
  });
});