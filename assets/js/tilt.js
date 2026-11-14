/**
 * BLOOM & CRADLE CLINIC — 3D TILT CARD MODULE (assets/js/tilt.js)
 * Applies smooth pointer-tracking 3D perspective tilt + glare highlight to `.tilt-card` elements.
 * Automatically disables on coarse/touch pointers and when `prefers-reduced-motion: reduce` is active.
 */
(function () {
  'use strict';

  function initTiltCards() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    const cards = document.querySelectorAll('.tilt-card');
    const maxTilt = 10.5; // degrees

    cards.forEach((card) => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';

      // Ensure glare element exists inside each tilt card
      let glare = card.querySelector('.tilt-card__glare');
      if (!glare) {
        glare = document.createElement('span');
        glare.className = 'tilt-card__glare';
        glare.setAttribute('aria-hidden', 'true');
        card.appendChild(glare);
      }

      card.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;
        const glareX = ((x / rect.width) * 100).toFixed(1);
        const glareY = ((y / rect.height) * 100).toFixed(1);

        card.classList.add('is-tilting');
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
      });

      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });

      card.addEventListener('focusin', () => {
        card.style.transform = 'perspective(1000px) translateY(-4px) scale3d(1.01, 1.01, 1.01)';
      });

      card.addEventListener('focusout', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  window.BloomTilt = { init: initTiltCards };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTiltCards);
  } else {
    initTiltCards();
  }
})();
