# Bloom & Cradle — Official Documentation & Customization Guide

Version: **1.0.0**  
Brand Placeholder: **Bloom & Cradle Women's Health & Maternity Clinic** (`TODO` markers included throughout)

---

## 1. Installation Guide

1. **Unzip / Open Folder**: Extract or open the `Gynecology_Maternity_Clinic` directory.
2. **Instant Local Preview**: Double-click `index.html` in the root folder. It automatically redirects to `pages/index.html` (Home 1) and provides a fallback button.
3. **Optional Local Dev Server**:
   - **VS Code Live Server**: Right-click `pages/index.html` and select *Open with Live Server*.
   - **Python HTTP Server**: Run `python -m http.server 8080` and visit `http://localhost:8080/pages/index.html`.
   - **Node `serve`**: Run `npx serve .`
4. **Static Hosting Deployment (Netlify / Vercel / GitHub Pages / cPanel / S3)**:
   - Upload the entire directory as-is. No build command (`npm run build`) is required.
   - Set the publish directory to `.` (root).

---

## 2. Customization Guide

### 2.1 Changing Brand Name & Contact Info
Search across the project for `TODO:` comments:
- Replace `"Bloom & Cradle"` with your clinic's official name.
- Update the emergency hotline (`+1 (800) 555-0199`) in the `.emergency-strip` and footer.
- Update the domain placeholder (`https://www.bloomandcradle.example`) in `sitemap.xml`, `robots.txt`, and `<link rel="canonical">` tags.

### 2.2 Editing Colors (CSS Variables)
Open `assets/css/style.css` and edit the `:root` variables at the top of the file:
```css
:root {
  --rose-50: #FFF5F3;
  --rose-100: #FDE8E4;
  --rose-200: #F8CFC9;
  --rose-400: #E9908F;
  --plum-700: #5B2A4A;
  --plum-900: #2E1228;
  --sage-300: #BFD3C1;
  --sage-600: #5E8C73;
  --champagne-300: #E9CFA0;
  --champagne-500: #C9A15B;
  --lilac-200: #E4D7F0;
}
```
For Dark Mode overrides, open `assets/css/dark-mode.css` (`#1B0E19` background, `#26142A` surface cards).

### 2.3 Changing Fonts
Self-hosted `.woff2` and `.woff` fonts live in `assets/fonts/` and are declared at the top of `assets/css/style.css`:
- `--font-serif`: `'Fraunces', Georgia, serif`
- `--font-sans`: `'Plus Jakarta Sans', -apple-system, sans-serif`
- `--font-script`: `'Caveat', cursive`

### 2.4 Replacing Images
All 70 photorealistic photographs live in `assets/images/` with both `.webp` and `.jpg` versions. Every `<picture>` element follows this pattern:
```html
<picture>
  <source srcset="../assets/images/hero-home1-mother-bump.webp" type="image/webp">
  <img src="../assets/images/hero-home1-mother-bump.jpg" alt="Descriptive alt text" width="900" height="1080" loading="lazy" decoding="async">
</picture>
```
To replace an image, overwrite the matching `.webp` and `.jpg` files in `assets/images/` using the same filename.

### 2.5 Changing Demo Credentials
Open `assets/js/main.js` and locate the `initAuthForms()` function (around line 520) or update the demo autofill attributes (`data-demo-role="patient"` / `data-demo-role="admin"`) in `pages/login.html`.

---

## 3. Page Structure & Section Allocation Matrix

Every page has a strictly unique section set (zero repeated content sections across pages):

