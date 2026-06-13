# Lovett Counseling & Consulting — Site

Whitney Lovett, MA, LPC, CCTP · Denver, CO · Online across Colorado

A trauma-informed therapy + consulting practice site. Static HTML/CSS/JS — no build step, hosts anywhere, costs nothing to run.

---

## Tomorrow's Launch Checklist

Step-by-step for the evening you go live. Allow ~60–90 minutes total.

### 1. Create the new Gmail (5 min)
Sign in to https://accounts.google.com/signup and create the practice's working address. Suggested: `lovettcounselingandconsulting@gmail.com` (already referenced site-wide).

> If you choose a different address, do a project-wide find-and-replace before launching — the existing one is hard-coded in:
> - `contact.html` (3 places)
> - footer of all 8 HTML pages
> - `index.html` JSON-LD schema
> - `llms.txt`
> - `mailto:` links throughout

### 2. Set up EmailJS so the contact form delivers (10 min)

1. Sign up at https://www.emailjs.com/ — the free tier covers 200 emails/month, plenty to start.
2. **Email Services** → **Add New Service** → choose **Gmail** → connect the new gmail account.
3. **Email Templates** → **Create New Template**:
   - In the template editor, switch the Content view from "Plain Text" to **"HTML / Code"**.
   - Open `emailjs-template.html` from this folder, copy **everything from `<!DOCTYPE html>` to the end**, and paste it into the Content field. (The full branded template is already written — Cream/clay/forest palette, Cormorant serif headings, table-based layout for max compatibility with Gmail, Apple Mail, Outlook.)
   - In the template Settings tab:
     - **Subject**: `New inquiry from {{name}} — Lovett Counseling`
     - **To Email**: `lovettcounselingandconsulting@gmail.com`
     - **From Name**: `Lovett Counseling Website`
     - **Reply To**: `{{email}}` ← critical, so hitting Reply in Gmail emails the visitor directly
   - Click **Test It** to send yourself a preview. You should see a branded email card with the sender's info, message, and a green "Reply To" button.

4. **Account** → **API Keys** → copy the **Public Key**.
5. Open `contact.html` and replace the three placeholders near the bottom of the file:
   ```js
   const EMAILJS_PUBLIC_KEY  = "REPLACE_WITH_PUBLIC_KEY";   // step 4
   const EMAILJS_SERVICE_ID  = "REPLACE_WITH_SERVICE_ID";   // step 2
   const EMAILJS_TEMPLATE_ID = "REPLACE_WITH_TEMPLATE_ID";  // step 3
   ```
6. Save. Test the form locally by opening `contact.html` in a browser, filling it out, hitting Send.

### 3. Pick a host (5 min)

All three are free and equivalent quality. **Netlify Drop** is the fastest.

| Option | Where | Best for |
|---|---|---|
| **Netlify Drop** ⭐ | https://app.netlify.com/drop | Drag-and-drop the whole folder, done in 30s |
| **Vercel** | https://vercel.com | Connect a GitHub repo, auto-deploys on push |
| **GitHub Pages** | github.com → repo Settings → Pages | If she already has a GitHub account |
| **Cloudflare Pages** | https://pages.cloudflare.com | Drag/drop or git, great DNS integration |

Recommendation: **Netlify**. Drag this folder onto Netlify Drop. You get a `*.netlify.app` URL immediately. Add the GoDaddy domain in *Site settings → Domain management*.

### 4. Point the GoDaddy domain (15 min, DNS propagates 1–24h)

In GoDaddy → My Products → Domain → DNS:

**For Netlify:**
- Delete any existing A or CNAME records on `@` and `www`.
- Add an `A` record: name `@`, value `75.2.60.5`, TTL `1 hour`.
- Add a `CNAME` record: name `www`, value `<your-site>.netlify.app`, TTL `1 hour`.

**For Vercel:**
- `A` record on `@` pointing to `76.76.21.21`.
- `CNAME` on `www` pointing to `cname.vercel-dns.com`.

