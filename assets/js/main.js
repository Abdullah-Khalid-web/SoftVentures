/*
 * main.js — shared behaviour for every page.
 * Each feature only runs if its markup exists on the page.
 */
(function () {
  const root = document.documentElement;
  const site = window.SITE || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fill data-site="key" placeholders from config ---------- */
  document.querySelectorAll('[data-site]').forEach(el => {
    const value = site[el.dataset.site];
    if (value == null) return;
    el.textContent = value;
    if (el.tagName === 'A' && el.dataset.site === 'email') el.href = 'mailto:' + value;
  });
  document.querySelectorAll('[data-whatsapp-link]').forEach(el => {
    el.href = 'https://wa.me/' + site.whatsapp;
  });

  /* ---------- Icons (Lucide) ---------- */
  function renderIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  }
  renderIcons();

  /* ---------- Theme controls (state is owned by theme-init.js) ---------- */
  window.SiteTheme.syncControls();

  /* ---------- Mobile menu ---------- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-menu-toggle]');
    if (!btn) return;
    const panel = document.getElementById('mobile-nav');
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('hidden', !open);
    btn.querySelector('[data-menu-icon="open"]').classList.toggle('hidden', open);
    btn.querySelector('[data-menu-icon="close"]').classList.toggle('hidden', !open);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const btn = document.querySelector('[data-menu-toggle][aria-expanded="true"]');
    if (btn) { btn.click(); btn.focus(); }
  });

  /* ---------- Hero demo: an agent handling a real conversation ---------- */
  const demo = document.querySelector('[data-demo]');
  if (demo) {
    const scenarios = [
      {
        business: 'Saffron Grill',
        place: 'Restaurant in Toronto',
        messages: [
          ['customer', 'Hi! 2 butter chicken and 4 garlic naan, delivery to 88 King St W please.'],
          ['agent', 'Got it. 2 × butter chicken $37.98, 4 × garlic naan $15.96, delivery $4.99. Total $58.93. Card on delivery or pay online?'],
          ['customer', 'Online'],
          ['agent', 'Here’s your payment link: pay.example/K42X. Order #1042 goes to the kitchen as soon as it’s paid, about 35 minutes to you.'],
        ],
        log: ['Order #1042 created in the POS', 'Ticket sent to the kitchen screen', 'Rider assigned and customer notified'],
      },
      {
        business: 'Smile Dental Clinic',
        place: 'Dental clinic in Dubai',
        messages: [
          ['customer', 'Hi, can I book a cleaning with Dr. Sara this week?'],
          ['agent', 'Dr. Sara has Thursday at 4:30 pm or Saturday at 11:00 am free. Which suits you?'],
          ['customer', 'Saturday 11 please'],
          ['agent', 'Booked: scale and polish, Saturday 11:00 am with Dr. Sara. I’ll send you a reminder the evening before.'],
        ],
        log: ['Slot held in the clinic calendar', 'Matched to existing patient record', 'Reminder scheduled for Friday 7 pm'],
      },
      {
        business: 'The Corner Bakery',
        place: 'Bakery in Manchester',
        messages: [
          ['customer', 'Do you have the 8 inch chocolate cake for pickup tomorrow?'],
          ['agent', 'Yes, 3 left for tomorrow at £28. Pickup is from 9 am. Shall I reserve one? Just tell me a name.'],
          ['customer', 'Yes please, Emma'],
          ['agent', 'Reserved for Emma, pickup tomorrow from 9 am. Here’s your payment link: pay.example/7KQ2'],
        ],
        log: ['Stock reserved, 2 left for tomorrow', 'Payment link sent', 'Added to tomorrow’s pickup list'],
      },
      {
        // Process automation: the manager talks to an internal agent, not a customer
        business: 'Northline Pharmacy',
        place: 'Back-office agent, 3 branches',
        messages: [
          ['customer', 'MedCo’s invoice just came in by email. Anything I should know?'],
          ['agent', 'Read and checked: 48 items, $3,420, all match purchase order #318. Two prices went up since last time: gauze +12%, amoxicillin +8%.'],
          ['customer', 'Approve it and flag those two for the owner.'],
          ['agent', 'Done. Stock is updated in all 3 branches, payment is scheduled for Friday, and both price rises are in tomorrow’s owner report.'],
        ],
        log: ['Invoice matched to purchase order #318', 'Stock updated for 48 items', 'Payment scheduled, owner report updated'],
      },
    ];

    const chat = demo.querySelector('[data-demo-chat]');
    const logList = demo.querySelector('[data-demo-log]');
    const nameEl = demo.querySelector('[data-demo-business]');
    const placeEl = demo.querySelector('[data-demo-place]');
    const buttons = Array.from(document.querySelectorAll('[data-scenario]'));

    let current = 0;
    let runId = 0;
    let visible = true;

    const wait = ms => new Promise(r => setTimeout(r, ms));
    async function waitVisible() { while (!visible || document.hidden) await wait(400); }

    function bubble(role, text, animate) {
      const el = document.createElement('div');
      el.className = 'bubble ' + (role === 'customer' ? 'bubble-customer' : 'bubble-agent') + (animate ? ' bubble-in' : '');
      el.textContent = text;
      chat.appendChild(el);
      return el;
    }
    function typing(role) {
      const el = document.createElement('div');
      el.className = 'bubble typing ' + (role === 'customer' ? 'bubble-customer' : 'bubble-agent');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<span></span><span></span><span></span>';
      chat.appendChild(el);
      return el;
    }
    function setup(i) {
      const s = scenarios[i];
      nameEl.textContent = s.business;
      placeEl.textContent = s.place;
      chat.innerHTML = '';
      logList.innerHTML = s.log.map(t => `
        <li class="log-item flex items-start gap-2.5">
          <svg class="log-check mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="currentColor"/><path d="M4.8 8.2l2.1 2.1 4.3-4.6" fill="none" stroke="var(--surface)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>${t}</span>
        </li>`).join('');
      buttons.forEach((b, bi) => b.setAttribute('aria-pressed', String(bi === i)));
    }
    function showStatic(i) {
      setup(i);
      scenarios[i].messages.forEach(([role, text]) => bubble(role, text, false));
      logList.querySelectorAll('.log-item').forEach(li => li.classList.add('is-done'));
    }

    async function play(i) {
      const id = ++runId;
      current = i;
      setup(i);
      const s = scenarios[i];
      const logs = logList.querySelectorAll('.log-item');
      await wait(500);
      for (let m = 0; m < s.messages.length; m++) {
        await waitVisible();
        if (id !== runId) return;
        const [role, text] = s.messages[m];
        const t = typing(role);
        await wait(role === 'agent' ? 1100 : 750);
        if (id !== runId) return;
        t.remove();
        bubble(role, text, true);
        if (role === 'agent' && m >= 1) {
          const idx = m === s.messages.length - 1 ? [1, 2] : [0];
          for (const k of idx) { await wait(380); if (id !== runId) return; logs[k] && logs[k].classList.add('is-done'); }
        }
        await wait(role === 'agent' ? 1300 : 600);
      }
      await wait(4200);
      await waitVisible();
      if (id !== runId) return;
      play((i + 1) % scenarios.length);
    }

    buttons.forEach((b, bi) => b.addEventListener('click', () => {
      if (reduceMotion) { runId++; showStatic(bi); } else { play(bi); }
    }));

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(demo);
    }

    if (reduceMotion) showStatic(0); else play(0);
  }

  /* ---------- Hero background: ribbons of fine flowing lines ----------
   * Fills the empty <svg data-ribbon> elements in the hero. Each line is two
   * gentle sine waves added together; the phase shifts a little from line to
   * line, which turns the set into a twisting ribbon. The 2880-wide path holds
   * the same 1440-wide shape twice, so the CSS drift by -50% loops seamlessly.
   * Styling and motion are in theme.css (.hero-lines).
   */
  const ribbons = {
    //   lines, first y, spacing, big wave, small wave, phases (start, step) ×2, big wave growth per line
    a: { n: 9, base: 120, gap: 13, a1: 70, a2: 18, p1: 0,   dp1: 0.16,  p2: 1,   dp2: 0.1,  da: 3 },
    b: { n: 6, base: 180, gap: 16, a1: 55, a2: 22, p1: 2.4, dp1: -0.12, p2: 0.3, dp2: 0.14, da: -2 },
  };
  document.querySelectorAll('svg[data-ribbon]').forEach(svg => {
    const r = ribbons[svg.dataset.ribbon];
    if (!r) return;
    let paths = '';
    for (let k = 0; k < r.n; k++) {
      let d = '';
      for (let x = 0; x <= 2880; x += 30) {
        const t = (2 * Math.PI * x) / 1440;
        const y = r.base + k * r.gap
          + (r.a1 + k * r.da) * Math.sin(t + r.p1 + k * r.dp1)
          + r.a2 * Math.sin(2 * t + r.p2 + k * r.dp2);
        d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
      }
      paths += `<path d="${d}"/>`;
    }
    svg.innerHTML = paths;
  });

  /* ---------- Tabs with a sliding indicator ---------- */
  document.querySelectorAll('[data-tabs]').forEach(tabs => {
    const track = tabs.querySelector('.tabs-track');
    const indicator = tabs.querySelector('.tabs-indicator');
    const btns = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const panels = btns.map(b => document.getElementById(b.getAttribute('aria-controls')));

    function moveIndicator(btn) {
      indicator.style.width = btn.offsetWidth + 'px';
      indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
    }
    function select(i, focus) {
      btns.forEach((b, bi) => {
        const on = bi === i;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        panels[bi].hidden = !on;
        if (on) {
          panels[bi].classList.remove('is-entering');
          void panels[bi].offsetWidth;
          panels[bi].classList.add('is-entering');
        }
      });
      moveIndicator(btns[i]);
      if (focus) btns[i].focus();
      btns[i].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(i));
      b.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % btns.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + btns.length) % btns.length, true); }
      });
    });
    const start = Math.max(0, btns.findIndex(b => b.getAttribute('aria-selected') === 'true'));
    indicator.style.transition = 'none';
    moveIndicator(btns[start]);
    requestAnimationFrame(() => { indicator.style.transition = ''; });
    window.addEventListener('resize', () => moveIndicator(btns.find(b => b.getAttribute('aria-selected') === 'true')));
    if (document.fonts) document.fonts.ready.then(() => moveIndicator(btns.find(b => b.getAttribute('aria-selected') === 'true')));
  });

  /* ---------- World clocks ---------- */
  const clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    function tick() {
      const now = new Date();
      clocks.forEach(el => {
        const tz = el.dataset.clock;
        el.querySelector('[data-time]').textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(now);
        const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: tz }).format(now));
        const state = el.querySelector('[data-state]');
        if (state) {
          if (el.hasAttribute('data-team')) {
            // Our team: online 06:00 to 18:00 UTC, Monday to Saturday (keep in step with SITE.hours)
            const online = now.getUTCDay() !== 0 && hour >= 6 && hour < 18;
            state.textContent = online ? 'Online now' : 'Back at 06:00 UTC';
            state.classList.toggle('text-brand-ink', online);
          } else {
            const working = hour >= 9 && hour < 18;
            state.textContent = working ? 'Working hours' : 'After hours';
            state.classList.toggle('text-brand-ink', working);
          }
        }
      });
    }
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Projects showcase (data lives in assets/js/projects.js) ----------
   * [data-projects="featured"]  home page, first 3 projects with featured: true
   * [data-projects="all"]       work.html, every project, with [data-project-filter] buttons
   * [data-project-detail]       project.html?id=...
   * A wrapping [data-projects-section] is hidden when there is nothing to show.
   */
  const projects = (window.PROJECTS || []).filter(p => p && p.id && p.title);
  const TYPE_LABELS = { system: 'Management system', agent: 'AI agent', automation: 'Process automation', rescue: 'Takeover and fix' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const projectUrl = p => 'project.html?id=' + encodeURIComponent(p.id);
  const metaTags = p => [TYPE_LABELS[p.type] || 'Software', p.industry, p.country]
    .filter(Boolean).map(t => `<span class="tag">${esc(t)}</span>`).join('');

  function projectCard(p) {
    const soon = p.status !== 'live';
    return `
      <a href="${projectUrl(p)}" class="project group block" data-type="${esc(p.type)}">
        <div class="zoom relative">
          <img class="photo project-img w-full" src="${esc(p.cover)}" alt="${esc(p.coverAlt || p.title)}" loading="lazy">
          ${soon ? '<span class="project-badge tag">Case study coming soon</span>' : ''}
        </div>
        <div class="mt-5 flex flex-wrap gap-2">${metaTags(p)}</div>
        <h3 class="mt-3 flex items-start gap-2 text-xl font-semibold tracking-tight sm:text-2xl">${esc(p.title)}<i data-lucide="arrow-up-right" class="mt-1 h-5 w-5 shrink-0 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"></i></h3>
        <p class="mt-2 max-w-xl leading-relaxed text-muted">${esc(p.summary)}</p>
      </a>`;
  }

  document.querySelectorAll('[data-projects]').forEach(list => {
    const featuredOnly = list.dataset.projects === 'featured';
    const items = featuredOnly ? projects.filter(p => p.featured).slice(0, 3) : projects;
    const section = list.closest('[data-projects-section]');
    if (!items.length) { if (section) section.hidden = true; return; }
    list.innerHTML = items.map(projectCard).join('');
  });

  const filterBtns = Array.from(document.querySelectorAll('[data-project-filter]'));
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const type = btn.dataset.projectFilter;
    filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    let shown = 0;
    document.querySelectorAll('[data-projects="all"] .project').forEach(card => {
      const on = type === 'all' || card.dataset.type === type;
      card.hidden = !on;
      if (on) shown++;
    });
    const empty = document.querySelector('[data-projects-empty]');
    if (empty) empty.hidden = shown > 0;
  }));

  const detail = document.querySelector('[data-project-detail]');
  if (detail) {
    const id = new URLSearchParams(location.search).get('id');
    const p = projects.find(x => x.id === id);
    if (!p) {
      detail.innerHTML = `
        <h1 class="display max-w-3xl">We couldn't find that project.</h1>
        <p class="lede mt-6">It may have been renamed. Have a look at the rest of our work.</p>
        <a href="work.html" class="btn btn-primary mt-9">See all projects</a>`;
    } else {
      document.title = `${p.title} | ${site.name || 'Our work'}`;
      const soon = p.status !== 'live';
      const list = (title, arr) => arr && arr.length ? `
        <div>
          <h2 class="text-lg font-semibold">${title}</h2>
          <ul class="rows mt-4">${arr.map(x => `<li class="flex gap-3 py-3"><i data-lucide="check" class="mt-0.5 h-5 w-5 shrink-0 text-brand"></i><span>${esc(x)}</span></li>`).join('')}</ul>
        </div>` : '';
      const para = (title, text) => text ? `<div><h2 class="text-lg font-semibold">${title}</h2><p class="mt-3 leading-relaxed text-muted">${esc(text)}</p></div>` : '';
      const facts = [['Client', p.client], ['Industry', p.industry], ['Country', p.country], ['Year', p.year], ['Built with', (p.stack || []).join(', ')]]
        .filter(([, v]) => v).map(([k, v]) => `<div><dt class="text-sm text-muted">${k}</dt><dd class="mt-1 font-medium">${esc(v)}</dd></div>`).join('');

      detail.innerHTML = `
        <a href="work.html" class="link text-sm font-medium">All projects</a>
        <div class="mt-6 flex flex-wrap gap-2">${metaTags(p)}</div>
        <h1 class="display mt-5 max-w-5xl">${esc(p.title)}</h1>
        <p class="lede mt-7">${esc(p.summary)}</p>
        <div class="zoom relative mt-12">
          <img class="photo aspect-[16/9] w-full sm:aspect-[21/9]" src="${esc(p.cover)}" alt="${esc(p.coverAlt || p.title)}">
        </div>
        <div class="mt-14 grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            ${facts ? `<dl class="grid grid-cols-2 gap-6 lg:grid-cols-1">${facts}</dl>` : ''}
            ${p.link ? `<a href="${esc(p.link)}" class="btn btn-ghost mt-8" target="_blank" rel="noopener">Visit the live project</a>` : ''}
          </div>
          <div class="grid gap-12">
            ${soon ? `<div class="rounded-[var(--radius-lg)] border border-line bg-sunken p-6 sm:p-8">
                <h2 class="text-lg font-semibold">The full case study is on its way</h2>
                <p class="mt-2 leading-relaxed text-muted">We're writing this one up. Want to see something similar working? We'll walk you through a live demo on a free call.</p>
                <a href="contact.html" class="btn btn-primary mt-6">Book a free call</a>
              </div>` : ''}
            ${para('The problem', p.problem)}
            ${para('What we built', p.solution)}
            ${list('What it does', p.features)}
            ${list('Results', p.results)}
            ${p.quote && p.quote.text ? `<figure class="border-l-2 border-brand pl-6"><blockquote class="text-xl font-medium leading-relaxed">“${esc(p.quote.text)}”</blockquote><figcaption class="mt-3 text-sm text-muted">${esc(p.quote.name)}${p.quote.role ? ', ' + esc(p.quote.role) : ''}</figcaption></figure>` : ''}
          </div>
        </div>
        ${p.gallery && p.gallery.length ? `<div class="mt-16 grid gap-6 sm:grid-cols-2">${p.gallery.map(g => `<div class="zoom"><img class="photo aspect-[4/3] w-full" src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></div>`).join('')}</div>` : ''}`;
    }
  }
  renderIcons();

  /* ---------- Photo strip: clone the items so the marquee loops seamlessly ---------- */
  document.querySelectorAll('[data-photo-strip]').forEach(track => {
    Array.from(track.children).forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(img => { img.alt = ''; });
      track.appendChild(clone);
    });
  });

  /* ---------- Photos wipe into view as they scroll in (images only, never text) ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('reveal-on');
    // Observe each photo's parent: a fully clipped image counts as invisible
    // to IntersectionObserver, so watching the image itself would never fire.
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll(':scope > img.photo').forEach(img => img.classList.add('is-in'));
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    const parents = new Set();
    document.querySelectorAll('img.photo').forEach(img => img.parentElement && parents.add(img.parentElement));
    parents.forEach(el => io.observe(el));
  }

  /* ---------- Contact form (no backend yet: opens email or WhatsApp) ---------- */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('[data-form-status]');

    function collect() {
      const data = Object.fromEntries(new FormData(form).entries());
      let ok = true;
      form.querySelectorAll('[required]').forEach(f => {
        const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        f.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) {
        status.textContent = 'Fill in your name, a valid email and a short description so we can reply.';
        return null;
      }
      return data;
    }
    function body(d) {
      return [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        d.company && `Company: ${d.company}`,
        d.country && `Country: ${d.country}`,
        `Looking for: ${d.need}`,
        d.budget && `Budget: ${d.budget}`,
        '',
        d.message,
      ].filter(Boolean).join('\n');
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = collect();
      if (!d) return;
      const subject = `New project: ${d.need} — ${d.company || d.name}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body(d))}`;
      status.textContent = `Your email app should open with the message filled in. If it doesn't, write to ${site.email}.`;
    });

    const wa = form.querySelector('[data-send-whatsapp]');
    if (wa) wa.addEventListener('click', () => {
      const d = collect();
      if (!d) return;
      window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body(d))}`, '_blank', 'noopener');
      status.textContent = 'WhatsApp opened in a new tab with your message ready to send.';
    });

    form.querySelectorAll('[required]').forEach(f => f.addEventListener('input', () => f.removeAttribute('aria-invalid')));
  }
})();
