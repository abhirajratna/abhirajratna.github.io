// Q2: Function to capture all click events and page views
document.addEventListener('DOMContentLoaded', function() {
    // Track page view when the page loads
    logEvent('view', 'page');
    
    // Track all click events
    document.addEventListener('click', function(event) {
        // Get information about the clicked element
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        let objectType = tagName;
        
        // Determine more specific object type based on element attributes or classes
        if (tagName === 'img') {
            objectType = 'image: ' + (target.alt || 'unnamed');
        } else if (tagName === 'a') {
            objectType = 'link: ' + (target.textContent || 'unnamed');
        } else if (tagName === 'button') {
            objectType = 'button: ' + (target.textContent || 'unnamed');
        } else if (tagName === 'input') {
            objectType = 'input: ' + (target.type || 'text');
        } else if (tagName === 'textarea') {
            objectType = 'textarea';
        } else if (tagName === 'select') {
            objectType = 'dropdown';
        } else if (target.classList.contains('tab')) {
            objectType = 'tab: ' + (target.textContent || 'unnamed');
        } else if (target.classList.contains('skill-level')) {
            objectType = 'skill bar: ' + (target.querySelector('.skill-name')?.textContent || 'unnamed');
        }
        
        // Log the event
        logEvent('click', objectType);
    });
    
    // Function to log events with timestamp and details
    function logEvent(eventType, objectType) {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp}, ${eventType}, ${objectType}`);
    }
    
    // Q3: Text Analysis Functionality
    const analyzeButton = document.getElementById('analyzeButton');
    const textInput = document.getElementById('textInput');
    
    // Handle tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Log tab view
            logEvent('view', `tab: ${tabName}`);
        });
    });
    
    if (analyzeButton && textInput) {
        analyzeButton.addEventListener('click', function() {
            const text = textInput.value;
            
            if (text.length < 1000) {
                alert('Please enter at least 1,000 words for analysis.');
                return;
            }
            
            // Basic text statistics
            const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
            const wordCount = text.trim().split(/\s+/).length;
            const spaceCount = (text.match(/\s/g) || []).length;
            const newlineCount = (text.match(/\n/g) || []).length;
            const specialCount = (text.match(/[^\w\s]/g) || []).length;
            
            document.getElementById('letterCount').textContent = `Letters: ${letterCount}`;
            document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
            document.getElementById('spaceCount').textContent = `Spaces: ${spaceCount}`;
            document.getElementById('newlineCount').textContent = `Newlines: ${newlineCount}`;
            document.getElementById('specialCount').textContent = `Special Symbols: ${specialCount}`;
            
            // Tokenize text into words
            const words = text.toLowerCase().match(/\b\w+\b/g) || [];
            
            // Count pronouns
            const pronouns = {
                'i': 0, 'me': 0, 'my': 0, 'mine': 0, 'myself': 0,
                'you': 0, 'your': 0, 'yours': 0, 'yourself': 0,
                'he': 0, 'him': 0, 'his': 0, 'himself': 0,
                'she': 0, 'her': 0, 'hers': 0, 'herself': 0,
                'it': 0, 'its': 0, 'itself': 0,
                'we': 0, 'us': 0, 'our': 0, 'ours': 0, 'ourselves': 0,
                'they': 0, 'them': 0, 'their': 0, 'theirs': 0, 'themselves': 0,
                'this': 0, 'that': 0, 'these': 0, 'those': 0,
                'who': 0, 'whom': 0, 'whose': 0,
                'which': 0, 'what': 0
            };
            
            // Count prepositions
            const prepositions = {
                'about': 0, 'above': 0, 'across': 0, 'after': 0, 'against': 0,
                'along': 0, 'among': 0, 'around': 0, 'at': 0, 'before': 0,
                'behind': 0, 'below': 0, 'beneath': 0, 'beside': 0, 'between': 0,
                'beyond': 0, 'by': 0, 'despite': 0, 'down': 0, 'during': 0,
                'except': 0, 'for': 0, 'from': 0, 'in': 0, 'inside': 0,
                'into': 0, 'like': 0, 'near': 0, 'of': 0, 'off': 0,
                'on': 0, 'onto': 0, 'out': 0, 'outside': 0, 'over': 0,
                'past': 0, 'since': 0, 'through': 0, 'throughout': 0, 'to': 0,
                'toward': 0, 'towards': 0, 'under': 0, 'underneath': 0, 'until': 0,
                'up': 0, 'upon': 0, 'with': 0, 'within': 0, 'without': 0
            };
            
            // Count indefinite articles
            const indefiniteArticles = {
                'a': 0, 'an': 0, 'some': 0, 'any': 0, 'many': 0, 'few': 0,
                'several': 0, 'each': 0, 'every': 0, 'either': 0, 'neither': 0
            };
            
            // Count occurrences
            words.forEach(word => {
                if (pronouns.hasOwnProperty(word)) {
                    pronouns[word]++;
                }
                if (prepositions.hasOwnProperty(word)) {
                    prepositions[word]++;
                }
                if (indefiniteArticles.hasOwnProperty(word)) {
                    indefiniteArticles[word]++;
                }
            });
            
            // Update pronoun table
            const pronounTable = document.getElementById('pronounTable');
            pronounTable.innerHTML = '<tr><th>Pronoun</th><th>Count</th></tr>';
            
            Object.entries(pronouns)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .forEach(([pronoun, count]) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${pronoun}</td><td>${count}</td>`;
                    pronounTable.appendChild(row);
                });
            
            // Update preposition table
            const prepositionTable = document.getElementById('prepositionTable');
            prepositionTable.innerHTML = '<tr><th>Preposition</th><th>Count</th></tr>';
            
            Object.entries(prepositions)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .forEach(([preposition, count]) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${preposition}</td><td>${count}</td>`;
                    prepositionTable.appendChild(row);
                });
            
            // Update indefinite article table
            const articleTable = document.getElementById('articleTable');
            articleTable.innerHTML = '<tr><th>Article</th><th>Count</th></tr>';
            
            Object.entries(indefiniteArticles)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .forEach(([article, count]) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${article}</td><td>${count}</td>`;
                    articleTable.appendChild(row);
                });
            
            // Log text analysis event
            logEvent('click', 'text analysis');
        });
    }
});