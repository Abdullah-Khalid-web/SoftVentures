/*
 * main.js — shared behaviour for every page.
 * Each feature only runs if its markup exists on the page.
 */
(function () {
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

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  function syncThemeLabel() {
    const dark = root.classList.contains('dark');
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }
  syncThemeLabel();
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const dark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (err) {}
    syncThemeLabel();
  });

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
        business: 'Karahi House',
        place: 'Restaurant in Karachi',
        messages: [
          ['customer', 'Salam, 2 chicken karahi (half) and 6 naan. Delivery to Gulshan Block 13.'],
          ['agent', 'Got it. 2 × chicken karahi (half) Rs 2,400, 6 × naan Rs 360, delivery Rs 150. Total Rs 2,910. Cash or card on delivery?'],
          ['customer', 'Cash'],
          ['agent', 'Confirmed, order #1042. Your rider will reach you in about 35 minutes.'],
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
          const working = hour >= 9 && hour < 18;
          state.textContent = working ? 'Working hours' : 'After hours';
          state.classList.toggle('text-brand-ink', working);
        }
      });
    }
    tick();
    setInterval(tick, 30000);
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
