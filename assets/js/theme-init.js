
/*
 * SoftVentures Theme Controller
 * - First visit: Follow system preference.
 * - Manual selection: Save user's preference.
 * - Next visit: Restore saved preference.
 * - System changes: Follow only when no manual preference exists.
 */

(function () {
    const root = document.documentElement;
    const toggleSelector = '[data-theme-toggle], #theme-toggle';
    const storageKey = 'theme';

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    function getSavedTheme() {
        try {
            return localStorage.getItem(storageKey);
        } catch (e) {
            return null;
        }
    }

    function apply(theme) {
        const dark = theme === 'dark';

        root.classList.toggle('dark', dark);
        root.setAttribute('data-theme', dark ? 'dark' : 'light');

        syncControls();
    }

    function syncControls() {
        const dark = root.classList.contains('dark');

        document.querySelectorAll(toggleSelector).forEach(button => {
            button.setAttribute(
                'aria-label',
                dark ? 'Switch to light theme' : 'Switch to dark theme'
            );
        });
    }

    // Apply saved preference or detect system preference.
    function initializeTheme() {
        const saved = getSavedTheme();

        if (saved === 'dark' || saved === 'light') {
            apply(saved);
        } else {
            apply(systemTheme.matches ? 'dark' : 'light');
        }
    }

    // Handle manual theme changes.
    document.addEventListener('click', event => {
        const button = event.target.closest(toggleSelector);

        if (!button) return;

        const currentTheme = root.classList.contains('dark')
            ? 'dark'
            : 'light';

        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        apply(newTheme);

        try {
            localStorage.setItem(storageKey, newTheme);
        } catch (e) {}
    });

    // Follow system changes only if the user has no saved preference.
    systemTheme.addEventListener('change', event => {
        const saved = getSavedTheme();

        if (saved !== 'dark' && saved !== 'light') {
            apply(event.matches ? 'dark' : 'light');
        }
    });

    // Sync theme across browser tabs.
    window.addEventListener('storage', event => {
        if (event.key === storageKey || event.key === null) {
            initializeTheme();
        }
    });

    document.addEventListener('DOMContentLoaded', syncControls);

    // Run immediately before page rendering.
    initializeTheme();

    window.SiteTheme = {
        syncControls,
        apply,
        initializeTheme
    };
})();
