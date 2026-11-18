# AGENT.md

Instructions for any AI coding agent (Claude Code, Cursor, Copilot, etc.) or developer working on this website. Read this whole file before changing anything.

---

## 1. What this project is

The marketing website for **NextGen Tech Solutions**, a software house whose team is in Pakistan and whose market is international (the Gulf, UK, Europe, North America). **Never mention the team's city anywhere on the site, and don't position it around Pakistan**: no city names, prices in USD/GBP/CAD in examples, hours in UTC. The one exception is the PEC (Pakistan Engineering Council) registration of the engineers, which is a selling point. The company offers:

1. **AI agents**: WhatsApp order-taking, slot/appointment booking, customer support, lead follow-up, payment reminders, customer updates, and an internal manager's assistant.
2. **Management systems** for restaurants, medical (clinics, hospitals, labs, pharmacies), universities, schools, retail, and other industries.
3. **Fixes**: bug fixing, performance, security, hosting problems, rescuing stalled projects (including code written by others).
4. **Long-term maintenance contracts** with response times (plans: Care, Priority, Dedicated), including **taking over software someone else built**.
5. **Process automation agents**: internal agents for invoices, data entry, approvals, reconciliation and reports.
6. **AI issue resolution**: fixing chatbots/agents that give wrong answers, loop, or follow broken flows, and redesigning those flows.
7. **On-site / physical support**: hardware setup (POS, printers, scanners), networks and servers, go-live training. Planned per project.

The site's job: explain these services plainly and get the visitor to **start a project** (contact page or WhatsApp).

Audience: business owners and managers in Pakistan, the Gulf, the UK, Europe and North America. Many are not technical.

---

## 2. Tech stack (frontend only, for now)

| Part | Choice | Notes |
|---|---|---|
| Markup | Plain HTML, one file per page | No framework, no build step |
| Styling | Tailwind CSS v3 via the Play CDN + `assets/css/theme.css` | Config in `assets/js/tailwind.config.js` |
| Behaviour | Vanilla JS in `assets/js/main.js` | No jQuery, no frameworks |
| Layout | Web components: `<site-header>` and `<site-footer>` | `components/header.js`, `components/footer.js` |
| Icons | Lucide, pinned `lucide@0.499.0` via unpkg | `<i data-lucide="name">` |
| Font | Schibsted Grotesk (Google Fonts), one family for everything | |
| Backend | **None yet.** The contact form opens the visitor's email app or WhatsApp with the message prefilled | See section 10 |

Because there is no build step, the site deploys anywhere that serves static files.

---

## 3. Folder structure

```
/
├── index.html          Home
├── agents.html         AI agents
├── systems.html        Management systems by industry
├── support.html        Fixes (#fix) and maintenance contracts (#maintenance)
├── work.html           Projects showcase (all projects, filter by type)
├── project.html        One project: project.html?id=<id> (filled from projects.js)
├── about.html          About, PEC engineers, on-site work, process (#process), tech stack
├── contact.html        Contact form (footer uses no-cta here)
├── terms.html          Terms of service (16 sections, anchors per section)
├── privacy.html        Privacy policy
├── 404.html            Not found page (uses absolute /paths)
├── robots.txt
├── sitemap.xml
├── components/
│   ├── header.js       <site-header> : logo, nav, theme toggle, mobile menu
│   └── footer.js       <site-footer> : wave divider, CTA, link columns
├── assets/
│   ├── css/theme.css   COLOURS (:root) + component classes
│   ├── js/config.js    Company name, email, phone, WhatsApp, nav links
│   ├── js/projects.js  PROJECTS list: the showcase on home, work.html, project.html
│   ├── js/tailwind.config.js
│   ├── js/theme-init.js  Applies saved dark mode before paint
│   ├── js/main.js      Theme toggle, menu, hero demo, tabs, clocks, form
│   └── img/favicon.svg
├── AGENT.md            This file
└── README.md           Short human guide
```

