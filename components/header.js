/*
 * <site-header></site-header>
 * Shared header for every page. The active link is taken from
 * <body data-page="..."> and matched against SITE.nav ids.
 */
(function () {
  const logo = `
    <svg class="h-8 w-8 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--brand)"/>
      <path d="M10.5 22V10.5l11 11V10" fill="none" stroke="var(--on-brand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const site = window.SITE || {};
      const page = document.body.dataset.page || '';
      const nav = site.nav || [];

      const desktopLinks = nav.map(item => `
        <a href="${item.href}" class="nav-link text-[0.95rem] text-muted transition-colors hover:text-ink"
           ${item.id === page ? 'aria-current="page"' : ''}>${item.label}</a>`).join('');

      const mobileLinks = nav.map(item => `
        <a href="${item.href}" class="block border-b border-line py-4 text-lg font-medium ${item.id === page ? 'text-brand-ink' : 'text-ink'}"
           ${item.id === page ? 'aria-current="page"' : ''}>${item.label}</a>`).join('');

      this.innerHTML = `
        <a href="#main" class="skip-link">Skip to content</a>
        <header class="site-header sticky top-0 z-40 border-b border-line">
          <div class="mx-auto flex h-[4.25rem] max-w-site items-center justify-between gap-6 px-5 sm:px-8">
            <a href="index.html" class="flex items-center gap-2.5 font-bold tracking-tight text-ink" aria-label="${site.name} home">
              ${logo}
              <span class="text-[1.05rem]">${site.shortName || site.name}</span>
            </a>

            <nav class="hidden items-center gap-8 lg:flex" aria-label="Main">
              ${desktopLinks}
            </nav>

            <div class="flex items-center gap-2">
              <button type="button" data-theme-toggle
                      class="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink"
                      aria-label="Switch to dark theme">
                <i data-lucide="moon" class="h-[18px] w-[18px] dark:hidden"></i>
                <i data-lucide="sun" class="hidden h-[18px] w-[18px] dark:block"></i>
              </button>
              <div class="hidden sm:block"><a href="contact.html" class="btn btn-primary btn-sm">Start a project</a></div>
              <button type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-nav"
                      class="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-sunken lg:hidden"
                      aria-label="Open menu">
                <i data-lucide="menu" class="h-5 w-5" data-menu-icon="open"></i>
                <i data-lucide="x" class="hidden h-5 w-5" data-menu-icon="close"></i>
              </button>
            </div>
          </div>

          <div id="mobile-nav" class="hidden border-t border-line bg-paper lg:hidden">
            <nav class="mx-auto max-w-site px-5 pb-6 sm:px-8" aria-label="Mobile">
              ${mobileLinks}
              <a href="contact.html" class="btn btn-primary mt-6 w-full">Start a project</a>
            </nav>
          </div>
        </header>`;
    }
  }

  customElements.define('site-header', SiteHeader);
})();
