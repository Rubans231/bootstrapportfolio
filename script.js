document.addEventListener('DOMContentLoaded', function() {
    // Fetch GitHub projects
    fetchGitHubProjects();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission (placeholder)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! This is a demo form, so no message was actually sent.');
            contactForm.reset();
        });
    }
    
    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Function to fetch GitHub projects
async function fetchGitHubProjects() {
    const username = 'Rubans231';
    const projectsContainer = document.getElementById('project-cards');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        // Clear loading indicator
        projectsContainer.innerHTML = '';
        
        // Create project cards
        repos.forEach(repo => {
            const card = createProjectCard(repo);
            projectsContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        projectsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load GitHub projects. Please try again later.
                </div>
            </div>
        `;
    }
}

// Function to create a project card
function createProjectCard(repo) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    // Get language color
    const languageColors = {
        JavaScript: '#f1e05a',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Python: '#3572A5',
        Java: '#b07219',
        'C#': '#178600',
        PHP: '#4F5D95',
        TypeScript: '#2b7489',
        // Add more languages as needed
    };
    
    const languageColor = languageColors[repo.language] || '#8e8e8e';
    
    // Create language tag HTML
    let languageTag = '';
    if (repo.language) {
        languageTag = `
            <div class="project-tag">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${languageColor}; margin-right: 5px;"></span>
                ${repo.language}
            </div>
        `;
    }
    
    // Generate a random icon for the project
    const icons = ['fa-code', 'fa-laptop-code', 'fa-file-code', 'fa-terminal', 'fa-database', 'fa-sitemap'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    // Create the card HTML
    col.innerHTML = `
        <div class="project-card">
            <div class="project-image" style="background-color: ${languageColor}40;">
                <i class="fas ${randomIcon}"></i>
            </div>
            <div class="project-body">
                <h5 class="project-title">${repo.name}</h5>
                <p class="project-description">${repo.description || 'No description available'}</p>
                <div class="project-tags">
                    ${languageTag}
                    <div class="project-tag">
                        <i class="fas fa-star me-1"></i> ${repo.stargazers_count}
                    </div>
                    <div class="project-tag">
                        <i class="fas fa-code-branch me-1"></i> ${repo.forks_count}
                    </div>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    return col;
}