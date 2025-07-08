document.addEventListener('DOMContentLoaded', () => {
    // ===================================
    //  CONSTANTS & STATE
    // ===================================
    const API_URL = 'data.json';
    const languageSelectors = document.querySelectorAll('.lang-switcher a');
    let currentLanguage = localStorage.getItem('language') || 'en'; // Default to English

    // ===================================
    //  FUNCTION DEFINITIONS
    // ===================================

    /**
     * Fetches and applies translations for the selected language.
     * @param {string} lang - The language code ('en' or 'ar').
     */
    const setLanguage = async (lang) => {
        try {
            const response = await fetch(`${lang}.json`);
            if (!response.ok) throw new Error(`Translation file for ${lang} not found.`);
            const translations = await response.json();

            // Apply translations to all static elements
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key]) {
                    element.innerHTML = translations[key];
                }
            });

            // Update HTML tag attributes for language and direction
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

            // Update the visual state of the language switchers
            updateSwitcherState(lang);

            // Store the selected language preference
            localStorage.setItem('language', lang);
            currentLanguage = lang;
        } catch (error) {
            console.error("Failed to set language:", error);
        }
    };

    /**
     * Updates the visual style of the language switcher links.
     * @param {string} lang - The currently active language code.
     */
    const updateSwitcherState = (lang) => {
        languageSelectors.forEach(selector => {
            const selectorLang = selector.getAttribute('data-lang');
            if (selectorLang === lang) {
                selector.classList.remove('text-gray-500', 'font-medium');
                selector.classList.add('text-[#FF9900]', 'font-bold');
            } else {
                selector.classList.remove('text-[#FF9900]', 'font-bold');
                selector.classList.add('text-gray-500', 'font-medium');
            }
        });
    };

    /**
     * Fetches data from the main data source.
     */
    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('data.json not found.');
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return null;
        }
    };

    /**
     * Creates an HTML string for a team member card.
     */
    const createTeamMemberCard = (member) => `
        <div class="text-center">
            <img src="${member.imageUrl}" alt="${member.name}" class="w-32 h-32 mx-auto rounded-full mb-4 shadow-lg border-4 border-white object-cover" />
            <h4 class="text-lg font-semibold text-gray-800">${member.name}</h4>
            <p class="text-[#FF9900] font-medium">${member.role}</p>
        </div>
    `;

    // ===================================
    //  EVENT LISTENERS & INITIALIZATIONS
    // ===================================

    // --- Language Switcher ---
    languageSelectors.forEach(selector => {
        selector.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent page reload
            const selectedLang = selector.getAttribute('data-lang');
            if (selectedLang !== currentLanguage) {
                setLanguage(selectedLang);
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        const mobileMenu = document.getElementById('mobile-menu');
        const openIcon = document.getElementById('menu-open-icon');
        const closeIcon = document.getElementById('menu-close-icon');
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    // --- Active Nav Link ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // --- Page-Specific Content Loading ---
    // Home Page: Featured Services
    if (document.getElementById('featured-services')) {
        fetchData().then(data => {
            if (data?.cloudServices) {
                const container = document.getElementById('featured-services');
                container.innerHTML = data.cloudServices.slice(0, 3).map(createServiceCard).join('');
            }
        });
    }

    // Services Page
    if (document.getElementById('cloud-services-container')) {
        fetchData().then(data => {
            if (data) {
                const cloudContainer = document.getElementById('cloud-services-container');
                const networkContainer = document.getElementById('networking-services-container');
                if (data.cloudServices) cloudContainer.innerHTML = data.cloudServices.map(createServiceCard).join('');
                if (data.networkingServices) networkContainer.innerHTML = data.networkingServices.map(createServiceCard).join('');
            }
        });
    }

    // About Page
    if (document.getElementById('team-container')) {
        fetchData().then(data => {
            if (data?.teamMembers) {
                const container = document.getElementById('team-container');
                container.innerHTML = data.teamMembers.map(createTeamMemberCard).join('');
            }
        });
    }
    
    // Contact Page Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const statusEl = document.getElementById('form-status');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Simulate form submission
            setTimeout(() => {
                statusEl.textContent = 'Message sent successfully!';
                statusEl.classList.add('text-green-600');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                contactForm.reset();

                setTimeout(() => {
                    statusEl.textContent = '';
                    statusEl.classList.remove('text-green-600');
                }, 3000);
            }, 1500);
        });
    }

    // --- Initial Language Load ---
    // This is called last to ensure the page is translated on initial visit
    setLanguage(currentLanguage);
});