**For Cloudflare Pages:**
- Easier: change the GoDaddy nameservers to Cloudflare's (Cloudflare will provide them when you add the site).

In the hosting dashboard, mark `lovettcounselingandconsulting.com` as the primary domain and enable the free auto-SSL certificate.

### 5. Submit to search engines (10 min)
- **Google Search Console**: https://search.google.com/search-console → add the property → verify (DNS or HTML file) → submit `https://lovettcounselingandconsulting.com/sitemap.xml`.
- **Bing Webmaster Tools**: https://www.bing.com/webmasters → same flow.

### 6. Last-pass polish (15 min)
- Replace the Instagram placeholder link (`https://instagram.com`) site-wide with Whitney's actual handle URL, once she has one. Currently in the footer of every page.
- Add a real OG share image. Save a 1200×630 image as `images/og-card.jpg` — a cropped version of the hero photo works well. The HTML already references this filename.
- Verify the phone number on the contact + JSON-LD: currently `(530) 802-0437`. Update everywhere if it's different.

---

## What's in the box

```
outputs/
├─ index.html               Home — full-bleed hero
├─ individual-therapy.html
├─ couples-therapy.html
├─ consulting.html
├─ about.html
├─ faq.html
├─ fees.html
├─ contact.html             EmailJS-wired form
├─ emailjs-template.html    Paste-ready branded HTML email for the EmailJS dashboard
├─ css/styles.css           Single CSS file — all design tokens at top
├─ js/main.js               Scroll parallax, mobile menu, FAQ accordion, form validation
├─ images/                  All photos + headshot
├─ sitemap.xml              Submit to Google
├─ robots.txt               Allows all crawlers; lists sitemap; explicit opt-in for AI bots
├─ llms.txt                 Structured site context for AI agents (emerging standard)
├─ README.md                This file
└─ Whitney - Assets/        Original raw assets (keep, don't deploy)
```

## SEO + metadata that's already in place

- Per-page `<title>`, `<meta description>`, `<meta keywords>`, canonical URL
- Open Graph (Facebook/LinkedIn shares) on every page, with image dimensions
- Twitter Card meta on every page
- `<meta name="robots" content="index, follow, max-image-preview:large">`
- JSON-LD structured data:
  - Home → `MedicalBusiness` (name, address, phone, founder, areaServed)
  - Individual/Couples → `MedicalTherapy`
  - Consulting → `Service`
  - About → `Person` with credentials
  - FAQ → `FAQPage` with 5 Q/A pairs
  - Fees → `PriceSpecification`
  - Contact → `ContactPage`
- `sitemap.xml` with all 8 pages and priority weights
- `robots.txt` allowing all major crawlers including GPTBot, ClaudeBot, PerplexityBot
- `llms.txt` so AI agents can quickly understand the practice
- Semantic HTML5 throughout (`<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`)
- Alt text on every image, ARIA labels on icons + form fields

## Design system at a glance

All design tokens live as CSS variables at the top of `css/styles.css` — change once, propagate everywhere:

```css
--cream:        #F2EBE0;    /* page background */
--clay:         #A07B6B;    /* muted earth accent (italics, eyebrows, CTAs) */
--peach:        #D9A892;    /* highlight */
--sage:         #6B7A5A;    /* secondary accent */
--forest:       #3E4A35;    /* primary button + footer */
--radius-sm/md/lg: 0        /* sharp corners site-wide */
```

Typography: **Cormorant Garamond** (display serif + italic emphasis), **Manrope** (UI sans).

## Hero on the home page

Full-bleed background photo, dark left-fade gradient overlay, vertically centered content, sticky-on-scroll nav that goes transparent over the hero and solid below it. Uses `100dvh` for steady mobile sizing. Scroll arrow centers at the bottom.

To swap the hero photo: replace `images/Hero.jpg` (1200×800 or larger, focal subject right of center so the left stays available for headline text).

## Local development

No build, no server needed — open `index.html` in a browser. To test the EmailJS form locally without spamming Whitney, comment out the `emailjs.send` line in `contact.html` and uncomment a console.log.

