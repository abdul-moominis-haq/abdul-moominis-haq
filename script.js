function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}


window.addEventListener('load', function() {
  // Fade-in Profile Section
  gsap.from('#profile', {
    opacity: 0,
    y: 100,
    duration: 1.5,
    ease: 'power2.out',
  });

  // Fade-in About Section
  gsap.from('#about', {
    opacity: 0,
    y: 100,
    duration: 1.5,
    delay: 0.5,
    ease: 'power2.out',
  });

  // Animate Navigation Bar
  gsap.from('#desktop-nav, #hamburger-nav', {
    y: -100,
    opacity: 0,
    duration: 1.2,
    ease: 'bounce.out',
  });

  // Animate Buttons on Hover
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.1,
        duration: 0.3,
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
      });
    });
  });

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      gsap.to(window, {
        scrollTo: target,
        duration: 1,
        ease: 'power2.inOut',
      });
    });
  });

  // Animate Social Icons on Scroll
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.icon', {
    scrollTrigger: {
      trigger: '#socials-container',
      start: 'top 80%',
    },
    scale: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'back.out(1.7)',
  });
});


gsap.from('.icon', {
  opacity: 0,
  duration: 1,
  delay: 1, // Delay the animation by 1 second to allow icons to load
});

window.addEventListener('load', () => {
  gsap.from('.icon', {
    opacity: 0,
    duration: 1,
  });
});

