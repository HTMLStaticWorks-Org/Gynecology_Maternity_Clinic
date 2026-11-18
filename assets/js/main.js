/**
 * BLOOM & CRADLE WOMEN'S HEALTH & MATERNITY CLINIC (TODO: Replace Brand Name)
 * Main Application Script (assets/js/main.js)
 * Handles Theme, RTL, Navigation, Reveal, Counters, Calculators, Filters, Booking & Forms
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME & RTL INITIALIZATION (Immediate to avoid flash)
     ------------------------------------------------------------------------ */
  const rootEl = document.documentElement;
  const savedTheme = localStorage.getItem('bc_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  rootEl.setAttribute('data-theme', initialTheme);

  const savedDir = localStorage.getItem('bc_dir') || 'ltr';
  rootEl.setAttribute('dir', savedDir);

  /* ------------------------------------------------------------------------
     2. TOAST NOTIFICATION HELPER
     ------------------------------------------------------------------------ */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4200);
  }
  window.showBloomToast = showToast;

  document.addEventListener('DOMContentLoaded', () => {
    /* ----------------------------------------------------------------------
       3. PRELOADER & STICKY HEADER
       ---------------------------------------------------------------------- */
    const preloader = document.querySelector('.page-preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('is-hidden'), 180);
    }

    const header = document.querySelector('.site-header');
    if (header) {
      const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ----------------------------------------------------------------------
       3b. MOBILE DRAWER ACTIONS & BACKDROP (Sync header actions into drawer)
       ---------------------------------------------------------------------- */
    const mainNav = document.querySelector('.main-nav');
    const headerActions = document.querySelector('.site-header .header-actions');

    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    if (mainNav && !mainNav.querySelector('.main-nav__header')) {
      const drawerHeader = document.createElement('div');
      drawerHeader.className = 'main-nav__header';
      drawerHeader.innerHTML = `
        <button type="button" class="icon-btn main-nav__close" data-nav-close aria-label="Close navigation menu">
          <svg aria-hidden="true"><use href="../assets/icons/icons.svg#icon-close"></use></svg>
        </button>
      `;
      mainNav.insertBefore(drawerHeader, mainNav.firstChild);
    }

    if (mainNav && headerActions && !mainNav.querySelector('.mobile-nav-actions')) {
      const themeBtn = headerActions.querySelector('[data-theme-toggle]');
      const rtlBtn = headerActions.querySelector('[data-rtl-toggle]');
      const ctaBtns = headerActions.querySelectorAll('.btn:not(.mobile-menu-toggle)');

      const mobileActions = document.createElement('div');
      mobileActions.className = 'mobile-nav-actions';

      const togglesWrap = document.createElement('div');
      togglesWrap.className = 'mobile-nav-actions__toggles';

      if (themeBtn) {
        togglesWrap.appendChild(themeBtn.cloneNode(true));
      }
      if (rtlBtn) {
        togglesWrap.appendChild(rtlBtn.cloneNode(true));
      }
      if (togglesWrap.children.length > 0) {
        mobileActions.appendChild(togglesWrap);
      }
      ctaBtns.forEach((btn) => {
        mobileActions.appendChild(btn.cloneNode(true));
      });

      const navList = mainNav.querySelector('.main-nav__list');
      if (navList) {
        mainNav.insertBefore(mobileActions, navList);
      } else {
        mainNav.appendChild(mobileActions);
      }
    }

    /* ----------------------------------------------------------------------
       4. THEME, RTL & LANGUAGE TOGGLES
       ---------------------------------------------------------------------- */
    function updateThemeButtons() {
      const current = rootEl.getAttribute('data-theme');
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        btn.setAttribute('title', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        const iconUse = btn.querySelector('use');
        if (iconUse) {
          const href = iconUse.getAttribute('href') || '';
          const base = href.includes('#') ? href.split('#')[0] : '../assets/icons/icons.svg';
          iconUse.setAttribute('href', `${base}#${current === 'dark' ? 'icon-sun' : 'icon-moon'}`);
        }
      });
    }
    updateThemeButtons();

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        rootEl.setAttribute('data-theme', next);
        localStorage.setItem('bc_theme', next);
        updateThemeButtons();
        showToast(`Theme switched to ${next} mode.`);
      });
    });

    function updateRtlButtons() {
      const dir = rootEl.getAttribute('dir') || 'ltr';
      document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
        btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch layout to Left-to-Right' : 'Switch layout to Right-to-Left');
      });
    }
    updateRtlButtons();

    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = rootEl.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        rootEl.setAttribute('dir', next);
        localStorage.setItem('bc_dir', next);
        updateRtlButtons();
        showToast(`Text direction set to ${next.toUpperCase()}.`);
      });
    });

    /* ----------------------------------------------------------------------
       5. MOBILE NAVIGATION DRAWER (WITH FOCUS TRAP & CLOSE CONTROLS)
       ---------------------------------------------------------------------- */
    const navToggle = document.querySelector('[data-nav-toggle]');
    if (mainNav) {
      const setNavOpen = (isOpen) => {
        mainNav.classList.toggle('is-open', isOpen);
        if (backdrop) backdrop.classList.toggle('is-active', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', String(isOpen));
          navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
          const iconUse = navToggle.querySelector('use');
          if (iconUse) {
            const href = iconUse.getAttribute('href') || '';
            const base = href.includes('#') ? href.split('#')[0] : '../assets/icons/icons.svg';
            iconUse.setAttribute('href', `${base}#${isOpen ? 'icon-close' : 'icon-menu'}`);
          }
        }
      };

      if (navToggle) {
        navToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const willOpen = !mainNav.classList.contains('is-open');
          setNavOpen(willOpen);
        });
      }

      // Close button inside the drawer
      document.querySelectorAll('[data-nav-close]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setNavOpen(false);
          if (navToggle) navToggle.focus();
        });
      });

      // Clicking on the backdrop closes the drawer
      if (backdrop) {
        backdrop.addEventListener('click', () => {
          setNavOpen(false);
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
          setNavOpen(false);
          if (navToggle) navToggle.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (
          mainNav.classList.contains('is-open') &&
          !mainNav.contains(e.target) &&
          (!navToggle || !navToggle.contains(e.target))
        ) {
          setNavOpen(false);
        }
      });

      // Closing when selecting a link inside the drawer (except dropdown triggers on mobile/touch)
      const isTouchNav = () =>
        window.innerWidth <= 1024 ||
        window.matchMedia('(hover: none), (pointer: coarse)').matches;

      mainNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          if (isTouchNav() && link.closest('.nav-dropdown') && link.classList.contains('main-nav__link')) {
            return;
          }
          setNavOpen(false);
        });
      });
    }

    /* ----------------------------------------------------------------------
       5b. NAVIGATION DROPDOWNS (KEYBOARD & TOUCH ACCESSIBILITY)
       ---------------------------------------------------------------------- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-dropdown__link').forEach((subLink) => {
      const href = subLink.getAttribute('href');
      if (href && href.split('/').pop() === currentPage && !subLink.hasAttribute('aria-current')) {
        subLink.setAttribute('aria-current', 'page');
      }
    });

    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    navDropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('.main-nav__link');
      if (!trigger) return;

      // Mobile & touch/tablet click to toggle dropdown
      trigger.addEventListener('click', (e) => {
        const isTouchOrTablet =
          window.innerWidth <= 1024 ||
          window.matchMedia('(hover: none), (pointer: coarse)').matches;
        if (isTouchOrTablet) {
          e.preventDefault();
          e.stopPropagation();
          const wasOpen = dropdown.classList.contains('is-open');
          navDropdowns.forEach((d) => d.classList.remove('is-open'));
          if (!wasOpen) dropdown.classList.add('is-open');
        }
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          dropdown.classList.add('is-open');
          const firstSubLink = dropdown.querySelector('.nav-dropdown__link');
          if (firstSubLink && e.key === 'ArrowDown') {
            e.preventDefault();
            firstSubLink.focus();
          }
        }
      });

      dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdown.classList.remove('is-open');
          trigger.focus();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        navDropdowns.forEach((d) => d.classList.remove('is-open'));
      }
    });

    /* ----------------------------------------------------------------------
       6. SCROLL REVEAL & ANIMATED STAT COUNTERS
       ---------------------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });
      revealEls.forEach((el) => revealObs.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    const counterEls = document.querySelectorAll('[data-counter]');
    if ('IntersectionObserver' in window && counterEls.length) {
      const counterObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter')) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1600;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(eased * target);
            el.textContent = val.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      }, { threshold: 0.35 });
      counterEls.forEach((el) => counterObs.observe(el));
    }

    /* ----------------------------------------------------------------------
       7. TABS & ACCORDIONS
       ---------------------------------------------------------------------- */
    document.querySelectorAll('[data-tabs]').forEach((tabContainer) => {
      const buttons = tabContainer.querySelectorAll('[data-tab-target]');
      const panels = tabContainer.querySelectorAll('.tab-panel');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-tab-target');
          buttons.forEach((b) => {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          panels.forEach((p) => p.classList.remove('is-active'));
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');
          const panel = tabContainer.querySelector(`#${targetId}`);
          if (panel) panel.classList.add('is-active');
        });
      });
    });

    document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        if (!item) return;
        const isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });
    });

    /* ----------------------------------------------------------------------
       8. HOME 2 HERO SLIDER & DUE-DATE CALCULATOR
       ---------------------------------------------------------------------- */
    const heroSlides = document.querySelectorAll('.hero-home2__slide');
    if (heroSlides.length > 1) {
      let currentSlide = 0;
      setInterval(() => {
        heroSlides[currentSlide].classList.remove('is-active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('is-active');
      }, 5500);
    }

    const dueDateForm = document.getElementById('due-date-form');
    if (dueDateForm) {
      dueDateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const lmpInput = document.getElementById('lmp-date');
        const cycleInput = document.getElementById('cycle-length');
        const resultEl = document.getElementById('due-date-result');
        if (!lmpInput || !lmpInput.value || !resultEl) return;

        const lmp = new Date(lmpInput.value);
        const cycle = parseInt(cycleInput ? cycleInput.value : '28', 10) || 28;
        const cycleOffset = cycle - 28;
        const edd = new Date(lmp.getTime() + (280 + cycleOffset) * 86400000);
        const now = new Date();
        const diffDays = Math.max(0, Math.floor((now - lmp) / 86400000));
        const weeks = Math.min(40, Math.floor(diffDays / 7));
        const days = diffDays % 7;
        const trimester = weeks < 13 ? 'First Trimester' : (weeks < 27 ? 'Second Trimester' : 'Third Trimester');

        resultEl.hidden = false;
        resultEl.innerHTML = `Estimated Due Date: <strong>${edd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong><br>Current Progress: <strong>Week ${weeks}, Day ${days}</strong> (${trimester})`;
      });
    }

    /* ----------------------------------------------------------------------
       8b. SERVICES QUICKNAV ACTIVE STATE ON SCROLL
       ---------------------------------------------------------------------- */
    const quicknavPills = document.querySelectorAll('.quicknav-pill');
    if (quicknavPills.length) {
      const navSections = [];
      quicknavPills.forEach((pill) => {
        const hash = pill.getAttribute('href');
        if (hash && hash.startsWith('#')) {
          const sec = document.querySelector(hash);
          if (sec) navSections.push({ pill, sec });
        }
      });

      const updateQuicknav = () => {
        const scrollPos = window.scrollY + 180;
        let currentPill = null;
        navSections.forEach(({ pill, sec }) => {
          if (sec.offsetTop <= scrollPos) {
            currentPill = pill;
          }
        });
        if (currentPill) {
          quicknavPills.forEach((p) => p.classList.remove('is-active'));
          currentPill.classList.add('is-active');
        }
      };

      window.addEventListener('scroll', updateQuicknav, { passive: true });
    }

    /* ----------------------------------------------------------------------
       9. CATEGORY FILTERS (Services, Doctors, Blog, Gallery) & SEARCH
       ---------------------------------------------------------------------- */
    document.querySelectorAll('[data-filter-group]').forEach((group) => {
      const buttons = group.querySelectorAll('[data-filter]');
      const targetGridId = group.getAttribute('data-filter-group');
      const grid = document.getElementById(targetGridId);
      if (!grid) return;
      const items = grid.querySelectorAll('[data-category]');

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const cat = btn.getAttribute('data-filter');
          buttons.forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          items.forEach((item) => {
            const itemCat = item.getAttribute('data-category') || '';
            const match = cat === 'all' || itemCat.split(' ').includes(cat);
            item.style.display = match ? '' : 'none';
          });
        });
      });
    });

    const doctorSearch = document.getElementById('doctor-search');
    if (doctorSearch) {
      doctorSearch.addEventListener('input', () => {
        const q = doctorSearch.value.trim().toLowerCase();
        document.querySelectorAll('#doctors-grid [data-category]').forEach((card) => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }

    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
      faqSearch.addEventListener('input', () => {
        const q = faqSearch.value.trim().toLowerCase();
        document.querySelectorAll('.accordion-item').forEach((item) => {
          const match = item.textContent.toLowerCase().includes(q);
          item.style.display = match ? '' : 'none';
          if (q.length > 2 && match) item.classList.add('is-open');
        });
      });
    }

    /* ----------------------------------------------------------------------
       10. GALLERY LIGHTBOX MODAL
       ---------------------------------------------------------------------- */
    const lightboxModal = document.getElementById('gallery-lightbox');
    if (lightboxModal) {
      const lbImg = document.getElementById('lightbox-img');
      const lbTitle = document.getElementById('lightbox-caption');
      const lbClose = document.getElementById('lightbox-close');

      document.querySelectorAll('[data-lightbox-title]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const cardSrc = btn.closest('article')?.querySelector('source')?.getAttribute('srcset') || btn.getAttribute('data-lightbox-src');
          if (lbImg && cardSrc) lbImg.src = cardSrc;
          if (lbTitle) lbTitle.textContent = btn.getAttribute('data-lightbox-title') || '';
          lightboxModal.hidden = false;
        });
      });

      if (lbClose) {
        lbClose.addEventListener('click', () => {
          lightboxModal.hidden = true;
        });
      }
    }

    /* ----------------------------------------------------------------------
       11. PREGNANCY JOURNEY INTERACTIVE TOOLS (Weeks 1-40 + Kick Counter + Weight)
       ---------------------------------------------------------------------- */
    const weekSelector = document.getElementById('week-selector');
    if (weekSelector) {
      const weekData = {
        4: { size: 'Poppy Seed (2 mm)', baby: 'Implantation completes and the neural tube begins forming.', mother: 'Mild cramping or fatigue; begin daily 400 mcg folic acid.' },
        8: { size: 'Raspberry (1.6 cm)', baby: 'Tiny fingers and toes are forming; fetal heartbeat is ~150 bpm.', mother: 'Morning nausea and heightened sense of smell; first prenatal booking scan.' },
        12: { size: 'Plum (5.4 cm)', baby: 'All vital organs formed; reflexes begin moving limbs.', mother: 'Energy starts returning as placenta takes over hormone production; NT scan week.' },
        16: { size: 'Avocado (11.6 cm)', baby: 'Ears are in position and baby can hear your voice and heartbeat.', mother: 'The "second-trimester glow" begins; first gentle flutters (quickening) may appear.' },
        20: { size: 'Artichoke (25 cm)', baby: 'Halfway milestone! Vernix protects skin and sleep-wake cycles establish.', mother: 'Detailed mid-pregnancy anomaly ultrasound scan scheduled between weeks 19 and 21.' },
        24: { size: 'Pomegranate (30 cm)', baby: 'Lungs develop surfactant branches; baby responds to touch and music.', mother: 'Oral glucose tolerance screening window (weeks 24-28).' },
        28: { size: 'Eggplant (37.6 cm)', baby: 'Eyes blink and REM sleep begins; rapid brain growth.', mother: 'Welcome to the third trimester! Tdap vaccination and Rhogam check if indicated.' },
        32: { size: 'Napa Cabbage (42.4 cm)', baby: 'Toenails and hair are visible; baby practices breathing movements.', mother: 'Braxton Hicks practice contractions; begin finalizing your birth preferences.' },
        36: { size: 'Honeydew Melon (47.4 cm)', baby: 'Most babies settle into a head-down position ready for birth.', mother: 'Weekly antenatal visits begin; Group B Strep (GBS) swab screening.' },
        40: { size: 'Small Pumpkin (51.2 cm)', baby: 'Full-term and ready to meet you! Lungs and immune antibodies are mature.', mother: 'Rest, hydrate, monitor fetal movements, and call our 24/7 labour suite when contractions become regular.' }
      };

      const renderWeek = (w) => {
        const keys = Object.keys(weekData).map(Number);
        const closest = keys.reduce((prev, curr) => Math.abs(curr - w) < Math.abs(prev - w) ? curr : prev);
        const info = weekData[closest];
        const titleEl = document.getElementById('week-display-title');
        const sizeEl = document.getElementById('week-display-size');
        const babyEl = document.getElementById('week-display-baby');
        const motherEl = document.getElementById('week-display-mother');
        if (titleEl) titleEl.textContent = `Week ${w} of 40`;
        if (sizeEl) sizeEl.textContent = `Comparable Milestone Size: ${info.size}`;
        if (babyEl) babyEl.textContent = info.baby;
        if (motherEl) motherEl.textContent = info.mother;
      };

      weekSelector.addEventListener('input', () => renderWeek(parseInt(weekSelector.value, 10)));
      renderWeek(parseInt(weekSelector.value || '20', 10));
    }

    const journeyKickBtn = document.getElementById('journey-kick-btn');
    if (journeyKickBtn) {
      let kicks = parseInt(localStorage.getItem('bc_journey_kicks') || '0', 10);
      const countEl = document.getElementById('journey-kick-count');
      const resetBtn = document.getElementById('journey-kick-reset');
      if (countEl) countEl.textContent = String(kicks);

      journeyKickBtn.addEventListener('click', () => {
        kicks += 1;
        localStorage.setItem('bc_journey_kicks', String(kicks));
        if (countEl) countEl.textContent = String(kicks);
        if (kicks === 10) showToast('10 fetal movements recorded! Reassuring activity logged.');
      });
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          kicks = 0;
          localStorage.setItem('bc_journey_kicks', '0');
          if (countEl) countEl.textContent = '0';
        });
      }
    }

    const weightForm = document.getElementById('weight-gain-form');
    if (weightForm) {
      weightForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const preW = parseFloat(document.getElementById('pre-weight')?.value || '60');
        const heightCm = parseFloat(document.getElementById('height-cm')?.value || '165');
        const out = document.getElementById('weight-gain-result');
        if (!out) return;
        const bmi = preW / Math.pow(heightCm / 100, 2);
        let range = '11.5 – 16.0 kg (25 – 35 lbs)';
        if (bmi < 18.5) range = '12.5 – 18.0 kg (28 – 40 lbs)';
        else if (bmi >= 25 && bmi < 30) range = '7.0 – 11.5 kg (15 – 25 lbs)';
        else if (bmi >= 30) range = '5.0 – 9.0 kg (11 – 20 lbs)';
        out.hidden = false;
        out.innerHTML = `Pre-pregnancy BMI: <strong>${bmi.toFixed(1)}</strong> • Recommended Total Pregnancy Gain: <strong>${range}</strong>`;
      });
    }

    /* ----------------------------------------------------------------------
       12. MULTI-STEP BOOK APPOINTMENT WIZARD
       ---------------------------------------------------------------------- */
    const bookingWizard = document.getElementById('booking-wizard');
    if (bookingWizard) {
      const steps = bookingWizard.querySelectorAll('[data-booking-step]');
      let currentStep = 1;

      const showStep = (stepNum) => {
        currentStep = stepNum;
        steps.forEach((s) => {
          s.hidden = parseInt(s.getAttribute('data-booking-step'), 10) !== stepNum;
        });
        document.querySelectorAll('[data-step-indicator]').forEach((ind) => {
          const n = parseInt(ind.getAttribute('data-step-indicator'), 10);
          ind.classList.toggle('badge-plum', n === stepNum);
          ind.classList.toggle('badge-success', n < stepNum);
        });
      };

      bookingWizard.querySelectorAll('[data-next-step]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const next = parseInt(btn.getAttribute('data-next-step'), 10);
          if (next === 5) {
            const srv = document.getElementById('book-service')?.value || 'Antenatal Consultation';
            const doc = document.getElementById('book-doctor')?.value || 'Dr. Amara Okafor';
            const dt = document.getElementById('book-date')?.value || '2026-11-20';
            const tm = document.getElementById('book-time')?.value || '10:30 AM';
            const nm = document.getElementById('book-name')?.value || 'Elena Rostova';
            const sumEl = document.getElementById('booking-summary-box');
            if (sumEl) {
              sumEl.innerHTML = `
                <p><strong>Patient:</strong> ${nm}</p>
                <p><strong>Service:</strong> ${srv}</p>
                <p><strong>Specialist:</strong> ${doc}</p>
                <p><strong>Date & Time:</strong> ${dt} at ${tm}</p>
                <p><strong>Confirmation Reference:</strong> #BC-${Math.floor(100000 + Math.random() * 900000)}</p>
              `;
            }
            const existing = JSON.parse(localStorage.getItem('bc_appointments') || '[]');
            existing.unshift({ id: Date.now(), service: srv, doctor: doc, date: dt, time: tm, status: 'Confirmed' });
            localStorage.setItem('bc_appointments', JSON.stringify(existing));
            showToast('Appointment confirmed! Confirmation summary generated.');
          }
          showStep(next);
        });
      });

      bookingWizard.querySelectorAll('[data-prev-step]').forEach((btn) => {
        btn.addEventListener('click', () => {
          showStep(parseInt(btn.getAttribute('data-prev-step'), 10));
        });
      });
    }

    /* ----------------------------------------------------------------------
       13. PASSWORD VISIBILITY TOGGLE & AUTH / FORM VALIDATION
       ---------------------------------------------------------------------- */
    document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-toggle-password');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        const useEl = btn.querySelector('use');
        if (useEl) {
          const currentHref = useEl.getAttribute('href') || '';
          const basePath = currentHref.split('#')[0];
          useEl.setAttribute('href', `${basePath}#${isPass ? 'icon-eye-off' : 'icon-eye'}`);
        } else {
          btn.textContent = isPass ? 'Hide' : 'Show';
        }
        btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
      });
    });

    document.querySelectorAll('form[data-validate-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach((field) => {
          const errId = field.getAttribute('aria-describedby');
          const errEl = errId ? document.getElementById(errId) : null;
          const isFieldValid = field.type === 'checkbox' ? field.checked : field.value.trim().length > 0;
          if (!isFieldValid || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()))) {
            valid = false;
            field.classList.add('is-invalid');
            if (errEl) errEl.textContent = field.getAttribute('data-error-msg') || 'Please complete this required field.';
          } else {
            field.classList.remove('is-invalid');
            if (errEl) errEl.textContent = '';
          }
        });

        if (!valid) {
          showToast('Please check the highlighted fields and try again.');
          return;
        }

        const formType = form.getAttribute('data-validate-form');
        if (formType === 'login') {
          const email = (form.querySelector('input[type="email"]')?.value || '').trim().toLowerCase();
          const role = email.includes('admin') ? 'admin' : 'patient';
          localStorage.removeItem('bc_auth_logged_out');
          localStorage.setItem('bc_auth_session', JSON.stringify({
            email: email || 'patient@demo.com',
            name: role === 'admin' ? 'Sophia Brooks' : 'Elena Rostova',
            role,
            loggedInAt: new Date().toISOString()
          }));
          showToast('Welcome back! Redirecting to your portal...');
          setTimeout(() => {
            window.location.href = role === 'admin' ? 'admin/index.html' : 'dashboard/index.html';
          }, 600);
        } else if (formType === 'register') {
          const name = form.querySelector('#reg-name')?.value || 'Elena Rostova';
          const email = form.querySelector('#reg-email')?.value || 'patient@demo.com';
          localStorage.setItem('bc_auth_session', JSON.stringify({
            email,
            name,
            role: 'patient',
            loggedInAt: new Date().toISOString()
          }));
          showToast('Account created! Redirecting to your Patient Dashboard...');
          setTimeout(() => {
            window.location.href = 'dashboard/index.html';
          }, 700);
        } else {
          const successMsg = form.getAttribute('data-success-msg') || 'Thank you! Your submission has been received.';
          showToast(successMsg);
          const statusBox = form.querySelector('.form-status-box');
          if (statusBox) {
            statusBox.hidden = false;
            statusBox.textContent = successMsg;
          }
          form.reset();
        }
      });
    });

    /* ----------------------------------------------------------------------
       14. COMING SOON COUNTDOWN TIMER
       ---------------------------------------------------------------------- */
    const countdownEl = document.getElementById('countdown-timer');
    if (countdownEl) {
      const targetDate = new Date(Date.now() + 18 * 86400000 + 6 * 3600000).getTime();
      const updateTimer = () => {
        const diff = Math.max(0, targetDate - Date.now());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-mins');
        const sEl = document.getElementById('cd-secs');
        if (dEl) dEl.textContent = String(d).padStart(2, '0');
        if (hEl) hEl.textContent = String(h).padStart(2, '0');
        if (mEl) mEl.textContent = String(m).padStart(2, '0');
        if (sEl) sEl.textContent = String(s).padStart(2, '0');
      };
      updateTimer();
      setInterval(updateTimer, 1000);
    }

    /* ----------------------------------------------------------------------
       15. SCROLL TO TOP BUTTON
       ---------------------------------------------------------------------- */
    if (!document.querySelector('.scroll-up-btn')) {
      const scrollUpBtn = document.createElement('button');
      scrollUpBtn.type = 'button';
      scrollUpBtn.className = 'scroll-up-btn';
      scrollUpBtn.setAttribute('aria-label', 'Scroll back to top');
      scrollUpBtn.setAttribute('title', 'Back to top');
      scrollUpBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
      document.body.appendChild(scrollUpBtn);

      const toggleScrollBtn = () => {
        scrollUpBtn.classList.toggle('is-visible', window.scrollY > 320);
      };
      window.addEventListener('scroll', toggleScrollBtn, { passive: true });
      toggleScrollBtn();

      scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });
})();
