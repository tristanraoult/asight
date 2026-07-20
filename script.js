/* ==========================================================================
   INTERACTIVE LOGIC & ANIMATIONS — ASIGHT REFONTE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Custom Cursor (only on Desktop)
  initCustomCursor();
  
  // 2. Initialize Hamburger Menu Mobile Overlay Toggle
  initHamburgerMenu();
  
  // 3. Initialize Scroll Progress Indicator
  initScrollProgress();
  
  // 4. Initialize Intersection Observer for Scroll Reveals
  initScrollReveals();
  
  // 5. Initialize Split Text Animations for Headers
  initSplitText();
  
  // 6. Initialize Count-up Statistics
  initCountUps();
  
  // 7. Initialize Magnetic CTA Buttons
  initMagneticButtons();
  
  // 8. Initialize Project Filters (if on projects.html)
  initProjectFilters();
  
  // 9. Initialize Contact Form Submission Logic (if on contact.html or homepage)
  initContactForm();

});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  const dot = document.createElement('div');
  dot.classList.add('custom-cursor-dot');
  
  document.body.appendChild(cursor);
  document.body.appendChild(dot);
  
  // Hide on touchscreen devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    dot.style.display = 'none';
    return;
  }
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot moves instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });
  
  // Smooth follow for outer ring
  function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Hover states
  const interactives = document.querySelectorAll('a, button, select, input, textarea, .project-card, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      dot.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
  
  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    dot.style.opacity = '1';
  });
}

/* ==========================================================================
   2. HAMBURGER MENU MOBILE
   ========================================================================== */
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.nav-sidebar');
  
  if (!hamburger || !sidebar) return;
  
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      sidebar.classList.remove('active');
    }
  });
  
  // Close menu when clicking on a link
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      sidebar.classList.remove('active');
    });
  });
}

/* ==========================================================================
   3. SCROLL PROGRESS
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
  });
}

/* ==========================================================================
   4. SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);
  
  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   5. SPLIT TEXT HEADERS
   ========================================================================== */
function initSplitText() {
  const headers = document.querySelectorAll('[data-split-text]');
  headers.forEach(header => {
    const text = header.textContent.trim();
    const words = text.split(' ');
    header.textContent = ''; // clear original text
    
    words.forEach((word, idx) => {
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word-reveal');
      
      const innerSpan = document.createElement('span');
      innerSpan.classList.add('word-inner');
      innerSpan.textContent = word + (idx < words.length - 1 ? '\u00A0' : ''); // Keep space
      innerSpan.style.transitionDelay = `${idx * 0.04}s`;
      
      wordSpan.appendChild(innerSpan);
      header.appendChild(wordSpan);
    });
    
    // Animate automatically after a short delay
    setTimeout(() => {
      header.querySelectorAll('.word-reveal').forEach(word => word.classList.add('visible'));
    }, 100);
  });
}

/* ==========================================================================
   6. COUNT-UP STATISTICS
   ========================================================================== */
function initCountUps() {
  const stats = document.querySelectorAll('[data-count]');
  if (stats.length === 0) return;
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseFloat(target.getAttribute('data-count'));
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const isDecimal = countTo % 1 !== 0;
        
        let start = 0;
        const duration = 1500; // 1.5s duration
        const startTime = performance.now();
        
        function updateCount(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Ease Out Quad
          const easeProgress = progress * (2 - progress);
          const currentCount = easeProgress * countTo;
          
          if (isDecimal) {
            target.textContent = prefix + currentCount.toFixed(1) + suffix;
          } else {
            target.textContent = prefix + Math.floor(currentCount) + suffix;
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            // Guarantee final value matches target
            target.textContent = prefix + (isDecimal ? countTo.toFixed(1) : countTo) + suffix;
          }
        }
        
        requestAnimationFrame(updateCount);
        observer.unobserve(target); // Only count up once
      }
    });
  }, observerOptions);
  
  stats.forEach(stat => countObserver.observe(stat));
}

/* ==========================================================================
   7. MAGNETIC BUTTONS
   ========================================================================== */
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn, .social-link');
  if (btns.length === 0 || window.matchMedia('(pointer: coarse)').matches) return;
  
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const bound = btn.getBoundingClientRect();
      const x = e.clientX - bound.left - (bound.width / 2);
      const y = e.clientY - bound.top - (bound.height / 2);
      
      // Pull button slightly towards cursor (magnetic effect)
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   8. PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterBtns.length === 0 || projectCards.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          // Force a tiny reflow for fade in animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   9. CONTACT & RDV FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('rdv-form');
  const successOverlay = document.querySelector('.form-success-overlay');
  
  if (!form || !successOverlay) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate API request
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Envoi en cours...';
    
    setTimeout(() => {
      // Clear form inputs
      form.reset();
      
      // Display success message overlay
      successOverlay.style.display = 'flex';
      
      // Reset submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1200);
  });
  
  // Close success message overlay
  const closeSuccessBtn = document.querySelector('.close-success');
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successOverlay.style.display = 'none';
    });
  }
}
