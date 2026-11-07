/**
 * CognoRise InfoTech Web Development Internship — October 2026
 * Task 1: Premium Personal Portfolio Website
 * Developer: Sandeep Kumar
 * Script: Responsive Canvas Particles & Shockwave, Fluid Custom Cursor,
 *         Dynamic Role Typewriter, 3D Tilt with Holographic Glare,
 *         Interactive Spotlight Cards, Skills Category Filtering,
 *         Scroll Reading Progress & Circular Back-to-Top,
 *         One-Click Email Copy with Toast System, and Accessible Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // System & Preference Checks
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isPointerFine = window.matchMedia('(pointer: fine)');

  /* ==========================================================================
     1. Toast Notification Utility
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, iconClass = 'fa-solid fa-check') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  /* ==========================================================================
     2. Fluid Magnetic Custom Cursor (Desktop Fine Pointer Only)
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');

  if (isPointerFine.matches && !prefersReducedMotion.matches && cursorDot && cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let isCursorVisible = false;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorVisible) {
        cursorDot.style.opacity = '1';
        cursorGlow.style.opacity = '1';
        isCursorVisible = true;
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      cursorDot.style.opacity = '0';
      cursorGlow.style.opacity = '0';
      isCursorVisible = false;
    });

    // Smooth Lerp Physics for Glow Trail
    const renderCursor = () => {
      glowX += (mouseX - glowX) * 0.16;
      glowY += (mouseY - glowY) * 0.16;

      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Expand Cursor on Hovering Interactive Elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, .glass-card, .skill-tag, .chip');
    interactiveElements.forEach(el => {
      el.addEventListener('pointerenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('pointerleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  /* ==========================================================================
     3. Interactive HTML5 Canvas Particle Engine & Click Shockwave
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let width = 0;
    let height = 0;
    let particles = [];
    let shockwaves = [];

    const mouse = {
      x: null,
      y: null,
      radius: 120,
      active: false,
      timeoutId: null
    };

    const getTargetParticleCount = () => {
      const isMobile = window.innerWidth < 768 || !isPointerFine.matches;
      if (isMobile) {
        return Math.min(28, Math.floor((window.innerWidth * window.innerHeight) / 28000));
      }
      return Math.min(68, Math.floor((window.innerWidth * window.innerHeight) / 16000));
    };

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
        this.radius = Math.random() * 1.6 + 0.8;
        this.baseAlpha = Math.random() * 0.35 + 0.15;
        this.alpha = this.baseAlpha;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.colorType = Math.random() > 0.4 ? 'cyan' : 'violet';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Interactive gentle steering from cursor
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 0.75;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        // Reaction to Click Shockwaves
        for (let i = 0; i < shockwaves.length; i++) {
          const sw = shockwaves[i];
          const dx = this.x - sw.x;
          const dy = this.y - sw.y;
          const dist = Math.hypot(dx, dy);
          const diff = dist - sw.radius;

          if (Math.abs(diff) < 25 && dist > 0) {
            const push = (1 - Math.abs(diff) / 25) * 2.2 * sw.strength;
            this.x += (dx / dist) * push;
            this.y += (dy / dist) * push;
          }
        }

        // Screen edge wrapping
        if (this.x < -10) this.x = width + 10;
        else if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        else if (this.y > height + 10) this.y = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colorType === 'cyan'
          ? `rgba(56, 189, 248, ${this.alpha})`
          : `rgba(168, 85, 247, ${this.alpha * 0.85})`;
        ctx.fill();
      }
    }

    const drawConnections = () => {
      const maxDistance = 95;
      const len = particles.length;

      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      const targetCount = getTargetParticleCount();
      particles = Array.from({ length: targetCount }, () => new Particle());

      if (prefersReducedMotion.matches) {
        renderStaticFrame();
      }
    };

    const renderStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => p.draw());
      drawConnections();
    };

    const animate = () => {
      if (document.hidden || prefersReducedMotion.matches) {
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update and draw click shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 4.5;
        sw.strength -= 0.025;

        if (sw.strength <= 0 || sw.radius > 260) {
          shockwaves.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${sw.strength * 0.18})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    // Pointer Tracking
    if (isPointerFine.matches) {
      window.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;

        clearTimeout(mouse.timeoutId);
        mouse.timeoutId = setTimeout(() => {
          mouse.active = false;
        }, 1200);
      }, { passive: true });

      window.addEventListener('pointerleave', () => {
        mouse.active = false;
      });

      // Click ripple wave
      window.addEventListener('click', (e) => {
        if (!prefersReducedMotion.matches) {
          shockwaves.push({
            x: e.clientX,
            y: e.clientY,
            radius: 5,
            strength: 0.95
          });
        }
      });
    }

    // Visibility Handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else if (!prefersReducedMotion.matches) {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    }, { passive: true });

    handleResize();
    if (!prefersReducedMotion.matches) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  /* ==========================================================================
     4. Dynamic Role Typewriter Subtitle
     ========================================================================== */
  const typedTextEl = document.getElementById('typed-text');
  if (typedTextEl && !prefersReducedMotion.matches) {
    const roles = [
      'Full Stack Web Developer',
      'MERN Stack Developer',
      'Creative Frontend Engineer',
      'Clean Code Enthusiast',
      'Problem Solver'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const typeLoop = () => {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typedTextEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 40;
      } else {
        typedTextEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        // Pause at full word
        typingSpeed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    setTimeout(typeLoop, 800);
  }

  /* ==========================================================================
     5. Interactive Terminal Code Snippet Copy
     ========================================================================== */
  const terminalCopyBtn = document.getElementById('terminal-copy-btn');
  if (terminalCopyBtn) {
    const snippetCode = `const developer = {
  name: "Sandeep Kumar",
  role: "Full Stack Web Developer",
  internship: "CognoRise InfoTech",
  tasksCompleted: [
    "Task 1: Personal Portfolio Website",
    "Task 2: React E-Commerce Store",
    "Task 3: Blog REST API with JWT"
  ],
  coreStack: {
    frontend: ["HTML5/CSS3", "JavaScript", "React.js"],
    backend: ["Node.js", "Express.js", "MongoDB Atlas", "JWT"]
  },
  status: "Open to Opportunities 🚀"
};`;

    terminalCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(snippetCode);
        terminalCopyBtn.classList.add('copied');
        showToast('Developer profile snippet copied! 📋', 'fa-regular fa-clipboard');
        setTimeout(() => {
          terminalCopyBtn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy error', err);
      }
    });
  }

  /* ==========================================================================
     6. One-Click Instant Email Copy Card
     ========================================================================== */
  const emailCopyBox = document.getElementById('email-copy-box');
  const emailText = document.getElementById('email-text');

  if (emailCopyBox && emailText) {
    const emailToCopy = emailText.textContent.trim();

    const handleEmailCopy = async () => {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        emailCopyBox.classList.add('copied');
        const pillText = emailCopyBox.querySelector('.copy-status-text');
        if (pillText) pillText.textContent = 'Copied! ✓';

        showToast(`Copied ${emailToCopy} to clipboard! 🚀`, 'fa-regular fa-envelope');

        setTimeout(() => {
          emailCopyBox.classList.remove('copied');
          if (pillText) pillText.textContent = 'Click to Copy';
        }, 2500);
      } catch (err) {
        // Fallback for clipboard
        window.location.href = `mailto:${emailToCopy}`;
      }
    };

    emailCopyBox.addEventListener('click', handleEmailCopy);
    emailCopyBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEmailCopy();
      }
    });
  }

  /* ==========================================================================
     7. Interactive Skills Category Filter Tabs
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCategories = document.querySelectorAll('.skill-category');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetFilter = tab.getAttribute('data-filter');

      // Update tab active states
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter categories with animation
      skillCategories.forEach(cat => {
        const catGroup = cat.getAttribute('data-category');
        if (targetFilter === 'all' || catGroup === targetFilter) {
          cat.classList.remove('hidden');
          cat.style.animation = 'fadeIn 0.35s ease-in-out';
        } else {
          cat.classList.add('hidden');
        }
      });
    });
  });

  /* ==========================================================================
     8. Spotlight Border Glow & 3D Tilt with Holographic Glare
     ========================================================================== */
  const spotlightCards = document.querySelectorAll('[data-spotlight]');
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (isPointerFine.matches) {
    // Spotlight border illumination following cursor
    spotlightCards.forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });

    // 3D Perspective Tilt on Project & Terminal Cards
    if (!prefersReducedMotion.matches) {
      const MAX_TILT = 7;

      tiltCards.forEach(card => {
        let isHovered = false;

        card.addEventListener('pointerenter', () => {
          isHovered = true;
        });

        card.addEventListener('pointermove', (e) => {
          if (!isHovered) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = -((y - centerY) / centerY) * MAX_TILT;
          const rotateY = ((x - centerX) / centerX) * MAX_TILT;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

          // Holographic Glare coordinate calculation
          card.style.setProperty('--glare-x', `${x}px`);
          card.style.setProperty('--glare-y', `${y}px`);
        }, { passive: true });

        card.addEventListener('pointerleave', () => {
          isHovered = false;
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
      });
    }
  }

  /* ==========================================================================
     9. Sticky Navbar, Mobile Menu, Active Spy & Scroll Progress
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section');

  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressRingBar = document.getElementById('progress-ring-bar');

  // Combined Scroll Handler
  const handleScrollEffects = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Top Reading Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Sticky Navbar Styling
    if (scrollY > 25) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back-to-Top Button Visibility & Circular Ring Indicator
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      if (progressRingBar) {
        const circumference = 2 * Math.PI * 20; // r=20 -> 125.66
        const offset = circumference - (scrollPercent / 100) * circumference;
        progressRingBar.style.strokeDashoffset = `${offset}`;
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  // Back To Top Click Action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  }

  // Mobile Menu Toggle with ARIA Synchronization
  if (navToggle && navMenu) {
    const toggleMenu = (open) => {
      const willOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  }

  // Active Nav Link Spy using IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ==========================================================================
     10. Scroll-Reveal Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================================================
     11. Accessible Contact Form Validation & Character Counter
     ========================================================================== */
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formStatus = document.getElementById('form-status');
  const charCounter = document.getElementById('char-counter');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  const displayFieldError = (input, errorEl, message) => {
    if (!input || !errorEl) return;
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  };

  const clearFieldError = (input, errorEl) => {
    if (!input || !errorEl) return;
    input.setAttribute('aria-invalid', 'false');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  };

  // Real-time character counter & validation clearance
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.trim().length;
      charCounter.textContent = `${len} / 10 min`;

      if (len >= 10) {
        charCounter.classList.add('valid');
        clearFieldError(messageInput, messageError);
      } else {
        charCounter.classList.remove('valid');
      }
    });
  }

  if (nameInput && nameError) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 3) {
        clearFieldError(nameInput, nameError);
      }
    });
  }

  if (emailInput && emailError) {
    emailInput.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        clearFieldError(emailInput, emailError);
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidField = null;

      const trimmedName = nameInput ? nameInput.value.trim() : '';
      const trimmedEmail = emailInput ? emailInput.value.trim() : '';
      const trimmedMessage = messageInput ? messageInput.value.trim() : '';

      // 1. Name Check: >= 3 chars
      if (!trimmedName) {
        displayFieldError(nameInput, nameError, 'Name is required.');
        isValid = false;
        firstInvalidField = firstInvalidField || nameInput;
      } else if (trimmedName.length < 3) {
        displayFieldError(nameInput, nameError, 'Name must contain at least 3 characters.');
        isValid = false;
        firstInvalidField = firstInvalidField || nameInput;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // 2. Email Check: standard pattern
      if (!trimmedEmail) {
        displayFieldError(emailInput, emailError, 'Email address is required.');
        isValid = false;
        firstInvalidField = firstInvalidField || emailInput;
      } else if (!emailRegex.test(trimmedEmail)) {
        displayFieldError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
        firstInvalidField = firstInvalidField || emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // 3. Message Check: >= 10 chars
      if (!trimmedMessage) {
        displayFieldError(messageInput, messageError, 'Message is required.');
        isValid = false;
        firstInvalidField = firstInvalidField || messageInput;
      } else if (trimmedMessage.length < 10) {
        displayFieldError(messageInput, messageError, 'Message must be at least 10 characters long.');
        isValid = false;
        firstInvalidField = firstInvalidField || messageInput;
      } else {
        clearFieldError(messageInput, messageError);
      }

      // Accessible Focus on Error
      if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        if (formStatus) {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }
        return;
      }

      // Successful Local Validation
      if (formStatus) {
        formStatus.textContent = `Thank you, ${trimmedName}! Your message has been validated and recorded locally. Feel free to connect directly via LinkedIn or GitHub.`;
        formStatus.className = 'form-status success';

        showToast(`Message from ${trimmedName} validated! ✨`, 'fa-solid fa-paper-plane');

        form.reset();
        if (charCounter) {
          charCounter.textContent = '0 / 10 min';
          charCounter.classList.remove('valid');
        }

        [nameInput, emailInput, messageInput].forEach(input => {
          if (input) input.setAttribute('aria-invalid', 'false');
        });

        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 6000);
      }
    });
  }
});
