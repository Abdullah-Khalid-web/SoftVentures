/*
 * SITE CONFIG
 * One place for the company name, contact details and navigation.
 * The header, footer, contact page and legal pages all read from here.
 * Any element with data-site="key" gets its text filled from this object
 * (e.g. <span data-site="email"></span>).
 */
window.SITE = {
  name: 'NextGen Tech Solutions',
  shortName: 'NextGen',
  legalName: 'NextGen Tech Solutions',           // as it appears on contracts
  city: 'Karachi, Pakistan',
  email: 'hello@yourdomain.com',                 // TODO: replace with your real address
  phone: '+92 300 0000000',                      // TODO: shown as text
  whatsapp: '923000000000',                      // TODO: digits only, with country code, no +
  hours: '11:00 to 23:00 Karachi time, Monday to Saturday',
  legalUpdated: '17 November 2026',

  social: {
    linkedin: 'https://www.linkedin.com/',       // TODO
    github: 'https://github.com/',               // TODO
  },

  nav: [
    { id: 'agents',  label: 'AI agents',          href: 'agents.html' },
    { id: 'systems', label: 'Management systems', href: 'systems.html' },
    { id: 'support', label: 'Fixes & maintenance', href: 'support.html' },
    { id: 'about',   label: 'About',              href: 'about.html' },
  ],
};
