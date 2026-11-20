
/*
 * main.js — shared behaviour for every page.
 *
 * Central configuration: assets/js/config.js
 *
 * Features:
 * - Dynamic company information
 * - Dynamic contact details
 * - Dynamic social media links
 * - Dynamic navigation
 * - WhatsApp links
 * - Lucide icons
 * - Theme controls
 * - Mobile menu
 * - Hero conversation demo
 * - Animated hero ribbons
 * - Tabs
 * - World clocks
 * - Projects showcase
 * - Photo animations
 * - Contact forms
 *
 * Each feature only runs when its markup exists.
 */

(function () {

  'use strict';

  const root = document.documentElement;
  const site = window.SITE || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* =====================================================
     1. DYNAMIC WEBSITE CONFIGURATION
  ===================================================== */

  // Basic text values
  document.querySelectorAll('[data-site]').forEach(el => {

    const key = el.dataset.site;
    const value = site[key];

    if (value == null) return;

    el.textContent = Array.isArray(value)
      ? value.join(', ')
      : value;

    if (el.tagName === 'A') {

      if (key === 'email') {
        el.href = 'mailto:' + value;
      }

      if (key === 'phone') {
        el.href = 'tel:' + String(value).replace(/[^\d+]/g, '');
      }

    }

  });


  // Dynamic city list
  document.querySelectorAll('[data-site-cities]').forEach(el => {

    const cities = site.cities || [];

    el.textContent = cities.join(' · ');

  });


  // Social media links
  document.querySelectorAll('[data-social]').forEach(el => {

    const platform = el.dataset.social;
    const url = site.social && site.social[platform];

    if (!url) return;

    el.href = url;

    if (el.target === '_blank') {
      el.rel = 'noopener noreferrer';
    }

  });


  // WhatsApp links
  document.querySelectorAll('[data-whatsapp-link]').forEach(el => {

    if (!site.whatsapp) return;

    el.href = 'https://wa.me/' + String(site.whatsapp).replace(/\D/g, '');

    if (el.tagName === 'A' && el.target === '_blank') {
      el.rel = 'noopener noreferrer';
    }

  });



  function escapeHTML(value) {

    return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);

  }


  /* =====================================================
     2. LUCIDE ICONS
  ===================================================== */

  function renderIcons() {

    if (window.lucide) {

      window.lucide.createIcons({
        attrs: {
          'stroke-width': 1.75
        }
      });

    }

  }

  renderIcons();


  /* =====================================================
     3. THEME CONTROLS
  ===================================================== */

  if (window.SiteTheme && typeof window.SiteTheme.syncControls === 'function') {
    window.SiteTheme.syncControls();
  }


  /* =====================================================
     4. MOBILE MENU
  ===================================================== */

  /* =====================================================
     MOBILE MENU
  ===================================================== */

  document.addEventListener('click', e => {

    const btn = e.target.closest('#hamburger-btn');
    const mobileLink = e.target.closest('#mobile-menu .mobile-link');

    const panel = document.getElementById('mobile-menu');

    if (!panel) return;

    if (btn) {

      const open = btn.getAttribute('aria-expanded') !== 'true';

      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

      panel.classList.toggle('hidden', !open);
      panel.classList.toggle('is-open', open);

    }

    if (mobileLink) {

      panel.classList.remove('is-open');
      panel.classList.add('hidden');

      const menuBtn = document.getElementById('hamburger-btn');

      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Menu');
      }

    }

  });


  document.addEventListener('keydown', e => {

    if (e.key !== 'Escape') return;

    const btn = document.getElementById('hamburger-btn');
    const panel = document.getElementById('mobile-menu');

    if (btn && panel) {

      panel.classList.remove('is-open');
      panel.classList.add('hidden');

      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Menu');

      btn.focus();

    }

  });




  /* =====================================================
     5. HERO DEMO
  ===================================================== */

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
          ['agent', 'Here’s your payment link: pay.example/K42X. Order #1042 goes to the kitchen as soon as it’s paid, about 35 minutes to you.']
        ],

        log: [
          'Order #1042 created in the POS',
          'Ticket sent to the kitchen screen',
          'Rider assigned and customer notified'
        ]
      },

      {
        business: 'Smile Dental Clinic',
        place: 'Dental clinic in Dubai',

        messages: [
          ['customer', 'Hi, can I book a cleaning with Dr. Sara this week?'],
          ['agent', 'Dr. Sara has Thursday at 4:30 pm or Saturday at 11:00 am free. Which suits you?'],
          ['customer', 'Saturday 11 please'],
          ['agent', 'Booked: scale and polish, Saturday 11:00 am with Dr. Sara. I’ll send you a reminder the evening before.']
        ],

        log: [
          'Slot held in the clinic calendar',
          'Matched to existing patient record',
          'Reminder scheduled for Friday 7 pm'
        ]
      },

      {
        business: 'The Corner Bakery',
        place: 'Bakery in Manchester',

        messages: [
          ['customer', 'Do you have the 8 inch chocolate cake for pickup tomorrow?'],
          ['agent', 'Yes, 3 left for tomorrow at £28. Pickup is from 9 am. Shall I reserve one? Just tell me a name.'],
          ['customer', 'Yes please, Emma'],
          ['agent', 'Reserved for Emma, pickup tomorrow from 9 am. Here’s your payment link: pay.example/7KQ2']
        ],

        log: [
          'Stock reserved, 2 left for tomorrow',
          'Payment link sent',
          'Added to tomorrow’s pickup list'
        ]
      },

      {
        business: 'Northline Pharmacy',
        place: 'Back-office agent, 3 branches',

        messages: [
          ['customer', 'MedCo’s invoice just came in by email. Anything I should know?'],
          ['agent', 'Read and checked: 48 items, $3,420, all match purchase order #318. Two prices went up since last time: gauze +12%, amoxicillin +8%.'],
          ['customer', 'Approve it and flag those two for the owner.'],
          ['agent', 'Done. Stock is updated in all 3 branches, payment is scheduled for Friday, and both price rises are in tomorrow’s owner report.']
        ],

        log: [
          'Invoice matched to purchase order #318',
          'Stock updated for 48 items',
          'Payment scheduled, owner report updated'
        ]
      }

    ];


    const chat = demo.querySelector('[data-demo-chat]');
    const logList = demo.querySelector('[data-demo-log]');
    const nameEl = demo.querySelector('[data-demo-business]');
    const placeEl = demo.querySelector('[data-demo-place]');
    const buttons = Array.from(document.querySelectorAll('[data-scenario]'));

    if (chat && logList && nameEl && placeEl) {

      let runId = 0;
      let visible = true;

      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

      async function waitVisible() {

        while (!visible || document.hidden) {
          await wait(400);
        }

      }


      function bubble(role, text, animate) {

        const el = document.createElement('div');

        el.className =
          'bubble ' +
          (role === 'customer' ? 'bubble-customer' : 'bubble-agent') +
          (animate ? ' bubble-in' : '');

        el.textContent = text;

        chat.appendChild(el);

        return el;

      }


      function typing(role) {

        const el = document.createElement('div');

        el.className =
          'bubble typing ' +
          (role === 'customer' ? 'bubble-customer' : 'bubble-agent');

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
                        <svg class="log-check mt-0.5 h-4 w-4 shrink-0"
                             viewBox="0 0 16 16"
                             aria-hidden="true">
                            <circle cx="8" cy="8" r="8" fill="currentColor"/>
                            <path d="M4.8 8.2l2.1 2.1 4.3-4.6"
                                  fill="none"
                                  stroke="var(--surface)"
                                  stroke-width="1.8"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                        <span>${escapeHTML(t)}</span>
                    </li>
                `).join('');

        buttons.forEach((b, bi) => {
          b.setAttribute('aria-pressed', String(bi === i));
        });

      }


      function showStatic(i) {

        setup(i);

        scenarios[i].messages.forEach(([role, text]) => {
          bubble(role, text, false);
        });

        logList.querySelectorAll('.log-item').forEach(li => {
          li.classList.add('is-done');
        });

      }


      async function play(i) {

        const id = ++runId;

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

            const indexes =
              m === s.messages.length - 1 ? [1, 2] : [0];

            for (const k of indexes) {

              await wait(380);

              if (id !== runId) return;

              if (logs[k]) logs[k].classList.add('is-done');

            }

          }

          await wait(role === 'agent' ? 1300 : 600);

        }

        await wait(4200);

        await waitVisible();

        if (id !== runId) return;

        play((i + 1) % scenarios.length);

      }


      buttons.forEach((b, bi) => {

        b.addEventListener('click', () => {

          if (reduceMotion) {
            runId++;
            showStatic(bi);
          } else {
            play(bi);
          }

        });

      });


      if ('IntersectionObserver' in window) {

        new IntersectionObserver(entries => {
          visible = entries[0].isIntersecting;
        }).observe(demo);

      }


      if (reduceMotion) {
        showStatic(0);
      } else {
        play(0);
      }

    }

  }


  /* =====================================================
     6. HERO BACKGROUND RIBBONS
  ===================================================== */

  const ribbons = {

    a: {
      n: 9,
      base: 120,
      gap: 13,
      a1: 70,
      a2: 18,
      p1: 0,
      dp1: 0.16,
      p2: 1,
      dp2: 0.1,
      da: 3
    },

    b: {
      n: 6,
      base: 180,
      gap: 16,
      a1: 55,
      a2: 22,
      p1: 2.4,
      dp1: -0.12,
      p2: 0.3,
      dp2: 0.14,
      da: -2
    }

  };


  document.querySelectorAll('svg[data-ribbon]').forEach(svg => {

    const r = ribbons[svg.dataset.ribbon];

    if (!r) return;

    let paths = '';

    for (let k = 0; k < r.n; k++) {

      let d = '';

      for (let x = 0; x <= 2880; x += 30) {

        const t = (2 * Math.PI * x) / 1440;

        const y =
          r.base +
          k * r.gap +
          (r.a1 + k * r.da) * Math.sin(t + r.p1 + k * r.dp1) +
          r.a2 * Math.sin(2 * t + r.p2 + k * r.dp2);

        d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);

      }

      paths += `<path d="${d}"/>`;

    }

    svg.innerHTML = paths;

  });


  /* =====================================================
     7. TABS WITH SLIDING INDICATOR
  ===================================================== */

  document.querySelectorAll('[data-tabs]').forEach(tabs => {

    const track = tabs.querySelector('.tabs-track');
    const indicator = tabs.querySelector('.tabs-indicator');

    const btns = Array.from(tabs.querySelectorAll('[role="tab"]'));

    if (!indicator || !btns.length) return;

    const panels = btns.map(b =>
      document.getElementById(b.getAttribute('aria-controls'))
    );

    if (panels.some(panel => !panel)) return;


    function moveIndicator(btn) {

      if (!btn) return;

      indicator.style.width = btn.offsetWidth + 'px';

      indicator.style.transform =
        `translateX(${btn.offsetLeft}px)`;

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

      btns[i].scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: reduceMotion ? 'auto' : 'smooth'
      });

    }


    btns.forEach((b, i) => {

      b.addEventListener('click', () => select(i));

      b.addEventListener('keydown', e => {

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          select((i + 1) % btns.length, true);
        }

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          select((i - 1 + btns.length) % btns.length, true);
        }

      });

    });


    const selected = btns.findIndex(
      b => b.getAttribute('aria-selected') === 'true'
    );

    const start = Math.max(0, selected);

    indicator.style.transition = 'none';

    moveIndicator(btns[start]);

    requestAnimationFrame(() => {
      indicator.style.transition = '';
    });


    window.addEventListener('resize', () => {

      moveIndicator(
        btns.find(b => b.getAttribute('aria-selected') === 'true')
      );

    });


    if (document.fonts) {

      document.fonts.ready.then(() => {

        moveIndicator(
          btns.find(b => b.getAttribute('aria-selected') === 'true')
        );

      });

    }

  });


  /* =====================================================
     8. WORLD CLOCKS
  ===================================================== */

  const clocks = document.querySelectorAll('[data-clock]');

  if (clocks.length) {

    function tick() {

      const now = new Date();

      clocks.forEach(el => {

        const tz = el.dataset.clock;

        const timeEl = el.querySelector('[data-time]');

        if (!timeEl) return;

        timeEl.textContent = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: tz
        }).format(now);


        const hour = Number(
          new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            hourCycle: 'h23',
            timeZone: tz
          }).format(now)
        );


        const state = el.querySelector('[data-state]');

        if (state) {

          if (el.hasAttribute('data-team')) {

            // Keep this synchronized with SITE.hours.
            const online =
              now.getUTCDay() !== 0 &&
              hour >= 6 &&
              hour < 18;

            state.textContent = online
              ? 'Online now'
              : 'Back at 06:00 UTC';

            state.classList.toggle('text-brand-ink', online);

          } else {

            const working = hour >= 9 && hour < 18;

            state.textContent = working
              ? 'Working hours'
              : 'After hours';

            state.classList.toggle('text-brand-ink', working);

          }

        }

      });

    }

    tick();

    setInterval(tick, 30000);

  }


  /* =====================================================
     9. PROJECTS SHOWCASE
  ===================================================== */

  const projects = (window.PROJECTS || []).filter(
    p => p && p.id && p.title
  );

  const TYPE_LABELS = {
    system: 'Management system',
    agent: 'AI agent',
    automation: 'Process automation',
    rescue: 'Takeover and fix'
  };


  const projectUrl = p =>
    'project.html?id=' + encodeURIComponent(p.id);


  const metaTags = p => [
    TYPE_LABELS[p.type] || 'Software',
    p.industry,
    p.country
  ]
    .filter(Boolean)
    .map(t => `<span class="tag">${escapeHTML(t)}</span>`)
    .join('');


  function projectCard(p) {

    const soon = p.status !== 'live';

    return `
            <a href="${projectUrl(p)}"
               class="project group block"
               data-type="${escapeHTML(p.type)}">

                <div class="zoom relative">

                    <img
                        class="photo project-img w-full"
                        src="${escapeHTML(p.cover)}"
                        alt="${escapeHTML(p.coverAlt || p.title)}"
                        loading="lazy">

                    ${soon
        ? '<span class="project-badge tag">Case study coming soon</span>'
        : ''
      }

                </div>

                <div class="mt-5 flex flex-wrap gap-2">
                    ${metaTags(p)}
                </div>

                <h3 class="mt-3 flex items-start gap-2 text-xl font-semibold tracking-tight sm:text-2xl">

                    ${escapeHTML(p.title)}

                    <i data-lucide="arrow-up-right"
                       class="mt-1 h-5 w-5 shrink-0 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"></i>

                </h3>

                <p class="mt-2 max-w-xl leading-relaxed text-muted">
                    ${escapeHTML(p.summary)}
                </p>

            </a>
        `;

  }


  document.querySelectorAll('[data-projects]').forEach(list => {

    const featuredOnly = list.dataset.projects === 'featured';

    const items = featuredOnly
      ? projects.filter(p => p.featured).slice(0, 3)
      : projects;

    const section = list.closest('[data-projects-section]');

    if (!items.length) {

      if (section) section.hidden = true;

      return;

    }

    list.innerHTML = items.map(projectCard).join('');

  });


  // Project filters
  const filterBtns = Array.from(
    document.querySelectorAll('[data-project-filter]')
  );

  filterBtns.forEach(btn => {

    btn.addEventListener('click', () => {

      const type = btn.dataset.projectFilter;

      filterBtns.forEach(b => {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      let shown = 0;

      document.querySelectorAll('[data-projects="all"] .project').forEach(card => {

        const on = type === 'all' || card.dataset.type === type;

        card.hidden = !on;

        if (on) shown++;

      });

      const empty = document.querySelector('[data-projects-empty]');

      if (empty) empty.hidden = shown > 0;

    });

  });


  // Individual project detail page
  const detail = document.querySelector('[data-project-detail]');

  if (detail) {

    const id = new URLSearchParams(location.search).get('id');

    const p = projects.find(x => x.id === id);

    if (!p) {

      detail.innerHTML = `
                <h1 class="display max-w-3xl">
                    We couldn't find that project.
                </h1>

                <p class="lede mt-6">
                    It may have been renamed. Have a look at the rest of our work.
                </p>

                <a href="work.html" class="btn btn-primary mt-9">
                    See all projects
                </a>
            `;

    } else {

      document.title = `${p.title} | ${site.name || 'Our work'}`;

      const soon = p.status !== 'live';


      const list = (title, arr) => {

        if (!arr || !arr.length) return '';

        return `
                    <div>

                        <h2 class="text-lg font-semibold">
                            ${title}
                        </h2>

                        <ul class="rows mt-4">

                            ${arr.map(x => `
                                <li class="flex gap-3 py-3">

                                    <i data-lucide="check"
                                       class="mt-0.5 h-5 w-5 shrink-0 text-brand"></i>

                                    <span>${escapeHTML(x)}</span>

                                </li>
                            `).join('')}

                        </ul>

                    </div>
                `;

      };


      const para = (title, text) => {

        if (!text) return '';

        return `
                    <div>

                        <h2 class="text-lg font-semibold">
                            ${title}
                        </h2>

                        <p class="mt-3 leading-relaxed text-muted">
                            ${escapeHTML(text)}
                        </p>

                    </div>
                `;

      };


      const facts = [
        ['Client', p.client],
        ['Industry', p.industry],
        ['Country', p.country],
        ['Year', p.year],
        ['Built with', (p.stack || []).join(', ')]
      ]
        .filter(([, v]) => v)
        .map(([k, v]) => `
                    <div>
                        <dt class="text-sm text-muted">${k}</dt>
                        <dd class="mt-1 font-medium">${escapeHTML(v)}</dd>
                    </div>
                `)
        .join('');


      detail.innerHTML = `

                <a href="work.html" class="link text-sm font-medium">
                    All projects
                </a>

                <div class="mt-6 flex flex-wrap gap-2">
                    ${metaTags(p)}
                </div>

                <h1 class="display mt-5 max-w-5xl">
                    ${escapeHTML(p.title)}
                </h1>

                <p class="lede mt-7">
                    ${escapeHTML(p.summary)}
                </p>

                <div class="zoom relative mt-12">

                    <img
                        class="photo aspect-[16/9] w-full sm:aspect-[21/9]"
                        src="${escapeHTML(p.cover)}"
                        alt="${escapeHTML(p.coverAlt || p.title)}">

                </div>

                <div class="mt-14 grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">

                    <div>

                        ${facts
          ? `<dl class="grid grid-cols-2 gap-6 lg:grid-cols-1">${facts}</dl>`
          : ''
        }

                        ${p.link
          ? `<a href="${escapeHTML(p.link)}" class="btn btn-ghost mt-8" target="_blank" rel="noopener noreferrer">Visit the live project</a>`
          : ''
        }

                    </div>

                    <div class="grid gap-12">

                        ${soon ? `

                            <div class="rounded-[var(--radius-lg)] border border-line bg-sunken p-6 sm:p-8">

                                <h2 class="text-lg font-semibold">
                                    The full case study is on its way
                                </h2>

                                <p class="mt-2 leading-relaxed text-muted">
                                    We're writing this one up. Want to see something similar working?
                                    We'll walk you through a live demo on a free call.
                                </p>

                                <a href="contact.html" class="btn btn-primary mt-6">
                                    Book a free call
                                </a>

                            </div>

                        ` : ''}

                        ${para('The problem', p.problem)}

                        ${para('What we built', p.solution)}

                        ${list('What it does', p.features)}

                        ${list('Results', p.results)}

                        ${p.quote && p.quote.text ? `

                            <figure class="border-l-2 border-brand pl-6">

                                <blockquote class="text-xl font-medium leading-relaxed">
                                    “${escapeHTML(p.quote.text)}”
                                </blockquote>

                                <figcaption class="mt-3 text-sm text-muted">
                                    ${escapeHTML(p.quote.name)}
                                    ${p.quote.role ? ', ' + escapeHTML(p.quote.role) : ''}
                                </figcaption>

                            </figure>

                        ` : ''}

                    </div>

                </div>

                ${p.gallery && p.gallery.length ? `

                    <div class="mt-16 grid gap-6 sm:grid-cols-2">

                        ${p.gallery.map(g => `

                            <div class="zoom">

                                <img
                                    class="photo aspect-[4/3] w-full"
                                    src="${escapeHTML(g.src)}"
                                    alt="${escapeHTML(g.alt)}"
                                    loading="lazy">

                            </div>

                        `).join('')}

                    </div>

                ` : ''}

            `;

    }

  }

  // Render icons created by project content
  renderIcons();


  /* =====================================================
     10. PHOTO STRIP
  ===================================================== */

  document.querySelectorAll('[data-photo-strip]').forEach(track => {

    Array.from(track.children).forEach(item => {

      const clone = item.cloneNode(true);

      clone.setAttribute('aria-hidden', 'true');

      clone.querySelectorAll('img').forEach(img => {
        img.alt = '';
      });

      track.appendChild(clone);

    });

  });


  /* =====================================================
     11. SCROLL PHOTO REVEAL
  ===================================================== */

  if (!reduceMotion && 'IntersectionObserver' in window) {

    root.classList.add('reveal-on');

    const io = new IntersectionObserver(entries => {

      entries.forEach(e => {

        if (!e.isIntersecting) return;

        e.target.querySelectorAll(':scope > img.photo').forEach(img => {
          img.classList.add('is-in');
        });

        io.unobserve(e.target);

      });

    }, {
      rootMargin: '0px 0px -8% 0px'
    });


    const parents = new Set();

    document.querySelectorAll('img.photo').forEach(img => {

      if (img.parentElement) {
        parents.add(img.parentElement);
      }

    });

    parents.forEach(el => io.observe(el));

  }


  /* =====================================================
     12. CONTACT FORMS
     
     Supports:
     A. Existing data-contact-form markup
     B. Contact page quote-request-form markup
     
     No backend: opens email or WhatsApp.
  ===================================================== */

  function setupContactForm(form) {

    if (form.dataset.initialized === 'true') return;

    form.dataset.initialized = 'true';

    const status =
      form.querySelector('[data-form-status]') ||
      document.getElementById('form-message');


    function showStatus(message, type) {

      if (!status) return;

      status.textContent = message;

      status.classList.add('show');

      status.classList.toggle('error', type === 'error');

    }


    function getValue(...names) {

      for (const name of names) {

        const field = form.elements.namedItem(name);

        if (field && field.value != null) {
          return field.value.trim();
        }

      }

      return '';

    }


    function collect() {

      if (!form.reportValidity()) return null;

      const data = {

        name: getValue('name'),

        email: getValue('email'),

        contact: getValue('contact'),

        company: getValue('company', 'business'),

        country: getValue('country'),

        need: getValue('need', 'type') || 'General enquiry',

        budget: getValue('budget'),

        message: getValue('message')

      };


      if (!data.name) {

        showStatus('Please enter your name.', 'error');

        return null;

      }


      if (!data.email && !data.contact) {

        showStatus('Please enter your email or WhatsApp number.', 'error');

        return null;

      }


      if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {

        showStatus('Please enter a valid email address.', 'error');

        return null;

      }


      return data;

    }


    function buildBody(d) {

      return [

        `Name: ${d.name}`,

        d.email && `Email: ${d.email}`,

        d.contact && `Email / WhatsApp: ${d.contact}`,

        d.company && `Business: ${d.company}`,

        d.country && `Country: ${d.country}`,

        `Service required: ${d.need}`,

        d.budget && `Budget: ${d.budget}`,

        '',

        'Project details:',

        d.message || 'No additional details provided.'

      ].filter(Boolean).join('\n');

    }


    // Email submission
    form.addEventListener('submit', e => {

      e.preventDefault();

      const d = collect();

      if (!d) return;

      if (!site.email) {

        showStatus('Company email is not configured yet.', 'error');

        return;

      }

      const subject =
        `New Project Enquiry - ${d.need}`;

      const mailto =
        'mailto:' + site.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(buildBody(d));

      window.location.href = mailto;

      showStatus(
        `Your email application should open with your enquiry ready. If it doesn't, email ${site.email}.`
      );

    });


    // WhatsApp submission
    const whatsappButton = form.querySelector('[data-send-whatsapp]');

    if (whatsappButton) {

      whatsappButton.addEventListener('click', () => {

        const d = collect();

        if (!d) return;

        if (!site.whatsapp) {

          showStatus('WhatsApp number is not configured yet.', 'error');

          return;

        }

        const number = String(site.whatsapp).replace(/\D/g, '');

        const url =
          'https://wa.me/' + number +
          '?text=' + encodeURIComponent(buildBody(d));

        window.open(url, '_blank', 'noopener,noreferrer');

        showStatus(
          'WhatsApp opened with your enquiry ready to send.'
        );

      });

    }

  }


  // Existing forms
  document.querySelectorAll('[data-contact-form]').forEach(setupContactForm);


  // Current Contact page form
  const quoteForm = document.getElementById('quote-request-form');

  if (quoteForm) {
    setupContactForm(quoteForm);
  }


  /* =====================================================
     13. FORM FIELD VALIDATION RESET
  ===================================================== */

  document.querySelectorAll(
    '[data-contact-form] [required], #quote-request-form [required]'
  ).forEach(field => {

    field.addEventListener('input', () => {
      field.removeAttribute('aria-invalid');
    });

  });




  function initializeFooter() {
    const footer = document.querySelector('#site-footer-slot footer, footer');

    if (!footer || footer.dataset.configInitialized === 'true') return;

    footer.dataset.configInitialized = 'true';

    // Company information
    footer.querySelectorAll('[data-site]').forEach(el => {
      const key = el.dataset.site;
      const value = site[key];

      if (value !== undefined && value !== null) {
        el.textContent = Array.isArray(value)
          ? value.join(', ')
          : value;
      }
    });

    // Email
    footer.querySelectorAll('[data-site-email]').forEach(el => {
      if (!site.email) return;

      el.href = `mailto:${site.email}`;
      el.textContent = site.email;
    });

    // Logo
    footer.querySelectorAll('[data-site-logo]').forEach(img => {
      if (site.logo) img.src = site.logo;
    });

    // Cities
    footer.querySelectorAll('[data-site-cities]').forEach(el => {
      el.textContent = (site.cities || []).join(' · ');
    });

    // Social media
    footer.querySelectorAll('[data-social]').forEach(el => {
      const url = site.social?.[el.dataset.social];

      if (url) {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });

    // Software and company links
    ['software', 'company'].forEach(section => {
      const list = footer.querySelector(
        `[data-footer-list="${section}"]`
      );

      const items = site.footer?.[section];

      if (!list || !Array.isArray(items)) return;

      list.innerHTML = items.map(item => `
      <li>
        <a href="${escapeHTML(item.href)}" class="f-link">
          ${escapeHTML(item.label)}
        </a>
      </li>
    `).join('');
    });

    // Response time
    const response = footer.querySelector('[data-site="responseTime"]');

    if (response && site.responseTime) {
      response.textContent = site.responseTime;
    }

    // Service areas
    const areas = footer.querySelector('[data-footer-service-areas]');

    if (areas) {
      areas.textContent = (site.serviceAreas || []).join(' • ');
    }

    // Footer tagline
    const tagline = footer.querySelector('[data-site-footer-tagline]');

    if (tagline && site.footer?.tagline) {
      tagline.textContent = site.footer.tagline;
    }

    // Current year
    footer.querySelectorAll('#footer-year, [data-current-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  // Run immediately if footer already exists
  initializeFooter();

  // Also detect footer when it is injected later
  const footerObserver = new MutationObserver(() => {
    initializeFooter();
  });

  footerObserver.observe(document.body, {
    childList: true,
    subtree: true
  });



  /* ---------- Dynamic Header ---------- */

  /* =====================================================
     DYNAMIC HEADER
  ===================================================== */

  /* =====================================================
     DYNAMIC HEADER
  ===================================================== */

  function initializeHeader() {

    const header = document.querySelector('#site-header');

    // Header has not been injected yet
    if (!header) return;

    // Prevent duplicate initialization
    if (header.dataset.configInitialized === 'true') return;

    const desktopNav = header.querySelector('[data-site-nav]');
    const mobileNav = document.querySelector('[data-site-mobile-nav]');

    const navItems = Array.isArray(site.nav) ? site.nav : [];

    // Check whether navigation containers exist
    if (!desktopNav) {
      console.error('Header error: [data-site-nav] not found.');
      return;
    }

    // Mark initialized
    header.dataset.configInitialized = 'true';

    // Logo
    header.querySelectorAll('[data-site-logo]').forEach(img => {
      if (site.logo) img.src = site.logo;
    });

    // Brand name
    header.querySelectorAll('[data-site="shortName"]').forEach(el => {
      el.textContent = site.shortName || 'SoftVentures';
    });

    // Current page
    const currentPage = (
      window.location.pathname.split('/').pop() || 'index.html'
    ).replace('.html', '');

    // Generate links
    function createNavLink(item, mobile = false) {

      const href = item.href || '#';
      const page = href.split('/').pop().split('#')[0].replace('.html', '');
      const active = page === currentPage;

      return `
      <a
        href="${escapeHTML(href)}"
        class="${mobile ? 'mobile-link' : 'nav-link'} ${active ? 'active' : ''}"
        data-nav="${escapeHTML(item.id)}"
        ${active ? 'aria-current="page"' : ''}
      >
        ${escapeHTML(item.label)}
      </a>
    `;
    }

    // Desktop navigation
    desktopNav.innerHTML = navItems
      .map(item => createNavLink(item))
      .join('');

    // Mobile navigation
    if (mobileNav) {
      mobileNav.innerHTML = navItems
        .map(item => createNavLink(item, true))
        .join('');
    }

    // CTA links
    const contactUrl =
      navItems.find(item => item.id === 'contact')?.href || 'contact.html';

    const cta = header.querySelector('[data-header-cta]');
    const mobileCta = document.querySelector('[data-header-mobile-cta]');

    if (cta) cta.href = contactUrl;
    if (mobileCta) mobileCta.href = contactUrl;

    console.log('SoftVentures navigation initialized:', navItems.length);
  }


  // Run immediately if header already exists
  initializeHeader();


  // Watch for asynchronously injected header
  const headerObserver = new MutationObserver(() => {
    initializeHeader();

    const header = document.querySelector('#site-header');

    if (header?.dataset.configInitialized === 'true') {
      headerObserver.disconnect();
    }
  });

  headerObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  initializeHeader();


  /* ---------- Contact page: dynamic config details ---------- */
  function initializeContactDetails() {
    const config = window.SITE || {};

    // Email
    document.querySelectorAll('[data-site-email]').forEach(el => {
      el.textContent = config.email || '';
    });

    document.querySelectorAll('[data-contact-email-link]').forEach(el => {
      el.href = config.email
        ? `mailto:${config.email}`
        : '#';
    });

    // Phone
    document.querySelectorAll('[data-contact-phone]').forEach(el => {
      el.textContent = config.phone || '';
    });

    document.querySelectorAll('[data-contact-phone-link]').forEach(el => {
      const phone = (config.phone || '').replace(/[^\d+]/g, '');
      el.href = phone ? `tel:${phone}` : '#';
    });

    // WhatsApp
    document.querySelectorAll('[data-contact-whatsapp]').forEach(el => {
      const whatsapp = (config.whatsapp || '').replace(/\D/g, '');

      el.href = whatsapp
        ? `https://wa.me/${whatsapp}`
        : '#';

      el.hidden = !whatsapp;
    });

    // Response time
    document.querySelectorAll('[data-contact-response]').forEach(el => {
      el.textContent = config.responseTime || 'Contact us for response times.';
    });

    // Service areas
    document.querySelectorAll('[data-contact-service-areas]').forEach(el => {
      el.textContent = Array.isArray(config.serviceAreas)
        ? config.serviceAreas.join(', ')
        : 'Worldwide';
    });
  }

  initializeContactDetails();

function getConfigValue(path) {
    if (!path || typeof path !== 'string') {
        console.warn('Invalid config path:', path);
        return '';
    }

    return path.split('.').reduce((obj, key) => {
        return obj != null ? obj[key] : undefined;
    }, window.SITE?.about) ?? '';
}


})();


/* SoftVentures - Common JS: loads header/footer on every page */
async function loadPart(id, file) {
  try { const r = await fetch(file); if (!r.ok) return; document.getElementById(id).innerHTML = await r.text(); } catch (e) { }
}
function initCommon() {
  // The shared pre-paint controller owns theme state and both toggle types.
  window.SiteTheme.syncControls();
  // header scroll + mobile menu
  const header = document.getElementById('site-header');
  if (header) window.addEventListener('scroll', () => { window.scrollY > 10 ? header.classList.add('scrolled') : header.classList.remove('scrolled'); });
  const hamburger = document.getElementById('hamburger-btn'); const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) { hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open')); mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open'))); }
  // active nav
  const page = document.body.dataset.page || 'index';
  document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === page) a.classList.add('active'); });
  if (window.lucide) lucide.createIcons();
  // reveal
  const reveals = document.querySelectorAll('.reveal'); const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } }) }, { threshold: .1 }); reveals.forEach(el => obs.observe(el));
  initMgmt();
}
const DATA = {
  retail: { kicker: "RETAIL • MOST POPULAR", title: "Shops, chains and wholesalers", desc: "Know what's on the shelf in every branch, what sold today and what to reorder — from your phone.", time: "⏱ Ready in 7 days", cta: "Retail", mock: "Retail System — Live Preview", s1: "1,284", s1l: "Sales today", s2: "7", s2l: "Low stock items", s3: "36", s3l: "Orders today", line: "New sale — Rs 4,200 • Branch 2", features: ["POS across all branches", "Stock, barcodes & alerts", "Supplier purchase orders", "Daily profit on WhatsApp", "Loyalty & online store sync", "Staff roles & permissions"] },
  clinic: { kicker: "CLINICS • HIGH DEMAND", title: "Clinics, hospitals, labs", desc: "Patient records, appointments and billing — so easy a new receptionist learns it in one afternoon.", time: "⏱ Ready in 7 days", cta: "Clinic", mock: "Clinic System — Live Preview", s1: "36", s1l: "Today's bookings", s2: "1,284", s2l: "Patients", s3: "Rs 84k", s3l: "Collected today", line: "Appointment booked — Ahmed, 4:30 PM", features: ["Patient records & history", "Appointments & queue", "Billing & insurance", "Pharmacy stock", "Lab reports", "WhatsApp reminders"] },
  school: { kicker: "SCHOOLS", title: "Schools and academies", desc: "Attendance, results and fees in one place — plus a parent app parents actually use.", time: "⏱ Ready in 7 days", cta: "School", mock: "School System — Live Preview", s1: "98%", s1l: "Attendance today", s2: "420", s2l: "Students", s3: "Rs 2.1L", s3l: "Fees collected", line: "Fee paid — Ayesha, Grade 8", features: ["Admissions & attendance", "Fee invoices & reminders", "Exams & report cards", "Parent app on WhatsApp", "Teacher timetable", "Transport & hostel"] },
  university: { kicker: "UNIVERSITIES", title: "Universities and colleges", desc: "From admission to transcript — with portals for students, faculty and admin.", time: "⏱ Ready in 14 days", cta: "University", mock: "University System — Live Preview", s1: "1,240", s1l: "Enrolled students", s2: "48", s2l: "Courses", s3: "96%", s3l: "On-time results", line: "Transcript issued — BS CS, 2024", features: ["Enrollment & admissions", "Course & timetable", "Grading & transcripts", "Student & faculty portals", "Finance & scholarships", "Hostel & library"] },
  restaurant: { kicker: "RESTAURANTS", title: "Restaurants, cafés, cloud kitchens", desc: "From order to kitchen to rider — one system, zero chaos during rush hour.", time: "⏱ Ready in 5 days", cta: "Restaurant", mock: "Restaurant System — Live Preview", s1: "128", s1l: "Orders today", s2: "12 min", s2l: "Avg. prep time", s3: "4.9 ★", s3l: "Customer rating", line: "New order — Table 4 • 2x Biryani", features: ["WhatsApp + dine-in orders", "Kitchen display screen", "Delivery & rider tracking", "Recipe costing & stock", "Table bookings", "Menu QR & payments"] },
  other: { kicker: "EVERYTHING ELSE", title: "If it runs on spreadsheets, it can be a system", desc: "Real estate, gyms, salons, logistics, manufacturing — tell us how work moves today, we systemise it.", time: "⏱ Custom — 7-14 days", cta: "Custom", mock: "Custom System — Live Preview", s1: "100%", s1l: "Your workflow", s2: "0", s2l: "Spreadsheets left", s3: "24/7", s3l: "AI automation", line: "Workflow automated — Invoice #1042 sent", features: ["Built around YOUR workflow", "Gyms, salons & hotels", "Logistics & manufacturing", "Real estate & property", "Custom reports", "AI automation included"] }
};
function initMgmt() {
  const feat = document.getElementById('mgmt-features'); if (!feat) return;
  const btns = document.querySelectorAll('[data-mgmt]');
  function setMgmt(key) {
    const d = DATA[key];
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('mgmt-kicker', d.kicker); set('mgmt-title', d.title); set('mgmt-desc', d.desc); set('mgmt-time', d.time); set('mgmt-cta', d.cta); set('mgmt-mock-title', d.mock);
    set('mgmt-stat1', d.s1); set('mgmt-stat1-label', d.s1l); set('mgmt-stat2', d.s2); set('mgmt-stat2-label', d.s2l); set('mgmt-stat3', d.s3); set('mgmt-stat3-label', d.s3l); set('mgmt-mock-line', d.line);
    feat.innerHTML = d.features.map(f => '<div class="feature"><span class="check">✓</span><span>' + f + '</span></div>').join('');
    btns.forEach(b => b.classList.toggle('active', b.dataset.mgmt === key));
  }
  feat.innerHTML = DATA.retail.features.map(f => '<div class="feature"><span class="check">✓</span><span>' + f + '</span></div>').join('');
  btns.forEach(b => b.addEventListener('click', () => setMgmt(b.dataset.mgmt)));
}

