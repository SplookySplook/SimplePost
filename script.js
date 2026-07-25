// State management matching pseudocode toggle logic
let add = false;

// Mock server-list handler using localStorage for seamless local testing
const serverList = {
    fetch: function(serverName, order) {
        const rawData = localStorage.getItem(serverName);
        let posts = rawData ? JSON.parse(rawData) : [
            "### Hello World!\nWelcome to the anonymous markdown board.",
            "Testing out **bold** text and offline storage."
        ];
        
        if (order === 'newest') {
            // Assuming array items are pushed, reverse for newest first display if needed
            // Keeping order as stored or reversing depending on preference
        }
        
        const listContainer = document.getElementById('post-list');
        listContainer.innerHTML = '';
        
        posts.forEach(postContent => {
            const card = document.createElement('div');
            card.className = 'post-card';
            // Parse markdown using marked dependency
            card.innerHTML = marked.parse(postContent);
            listContainer.appendChild(card);
        });
    },
    
    append: function(serverName, markdownData) {
        const rawData = localStorage.getItem(serverName);
        let posts = rawData ? JSON.parse(rawData) : [];
        posts.unshift(markdownData); // Add to the top
        localStorage.setItem(serverName, JSON.stringify(posts));
        this.fetch(serverName, 'newest');
    }
};

// Render initial feed on load
serverList.fetch('feed', 'newest');

// UI Toggle Logic based on `add` state variable
function renderUI() {
    const addingContainer = document.getElementById('adding-container');
    addingContainer.innerHTML = '';

    if (add) {
        const box = document.createElement('div');
        box.className = 'adding-box';
        box.innerHTML = `
            <textarea id="post-input" placeholder="Enter your post..."></textarea>
            <button id="send" class="send-btn">
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                Send
            </button>
        `;
        addingContainer.appendChild(box);

        // Bind event for the dynamically generated send button
        document.getElementById('id-send')?.addEventListener('click', handleSend); // fallback safety
        document.getElementById('send').addEventListener('click', () => {
            console.log("button pressed!");
            const postText = document.getElementById('post-input').value;
            
            if (postText.trim() !== "") {
                // file.convert.md equivalent simulated via marked parser integration
                serverList.append('feed', postText);
                add = false;
                renderUI();
            }
        });
    }
}

// Event: id.post.pressed (Main plus button)
document.getElementById('post').addEventListener('click', () => {
    add = !add; // toggle state
    renderUI();
});
