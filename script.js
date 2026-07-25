const BIN_URL = 'https://api.jsonbin.io/v3/b/6a642557da38895dfe8cb0bd';

const serverList = {
    fetch: async function(order) {
        try {
            const response = await fetch(BIN_URL, {
                headers: {
                    'X-Master-Key': '$2a$10$9sgqjW/cI9A7s3SqU8Ye1.tWd.LfzmmY2x1J.TdhZWBALVNRCww/2'
                }
            });
            let data = await response.json();
            let posts = Array.isArray(data) ? data : (data.record || []);
            
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
            const res = await fetch(BIN_URL, {
                headers: {
                    'X-Master-Key': '$2a$10$9sgqjW/cI9A7s3SqU8Ye1.tWd.LfzmmY2x1J.TdhZWBALVNRCww/2'
                }
            });
            if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
            let data = await res.json();
            
            let posts = Array.isArray(data) ? data : (data.record || []);
            posts.unshift(markdownData);
            
            const updateRes = await fetch(BIN_URL, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$9sgqjW/cI9A7s3SqU8Ye1.tWd.LfzmmY2x1J.TdhZWBALVNRCww/2'
                },
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