For full-fidelity testing with a server, run from the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Maintenance notes

- New photo? Drop it in `images/` and reference it in the relevant HTML. Recommended dimensions: hero ≥1600×1000, page heroes ~900×1100, two-col images ~800×1000.
- Changing fees? Edit `fees.html` rates. Also update `images/og-card.jpg` if needed (the dollar figures don't appear there, just generic copy).
- New blog/journal post? The current structure doesn't include a blog. If we add one later, the easiest path is a Markdown-driven static generator (Eleventy or Astro) layered on top of this design system.
- Google Analytics / Plausible: not currently included. Drop the snippet into the `<head>` of each page when ready.

## What I touched in this final pass

- Wired up EmailJS (branded HTML template in `emailjs-template.html`)
- Wrote `llms.txt`
- Refreshed `sitemap.xml`, `robots.txt` (AI crawlers explicitly allowed)
- Tightened every page's `<title>` to ≤60 chars and `<meta description>` to ≤160 chars so Google doesn't truncate them in search results
- Added OG image + Twitter card meta + robots meta to every page
- Added `PriceSpecification` JSON-LD to `fees.html`
- Wired in new photos: Hero, Individual, Couples, Succulents, plus four new filenames (Archway, Plants, Eucalyptus, Sanctuary) ready for files to land
- **Image optimization**: stripped EXIF, resized over-large originals, re-encoded JPG progressive at q=82, generated WebP versions for every photo (~35% smaller). Total `images/` folder dropped from **6.2 MB → 1.3 MB**.
- Wrapped all `<img>` tags in `<picture>` elements with WebP source + JPG fallback — every browser gets the best format it supports
- Added `<link rel="preload" as="image" fetchpriority="high">` on home page hero for fastest LCP (Largest Contentful Paint)
- Verified at 1440×900, 1366×768, and 390×844 viewports — all 8 pages render correctly

## What still needs to land before going live

These are the small handful of things I can't do from inside the build folder. Most take 30 seconds each.

### Files to drop into `images/`
- `Archway.jpg` — used on Consulting hero. Adobe archway with iron gates.
- `Plants.jpg` — used on Individual two-col. Snake plants with shadows.
- `Eucalyptus.jpg` — used on Couples two-col. Eucalyptus on warm peachy wall.
- `Sanctuary.jpg` — used on About two-col. Warm room with chair, pampas, jute baskets.
- `og-card.jpg` — the social-share image (1200×630). Easiest: crop the Hero photo to that ratio in Preview, export as JPG.

When you drop a JPG, I should re-run the WebP optimizer over it so it stays as fast as the rest. If you forget, the site still works — JPG is the fallback.

### Once Whitney has the new Gmail (tomorrow evening)

| Need from her | What it unlocks |
|---|---|
| EmailJS Public Key + Service ID + Template ID | Plug into 3 placeholders in `contact.html` and the contact form is live |
| (Optional) GitHub username | If you want a GitHub repo for version control |
| Cloudflare Pages (free) — connect to GitHub repo, or drag-drop the folder | Hosting + automatic SSL |
| Google Search Console — verify the property with DNS TXT or the HTML file method | Submit the sitemap so Google indexes faster |
| Google Analytics 4 (optional) — get the measurement ID, drop snippet into `<head>` of each page | Visitor analytics |
| Instagram handle URL | Replace the placeholder `https://instagram.com` in every footer |
| Her current phone number if different from `(530) 802-0437` | Project-wide find-and-replace |

### GoDaddy → Cloudflare Pages (recommended hosting)

The cleanest path: change the GoDaddy nameservers to Cloudflare's. Cloudflare tells you exactly which two to use when you add the site. Then in Cloudflare:
- Pages → connect to GitHub (or drag-drop deploy)
- Custom domains → add `lovettcounselingandconsulting.com` and `www.lovettcounselingandconsulting.com`
- SSL/TLS → Full (strict) — auto-renews forever

Cloudflare is free, fast, and the analytics they provide for free are excellent.

Anything else, just say the word.
