// Base API URL
const API_URL = "http://192.168.0.105:3000"; // Update with your actual backend URL

// Load Posts
const loadPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/api/posts`);
        if (!response.ok) throw new Error("Failed to fetch posts");

        const posts = await response.json();
        const tableBody = document.getElementById("postTable");
        tableBody.innerHTML = "";

        posts.forEach((post) => {
            const row = `
                <tr>
                    <td>${post._id}</td>
                    <td>${post.caption}</td>
                    <td>${post.imageUrl.join(", ") || "No Image"}</td>
                    <td>${post.likesCount}</td>
                    <td>${post.commentsCount}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editPost('${post._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deletePost('${post._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading posts:", error);
        alert("Failed to load posts!");
    }
};

// Edit Post
const editPost = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/posts/${id}`);
        if (!response.ok) throw new Error("Failed to fetch post");

        const post = await response.json();

        // Populate modal fields
        document.getElementById("editCaption").value = post.caption;
        document.getElementById("editImageUrl").value = post.imageUrl.join(", ");

        // Show modal
        $('#editPostModal').modal('show');

        // Update form submit action
        const form = document.getElementById("editPostForm");
        form.onsubmit = (event) => updatePost(event, id);
    } catch (error) {
        console.error("Error editing post:", error);
        alert("Failed to fetch post details!");
    }
};

// Update Post
const updatePost = async (event, id) => {
    event.preventDefault();

    const caption = document.getElementById("editCaption").value;
    const imageUrl = document.getElementById("editImageUrl").value.split(",").map((url) => url.trim());

    try {
        const response = await fetch(`${API_URL}/updatePost/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_data: JSON.stringify({ caption, imageUrl }) }),
        });

        if (!response.ok) throw new Error("Failed to update post");
        alert("Post updated successfully!");
        $('#editPostModal').modal('hide');
        loadPosts();
    } catch (error) {
        console.error("Error updating post:", error);
        alert("Failed to update post!");
    }
};

// Delete Post
const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        const response = await fetch(`${API_URL}/deletePost/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete post");
        alert("Post deleted successfully!");
        loadPosts();
    } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post!");
    }
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
});
