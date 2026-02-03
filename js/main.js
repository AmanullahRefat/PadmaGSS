// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. SAFETY CHECK: Find the data variables ---
    // This fixes the issue if you used 'projects' instead of 'projectsData'
    let safeProjects = [];
    let safeBlogs = [];

    if (typeof projectsData !== 'undefined') {
        safeProjects = projectsData;
    } else if (typeof projects !== 'undefined') {
        safeProjects = projects;
    }

    if (typeof blogPosts !== 'undefined') {
        safeBlogs = blogPosts;
    } else if (typeof blogs !== 'undefined') {
        safeBlogs = blogs;
    }

    // --- HELPER: Get Safe ID ---
    // If ID is missing, use the index (0, 1, 2)
    const getSafeId = (item, index) => {
        return (item.id !== undefined && item.id !== null) ? item.id : index;
    };

    // --- 1. HANDLE PROJECT LIST PAGE (projects.html) ---
    const projectList = document.getElementById('project-list');
    const projectFilters = document.getElementById('project-filters');

    if (projectList) {
        if (safeProjects.length === 0) {
            projectList.innerHTML = `<div class="col-span-full text-center text-red-500 font-bold">Error: No project data found. Please check js/data.js</div>`;
        } else {
            // Render Filters
            if(projectFilters) {
                // Determine categories dynamically if not defined
                const categories = typeof projectCategories !== 'undefined' ? projectCategories : {'all': 'All'};
                
                projectFilters.innerHTML = Object.entries(categories).map(([key, label]) => `
                    <button class="filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${key === 'all' ? 'active' : ''}" 
                            data-filter="${key}" onclick="filterProjects('${key}')">
                        ${label}
                    </button>
                `).join('');
            }

            // Render Projects Function
            window.renderProjects = (category = 'all') => {
                const filtered = category === 'all' 
                    ? safeProjects.map((p, index) => ({...p, originalIndex: index})) 
                    : safeProjects.map((p, index) => ({...p, originalIndex: index})).filter(p => p.category === category);
                
                if (filtered.length === 0) {
                    projectList.innerHTML = `<div class="col-span-full text-center py-12 text-secondary">No projects found in this category.</div>`;
                    return;
                }

                projectList.innerHTML = filtered.map(project => {
                    const uniqueLink = `project-details.html?id=${getSafeId(project, project.originalIndex)}`;
                    const catLabel = (typeof projectCategories !== 'undefined' && projectCategories[project.category]) ? projectCategories[project.category] : (project.category || 'Project');
                    
                    return `
                    <div class="bg-surface rounded-lg overflow-hidden shadow-lg card-hover group h-full flex flex-col">
                        <a href="${uniqueLink}" class="relative overflow-hidden h-48 block">
                            <img src="${project.image || 'https://placehold.co/600x400?text=No+Image'}" alt="${project.title}" onerror="this.src='https://placehold.co/600x400?text=No+Image'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                            <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span class="text-white font-semibold border border-white px-4 py-2 rounded-full">View Details</span>
                            </div>
                        </a>
                        <div class="p-6 flex-grow flex flex-col">
                            <div class="text-accent text-xs font-bold uppercase tracking-wider mb-2">${catLabel}</div>
                            <h3 class="text-xl font-bold text-primary mb-2">
                                <a href="${uniqueLink}" class="hover:text-accent transition-colors">${project.title}</a>
                            </h3>
                            <div class="text-secondary text-sm mb-4 line-clamp-3 flex-grow">
                                ${project.summary || (project.details ? project.details.replace(/<[^>]*>?/gm, '').substring(0, 100) : '...')}
                            </div>
                            <div class="border-t border-custom pt-4 mt-auto">
                                <div class="flex justify-between text-sm text-secondary">
                                    <span><i class="fas fa-user-tie mr-2"></i>${project.client || 'Client'}</span>
                                    <a href="${uniqueLink}" class="text-accent font-semibold hover:underline">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('');
            };

            window.filterProjects = (category) => {
                document.querySelectorAll('#project-filters .filter-btn').forEach(btn => {
                    if(btn.dataset.filter === category) btn.classList.add('active');
                    else btn.classList.remove('active');
                });
                window.renderProjects(category);
            };

            // Init
            window.renderProjects('all');
        }
    }


    // --- 2. HANDLE PROJECT DETAIL PAGE (project-details.html) ---
    const projectDetailContainer = document.getElementById('project-detail-container');
    if (projectDetailContainer) {
        
        if (safeProjects.length === 0) {
             projectDetailContainer.innerHTML = `
                <div class="text-center py-20">
                    <h2 class="text-xl font-bold text-red-500 mb-2">Data Error</h2>
                    <p class="text-secondary">Could not find 'projectsData' or 'projects' in js/data.js.</p>
                </div>`;
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('id');
            
            // Find project by ID OR by Index
            const project = safeProjects.find((p, index) => getSafeId(p, index) == projectId);

            if (project) {
                const catLabel = (typeof projectCategories !== 'undefined' && projectCategories[project.category]) ? projectCategories[project.category] : (project.category || 'Project');
                
                projectDetailContainer.innerHTML = `
                    <div class="mb-8">
                        <a href="projects.html" class="text-secondary hover:text-accent flex items-center mb-4">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Projects
                        </a>
                        <div class="grid lg:grid-cols-2 gap-12">
                            <div class="reveal visible">
                                <img src="${project.image || 'https://placehold.co/600x400?text=No+Image'}" alt="${project.title}" onerror="this.src='https://placehold.co/600x400?text=No+Image'" class="w-full rounded-xl shadow-2xl mb-8">
                                <div class="bg-surface p-6 rounded-lg shadow-lg border border-custom">
                                    <h3 class="font-bold text-lg text-primary mb-4 border-b border-custom pb-2">Project Facts</h3>
                                    <ul class="space-y-4">
                                        <li class="flex justify-between">
                                            <span class="text-secondary">Client</span>
                                            <span class="font-medium text-primary">${project.client || 'N/A'}</span>
                                        </li>
                                        <li class="flex justify-between">
                                            <span class="text-secondary">Location</span>
                                            <span class="font-medium text-primary">${project.location || 'N/A'}</span>
                                        </li>
                                        <li class="flex justify-between">
                                            <span class="text-secondary">Category</span>
                                            <span class="font-medium text-accent">${catLabel}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="reveal visible">
                                <h1 class="text-3xl md:text-5xl font-bold text-primary mb-6">${project.title}</h1>
                                <div class="prose max-w-none text-lg text-secondary leading-relaxed">
                                    ${project.details || project.summary || 'No details available.'}
                                </div>
                                <div class="mt-12 pt-8 border-t border-custom">
                                    <h3 class="text-xl font-bold text-primary mb-4">Interested in a similar project?</h3>
                                    <a href="contact.html" class="btn-primary py-3 px-8 rounded-lg">Contact Us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                projectDetailContainer.innerHTML = `
                    <div class="text-center py-20">
                        <h2 class="text-2xl font-bold text-primary mb-4">Project Not Found</h2>
                        <p class="text-secondary mb-6">ID: ${projectId || 'None'}</p>
                        <a href="projects.html" class="btn-primary py-2 px-6 rounded-full">Return to Work</a>
                    </div>
                `;
            }
        }
    }


    // --- 3. HANDLE BLOG LIST PAGE (blog.html) ---
    const blogList = document.getElementById('blog-list');
    
    if (blogList) {
        if(safeBlogs.length === 0) {
             blogList.innerHTML = `<div class="col-span-full text-center text-red-500">No blog posts found. Check js/data.js</div>`;
        } else {
            blogList.innerHTML = safeBlogs.map((post, index) => {
                const uniqueLink = `blog-details.html?id=${getSafeId(post, index)}`;
                return `
                <article class="bg-surface rounded-lg overflow-hidden shadow-lg card-hover flex flex-col h-full">
                    <a href="${uniqueLink}" class="h-56 overflow-hidden block">
                        <img src="${post.image || 'https://placehold.co/600x400?text=No+Image'}" alt="${post.title}" onerror="this.src='https://placehold.co/600x400?text=No+Image'" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                    </a>
                    <div class="p-6 flex flex-col flex-grow">
                        <div class="flex items-center text-sm text-secondary mb-3 space-x-4">
                            <span class="text-accent font-semibold">${post.category || 'News'}</span>
                            <span><i class="far fa-calendar-alt mr-2"></i>${post.date || ''}</span>
                        </div>
                        <h3 class="text-xl font-bold text-primary mb-3 hover:text-accent transition-colors">
                            <a href="${uniqueLink}">${post.title}</a>
                        </h3>
                        <p class="text-secondary mb-4 flex-grow text-sm line-clamp-3">${post.summary || ''}</p>
                        <a href="${uniqueLink}" class="inline-flex items-center text-accent font-semibold hover:underline bg-transparent border-none p-0">
                            Read Article <i class="fas fa-arrow-right ml-2"></i>
                        </a>
                    </div>
                </article>
                `;
            }).join('');
        }
    }


    // --- 4. HANDLE BLOG DETAIL PAGE (blog-details.html) ---
    const blogDetailContainer = document.getElementById('blog-detail-container');
    if (blogDetailContainer) {
        
        if (safeBlogs.length === 0) {
             blogDetailContainer.innerHTML = `
                <div class="text-center py-20">
                    <h2 class="text-xl font-bold text-red-500 mb-2">Data Error</h2>
                    <p class="text-secondary">Could not find 'blogPosts' in js/data.js.</p>
                </div>`;
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const blogId = urlParams.get('id');
            const post = safeBlogs.find((p, index) => getSafeId(p, index) == blogId);

            if (post) {
                blogDetailContainer.innerHTML = `
                    <div class="reveal visible">
                        <a href="blog.html" class="text-secondary hover:text-accent flex items-center mb-6">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Blog
                        </a>
                        <div class="mb-8">
                            <span class="bg-accent bg-opacity-10 text-accent px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">${post.category || 'Article'}</span>
                            <span class="text-secondary ml-4 text-sm"><i class="far fa-calendar-alt mr-2"></i>${post.date || ''}</span>
                        </div>
                        <h1 class="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">${post.title}</h1>
                        <img src="${post.image || 'https://placehold.co/600x400?text=No+Image'}" alt="${post.title}" onerror="this.src='https://placehold.co/600x400?text=No+Image'" class="w-full h-64 md:h-[500px] object-cover rounded-xl shadow-2xl mb-12">
                        
                        <div class="prose max-w-none text-lg text-secondary leading-relaxed border-b border-custom pb-12 mb-12">
                            ${post.content || post.summary}
                        </div>
                    </div>
                `;
            } else {
                blogDetailContainer.innerHTML = `
                    <div class="text-center py-20">
                        <h2 class="text-2xl font-bold text-primary mb-4">Article Not Found</h2>
                        <a href="blog.html" class="btn-primary py-2 px-6 rounded-full">Return to Blog</a>
                    </div>
                `;
            }
        }
    }
});