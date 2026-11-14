/**
 * BLOOM & CRADLE — Lightweight SVG & Canvas Sparkline Renderer (assets/js/plugins/smooth-charts.js)
 * Self-contained local plugin for drawing maternal health & clinic analytics trend lines.
 */
(function () {
  'use strict';

  function renderCanvasCharts() {
    document.querySelectorAll('canvas[data-chart-values]').forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const values = (canvas.getAttribute('data-chart-values') || '60,64,63,68,72,75')
        .split(',')
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !isNaN(v));
      if (values.length < 2) return;

      const w = canvas.width;
      const h = canvas.height;
      const min = Math.min(...values) * 0.92;
      const max = Math.max(...values) * 1.05;
      const pad = 16;

      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      values.forEach((val, idx) => {
        const x = pad + (idx / (values.length - 1)) * (w - pad * 2);
        const y = h - pad - ((val - min) / (max - min || 1)) * (h - pad * 2);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#C9A15B';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCanvasCharts);
  } else {
    renderCanvasCharts();
  }
})();
