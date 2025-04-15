document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking a nav link (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    // Fix for the TypeError: Check if navbar exists before accessing its properties
    function scrollHeader() {
        // Only proceed if navbar element exists
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    // Add the scroll event listener only if the navbar element exists
    if (navbar) {
        window.addEventListener('scroll', scrollHeader);
    }
    
    // Glitch effect for hero heading
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        setInterval(() => {
            glitchElement.style.animation = 'none';
            void glitchElement.offsetWidth; // Trigger reflow
            glitchElement.style.animation = null;
        }, 5000);
    }
    
    // Smooth appearing of skill bars on scroll
    const skillLevels = document.querySelectorAll('.skill-level');
    if (skillLevels.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.level === 'Advanced' ? '90%' : 
                                              entry.target.dataset.level === 'Intermediate' ? '70%' : '40%';
                    skillObserver.unobserve(entry.target);
                } else {
                    entry.target.style.width = '0';
                }
            });
        }, { threshold: 0.5 });
        
        skillLevels.forEach(skill => {
            skill.style.width = '0';
            skillObserver.observe(skill);
        });
    }
    
    // CV Download functionality
    const cvDownloadBtn = document.getElementById('cv-download');
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Here you would normally link to your actual CV file
            alert('CV download functionality will be implemented once the actual CV file is uploaded.');
            
            // For actual implementation:
            // window.location.href = "path/to/your/cv.pdf";
        });
    }
});

// Function to change the featured image in the gallery
function changeImage(src) {
    const featuredImage = document.getElementById('gallery-featured');
    
    // Add fade-out effect
    featuredImage.classList.add('fade-out');
    
    // Wait for fade-out animation to complete
    setTimeout(() => {
        // Change the image source
        featuredImage.src = src;
        
        // Remove fade-out and add fade-in effect
        featuredImage.classList.remove('fade-out');
        featuredImage.classList.add('fade-in');
        
        // Remove fade-in class after animation completes
        setTimeout(() => {
            featuredImage.classList.remove('fade-in');
        }, 500);
    }, 300);
}

// Add animation styles to the stylesheet
document.addEventListener('DOMContentLoaded', function() {
    // Create a style element
    const style = document.createElement('style');
    
    // Add the CSS animations
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .fade-in {
            animation: fadeIn 0.5s forwards;
        }
        
        .fade-out {
            animation: fadeOut 0.3s forwards;
        }
    `;
    
    // Append the style to the document head
    document.head.appendChild(style);
    
    // Initialize image gallery if it exists
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        // Set the first image as active
        galleryItems[0].classList.add('active');
    }
});

// Event tracking functionality as required in the assignment (Q2)
document.addEventListener('DOMContentLoaded', function() {
    // Function to log events with timestamp, event type, and object information
    function logEvent(eventType, eventObject) {
        const timestamp = new Date().toISOString();
        const objectInfo = eventObject.tagName ? 
            `${eventObject.tagName.toLowerCase()}${eventObject.id ? `#${eventObject.id}` : ''}${eventObject.className ? `.${Array.from(eventObject.classList).join('.')}` : ''}` : 
            'unknown';
        
        console.log(`${timestamp}, ${eventType}, ${objectInfo}`);
    }
    
    // Track clicks on all elements
    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        logEvent('click', clickedElement);
    });
    
    // Track page views with Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logEvent('view', entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all important elements in the page
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Also observe images, buttons, and other interactive elements
    const observableElements = document.querySelectorAll('img, button, a, .gallery-item, .achievement-card');
    observableElements.forEach(element => {
        observer.observe(element);
    });
    
    // Log initial page load
    logEvent('view', document.body);
    
    console.log('Event tracking initialized. All clicks and views will be logged to the console.');
});