---

## 4. How a page is put together

Every page uses the same skeleton. **Copy an existing page to make a new one** (e.g. `about.html`), then change the `<title>`, `<meta name="description">`, `data-page`, and the content inside `<main>`.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page title | NextGen Tech Solutions</title>
  <meta name="description" content="One sentence, under 160 characters.">
  <meta name="theme-color" content="#477B9A">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <script src="assets/js/theme-init.js"></script>                       <!-- must stay first, no defer -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..800&display=swap">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="assets/js/tailwind.config.js"></script>
  <link rel="stylesheet" href="assets/css/theme.css">
  <script src="https://unpkg.com/lucide@0.499.0/dist/umd/lucide.min.js" defer></script>
  <script src="assets/js/config.js" defer></script>
  <script src="components/header.js" defer></script>
  <script src="components/footer.js" defer></script>
  <script src="assets/js/main.js" defer></script>                         <!-- must stay last -->
</head>
<body data-page="PAGE_ID" class="bg-paper font-sans text-ink antialiased">
  <site-header></site-header>
  <main id="main">
    ...sections...
  </main>
  <site-footer></site-footer>
</body>
</html>
```

Rules:
- **Script order matters.** Lucide, config, header, footer, then main. All `defer`, so they run in that order after the HTML is parsed. `main.js` renders icons, so it must run after the header/footer exist.
- `data-page` must match an `id` in `SITE.nav` (config.js) to highlight the nav link. Pages not in the nav (contact, terms) just use their own name.
- `<site-footer no-cta>` hides the big "Start a project" block. Only the contact page uses it.
- To add a page to the main nav, add it to `SITE.nav` in `config.js`. To add it to the footer, edit the `col(...)` lists in `components/footer.js`. Add it to `sitemap.xml` too.

### Section pattern

```html
<section class="border-t border-line">            <!-- or class="bg-sunken" for an alternate band -->
  <div class="mx-auto max-w-site px-5 py-20 sm:px-8 lg:py-24">
    <h2 class="h2 max-w-2xl">Plain, specific heading.</h2>
    ...
  </div>
