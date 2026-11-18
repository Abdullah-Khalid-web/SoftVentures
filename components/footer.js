/*
 * <site-footer></site-footer>
 * Shared footer for every page.
 * Add the attribute no-cta to hide the "Start a project" block
 * (used on the contact page): <site-footer no-cta></site-footer>
 */
(function () {
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const site = window.SITE || {};
      const year = new Date().getFullYear();
      const showCta = !this.hasAttribute('no-cta');

      const cta = showCta ? `
        <div class="mx-auto max-w-site px-5 pb-20 pt-6 sm:px-8">
          <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2 class="h2 max-w-2xl">Tell us what your business does by hand today. We'll show you what can run on its own.</h2>
            <div class="flex flex-col gap-4 lg:items-end">
              <p class="muted-deep max-w-sm lg:text-right">The first call is free and takes 30 minutes. You get a written proposal with a fixed quote within a week.</p>
              <div class="flex flex-wrap gap-3">
                <a href="contact.html" class="btn btn-on-deep">Start a project</a>
                <a href="https://wa.me/${site.whatsapp}" class="btn border border-white/25 text-[var(--on-deep)] hover:border-white/60" target="_blank" rel="noopener">Message on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>` : '';

      const col = (title, links) => `
        <div>
          <h3 class="text-sm font-semibold text-[var(--on-deep)]">${title}</h3>
          <ul class="mt-4 space-y-2.5 text-[0.95rem]">
            ${links.map(([label, href]) => `<li><a class="muted-deep transition-colors" href="${href}">${label}</a></li>`).join('')}
          </ul>
        </div>`;

      this.innerHTML = `
        <footer class="mt-24">
          <svg class="block h-[70px] w-full sm:h-[110px]" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
            <path class="wave-1" d="M0 92C160 70 320 118 480 102C640 86 800 44 960 62C1120 80 1280 122 1440 94V160H0Z"/>
            <path class="wave-2" d="M0 118C200 102 360 138 560 128C760 118 880 90 1080 100C1240 108 1340 134 1440 122V160H0Z"/>
            <path class="wave-3" d="M0 140C240 130 420 154 640 146C860 138 1040 126 1240 134C1340 138 1400 146 1440 142V160H0Z"/>
          </svg>
          <div class="footer-deep">
            ${cta}
            <div class="mx-auto max-w-site px-5 sm:px-8">
              <div class="line-deep grid gap-12 border-t py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
                <div class="max-w-xs">
                  <p class="text-lg font-bold">${site.name}</p>
                  <p class="muted-deep mt-3 leading-relaxed">Management systems, AI agents and long-term support for businesses in any country, built by PEC-registered engineers.</p>
                  <div class="mt-6 space-y-2 text-[0.95rem]">
                    <a class="muted-deep flex items-center gap-2" href="mailto:${site.email}"><i data-lucide="mail" class="h-4 w-4"></i>${site.email}</a>
                    <a class="muted-deep flex items-center gap-2" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener"><i data-lucide="message-circle" class="h-4 w-4"></i>${site.phone}</a>
                  </div>
                </div>
                ${col('What we build', [
                  ['AI agents', 'agents.html'],
                  ['Management systems', 'systems.html'],
                  ['Fix an issue', 'support.html#fix'],
                  ['Maintenance contracts', 'support.html#maintenance'],
                ])}
                ${col('Company', [
                  ['About', 'about.html'],
                  ['Our work', 'work.html'],
                  ['How we work', 'about.html#process'],
                  ['Contact', 'contact.html'],
                ])}
                ${col('Legal', [
                  ['Terms of service', 'terms.html'],
                  ['Privacy policy', 'privacy.html'],
                ])}
              </div>
              <div class="line-deep flex flex-col gap-3 border-t py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p class="muted-deep">&copy; ${year} ${site.legalName || site.name}. All rights reserved.</p>
                <div class="flex items-center gap-5">
                  <a class="muted-deep" href="${site.social?.linkedin || '#'}" target="_blank" rel="noopener">LinkedIn</a>
                  <a class="muted-deep" href="${site.social?.github || '#'}" target="_blank" rel="noopener">GitHub</a>
                </div>
              </div>
            </div>
          </div>
        </footer>`;
    }
  }

  customElements.define('site-footer', SiteFooter);
})();
