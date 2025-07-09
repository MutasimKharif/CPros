document.addEventListener('DOMContentLoaded', () =>
    const pageName = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

// --- TEMPLATE GENERATORS ---
    const createHeaderHTML = (activePage) => {
        const pages = [
            { name: 'Home', href: 'index.html', page: 'index' },
            { name: 'Services', href: 'services.html', page: 'services' },
            { name: 'About Us', href: 'about.html', page: 'about' },
            { name: 'Contact', href: 'contact.html', page: 'contact' },
            { name: 'Sign In', href: 'signin.html', page: 'signin' }
        ];
        const navLinks = pages.map(p => `<a href="${p.href}" class="nav-link px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${activePage === p.page ? 'active' : ''}" data-page="${p.page}">${p.name}</a>`).join('');
        const mobileLinks = pages.map(p => `<a href="${p.href}" class="nav-link block px-3 py-2 rounded-md text-base font-medium ${activePage === p.page ? 'active' : ''}" data-page="${p.page}">${p.name}</a>`).join('');

        return `
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center justify-between h-20">
<a href="index.html" class="flex-shrink-0 flex items-center space-x-2"><svg class="h-8 w-8 text-[#FF9900]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg><span class="text-2xl font-bold text-gray-800">CloudPros</span></a>
<nav class="hidden md:flex items-center space-x-2">${navLinks}</nav>
 <div class="md:hidden"><button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-600"><svg id="menu-icon-open" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg><svg id="menu-icon-close" class="h-6 w-6 hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                </div>
            </div>
            <div id="mobile-menu" class="md:hidden hidden bg-white border-t border-gray-200"><div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">${mobileLinks}</div></div>
        `;
    };
    const createFooterHTML = () => `
        <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="col-span-1 md:col-span-2"><a href="index.html" class="flex items-center space-x-2 mb-4"><svg class="h-8 w-8 text-[#FF9900]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg><span class="text-2xl font-bold">CloudPros</span></a><p class="text-gray-400 max-w-md">Your expert partner for AWS cloud solutions, from migration and DevOps to security and data analytics.</p></div>
<div><h3 class="text-lg font-semibold mb-4">Quick Links</h3><ul class="space-y-2"><li><a href="index.html" class="text-gray-400 hover:text-white">Home</a></li><li><a href="services.html" class="text-gray-400 hover:text-white">Services</a></li><li><a href="about.html" class="text-gray-400 hover:text-white">About Us</a></li><li><a href="contact.html" class="text-gray-400 hover:text-white">Contact</a></li></ul></div>
<div><h3 class="text-lg font-semibold mb-4">Contact</h3><ul class="space-y-2 text-gray-400"><li class="flex items-start"><svg class="w-4 h-4 mr-2 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>Riyadh, Saudi Arabia</li>
    <li class="flex items-start"><svg class="w-4 h-4 mr-2 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        <svg>info@cloudpros.com</li>
        <li class="flex items-start">
<svg class="w-4 h-4 mr-2 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.971.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" /></svg>(966) 0552286385</li></ul></div></div>
<div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-500"><p>&copy; <span id="current-year"></span> CloudPros. All rights reserved.</p></div></div>

// --- GLOBAL INITIALIZATION ---
document.getElementById('header-placeholder').innerHTML =createHeaderHTML(pageName);
    document.getElementById('footer-placeholder').innerHTML = createFooterHTML();
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            document.getElementById('menu-icon-open').classList.toggle('hidden');
            document.getElementById('menu-icon-close').classList.toggle('hidden');
        });
    }

    // --- PAGE-SPECIFIC LOGIC ---
    // This runs after the global components are in place.
    (async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('data.json not found');
            const data = await response.json();

            if (pageName === 'index') {
                const featuredGrid = document.getElementById('featured-services-grid');
                if (featuredGrid) {
                    featuredGrid.innerHTML = data.cloudServices.slice(0,3).mapcreateServiceCard).join('');
        }
} else if (pageName === 'about') {
const teamGrid document.getElementById('team-grid');
if (teamGrid) {teamGrid.innerHTML = data.teamMembers.map(createTeamMemberCard).join('');
                }
            } else if (pageName === 'services') {
                // Your existing services page logic can go here...
            }
        } 
        catch (error) {
            console.error("Could not load page-specific data:", error);
        }
    })();
});
