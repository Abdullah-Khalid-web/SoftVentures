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
        // Edge to edge up to 1920px (only the side padding), then a centred column so
        // 2K/4K screens don't stretch lines and gaps out. Section backgrounds stay full width.
        site: 'var(--site-max-width)',
      },
    },
  },
};