</section>
```

- Container: always `mx-auto max-w-site px-5 sm:px-8`. `max-w-site` is set to `100%` in `assets/js/tailwind.config.js`, so every page runs edge to edge with only the side padding. Change that one value (it was `78rem`) to go back to a centred column. From 1024px up, theme.css widens the side gutter with the screen (`clamp(2rem, 4.5vw, 6rem)`). Because the container no longer limits width, keep a `max-w-*` on paragraphs and on anything that looks wrong stretched. The home hero's column split, demo width and headline size live in `.hero-grid` / `.hero-demo` in theme.css.
- Vertical rhythm: `py-20 lg:py-24` (or `lg:py-28` on the home page).
- Separate sections with either `border-t border-line` or a `bg-sunken` band. Don't stack two sunken bands.

---

## 5. Design system

### Colours: change them in ONE place

All colours live in `:root` at the top of `assets/css/theme.css`:

```css
--c-brand: #477B9A;   /* brand: buttons, links, accents */
--c-light: #F4F9F9;   /* light mode background */
--c-dark:  #1A1A1A;   /* light mode text, dark mode background */
```

Every other colour (`--surface`, `--sunken`, `--muted`, `--line`, `--brand-soft`, `--deep`, ...) is derived from those three with `color-mix()`, separately for light and `.dark`. **Never hard-code a hex value in HTML or JS.** Use the Tailwind colour names, which map to the variables:

| Tailwind class | Variable | Use for |
|---|---|---|
| `bg-paper` / `text-paper` | `--paper` | Page background |
| `text-ink` / `bg-ink` | `--ink` | Main text |
| `text-muted` | `--muted` | Secondary text |
| `border-line` | `--line` | Borders and rules |
| `bg-surface` | `--surface` | Raised panels (forms, demo) |
| `bg-sunken` | `--sunken` | Alternate section background |
| `bg-brand` / `text-brand` | `--brand` | Buttons, icons |
| `text-brand-ink` | `--brand-ink` | Brand-coloured **text** (passes contrast) |
| `bg-brand-soft` | `--brand-soft` | Tags, number badges |
| `text-on-brand` | `--on-brand` | Text on brand backgrounds |
| `bg-deep` | `--deep` | Footer only |

Note: Tailwind opacity modifiers like `bg-brand/50` do **not** work with these variables. If you need a tint, add a new derived variable in theme.css with `color-mix()`, for both `:root` and `.dark`.

### Light and dark mode
- Default is **light**. The toggle in the header saves `"light"` or `"dark"` to `localStorage.theme`.
- `theme-init.js` adds the `dark` class to `<html>` before paint. Tailwind is configured with `darkMode: 'class'`.
- Because colours are variables, most elements need **no** `dark:` classes. Only use `dark:` for things like swapping icons.
- Always check both themes after a change.

### Typography
- One family: **Schibsted Grotesk**, weights 400 to 800.
- Classes in theme.css: `.display` (page H1), `.h2` (section headings), `.h3`, `.lede` (intro paragraph, muted, max 40rem).
- Keep body text lines under ~75 characters (`max-w-xl`, `max-w-2xl`, `.prose-width`).
- Sentence case everywhere. Headlines end with a full stop when they are sentences.

### Components (theme.css)
- Buttons: `.btn` + `.btn-primary` (one per view, the main action) or `.btn-ghost` (secondary). `.btn-sm` for the header.
- Text link: `.link`.
- Tag: `.tag`.
- Row list: `.rows` on a parent gives hairline rules between children. Use this instead of grids of identical cards.
- Form field: `.field`.
- FAQ: `<details class="faq">` with a `plus` icon `.faq-icon` (rotates when open).
- Tabs: `[data-tabs]` > `.tabs-track[role=tablist]` > `.tabs-indicator` + `.tab-btn[role=tab]`, panels `.tab-panel[role=tabpanel]`. Behaviour is automatic in main.js.

**Important:** `.btn` and `.tag` set their own `display`. Don't combine them with Tailwind display utilities like `hidden sm:inline-flex` on the same element; wrap them in a `<div class="hidden sm:block">` instead.

### Icons
Lucide, stroke width 1.75 (set in main.js). Usage: `<i data-lucide="calendar-check" class="h-5 w-5 text-brand"></i>`. Check the name exists at lucide.dev for version 0.499. If you add icons from JS after load, call `lucide.createIcons()` again.

### Signature moments (don't dilute them)
The site spends its visual boldness in exactly two places:
1. **Home hero demo**: an animated conversation where an agent takes an order / books a slot and the "What the agent did" log ticks off. Scenarios live in `main.js` (`scenarios` array). It pauses when off-screen and shows a static version for `prefers-reduced-motion`. Behind it, `.hero-waves` (inline SVG in `index.html`, styled and animated in theme.css, no JS) is four flat layered waves drifting slowly sideways at the bottom of the hero: the footer's wave motif at the top of the page. Three soft tints (`--sunken` up to `--brand-soft`, never stronger, because text sits on them), then a `--paper` wave that hands over to the next section, which is why "What we build" has no `border-t`. Each path holds the same 1440-wide shape twice so the drift loops without a seam; keep that if you redraw them. Above the waves, `.hero-lines` holds two ribbons of thin `--brand` strokes drifting sideways in opposite directions (70s and 95s). The paths are generated by the "Hero background" block in `main.js` from the `ribbons` settings there (line count, spacing, wave size); opacity, speed and the left-to-right fade mask are in theme.css. Keep the strokes thin and the opacity low. Don't add dot grids, particles, circuit lines, glows or pointer effects here.
2. **Footer waves**: three layered SVG waves (Haikei style) leading into the deep footer.
3. **Service illustrations** (home, "What we build"): five small animated inline SVGs (`.ill` in theme.css). All colours come from theme variables. Rule: the resting CSS of every shape is the finished picture, and keyframes animate *towards* it, so the global reduced-motion rule leaves a complete image. Keep them line-art and on-brand; don't add more elsewhere.

Photos: `.photo` (theme.css) on the home industry tabs, the home takeover section and the About page. They are Unsplash photos hotlinked from images.unsplash.com. Replace them with the company's own photos when available (real team, real installs). Never use handshake or pointing-at-screen photos.

**Projects showcase.** All projects live in `assets/js/projects.js` (field guide and a copy-paste TEMPLATE at the top). `featured: true` puts a project on the home page (first 3). `status: 'placeholder'` shows a "Case study coming soon" badge: the shipped placeholders describe the kind of work only, with no client, numbers or quotes. Replace or delete them before launch, and only publish real clients/results/quotes with permission. Pages that show projects must load `projects.js` before `main.js`.

**Photo motion.** Photos (`img.photo`) wipe up into view once when scrolled to (`.reveal-on` / `.is-in`, JS observes each photo's *parent*, because a clipped image never counts as intersecting). `.zoom` wrappers zoom slowly on hover. The home page photo strip (`.strip`, `[data-photo-strip]`) is a slow marquee that pauses on hover. Only photos move this way: never animate text blocks or whole sections in.

Other home page pieces: "Sound familiar?" (`.pain` rows: hovering strikes the problem through), and the before/after AI flow lanes (`.lane`, `.lane-steps`).

Everything else stays quiet: hairline rules, generous whitespace, left-aligned text.

---

## 6. Anti-"AI-made" rules (follow strictly)

These come from the unslop checklist and the project's design brief. Breaking them makes the site look generated.

**Never add:**
- Purple or rainbow gradients, glows, neon, glassy blobs or "aurora" backgrounds.
- Emoji in headings, labels or buttons.
- ALL CAPS eyebrow labels above headings, or tracked-out small caps labels.
- One highlighted word in a headline (a different colour, italic or gradient word).
- Grids of identical rounded cards with the same soft shadow. Use `.rows`, columns with dividers, or tables.
- Fade-and-slide-up animations on every section, or hover lifts on every card.
- Numbered markers (01, 02, 03) unless the content really is a sequence (process steps are fine).
- `→` arrows appended to button text. Middle-dot meta strings ("A · B · C").
- Fake testimonials, fake client logos, invented statistics ("500+ projects", "99% satisfaction"). Only add real ones the company provides.
- Shouty or vague copy: "Revolutionize", "Cutting-edge", "Unleash", "Next-level", "Seamless", "Empower", "In today's fast-paced world".
- Stock photos of people shaking hands or pointing at screens. (Photos of real places, like a shop floor, clinic desk or server room, are fine.)

**Always:**
- Show the product (agent conversations, system modules, real plan details) instead of decoration.
- Write specific, plain sentences. Say what the thing does and for whom.
- Use the spacing scale consistently (section `py-20/24`, gaps `gap-6/10/12`).

---

## 7. Writing guidelines

- Voice: a calm, experienced engineer talking to a business owner. Confident, specific, no hype.
- Short sentences. Active voice. Sentence case.
- Buttons say what happens: "Start a project", "Report an issue", "See maintenance plans". Keep the same label for the same action everywhere.
- Use the customer's words: "take orders on WhatsApp", not "conversational commerce automation".
- Prices are never shown on the site. Plans say "Quoted per system".
- Spelling: British/international English is fine; be consistent within a page.

---

## 8. Accessibility checklist (every change)

- One `<h1>` per page; headings in order.
- All interactive elements are real `<a>` or `<button>`; icon-only buttons have `aria-label`.
- Keyboard: visible focus (`:focus-visible` is styled globally), Escape closes the mobile menu, arrow keys move between tabs.
- Colour contrast: use `text-brand-ink` (not `text-brand`) for brand-coloured text on light backgrounds.
- Motion: anything animated must respect `prefers-reduced-motion` (theme.css already cuts animations globally; JS checks `reduceMotion`).
- Images need `alt`; decorative SVGs get `aria-hidden="true"`.
- Test at 390px, 768px and 1440px wide, in both themes.

---

## 9. Running and deploying

**Run locally:** any static server from the project folder.
- VS Code: "Live Server" extension, right-click `index.html` > Open with Live Server
- or `npx serve .`
- or `python -m http.server 8000`

Opening the HTML file directly (double-click) also works, because the header and footer are JS components, not fetched files.

**Deploy (pick one, all free for static sites):**
- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the Git repo. No build command, publish directory `.`
- **Vercel**: import the repo, framework preset "Other", no build command.
- **Cloudflare Pages**: connect the repo, no build command, output directory `/`.
- **GitHub Pages**: push to a repo, Settings > Pages > deploy from branch `main`, folder `/root`. `404.html` is picked up automatically.

After the domain is set, update `https://yourdomain.com` in `sitemap.xml` and `robots.txt`.

