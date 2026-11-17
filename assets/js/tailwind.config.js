/*
 * Tailwind config (used by the Tailwind Play CDN in every page <head>).
 * Colours point at the CSS variables in assets/css/theme.css,
 * so change colours there, not here.
 */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        brand: 'var(--brand)',
        'brand-ink': 'var(--brand-ink)',
        'brand-soft': 'var(--brand-soft)',
        'on-brand': 'var(--on-brand)',
        surface: 'var(--surface)',
        sunken: 'var(--sunken)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        deep: 'var(--deep)',
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        // Width of the page container (`max-w-site`) on every page, header and footer included.
        // 100% = edge to edge, with only the px-5 / sm:px-8 side padding. Was 78rem (a centred column).
        site: '100%',
      },
    },
  },
};
