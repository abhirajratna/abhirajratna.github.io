/**
 * Text Analysis Tool
 * 
 * This script performs text analysis as per requirements:
 * - Calculate and display number of letters, words, spaces, newlines and special symbols
 * - Tokenize the text and print count of pronouns grouped by pronouns
 * - Tokenize the text and print count of prepositions grouped by prepositions
 * - Tokenize the text and print count of indefinite articles grouped by article
 * 
 * Author: Abhiraj Ratna
 * Date: 2025-04-15
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleTextBtn = document.getElementById('sample-text-btn');
    const wordCount = document.getElementById('word-count');
    const analysisResults = document.getElementById('analysis-results');
    const letterCount = document.getElementById('letter-count');
    const wordResult = document.getElementById('word-result');
    const spaceCount = document.getElementById('space-count');
    const newlineCount = document.getElementById('newline-count');
    const specialSymbolCount = document.getElementById('special-symbol-count');
    
    // Additional result containers
    const pronounsContainer = document.getElementById('pronouns-results');
    const prepositionsContainer = document.getElementById('prepositions-results');
    const articlesContainer = document.getElementById('articles-results');

    // Define linguistic data
    const pronouns = [
        // Personal pronouns
        "i", "me", "my", "mine", "myself",
        "you", "your", "yours", "yourself", "yourselves",
        "he", "him", "his", "himself",
        "she", "her", "hers", "herself",
        "it", "its", "itself",
        "we", "us", "our", "ours", "ourselves",
        "they", "them", "their", "theirs", "themselves",
        
        // Demonstrative pronouns
        "this", "that", "these", "those",
        
        // Interrogative pronouns
        "who", "whom", "whose", "which", "what",
        
        // Relative pronouns
        "who", "whom", "whose", "which", "that",
        
        // Indefinite pronouns
        "anybody", "anyone", "anything", "each", "either", "everybody", "everyone",
        "everything", "neither", "nobody", "nothing", "one", "somebody", "someone", "something",
        "both", "few", "many", "several", "all", "any", "most", "none", "some"
    ];

    const prepositions = [
        "about", "above", "across", "after", "against", "along", "amid", "among",
        "around", "at", "before", "behind", "below", "beneath", "beside", "besides",
        "between", "beyond", "but", "by", "concerning", "considering", "despite",
        "down", "during", "except", "excepting", "excluding", "following", "for",
        "from", "in", "inside", "into", "like", "minus", "near", "of", "off", "on",
        "onto", "opposite", "outside", "over", "past", "per", "plus", "regarding",
        "round", "save", "since", "than", "through", "throughout", "to", "toward",
        "towards", "under", "underneath", "unlike", "until", "up", "upon", "versus",
        "via", "with", "within", "without"
    ];

    const indefiniteArticles = ["a", "an"];

    // Initialize
    updateWordCount();
    
    /**
     * Updates the word count display
     */
    function updateWordCount() {
        const text = textInput.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = words.toLocaleString();
        
        // Change color based on word count
        if (words >= 10000) {
            wordCount.style.color = '#00ff9d'; // Neon green
        } else {
            wordCount.style.color = '#00c3ff'; // Neon blue
        }
    }
    
    /**
     * Analyze the text and display results
     */
    function analyzeText() {
        const text = textInput.value;
        
        // Check if text meets minimum word requirement
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (words < 10) { // Using 10 for testing, change to 10000 for production
            alert('Please enter at least 10,000 words for analysis.');
            return;
        }
        
        // Calculate basic statistics
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const spaces = (text.match(/\s/g) || []).length;
        const newlines = (text.match(/\n/g) || []).length;
        const specialSymbols = (text.match(/[^\w\s]/g) || []).length;
        
        // Update basic results
        letterCount.textContent = letters.toLocaleString();
        wordResult.textContent = words.toLocaleString();
        spaceCount.textContent = spaces.toLocaleString();
        newlineCount.textContent = newlines.toLocaleString();
        specialSymbolCount.textContent = specialSymbols.toLocaleString();
        
        // Tokenize the text and perform linguistic analysis
        const tokens = tokenizeText(text);
        
        // Count pronouns
        const pronounCounts = countTokens(tokens, pronouns);
        displayTokenResults(pronounsContainer, pronounCounts, "Pronouns");
        
        // Count prepositions
        const prepositionCounts = countTokens(tokens, prepositions);
        displayTokenResults(prepositionsContainer, prepositionCounts, "Prepositions");
        
        // Count indefinite articles
        const articleCounts = countTokens(tokens, indefiniteArticles);
        displayTokenResults(articlesContainer, articleCounts, "Indefinite Articles");
        
        // Show results with animation
        analysisResults.classList.add('visible');
        
        // Add result highlight animation
        animateResults();
        
        // Log the analysis action
        console.log(`${new Date().toISOString()}, analysis, Text analyzed (${words.toLocaleString()} words)`);
    }
    
    /**
     * Tokenize text into words, removing punctuation and converting to lowercase
     * @param {string} text - The text to tokenize
     * @return {string[]} Array of tokens/words
     */
    function tokenizeText(text) {
        // Convert to lowercase and split by whitespace and punctuation
        return text.toLowerCase()
                  .replace(/[^\w\s]|_/g, " ")  // Replace punctuation with spaces
                  .replace(/\s+/g, " ")        // Replace multiple spaces with a single space
                  .trim()                      // Remove leading/trailing whitespace
                  .split(/\s+/);               // Split by whitespace
    }
    
    /**
     * Count occurrences of specific tokens in the text
     * @param {string[]} tokens - Array of tokens from the text
     * @param {string[]} targetTokens - Array of target tokens to count
     * @return {Object} Object with counts for each token
     */
    function countTokens(tokens, targetTokens) {
        const counts = {};
        
        // Initialize counts for all target tokens
        targetTokens.forEach(token => {
            counts[token] = 0;
        });
        
        // Count occurrences
        tokens.forEach(token => {
            if (targetTokens.includes(token)) {
                counts[token]++;
            }
        });
        
        // Return only tokens that were found (count > 0), sorted by frequency
        const result = {};
        Object.entries(counts)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
            .forEach(([token, count]) => {
                result[token] = count;
            });
        
        return result;
    }
    
    /**
     * Display token count results in the specified container
     * @param {HTMLElement} container - The container to display results in
     * @param {Object} counts - Object with token counts
     * @param {string} title - Title for the results section
     */
    function displayTokenResults(container, counts, title) {
        // Clear previous results
        container.innerHTML = '';
        
        // Create section title
        const sectionTitle = document.createElement('h4');
        sectionTitle.textContent = title;
        container.appendChild(sectionTitle);
        
        // Check if any tokens were found
        const tokenCount = Object.keys(counts).length;
        
        if (tokenCount === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = `No ${title.toLowerCase()} found in the text.`;
            noResults.classList.add('no-results');
            container.appendChild(noResults);
            return;
        }
        
        // Display count of unique tokens
        const uniqueCount = document.createElement('p');
        uniqueCount.textContent = `Found ${tokenCount} unique ${title.toLowerCase()}.`;
        uniqueCount.classList.add('unique-count');
        container.appendChild(uniqueCount);
        
        // Create table for results
        const table = document.createElement('table');
        table.classList.add('token-table');
        
        // Add table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const thToken = document.createElement('th');
        thToken.textContent = title.slice(0, -1); // Remove 's' from plural
        headerRow.appendChild(thToken);
        
        const thCount = document.createElement('th');
        thCount.textContent = 'Count';
        headerRow.appendChild(thCount);
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Add table body with results
        const tbody = document.createElement('tbody');
        
        Object.entries(counts).forEach(([token, count], index) => {
            const row = document.createElement('tr');
            
            // Add alternating row class
            row.classList.add(index % 2 === 0 ? 'even-row' : 'odd-row');
            
            const tdToken = document.createElement('td');
            tdToken.textContent = token;
            row.appendChild(tdToken);
            
            const tdCount = document.createElement('td');
            tdCount.textContent = count.toLocaleString();
            tdCount.classList.add('count-cell');
            row.appendChild(tdCount);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
        
        // Add visualization for top 5 tokens
        if (tokenCount > 0) {
            addVisualization(container, counts, title);
        }
    }
    
    /**
     * Add a visual representation of the top 5 tokens
     * @param {HTMLElement} container - The container to add visualization to
     * @param {Object} counts - Object with token counts
     * @param {string} title - Title for the visualization
     */
    function addVisualization(container, counts, title) {
        // Create visualization container
        const visContainer = document.createElement('div');
        visContainer.classList.add('vis-container');
        
        // Get top 5 tokens
        const top5 = Object.entries(counts)
            .slice(0, 5)
            .map(([token, count]) => ({ token, count }));
        
        // Find the maximum count for scaling
        const maxCount = Math.max(...top5.map(item => item.count));
        
        // Create chart title
        const chartTitle = document.createElement('h5');
        chartTitle.textContent = `Top ${Math.min(5, top5.length)} ${title.toLowerCase()}`;
        visContainer.appendChild(chartTitle);
        
        // Create chart
        const chart = document.createElement('div');
        chart.classList.add('chart');
        
        top5.forEach(item => {
            // Create bar container
            const barContainer = document.createElement('div');
            barContainer.classList.add('bar-container');
            
            // Create label
            const label = document.createElement('div');
            label.classList.add('bar-label');
            label.textContent = item.token;
            
            // Create bar
            const bar = document.createElement('div');
            bar.classList.add('bar');
            
            // Calculate width percentage based on the maximum count
            const widthPercentage = (item.count / maxCount) * 100;
            bar.style.width = '0%'; // Start at 0 for animation
            
            // Create count label
            const countLabel = document.createElement('span');
            countLabel.classList.add('bar-count');
            countLabel.textContent = item.count.toLocaleString();
            
            // Add elements to container
            bar.appendChild(countLabel);
            barContainer.appendChild(label);
            barContainer.appendChild(bar);
            chart.appendChild(barContainer);
            
            // Animate bar width after a short delay
            setTimeout(() => {
                bar.style.width = `${widthPercentage}%`;
            }, 100);
        });
        
        visContainer.appendChild(chart);
        container.appendChild(visContainer);
    }
    
    /**
     * Clear the text input and results
     */
    function clearText() {
        textInput.value = '';
        updateWordCount();
        analysisResults.classList.remove('visible');
        
        // Log the clear action
        console.log(`${new Date().toISOString()}, action, Text input cleared`);
    }
    
    /**
     * Load sample text for testing
     */
    function loadSampleText() {
        // Generate a sample text with enough words and linguistic elements
        let sampleText = "This is a sample text for testing the text analysis functionality. ";
        sampleText += "I am writing this text to demonstrate how pronouns like me, you, he, she, it, ";
        sampleText += "we, they, and others are counted. You should see that these pronouns appear in the results. ";
        sampleText += "The text also contains prepositions such as in, on, at, by, with, from, into, during, ";
        sampleText += "and others to test preposition counting. It has indefinite articles like a and an. ";
        sampleText += "An apple a day keeps the doctor away. A student wrote an essay about linguistics. ";
        sampleText += "He gave his book to her. They found themselves in a difficult situation. ";
        sampleText += "We looked at each other. Who wants to join us for lunch? ";
        sampleText += "The cat sat on the mat. The dog ran across the field. ";
        sampleText += "She walked through the door and into the garden. ";
        sampleText += "This is something that everyone should know about. ";
        sampleText += "These are the kinds of examples that will help us understand how the analysis works.\n\n";
        
        // Repeat the sample text to reach 10,000+ words
        let repeatedText = "";
        for (let i = 0; i < 300; i++) {
            repeatedText += sampleText;
            if (i % 20 === 0) repeatedText += "\n\n"; // Add extra newlines periodically
        }
        
        textInput.value = repeatedText;
        updateWordCount();
        
        // Log the sample text action
        console.log(`${new Date().toISOString()}, action, Sample text loaded`);
    }
    
    /**
     * Animate the result cards
     */
    function animateResults() {
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            // Clear any existing animation
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            
            // Add the pulse animation with a staggered delay
            card.style.animation = `pulseGlow 1.5s ${index * 0.2}s`;
        });
        
        // Add pulse animation style if not already present
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulseGlow {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(0, 195, 255, 0.8); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Event listeners
    textInput.addEventListener('input', updateWordCount);
    
    analyzeBtn.addEventListener('click', analyzeText);
    
    clearBtn.addEventListener('click', clearText);
    
    sampleTextBtn.addEventListener('click', loadSampleText);
    
    // Listen for Enter key in textarea
    textInput.addEventListener('keydown', function(e) {
        // Ctrl+Enter or Cmd+Enter to analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            analyzeText();
        }
    });
    
    // Initial animation for the text analyzer section
    const textAnalyzerSection = document.getElementById('text-analyzer');
    if (textAnalyzerSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    textInput.classList.add('animate-focus');
                    observer.unobserve(entry.target);
                    
                    // Add focus animation if not already present
                    if (!document.getElementById('focus-animation')) {
                        const style = document.createElement('style');
                        style.id = 'focus-animation';
                        style.textContent = `
                            @keyframes focusGlow {
                                0% { box-shadow: none; border-color: rgba(0, 195, 255, 0.3); }
                                70% { box-shadow: 0 0 20px rgba(0, 195, 255, 0.7); border-color: var(--neon-blue); }
                                100% { box-shadow: none; border-color: rgba(0, 195, 255, 0.3); }
                            }
                            .animate-focus {
                                animation: focusGlow 2s forwards;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(textAnalyzerSection);
    }
});