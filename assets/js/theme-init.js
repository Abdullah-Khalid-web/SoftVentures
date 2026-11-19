/*
 * One theme controller for both the legacy and component-based pages.
 * Runs before paint. Default is light; a saved choice wins.
 */
(function () {
  const root = document.documentElement;
  const toggleSelector = '[data-theme-toggle], #theme-toggle';

  function syncControls() {
    const dark = root.classList.contains('dark');
    document.querySelectorAll(toggleSelector).forEach(button => {
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  function apply(theme) {
    const dark = theme === 'dark';
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    syncControls();
  }

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  apply(saved);

  // Delegation also handles the header fetched after DOMContentLoaded.
  document.addEventListener('click', event => {
    if (!event.target.closest(toggleSelector)) return;
    const theme = root.classList.contains('dark') ? 'light' : 'dark';
    apply(theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  });
  window.addEventListener('storage', event => {
    if (event.key === 'theme' || event.key === null) {
      let theme = null;
      try { theme = localStorage.getItem('theme'); } catch (e) {}
      apply(theme);
    }
  });
  document.addEventListener('DOMContentLoaded', syncControls);
  window.SiteTheme = { syncControls };
})();