---

## 10. Placeholders to replace before launch

Search for `TODO` and these values:

- `assets/js/config.js`: `email`, `phone`, `whatsapp`, `social.linkedin`, `social.github`, `hours`. Change `name`/`shortName`/`legalName` if the company name changes. Header, footer, contact page and legal pages update automatically.
- `<title>` and meta descriptions contain the company name in every HTML file (search and replace "NextGen Tech Solutions").
- `support.html`: maintenance plan details (hours, response times, minimum terms) are sensible defaults. Confirm them with the business.
- `config.js` `hours` (06:00 to 18:00 UTC, the same as 11:00 to 23:00 Pakistan time) and the "Our engineers" clock in `main.js` and the "fix period" (30 days) must match what the business actually offers. Also in `terms.html`.
- `terms.html` and `privacy.html` are drafts. **A lawyer must review them** before launch.
- `sitemap.xml`, `robots.txt`: domain.

---

## 11. Future roadmap (when a backend arrives)

Keep the frontend structure; add pieces like this:

1. **Contact form backend.** Simplest: Formspree / Web3Forms / Netlify Forms (change the `<form>` action and remove the mailto code in `main.js`). Later: own API endpoint (e.g. `/api/contact`) that stores leads and notifies on WhatsApp. Update the privacy policy when this happens.
2. **Production CSS.** Replace the Tailwind Play CDN with the Tailwind CLI build: `npx tailwindcss -i ./assets/css/input.css -o ./assets/css/tailwind.css --minify`, with `content: ['./**/*.html', './components/**/*.js', './assets/js/**/*.js']` and the same theme config. Then swap the CDN `<script>` for a `<link>` to the built file on every page.
3. **Case studies / blog.** Add `work/` and `blog/` folders, or move to Astro/Next.js reusing the same tokens, components and copy rules. Only publish real projects with client permission.
4. **Analytics.** Use a privacy-friendly tool (Plausible, Umami). Update the privacy policy's "This website" section.
5. **Live chat agent.** Put the company's own agent on the site (eat your own cooking).
6. **i18n.** Arabic (RTL) and Urdu versions for Gulf and local clients: add `dir="rtl"` handling and logical Tailwind classes (`ps-`, `pe-`, `ms-`, `me-`).

---

## 12. Do / Don't summary for agents

**Do**
- Reuse existing classes and patterns; read a similar page first.
- Keep every colour flowing from the three `:root` variables.
- Keep header/footer changes inside `components/`.
- Test light + dark, mobile + desktop, keyboard navigation.
- Keep copy specific and honest.

**Don't**
- Add a framework, bundler or npm dependency without being asked.
- Add inline `style="color:#..."` or new hex values.
- Duplicate header/footer markup into pages.
- Break the script order in `<head>`.
- Invent clients, numbers, awards or testimonials.
