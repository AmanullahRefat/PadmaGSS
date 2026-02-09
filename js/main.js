// js/main.js

/**
 * GLOBAL HELPER: Social Sharing Logic
 * Includes a safety check for "Localhost/File" mode to prevent broken UX.
 */
window.shareToSocial = function(platform) {
    // 1. DETECT LOCAL ENVIRONMENT
    const isLocal = window.location.protocol === 'file:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

    // 2. UX HANDLER FOR LOCAL TESTING
    if (isLocal) {
        alert("Developer Note: Social sharing requires a live public website (e.g., .com) to generate previews. This feature will work automatically once you publish your site.");
        return; // Stop here so we don't open the broken window
    }

    // 3. PRODUCTION LOGIC
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    let shareUrl = '';

    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
};

/**
 * GLOBAL HELPER: Copy to Clipboard
 * This provides immediate feedback and works everywhere.
 */
window.copyLink = function(btn) {
    navigator.clipboard.writeText(window.location.href).then(() => {
        // Visual Feedback: Change icon to checkmark temporarily
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add('bg-green-500', 'text-white');
        btn.classList.remove('bg-gray-200', 'text-gray-600');
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('bg-green-500', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-600');
        }, 2000);
    });
};


document.addEventListener('DOMContentLoaded', () => {

    // --- 0. DATA SAFETY CHECK ---
    let safeProjects = [];
    let safeBlogs = [];

    if (typeof projectsData !== 'undefined') safeProjects = projectsData;
    else if (typeof projects !== 'undefined') safeProjects = projects;

    if (typeof blogPosts !== 'undefined') safeBlogs = blogPosts;
    else if (typeof blogs !== 'undefined') safeBlogs = blogs;

    const getSafeId = (item, index) => {
        return (item.id !== undefined && item.id !== null) ? item.id : index;
    };


    // =========================================
    // 1. PROJECT LIST PAGE (AUTOMATED)
    // =========================================
    const projectList = document.getElementById('project-list');
    const projectFilters = document.getElementById('project-filters');

    if (projectList && projectFilters) {
        projectFilters.className = 'mb-12 reveal'; 
        projectFilters.innerHTML = '';

        const pDesktopContainer = document.createElement('div');
        pDesktopContainer.className = 'hidden md:flex flex-wrap justify-center gap-4';

        const pMobileContainer = document.createElement('div');
        pMobileContainer.className = 'block md:hidden w-full max-w-sm mx-auto';
        
        const pMobileSelect = document.createElement('select');
        pMobileSelect.className = 'mobile-filter-select w-full p-3 rounded-full appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

        // --- AUTOMATED PROJECT CATEGORIES ---
        const autoProjCats = { 'all': 'All Projects' };

        safeProjects.forEach(project => {
            if (project.category) {
                const rawCat = project.category;
                const key = rawCat.toLowerCase();
                
                if (!autoProjCats[key]) {
                    let label = rawCat;
                    if (typeof projectCategories !== 'undefined' && projectCategories[key]) {
                        label = projectCategories[key];
                    } else {
                        label = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
                    }
                    autoProjCats[key] = label;
                }
            }
        });

        Object.entries(autoProjCats).forEach(([key, label]) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.className = `filter-btn ${key === 'all' ? 'active' : ''}`;
            btn.dataset.filter = key;
            btn.addEventListener('click', () => {
                filterProjects(key);
                updateActiveState(projectFilters, key, pMobileSelect);
            });
            pDesktopContainer.appendChild(btn);

            const option = document.createElement('option');
            option.value = key;
            option.textContent = label;
            pMobileSelect.appendChild(option);
        });

        pMobileSelect.addEventListener('change', (e) => {
            filterProjects(e.target.value);
            updateActiveState(projectFilters, e.target.value, pMobileSelect);
        });

        pMobileContainer.appendChild(pMobileSelect);
        projectFilters.appendChild(pDesktopContainer);
        projectFilters.appendChild(pMobileContainer);

        function filterProjects(category) {
            projectList.innerHTML = '';
            
            const filtered = category === 'all' 
                ? safeProjects 
                : safeProjects.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());

            if (filtered.length === 0) {
                projectList.innerHTML = `<div class="col-span-full text-center text-secondary py-10">No projects found in this category.</div>`;
                return;
            }

            filtered.forEach((project, index) => {
                const pId = getSafeId(project, index);
                
                let cleanSummary = project.summary;
                if (!cleanSummary && project.details) {
                    cleanSummary = project.details.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
                } else if (!cleanSummary) {
                    cleanSummary = '';
                }

                const catLabel = autoProjCats[(project.category || '').toLowerCase()] || project.category;

                const card = document.createElement('div');
                card.className = 'bg-surface rounded-xl overflow-hidden shadow-lg card-hover group flex flex-col h-full';
                card.innerHTML = `
                    <div class="relative overflow-hidden h-64 flex-shrink-0">
                        <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <a href="project-details.html?id=${pId}" class="bg-white text-gray-900 py-2 px-6 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Details</a>
                        </div>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <div class="text-accent text-sm font-bold uppercase tracking-wide mb-2">${catLabel}</div>
                        <h3 class="text-xl font-bold text-primary mb-2 line-clamp-2">${project.title}</h3>
                        <p class="text-secondary line-clamp-3 mb-4 flex-grow">${cleanSummary}</p>
                        <a href="project-details.html?id=${pId}" class="text-accent font-medium hover:underline mt-auto inline-flex items-center">Read More <i class="fas fa-arrow-right ml-1"></i></a>
                    </div>
                `;
                projectList.appendChild(card);
            });
        }
        filterProjects('all');
    }


    // =========================================
    // 2. PROJECT DETAILS PAGE
    // =========================================
    const projectDetailContainer = document.getElementById('project-detail-container');

    if (projectDetailContainer) {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');

        const project = safeProjects.find((p, index) => {
            const pId = getSafeId(p, index);
            return String(pId) === String(projectId);
        });

        if (project) {
            const rawCat = (project.category || '').toLowerCase();
            let catLabel = project.category;
            if (typeof projectCategories !== 'undefined' && projectCategories[rawCat]) {
                catLabel = projectCategories[rawCat];
            } else {
                 catLabel = catLabel.charAt(0).toUpperCase() + catLabel.slice(1);
            }

            projectDetailContainer.innerHTML = `
                <div class="max-w-5xl mx-auto animate-fade-in">
                    <div class="mb-8 flex items-center text-sm text-secondary">
                        <a href="projects.html" class="hover:text-accent"><i class="fas fa-arrow-left mr-2"></i>Back to Projects</a>
                        <span class="mx-2">/</span>
                        <span class="text-accent font-semibold">${project.title}</span>
                    </div>
                    <div class="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-12">
                        <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.title}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        <div class="absolute bottom-0 left-0 p-8 md:p-12">
                            <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide mb-4 inline-block shadow-md">
                                ${catLabel}
                            </span>
                            <h1 class="text-3xl md:text-5xl font-bold text-white leading-tight shadow-sm">${project.title}</h1>
                        </div>
                    </div>
                    <div class="grid lg:grid-cols-3 gap-12">
                        <div class="lg:col-span-1 space-y-8 order-2 lg:order-1">
                            <div class="bg-surface p-8 rounded-xl shadow-lg border-custom" style="border: 1px solid var(--border-color);">
                                <h3 class="text-xl font-bold text-primary mb-6 border-b pb-4" style="border-color: var(--border-color);">Project Info</h3>
                                <ul class="space-y-4">
                                    <li class="flex flex-col"><span class="text-sm text-secondary uppercase tracking-wider font-semibold">Client</span><span class="text-primary font-medium text-lg">${project.client || 'N/A'}</span></li>
                                    <li class="flex flex-col"><span class="text-sm text-secondary uppercase tracking-wider font-semibold">Location</span><span class="text-primary font-medium text-lg">${project.location || 'N/A'}</span></li>
                                    <li class="flex flex-col"><span class="text-sm text-secondary uppercase tracking-wider font-semibold">Category</span><span class="text-primary font-medium text-lg">${catLabel}</span></li>
                                </ul>
                            </div>
                            
                            <div class="bg-surface p-8 rounded-xl shadow-lg text-center" style="border: 1px solid var(--border-color);">
                                <h3 class="text-lg font-bold text-primary mb-3">Need a similar solution?</h3>
                                <p class="text-secondary mb-6 text-sm">Contact us to discuss how we can help your organization.</p>
                                <a href="contact.html" class="inline-block w-full btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
                                    Get in Touch
                                </a>
                            </div>
                        </div>
                        <div class="lg:col-span-2 order-1 lg:order-2">
                             <div class="prose max-w-none text-lg text-secondary leading-relaxed">
                                ${project.details || project.summary || '<p>No details available.</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            projectDetailContainer.innerHTML = `<div class="text-center py-20"><h2 class="text-2xl font-bold text-primary">Project Not Found</h2><a href="projects.html" class="text-accent hover:underline mt-4 inline-block">Return to Projects</a></div>`;
        }
    }


    // =========================================
    // 3. BLOG LIST PAGE (AUTOMATED)
    // =========================================
    const blogList = document.getElementById('blog-list');
    const blogFilters = document.getElementById('blog-filters');

    if (blogList && blogFilters) {
        blogFilters.className = 'mb-12 reveal'; 
        blogFilters.innerHTML = '';

        const bDesktopContainer = document.createElement('div');
        bDesktopContainer.className = 'hidden md:flex flex-wrap justify-center gap-4';

        const bMobileContainer = document.createElement('div');
        bMobileContainer.className = 'block md:hidden w-full max-w-sm mx-auto';
        
        const bMobileSelect = document.createElement('select');
        bMobileSelect.className = 'mobile-filter-select w-full p-3 rounded-full appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

        const autoBlogCats = { 'all': 'All News' };
        
        safeBlogs.forEach(post => {
            if (post.category) {
                const key = post.category.toLowerCase();
                if (!autoBlogCats[key]) {
                    autoBlogCats[key] = post.category;
                }
            }
        });

        Object.entries(autoBlogCats).forEach(([key, label]) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.className = `filter-btn ${key === 'all' ? 'active' : ''}`;
            btn.dataset.filter = key;
            btn.addEventListener('click', () => {
                filterBlogs(key);
                updateActiveState(blogFilters, key, bMobileSelect);
            });
            bDesktopContainer.appendChild(btn);

            const option = document.createElement('option');
            option.value = key;
            option.textContent = label;
            bMobileSelect.appendChild(option);
        });

        bMobileSelect.addEventListener('change', (e) => {
            filterBlogs(e.target.value);
            updateActiveState(blogFilters, e.target.value, bMobileSelect);
        });

        bMobileContainer.appendChild(bMobileSelect);
        blogFilters.appendChild(bDesktopContainer);
        blogFilters.appendChild(bMobileContainer);

        function filterBlogs(category) {
            blogList.innerHTML = '';
            
            const filtered = category === 'all' 
                ? safeBlogs 
                : safeBlogs.filter(b => (b.category || '').toLowerCase() === category.toLowerCase());

            if (filtered.length === 0) {
                blogList.innerHTML = `<div class="col-span-full text-center text-secondary py-10">No articles found in this category.</div>`;
                return;
            }

            filtered.forEach((post, index) => {
                const bId = getSafeId(post, index);
                const card = document.createElement('div');
                card.className = 'bg-surface rounded-xl overflow-hidden shadow-lg card-hover flex flex-col h-full';
                
                const catLabel = autoBlogCats[(post.category || '').toLowerCase()] || post.category;

                card.innerHTML = `
                    <div class="relative h-56 overflow-hidden flex-shrink-0">
                        <img src="${post.image || 'images/placeholder.jpg'}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                        <div class="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            ${catLabel}
                        </div>
                    </div>
                    <div class="p-8 flex flex-col flex-grow">
                        <div class="flex items-center text-sm text-secondary mb-4">
                            <i class="far fa-calendar-alt mr-2 text-accent"></i>
                            <span>${post.date || 'Recent'}</span>
                        </div>
                        <h3 class="text-xl font-bold text-primary mb-3 leading-tight group-hover:text-accent transition-colors">
                            <a href="blog-details.html?id=${bId}">${post.title}</a>
                        </h3>
                        <p class="text-secondary line-clamp-3 mb-6 flex-grow">${post.summary || 'Click to read more...'}</p>
                        <a href="blog-details.html?id=${bId}" class="inline-flex items-center text-accent font-bold hover:underline mt-auto">
                            Read Article <i class="fas fa-arrow-right ml-2 text-sm transform transition-transform group-hover:translate-x-1"></i>
                        </a>
                    </div>
                `;
                blogList.appendChild(card);
            });
        }
        filterBlogs('all');
    }


    // =========================================
    // 4. BLOG DETAILS PAGE
    // =========================================
    const blogDetailContainer = document.getElementById('blog-detail-container');

    if (blogDetailContainer) {
        const params = new URLSearchParams(window.location.search);
        const blogId = params.get('id');

        const post = safeBlogs.find((b, index) => {
            const bId = getSafeId(b, index);
            return String(bId) === String(blogId);
        });

        if (post) {
            const catLabel = post.category || 'News';
            
            blogDetailContainer.innerHTML = `
                <div class="max-w-4xl mx-auto animate-fade-in">
                    <div class="mb-8">
                        <a href="blog.html" class="text-accent font-medium hover:underline"><i class="fas fa-arrow-left mr-2"></i>Back to Blog</a>
                    </div>
                    <div class="mb-8">
                        <span class="bg-accent bg-opacity-10 text-accent px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                            ${catLabel}
                        </span>
                        <span class="text-secondary ml-4 text-sm"><i class="far fa-calendar-alt mr-2"></i>${post.date || ''}</span>
                    </div>
                    <h1 class="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">${post.title}</h1>
                    <img src="${post.image || 'images/placeholder.jpg'}" alt="${post.title}" class="w-full h-64 md:h-[500px] object-cover rounded-xl shadow-2xl mb-12">
                    <div class="prose max-w-none text-lg text-secondary leading-relaxed border-b border-custom pb-12 mb-12">
                        ${post.content || post.summary}
                    </div>
                    <div class="text-center">
                        <h3 class="text-2xl font-bold text-primary mb-4">Share this article</h3>
                        <div class="flex justify-center space-x-4 items-center">
                            
                            <a href="#" onclick="window.shareToSocial('facebook'); return false;" class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1" title="Share on Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            
                            <a href="#" onclick="window.shareToSocial('twitter'); return false;" class="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1" title="Share on X (Twitter)">
                                <i class="fab fa-twitter"></i>
                            </a>
                            
                            <a href="#" onclick="window.shareToSocial('linkedin'); return false;" class="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1" title="Share on LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>

                            <button onclick="window.copyLink(this)" class="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1" title="Copy Link">
                                <i class="fas fa-link"></i>
                            </button>

                        </div>
                    </div>
                </div>
            `;
        } else {
            blogDetailContainer.innerHTML = `<div class="text-center py-20"><h2 class="text-2xl font-bold text-primary mb-4">Article Not Found</h2><a href="blog.html" class="text-accent hover:underline">Back to Blog</a></div>`;
        }
    }

    // --- SHARED HELPER FOR ACTIVE STATE ---
    function updateActiveState(container, activeCategory, mobileSelect) {
        if(mobileSelect) mobileSelect.value = activeCategory;
        const btns = container.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            if (btn.dataset.filter === activeCategory) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

});
