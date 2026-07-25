const BIN_URL = '[https://api.npoint.io/53653570b0945749c1f2](https://api.npoint.io/53653570b0945749c1f2)'; // Your free cloud JSON endpoint

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
            // 1. Fetch current posts
            const res = await fetch(BIN_URL);
            let posts = await res.json();
            
            // 2. Add new post to top
            posts.unshift(markdownData);
            
            // 3. Save back to cloud bin
            await fetch(BIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(posts)
            });
            
            // 4. Refresh feed
            this.fetch('newest');
        } catch (error) {
            console.error("Failed to save post:", error);
        }
    }
};