| Page Path | Purpose & Unique Sections |
| :--- | :--- |
| `index.html` | Root launcher redirecting to `pages/index.html` |
| `pages/index.html` | **Home 1**: Asymmetric split hero, Accreditation Marquee, Pillars of Care (6 cards), Life-Stage Care Tabs, Maternity Wing Reveal, Interactive 5-Step Journey Timeline, Birth Stories (3 mothers), Closing CTA Banner |
| `pages/home-2.html` | **Home 2**: Centered split-nav header, 3-slide full-bleed hero slider, Interactive Due-Date Calculator, 4-Number Animated Stats Band, Luxury Birthing Suites Showcase (3 suites), Specialist Carousel (4 doctors), Insurance & Direct-Billing Wall, Wellness Journal Preview, Newsletter Strip |
| `pages/about.html` | Editorial hero, Founder's Story, Mission/Vision/Philosophy cards, Clinic Milestones Timeline (2008–2026), Clinical Leadership & Safety Standards, Accreditations & Awards |
| `pages/services.html` | Banner, Filterable Service Directory (12 services), Diagnostic & Imaging Lab Spotlight, Emergency 24/7 Labour Triage Protocol |
| `pages/service-details.html` | Service Hero, Overview & Who It's For, Trimester Care Breakdown, What's Included Checklist, Diagnostic Schedule Table, Lead Specialist Card, Sticky Sidebar Quick-Book |
| `pages/doctors.html` | Hero with Search + Specialty/Language/Availability Filters, 8-Doctor Grid, Multidisciplinary Care Team Model |
| `pages/doctor-details.html` | Doctor Bio Hero, Biography & Philosophy, Qualifications & Fellowships Timeline, Weekly Consultation Schedule Table, Areas of Clinical Interest, Book Direct Form |
| `pages/maternity-packages.html` | Hero, 3-Tier Package Cards (*Blossom*, *Serenity*, *Royal Cradle*) with Currency Toggle, Feature Comparison Table, Add-On Wellness Services, Financing & Insurance Explainer |
| `pages/book-appointment.html` | Interactive 5-Step Booking Wizard with printable confirmation summary |
| `pages/pregnancy-journey.html` | Interactive Week 1–40 Slider, Trimester Nutrition & Exercise Guide, Hospital Bag Checklist, Kick Counter & Weight-Gain Estimator |
| `pages/blog.html` | Featured Article Hero, Category Filter + Search, 6-Article Grid, Author Spotlight |
| `pages/blog-details.html` | Article Header, Long-Form Medical Article with Table of Contents & Key Takeaways, Reviewed-By Medical Box, Share & Related Articles |
| `pages/gallery.html` | Filterable 12-Photo Facility Tour Masonry Grid with Lightbox, Virtual Tour Request Form |
| `pages/faq.html` | Searchable FAQ Hero, Category Tabs + 20+ Accordions, Still Have Questions Card |
| `pages/contact.html` | 3 Contact Cards, Validated Contact Form, Interactive Custom SVG Clinic Map, Getting Here (Parking/Transit/Accessibility), Visiting Hours Table |
| `pages/login.html`, `register.html`, `forgot-password.html` | Split-screen Auth Pages with Quick Demo Login & Password Strength Meter |
| `pages/dashboard/*.html` | 8 Patient Portal Pages (Overview, Book Checkup, Appointments, Pregnancy Tracker, Reports, Messages, Profile, Settings) |
| `pages/admin/*.html` | 7 Admin Portal Pages (Overview & KPIs, Appointments, Patients, Doctors, Clinical Analytics, Staff & Triage Alerts, Settings) |
| `pages/privacy-policy.html`, `terms.html`, `404.html`, `coming-soon.html` | Legal & Utility Pages |

---

## 4. Credits

- **Typography**: Self-hosted `Fraunces`, `Plus Jakarta Sans`, and `Caveat` (`assets/fonts/`).
- **Icons**: Custom-bundled local SVG symbol sprite (`assets/icons/icons.svg`, Lucide-inspired stroke icons).
- **Photography**: 70 unique photorealistic photographs stored locally in `assets/images/` (`.webp` and `.jpg`).
- **JavaScript**: 100% vanilla ES6+ (`assets/js/main.js`, `assets/js/tilt.js`, `assets/js/dashboard.js`, `assets/js/plugins/smooth-charts.js`).

---

## 5. Changelog

### v1.0.0 (2026-11-14)
- Initial release of the 38-page Bloom & Cradle Women's Health & Maternity Clinic website, Patient Portal, and Admin Portal.
- Implemented "Blush, Plum & Champagne" design tokens, Dark Mode (`#1B0E19`), RTL support, 3D tilt cards, and clinic-themed animations.

---

## 6. Support

For technical customization questions or support, please refer to the inline `TODO:` markers in the HTML/CSS/JS source files or contact your development team.
