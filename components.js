// components.js — loads header.html and footer.html into placeholders
(function () {
  function loadComponent(url, placeholderId, callback) {
    var el = document.getElementById(placeholderId);
    if (!el) return;
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + url);
        return r.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        if (typeof callback === 'function') callback();
      })
      .catch(function (err) {
        console.warn(err);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadComponent('header.html', 'header-placeholder', initHeader);
    loadComponent('footer.html', 'footer-placeholder', initFooter);
    initReveal();
    initBentoGlow();
  });

  /* ---------- HEADER BEHAVIOUR ---------- */
  function initHeader() {
    var html = document.documentElement;
    var themeToggle = document.getElementById('theme-toggle');

    // Respect system preference on first load
    if (!html.hasAttribute('data-theme') || html.getAttribute('data-theme') === 'light') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
        html.classList.add('dark');
      }
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        html.classList.toggle('dark', next === 'dark');
      });
    }

    var header = document.getElementById('site-header');
    if (header) {
      var onScroll = function () {
        if (window.scrollY > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var mobileBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', function () {
        var open = mobileMenu.classList.toggle('open');
        document.body.style.overflow = open ? 'hidden' : '';
      });
      mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ---------- FOOTER BEHAVIOUR ---------- */
  function initFooter() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- SCROLL REVEAL ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- BENTO HOVER GLOW ---------- */
  function initBentoGlow() {
    document.querySelectorAll('.bento-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }
})();