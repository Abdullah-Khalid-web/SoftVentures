SOFTVENTURES WEBSITE - HOW TO USE
================================
FILES:
- index.html      = Home page (Page 1)
- services.html   = Software / Services page (Page 2)
- contact.html    = Contact / Get Quote page (Page 3)
- ai-builder.html = AI Builder page (Bonus Page 4)
- header.html     = HEADER - edit here, changes on ALL pages
- footer.html     = FOOTER - edit here, changes on ALL pages
- style.css       = ALL CSS + colors. Change colors only here:
    :root { --dark: #1A1A1A; --light: #F4F9F9; --primary: #477B9A; }
- main.js         = Loads header/footer + theme + management tabs

HOW TO ADD A NEW PAGE:
1. Copy index.html -> rename e.g. about.html
2. Change <body data-page="index"> to data-page="about"
3. Change <title> and middle <main> content only.
4. Header/footer will load automatically. Do NOT copy header/footer code into the page.

HOW TO UPLOAD:
- Netlify: drag & drop this whole folder (or ZIP) onto Netlify Drop.
- cPanel: upload ZIP -> Extract in public_html -> done.
- IMPORTANT: Open via http:// / Live Server, NOT by double-clicking file:// alone for header/footer fetch to work on some browsers. On Netlify/cPanel it works perfectly.

EDIT EMAIL:
- Search hello@softventures.dev in footer.html + contact.html and replace.
