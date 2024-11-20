const API_URL = "http://26.187.200.144:3000";

// Load the list of posts
const loadPostsList = async () => {
    try {
        const response = await fetch(`${API_URL}/getListPosts`);
        if (!response.ok) throw new Error("Không thể tải danh sách bài viết.");

        const postsList = await response.json();
        const tableBody = document.getElementById("postTableBody");
        tableBody.innerHTML = ""; // Clear existing rows

        postsList.forEach((post) => {
            const row = `
                <tr>
                    <td>${post._id}</td>
                    <td>${post.title}</td>
                    <td>${new Date(post.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editPost('${post._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deletePost('${post._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
        alert("Lỗi khi tải danh sách bài viết!");
    }
};

// Add new post
const addPost = async (event) => {
    event.preventDefault();
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;

    try {
        const response = await fetch(`${API_URL}/createPost`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                content,
                date: new Date().toISOString()
            }),
        });

        if (!response.ok) throw new Error("Không thể thêm bài viết.");
        alert("Bài viết đã được thêm thành công!");
        document.getElementById("addPostForm").reset();
        $('#addPostModal').modal('hide');
        loadPostsList();  // Reload posts list after adding
    } catch (error) {
        console.error(error);
        alert("Lỗi khi thêm bài viết!");
    }
};

// Edit post (Functionality to be implemented)
const editPost = (id) => {
    console.log("Editing post", id);
    // Add your edit logic here
};

// Delete post
const deletePost = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;

    try {
        const response = await fetch(`${API_URL}/deletePost/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Không thể xóa bài viết.");
        alert("Bài viết đã được xóa thành công!");
        loadPostsList();  // Reload posts list after deleting
    } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa bài viết!");
    }
};

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    loadPostsList();  // Load posts when the page is loaded
    document.getElementById("addPostForm").addEventListener("submit", addPost);  // Handle post form submission
});
