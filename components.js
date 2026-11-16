// components.js — loads header.html and footer.html into placeholders
(function () {
  var THEME_KEY = 'nexa-theme';

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

  function applyStoredOrSystemTheme() {
    var html = document.documentElement;
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}

    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = (stored === 'dark' || stored === 'light') ? stored : (prefersDark ? 'dark' : 'light');

    html.setAttribute('data-theme', theme);
    html.classList.toggle('dark', theme === 'dark');
  }

  applyStoredOrSystemTheme();

  document.addEventListener('DOMContentLoaded', function () {
    loadComponent('header.html', 'header-placeholder', initHeader);
    loadComponent('footer.html', 'footer-placeholder', initFooter);
    initReveal();
    initBentoGlow();
  });

  function initHeader() {
    var html = document.documentElement;
    
    // 1. Theme Toggle
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        html.classList.toggle('dark', next === 'dark');
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      });
    }

    // 2. Mobile Menu Toggle
    var mobileBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', function () {
        var isOpen = mobileMenu.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen) mobileMenu.scrollTop = 0;
      });
      
      mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // 3. Scroll Header Border
    var header = document.getElementById('site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }, { passive: true });
    }
  }

  function initFooter() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

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