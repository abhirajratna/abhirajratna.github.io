/**
 * Event Tracking System - Fixed Version
 * 
 * This script captures all click events and page views performed by a user
 * across HTML tags and CSS objects and logs them to the console in the format:
 * Timestamp_of_click, type of event (click/view), event object (drop-down, image, text etc.)
 * 
 * Created: 2025-04-15
 * Author: Abhiraj Ratna
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Event tracking system initialized.');
    
    // Track page load
    logEvent('view', document.body, 'page_load');
    
    // Object definitions for tracking
    const objectTypes = {
        'A': 'link',
        'BUTTON': 'button',
        'INPUT': function(element) {
            return element.type || 'input';
        },
        'SELECT': 'dropdown',
        'IMG': 'image',
        'P': 'text',
        'H1': 'heading',
        'H2': 'heading',
        'H3': 'heading',
        'H4': 'heading',
        'H5': 'heading',
        'H6': 'heading',
        'LI': 'list_item',
        'UL': 'list',
        'OL': 'ordered_list',
        'DIV': function(element) {
            try {
                // Try to determine what kind of div this is based on class or role
                if (!element || !element.classList) return 'div';
                
                if (element.classList.contains('nav-menu')) return 'navigation';
                if (element.classList.contains('gallery-item')) return 'gallery_image';
                if (element.classList.contains('skill-item')) return 'skill_bar';
                if (element.classList.contains('timeline-item')) return 'timeline_entry';
                if (element.classList.contains('achievement-card')) return 'achievement';
                
                // If we can't determine a specific type, check if it's a section container
                const parentSection = element.closest('section');
                if (parentSection && element.parentNode === parentSection) {
                    return `${parentSection.id || 'unknown'}_section_container`;
                }
                
                return 'div';
            } catch (error) {
                console.error("Error determining DIV type:", error);
                return 'div';
            }
        },
        'SECTION': function(element) {
            try {
                return `${element.id || 'unknown'}_section`;
            } catch (error) {
                console.error("Error determining SECTION type:", error);
                return 'section';
            }
        },
        'NAV': 'navigation',
        'TEXTAREA': 'text_input',
        'FORM': 'form'
    };

    /**
     * Log an event to the console with timestamp, event type, and object information
     * @param {string} eventType - Type of event (click or view)
     * @param {HTMLElement} element - The DOM element that triggered the event
     * @param {string} [customLabel] - Optional custom label for the event
     */
    function logEvent(eventType, element, customLabel = null) {
        try {
            // Check if element exists and is valid
            if (!element) {
                console.warn("Attempted to log event on null element");
                return;
            }
            
            // Get the current timestamp in ISO format
            const timestamp = new Date().toISOString();

            // Determine the object type based on the element tag
            let objectType = customLabel || getObjectType(element);

            // Add id or class information if available to make the log more specific
            let objectInfo = objectType;
            
            try {
                if (element.id) {
                    objectInfo += `#${element.id}`;
                } else if (element.className && typeof element.className === 'string' && element.className.trim() !== '') {
                    // Extract the first class name for brevity
                    const firstClass = element.className.split(' ')[0];
                    objectInfo += `.${firstClass}`;
                }
            } catch (error) {
                // Skip adding ID/class if there's an error
                console.warn("Error accessing element properties:", error);
            }

            // Get the element's text content, if any, to provide context
            let textContext = '';
            try {
                if (element.textContent && typeof element.children !== 'undefined' && element.children.length === 0) {
                    // Only include text for elements that don't have child elements
                    const trimmedText = element.textContent.trim();
                    if (trimmedText) {
                        textContext = trimmedText.length > 20 ? 
                            `"${trimmedText.substring(0, 20)}..."` : 
                            `"${trimmedText}"`;
                    }
                }
            } catch (error) {
                // Skip adding text context if there's an error
                console.warn("Error getting text content:", error);
            }

            // Add the text context to the object info if available
            if (textContext) {
                objectInfo += ` ${textContext}`;
            }

            // Log the event to the console in the specified format
            console.log(`${timestamp}, ${eventType}, ${objectInfo}`);
        } catch (error) {
            console.error("Error in logEvent:", error);
        }
    }

    /**
     * Safely determine the type of object based on its tag name and properties
     * @param {HTMLElement} element - The DOM element
     * @return {string} The object type
     */
    function getObjectType(element) {
        try {
            if (!element || !element.tagName) return 'unknown';
            
            const tagName = element.tagName.toUpperCase();
            
            // Use the objectTypes mapping to determine the object type
            const type = objectTypes[tagName];
            
            if (typeof type === 'function') {
                // If the type is a function, call it with the element to determine the type
                return type(element);
            } else if (type) {
                // If we have a direct mapping, use it
                return type;
            } else {
                // If we don't have a mapping, return the lowercase tag name
                return tagName.toLowerCase();
            }
        } catch (error) {
            console.error("Error in getObjectType:", error);
            return 'unknown';
        }
    }

    /**
     * Set up click tracking for all elements
     */
    document.addEventListener('click', function(event) {
        try {
            // Get the clicked element
            const element = event.target;
            
            // Log the click event
            logEvent('click', element);
        } catch (error) {
            console.error("Error in click tracking:", error);
        }
    });

    /**
     * Set up view tracking using Intersection Observer
     */
    const viewObserver = new IntersectionObserver((entries) => {
        try {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element has entered the viewport
                    logEvent('view', entry.target);
                }
            });
        } catch (error) {
            console.error("Error in Intersection Observer callback:", error);
        }
    }, { threshold: 0.5 }); // Element is considered viewed when 50% visible

    /**
     * Track views for all important elements
     */
    function setupViewTracking() {
        try {
            // Track views for sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                try {
                    viewObserver.observe(section);
                } catch (error) {
                    console.warn("Could not observe section:", error);
                }
            });

            // Track views for major content elements - with more selective approach
            const selectors = [
                'img', '.gallery-item', '.skill-item', '.timeline-item',
                '.achievement-card', '.nav-link', '#text-input', 
                '.profile-img', 'h1', 'h2.section-title'
            ];
            
            // Try each selector individually to avoid errors
            selectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        try {
                            viewObserver.observe(element);
                        } catch (innerError) {
                            console.warn(`Could not observe element with selector ${selector}:`, innerError);
                        }
                    });
                } catch (error) {
                    console.warn(`Error with selector ${selector}:`, error);
                }
            });
        } catch (error) {
            console.error("Error in setupViewTracking:", error);
        }
    }

    // Initialize view tracking with a slight delay to ensure DOM is fully loaded
    setTimeout(setupViewTracking, 500);
    
    // Set up form interaction tracking
    try {
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', function() {
                logEvent('click', this, 'analyze_text_button');
                
                // Also log the text input usage
                try {
                    const textInput = document.getElementById('text-input');
                    if (textInput) {
                        const textLength = textInput.value.length;
                        console.log(`${new Date().toISOString()}, input, text_analyzer_input (${textLength} characters)`);
                    }
                } catch (error) {
                    console.error("Error logging text input:", error);
                }
            });
        }
    } catch (error) {
        console.error("Error setting up analyze button tracking:", error);
    }
    
    // Track CV download
    try {
        const cvDownloadBtn = document.getElementById('cv-download');
        if (cvDownloadBtn) {
            cvDownloadBtn.addEventListener('click', function() {
                logEvent('click', this, 'cv_download_button');
            });
        }
    } catch (error) {
        console.error("Error setting up CV download tracking:", error);
    }
    
    // Track navigation menu opens/closes on mobile
    try {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                const isOpening = !this.classList.contains('active');
                logEvent('click', this, `menu_toggle_${isOpening ? 'open' : 'close'}`);
            });
        }
    } catch (error) {
        console.error("Error setting up menu toggle tracking:", error);
    }
    
    // Log page unload event
    window.addEventListener('beforeunload', function() {
        logEvent('view', document.body, 'page_unload');
    });
});