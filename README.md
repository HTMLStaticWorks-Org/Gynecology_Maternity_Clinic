# Bloom & Cradle Women's Health & Maternity Clinic
**Couture Multi-Page Gynecology & Maternity Website + Patient & Admin Portals**

> **Note:** `"Bloom & Cradle Women's Health & Maternity Clinic"` is a placeholder brand name marked throughout the codebase with `<!-- TODO: Replace placeholder brand name "Bloom & Cradle" ... -->` comments for effortless rebranding.

---

## Quick Start (Zero Build Step)

1. Double-click the root `index.html` file (or open `pages/index.html` directly in any modern browser).
2. Or run a static local server from the project root:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

---

## Demo Portal Credentials

You can sign in on `pages/login.html` using the one-click Quick Demo Login buttons or enter the credentials manually:

| Portal Role | Email | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Patient Portal** | `elena@patient.demo` | `BloomPatient2026!` | `pages/dashboard/index.html` |
| **Clinic Admin** | `admin@bloomcradle.demo` | `BloomAdmin2026!` | `pages/admin/index.html` |

---

## Design System: "Blush, Plum & Champagne"

- **Light Palette**:
  - `--rose-50: #FFF5F3` (Warm blush-ivory page canvas)
  - `--rose-100: #FDE8E4`, `--rose-200: #F8CFC9`, `--rose-400: #E9908F` (Soft coral rose)
  - `--plum-700: #5B2A4A` (Primary deep mulberry headings & CTAs)
  - `--plum-900: #2E1228` (Darkest text & midnight sections)
  - `--sage-300: #BFD3C1`, `--sage-600: #5E8C73` (Calm wellness sage)
  - `--champagne-300: #E9CFA0`, `--champagne-500: #C9A15B` (Couture gold accents)
  - `--lilac-200: #E4D7F0` (Gentle lavender secondary surface)
- **Dark Mode**: Deep aubergine (`#1B0E19` background, `#26142A` surfaces) with full WCAG 2.1 AA contrast, auto-detected via `prefers-color-scheme` and persisted in `localStorage`.
- **RTL Support**: Instant LTR/RTL toggle persisted in `localStorage` (`assets/css/rtl.css`).
- **Self-Hosted Typography**: `Fraunces` (headings), `Plus Jakarta Sans` (body/UI), and `Caveat` (handwritten accents) in `assets/fonts/`.

---

## Complete File Structure

```
bloom-cradle-clinic/
├── assets/
│   ├── css/
│   │   ├── style.css          (design tokens, base, components, pages)
│   │   ├── style.min.css      (minified production stylesheet)
│   │   ├── dark-mode.css      (deep aubergine dark mode tokens & overrides)
│   │   ├── rtl.css            (Right-to-Left layout & logical overrides)
│   │   └── dashboard.css      (patient & admin portal layout & components)
│   ├── js/
│   │   ├── main.js            (nav, theme, RTL, reveal, counters, forms, calculators, wizard)
│   │   ├── main.min.js        (minified production script)
│   │   ├── tilt.js            (3D perspective tilt card module with glare)
│   │   ├── dashboard.js       (patient + admin portal interactive state & localStorage)
│   │   └── plugins/
│   │       └── smooth-charts.js (vanilla HTML5 Canvas trend chart plugin)
│   ├── images/                (70 unique photorealistic photographs in both .webp and .jpg)
│   ├── icons/                 (favicon.svg + icons.svg sprite with 45+ medical/UI symbols)
│   └── fonts/                 (self-hosted .woff2 and .woff font files)
├── pages/
│   ├── index.html             (Home 1 — Warm Editorial Split Hero & 8 Unique Sections)
│   ├── home-2.html            (Home 2 — Full-Bleed Slider, Due-Date Calculator, Suites, Newsletter)
│   ├── about.html
│   ├── services.html
│   ├── service-details.html
│   ├── doctors.html
│   ├── doctor-details.html
│   ├── maternity-packages.html
│   ├── book-appointment.html
│   ├── pregnancy-journey.html (Interactive Week 1–40 Slider, Kick Counter, Weight Tool)
│   ├── blog.html
│   ├── blog-details.html
│   ├── gallery.html           (Filterable Facility Tour + Lightbox)
│   ├── faq.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   ├── dashboard/             (8 Patient Portal pages)
│   ├── admin/                 (7 Admin Portal pages)
│   ├── privacy-policy.html
│   ├── terms.html
│   ├── 404.html
│   └── coming-soon.html
├── documentation/
│   ├── index.html             (Interactive HTML Documentation)
│   └── GUIDE.md               (Markdown Developer & Customization Guide)
├── sitemap.xml
├── robots.txt
├── index.html                 (Root entry launcher to pages/index.html)
└── README.md
```

For full customization instructions, see [`documentation/index.html`](documentation/index.html) or [`documentation/GUIDE.md`](documentation/GUIDE.md).
