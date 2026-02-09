// js/layout.js

// 1. Inject Header
const headerHTML = `
<header class="backdrop-blur-sm sticky top-0 z-50">
    <div class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="index.html" class="flex items-center space-x-3">
             <img src="https://raw.githubusercontent.com/AmanullahRefat/PadmaGeospatial/3777122a3f7d96876d53a005ab42caeceed8f4f1/images/PGeo%20Solutions.png" alt="Padma Geospatial Logo" class="h-12 w-auto">
             <span class="text-xl font-bold text-primary">Padma GeoSpatial Solutions Ltd.</span>
        </a>
        <div class="flex items-center space-x-8">
            <nav class="hidden md:flex items-center space-x-8 font-medium">
                <a href="index.html" class="nav-link">Home</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="services.html" class="nav-link">Services</a>
                <a href="projects.html" class="nav-link">Work</a>
                <a href="blog.html" class="nav-link">Blog</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </nav>
            <button id="theme-toggle" title="Toggle theme">
                <div class="toggle-track">
                    <div class="toggle-thumb"></div>
                </div>
            </button>
            <div class="md:hidden">
                <button id="mobile-menu-button" class="text-primary focus:outline-none">
                    <i class="fas fa-bars text-2xl"></i>
                </button>
            </div>
        </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden bg-surface shadow-lg">
        <a href="index.html" class="block py-3 px-6 text-secondary hover:bg-border-color mobile-nav-link">Home</a>
        <a href="about.html" class="block py-3 px-6 text-secondary hover:bg-border-color mobile-nav-link">About</a>
        <a href="services.html" class="block py-3 px-6 text-secondary hover:bg-border-color mobile-nav-link">Services</a>
        <a href="projects.html" class="block py-3 px-6 text-secondary hover:bg-border-color mobile-nav-link">Work</a>
        <a href="blog.html" class="block py-3 px-6 text-secondary hover:bg-border-color mobile-nav-link">Blog</a>
        <a href="contact.html" class="block py-3 px-6 text-secondary hover:bg-border-color mobile-nav-link">Contact</a>
    </div>
</header>
`;

document.body.insertAdjacentHTML("afterbegin", headerHTML);

// 2. Inject Footer
const footerHTML = `
<footer class="bg-surface text-primary mt-16 border-t border-custom">
    <div class="container mx-auto px-6 py-10">
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
            <div>
                <h3 class="text-lg font-semibold mb-4">Padma GeoSpatial Solutions Ltd.</h3>
                <p class="text-secondary">We believe accurate data is the foundation of a better world. We take the complexity out of geospatial science to give you the clarity you need to plan, build, and protect.</p>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                <ul class="space-y-1">
                    <li><a href="about.html" class="text-secondary hover:text-primary">About Us</a></li>
                    <li><a href="services.html" class="text-secondary hover:text-primary">Services</a></li>
                    <li><a href="projects.html" class="text-secondary hover:text-primary">Work</a></li>
                    <li><a href="blog.html" class="text-secondary hover:text-primary">Blog</a></li>
                </ul>
            </div>
            <div class="lg:col-span-2">
                <h3 class="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
                <form id="newsletterFormFooter" action="https://formspree.io/f/xeozbadd" method="POST" class="flex flex-col sm:flex-row gap-4">
                    <input type="email" name="email" placeholder="Enter your email" class="w-full px-4 py-2 bg-background border border-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary" required>
                    <button type="submit" class="btn-primary py-2 px-6 rounded-lg whitespace-nowrap">Subscribe</button>
                </form>
            </div>
        </div>
        <div class="border-t border-custom pt-4 mt-6 flex flex-col sm:flex-row justify-between items-center">
            <p class="text-secondary text-sm">© 2026 Padma GeoSpatial Solutions Ltd. All Rights Reserved.</p>
            <div class="flex space-x-4 mt-4 sm:mt-0">
                <a href="https://www.facebook.com/profile.php?id=61579305396441" target="_blank" class="text-secondary hover:text-primary"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="text-secondary hover:text-primary"><i class="fab fa-twitter"></i></a>
                <a href="#" class="text-secondary hover:text-primary"><i class="fab fa-linkedin-in"></i></a>
            </div>
        </div>
    </div>
</footer>
`;

document.body.insertAdjacentHTML("beforeend", footerHTML);

// 3. Common Logic (Theme, Mobile Menu)
const themeToggle = document.getElementById('theme-toggle');
const docElement = document.documentElement;
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Theme Logic
function applyTheme(theme) {
    if (theme === 'dark') docElement.classList.add('theme-dark');
    else docElement.classList.remove('theme-dark');
}
function toggleTheme() {
    const currentTheme = docElement.classList.contains('theme-dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}
const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme);
else {
    const hour = new Date().getHours();
    applyTheme((hour >= 6 && hour < 18) ? 'light' : 'dark');
}
if(themeToggle) themeToggle.addEventListener('click', toggleTheme);

// Mobile Menu Logic
if(mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}

// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

function observeElements() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', observeElements);

// Highlight Active Menu
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    // Basic match (exact or if index.html)
    if(link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
        link.classList.add('text-accent'); 
    }
    // Handle detail pages (keep parent highlighted)
    if(currentPage === 'project-details.html' && link.getAttribute('href') === 'projects.html') {
         link.classList.add('active', 'text-accent');
    }
    if(currentPage === 'blog-details.html' && link.getAttribute('href') === 'blog.html') {
         link.classList.add('active', 'text-accent');
    }
});