document.addEventListener('DOMContentLoaded', async () => {

    async function loadPart(id, file) {
        const slot = document.getElementById(id);

        if (!slot) {
            console.error(`SoftVentures: #${id} was not found.`);
            return false;
        }

        try {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`${file} returned HTTP ${response.status}`);
            }

            const html = await response.text();

            if (!html.trim()) {
                throw new Error(`${file} is empty.`);
            }

            slot.innerHTML = html;

            console.log(`SoftVentures: ${file} loaded successfully.`);

            return true;

        } catch (error) {
            console.error(`SoftVentures: Failed to load ${file}:`, error);
            return false;
        }
    }

    // Load shared components
    await loadPart('site-header-slot', 'header.html');
    await loadPart('site-footer-slot', 'footer.html');

    // Initialize shared functionality
    if (window.SiteTheme?.syncControls) {
        window.SiteTheme.syncControls();
    }

    // Active navigation
    const page = document.body.dataset.page || 'index';

    document.querySelectorAll('[data-nav]').forEach(link => {
        if (link.dataset.nav === page) {
            link.classList.add('active');
        }
    });

    // Header scroll effect
    const header = document.getElementById('site-header');

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    // Render icons
    if (window.lucide?.createIcons) {
        window.lucide.createIcons();
    }

    // Reveal animations
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(element => observer.observe(element));
    }

    // Management section
    if (typeof initMgmt === 'function') {
        initMgmt();
    }

});


