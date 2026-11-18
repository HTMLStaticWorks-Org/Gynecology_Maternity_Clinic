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

    document.querySelectorAll('canvas[data-trend-chart]').forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const values = (canvas.getAttribute('data-values') || '')
        .split(',')
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !isNaN(v));
      if (values.length < 2) return;

      const labels = (canvas.getAttribute('data-labels') || '')
        .split(',')
        .map((l) => l.trim());
      const strokeColor = canvas.getAttribute('data-color') || '#5B2A4A';

      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth || 600;
      const cssH = canvas.clientHeight || 240;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const padLeft = 28;
      const padRight = 24;
      const padTop = 28;
      const padBottom = 34;
      const chartW = Math.max(40, cssW - padLeft - padRight);
      const chartH = Math.max(40, cssH - padTop - padBottom);

      const min = Math.min(...values) * 0.88;
      const max = Math.max(...values) * 1.08;
      const range = max - min || 1;

      const points = values.map((val, idx) => ({
        x: padLeft + (idx / (values.length - 1)) * chartW,
        y: padTop + chartH - ((val - min) / range) * chartH,
        val,
        label: labels[idx] || ''
      }));

      ctx.clearRect(0, 0, cssW, cssH);

      // Subtle horizontal gridlines
      ctx.strokeStyle = 'rgba(91, 42, 74, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 3; i++) {
        const gy = padTop + (i / 3) * chartH;
        ctx.beginPath();
        ctx.moveTo(padLeft, gy);
        ctx.lineTo(cssW - padRight, gy);
        ctx.stroke();
      }

      // Soft area fill under trend line
      const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
      gradient.addColorStop(0, 'rgba(91, 42, 74, 0.22)');
      gradient.addColorStop(1, 'rgba(91, 42, 74, 0.0)');
      ctx.beginPath();
      points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(points[points.length - 1].x, padTop + chartH);
      ctx.lineTo(points[0].x, padTop + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Trend line
      ctx.beginPath();
      points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Data points, value labels, and x-axis labels
      ctx.font = '600 12px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      points.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        ctx.fillStyle = strokeColor;
        ctx.fillText(String(pt.val), pt.x, pt.y - 10);

        if (pt.label) {
          ctx.fillStyle = '#6E5A68';
          ctx.fillText(pt.label, pt.x, cssH - 10);
        }
      });
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderCanvasCharts, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCanvasCharts);
  } else {
    renderCanvasCharts();
  }
})();
