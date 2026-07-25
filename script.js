const BIN_URL = 'https://api.npoint.io/53653570b0945749c1f2';

const serverList = {
    fetch: async function(order) {
        try {
            const response = await fetch(BIN_URL);
            let posts = await response.json();
            
            const listContainer = document.getElementById('post-list');
            listContainer.innerHTML = '';
            
            posts.forEach(postContent => {
                const card = document.createElement('div');
                card.className = 'post-card';
                card.innerHTML = marked.parse(postContent);
                listContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    },
    
    append: async function(markdownData) {
        try {
            const res = await fetch(BIN_URL);
            if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
            let posts = await res.json();
            
            posts.unshift(markdownData);
            
            const updateRes = await fetch(BIN_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(posts)
            });
            
            if (!updateRes.ok) throw new Error(`Save failed with status ${updateRes.status}`);
            
            this.fetch('newest');
        } catch (error) {
            console.error("Failed to save post:", error);
            alert("Error saving post: " + error.message);
        }
    }
};

// Initial load
serverList.fetch('newest');

// State management for adding posts
let add = false;

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
        `
        addingContainer.appendChild(box);

        document.getElementById('send').addEventListener('click', async () => {
            const postText = document.getElementById('post-input').value;
            
            if (postText.trim() !== "") {
                await serverList.append(postText);
                add = false;
                renderUI();
            }
        });
    }
}

// Main plus button toggle
document.getElementById('post').addEventListener('click', () => {
    add = !add;
    renderUI();
});
