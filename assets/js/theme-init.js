/*
 * Runs before the page paints so there is no flash of the wrong theme.
 * Default is light. A saved choice ("light" / "dark") wins.
 */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved === 'dark') document.documentElement.classList.add('dark');
})();
