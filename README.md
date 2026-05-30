# Lovett Counseling & Consulting — Website

A multi-page, SEO-optimized, fully responsive site for Whitney Lovett, MA, LPC, CCTP.

## Pages

- `index.html` — Home (hero, philosophy, services, meet your therapist)
- `individual-therapy.html` — Individual therapy services
- `couples-therapy.html` — Couples therapy services
- `consulting.html` — Consulting & training for schools, teams, orgs
- `about.html` — Whitney's bio, approach, credentials
- `faq.html` — Frequently asked questions (with FAQ schema for SEO)
- `fees.html` — Session rates, insurance, Good Faith Estimate
- `contact.html` — Contact form + practice info

Shared assets: `css/styles.css`, `js/main.js`. Plus `sitemap.xml` and `robots.txt`.

## How to deploy

Pick whichever is easiest — the site is plain HTML/CSS/JS, no build step required.

**Netlify (drag-and-drop, free):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire folder onto the page
3. Done. Connect a custom domain in Site Settings.

**Vercel (free):**
1. Push the folder to a GitHub repo
2. Import the repo at [vercel.com](https://vercel.com)
3. Add domain in project settings

**GitHub Pages (free):**
1. Push to a GitHub repo
2. Settings → Pages → Source: main branch
3. Add custom domain in Pages settings

**Squarespace / Wix / WordPress:**
Use one of the static hosts above instead — it's free, faster, and the design will stay pixel-perfect.

## Before launching

1. **Hook up the contact form.** Open `contact.html` and replace `your-form-id` in the form's `action` URL with your free [Formspree.io](https://formspree.io) form ID. (Other options: [Basin](https://usebasin.com), [Web3Forms](https://web3forms.com). All free for low volumes.)
2. **Add the real domain.** Replace `lovettcounselingandconsulting.com` throughout the meta tags, sitemap, and schema.org JSON-LD if the final domain is different.
3. **Swap in Whitney's photo.** The About and Meet sections use Unsplash placeholders. Replace those `<img src>` URLs with Whitney's actual headshot.
4. **Update fees.** The numbers on `fees.html` ($175 individual / $200 couples) are reasonable Denver-area placeholders — adjust to your actual rates.
5. **Real Instagram link.** Replace `https://instagram.com` in the footers with the actual profile URL.
6. **Submit to search engines.** After launch, submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console) so Google indexes you faster.

## What's included for SEO

- Per-page `<title>`, `<meta description>`, and `<link rel="canonical">`
- Open Graph + Twitter Card meta for social sharing
- Schema.org JSON-LD: `MedicalBusiness` on home, `MedicalTherapy` on service pages, `Person` on about, `FAQPage` on FAQ, `ContactPage` on contact
- Semantic HTML5 throughout (`<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`)
- `alt` text on every image, ARIA labels on icons and form fields
- `sitemap.xml` + `robots.txt`
- Google Fonts preconnected for fast first paint
- Mobile-first responsive layout with three breakpoints (1100px, 768px, 480px)

## Design system

All colors and fonts live as CSS custom properties at the top of `css/styles.css`, so any palette tweaks happen in one place:

```css
--cream:        #F2EBE0;   /* page background */
--terracotta:   #B16548;   /* wave banner, accents */
--peach:        #E8A584;   /* script highlights */
--sage:         #6B7A5A;   /* secondary icon backgrounds */
--forest:       #3E4A35;   /* primary buttons + footer */
```

Fonts: **Cormorant Garamond** (display serif), **Allura** (script accent), **Caveat** (handwritten quotes), **Manrope** (UI sans).

— Built with care, with the goal that it feels like Whitney.
# lovett
