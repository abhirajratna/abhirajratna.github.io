/**
 * Tab functionality for the Text Analysis Tool
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and tab panes
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Add click event to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get target tab pane
            const tabId = this.getAttribute('data-tab');
            const tabPane = document.getElementById(tabId);
            
            // Activate the target tab pane
            if (tabPane) {
                tabPane.classList.add('active');
            }
        });
    });
});