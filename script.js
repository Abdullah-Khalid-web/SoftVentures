// --- Component Loading ---
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Re-initialize mobile menu logic and theme icon state after header loads
        if (elementId === 'header-placeholder') {
            initializeHeaderLogic();
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// --- Theme Toggle Logic ---
function initTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to light if no preference stored, unless system prefers dark? 
    // User said "default light theme", so we force light if nothing is set.
    let theme = 'light';
    if (storedTheme) {
        theme = storedTheme;
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.colorScheme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    if (!lightIcon || !darkIcon) return;
    
    if (theme === 'dark') {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    } else {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }
}

// --- Header Specific Logic (Mobile Menu & Toggle) ---
function initializeHeaderLogic() {
    // Theme Toggle Button
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Remove old listener to avoid duplicates if re-initialized
        const newBtn = themeToggleBtn.cloneNode(true);
        themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);
        newBtn.addEventListener('click', toggleTheme);
        
        // Update icon state
        const currentTheme = document.documentElement.getAttribute('data-theme');
        updateThemeIcon(currentTheme);
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        const newMenuBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newMenuBtn, mobileMenuBtn);
        newMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    // Set theme immediately to prevent flash
    initTheme();
    
    // Load components
    await loadComponent('header-placeholder', 'header.html');
    await loadComponent('footer-placeholder', 'footer.html');
    
    // If the page loads with header already present (e.g., terms page), ensure icons are set
    if (document.getElementById('theme-toggle')) {
        initializeHeaderLogic();
    }
});