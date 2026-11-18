/*
 * PROJECTS SHOWCASE
 * ---------------------------------------------------------------------
 * Every project shown on the home page ("Featured work"), on work.html
 * and on its own page (project.html?id=...) comes from this list.
 *
 * TO ADD A PROJECT: copy the TEMPLATE block below into the list, fill it
 * in, and set status: 'live'. Nothing else needs to change.
 *
 * Fields
 *   id          short unique slug used in the URL, e.g. 'citymart-pos'
 *   status      'live' = real, finished case study
 *               'placeholder' = shows a "Case study coming soon" badge.
 *               Replace or delete every placeholder before launch.
 *   featured    true = shown on the home page (the first 3 are used)
 *   type        'system' | 'agent' | 'automation' | 'rescue'
 *   title       what you built, in plain words
 *   client      client name (only with their permission), or leave ''
 *   industry    e.g. 'Retail', 'Healthcare'
 *   country     e.g. 'United Arab Emirates'
 *   year        e.g. 2026
 *   summary     one or two sentences for the cards
 *   cover       image URL (or a local path like 'assets/img/work/citymart.jpg')
 *   coverAlt    describe the image for screen readers
 *   problem     what was going wrong before (paragraph)
 *   solution    what you built and how it works (paragraph)
 *   features    list of the main things it does
 *   results     list of REAL outcomes the client agrees to publish
 *   stack       technologies used
 *   gallery     extra screenshots/photos: [{ src: '...', alt: '...' }]
 *   link        live site or app store link, or ''
 *   quote       a REAL client quote only: { text: '', name: '', role: '' }, or null
 *
 * Never invent clients, results or quotes. Real ones only.
 */

/* TEMPLATE (copy this into the list below)
  {
    id: 'my-project',
    status: 'live',
    featured: true,
    type: 'system',
    title: '',
    client: '',
    industry: '',
    country: '',
    year: 2026,
    summary: '',
    cover: 'assets/img/work/my-project.jpg',
    coverAlt: '',
    problem: '',
    solution: '',
    features: [],
    results: [],
    stack: [],
    gallery: [],
    link: '',
    quote: null,
  },
*/

window.PROJECTS = [
  {
    id: 'retail-chain-system',
    status: 'placeholder',
    featured: true,
    type: 'system',
    title: 'Multi-branch retail management system',
    client: '',
    industry: 'Retail',
    country: '',
    year: '',
    summary: 'POS, stock and supplier orders for every branch in one system, with the owner\'s daily report waiting on their phone each morning.',
    cover: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1400&q=70',
    coverAlt: 'Supermarket aisle with fully stocked shelves',
    problem: '',
    solution: '',
    features: ['POS across branches', 'Stock transfers and barcodes', 'Supplier purchase orders', 'Owner\'s daily report'],
    results: [],
    stack: [],
    gallery: [],
    link: '',
    quote: null,
  },
  {
    id: 'clinic-booking-agent',
    status: 'placeholder',
    featured: true,
    type: 'agent',
    title: 'WhatsApp booking agent for a clinic',
    client: '',
    industry: 'Healthcare',
    country: '',
    year: '',
    summary: 'Patients book, move and cancel appointments on WhatsApp, any time of day, straight into the clinic\'s calendar.',
    cover: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1400&q=70',
    coverAlt: 'A doctor talking with a patient in a clinic',
    problem: '',
    solution: '',
    features: ['Books against the live calendar', 'Reminders the evening before', 'Hands off to reception when unsure'],
    results: [],
    stack: [],
    gallery: [],
    link: '',
    quote: null,
  },
  {
    id: 'restaurant-pos-kds',
    status: 'placeholder',
    featured: true,
    type: 'system',
    title: 'Restaurant POS and kitchen display',
    client: '',
    industry: 'Restaurants',
    country: '',
    year: '',
    summary: 'Orders from the counter, the website and WhatsApp land on one kitchen screen, with stock deducted per recipe.',
    cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=70',
    coverAlt: 'A modern restaurant dining room',
    problem: '',
    solution: '',
    features: ['POS and billing', 'Kitchen display by station', 'Recipe costing'],
    results: [],
    stack: [],
    gallery: [],
    link: '',
    quote: null,
  },
  {
    id: 'invoice-automation',
    status: 'placeholder',
    featured: false,
    type: 'automation',
    title: 'Supplier invoice automation',
    client: '',
    industry: 'Wholesale and logistics',
    country: '',
    year: '',
    summary: 'An agent reads incoming supplier invoices, matches them to purchase orders, updates stock and flags price changes for approval.',
    cover: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=70',
    coverAlt: 'A large warehouse with shelves full of boxes',
    problem: '',
    solution: '',
    features: ['Reads invoices from email', 'Matches to purchase orders', 'Flags price changes'],
    results: [],
    stack: [],
    gallery: [],
    link: '',
    quote: null,
  },
  {
    id: 'school-system-rescue',
    status: 'placeholder',
    featured: false,
    type: 'rescue',
    title: 'School system taken over and stabilised',
    client: '',
    industry: 'Education',
    country: '',
    year: '',
    summary: 'A half-finished school system from another team, audited, fixed, documented and now on a maintenance contract.',
    cover: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=70',
    coverAlt: 'Books, an apple and alphabet blocks on a desk',
    problem: '',
    solution: '',
    features: ['Code audit report', 'Urgent bugs fixed', 'Full documentation', 'Monthly maintenance'],
    results: [],
    stack: [],
    gallery: [],
    link: '',
    quote: null,
  },
];
