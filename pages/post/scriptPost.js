// function fetchPosts() {
//     fetch('http://192.168.1.122:3000/moderation')
//         .then(response => response.json())
//         .then(posts => {
//             const container = document.getElementById('posts-container');
//             container.innerHTML = '';
//             posts.forEach(post => {
//                 const postElement = createPostElement(post);
//                 container.appendChild(postElement);
//             });
//         })
//         .catch(error => console.error('Error:', error));
// }
//
// function createPostElement(post) {
//     const postDiv = document.createElement('div');
//     postDiv.className = 'post';
//     postDiv.innerHTML = `
//         <div class="post-header">
//           <img src="${post.userImageUrl}" alt="${post.userName}">
//           <div>
//             <h3>${post.userName}</h3>
//             <p class="post-time">${new Date(post.createdAt).toLocaleString()}</p>
//           </div>
//         </div>
//         <div class="post-content">
//           <p>${post.caption}</p>
//           <img src="${post.imageUrl}" alt="Post image">
//         </div>
//         <div class="post-footer">
//           <div>
//             <span>Likes: ${post.likesCount} | Comments: ${post.commentsCount}</span>
//           </div>
//           <div class="post-actions">
//             <button class="approve" onclick="moderatePost('${post._id}', 'approved')">Phê duyệt</button>
//             <button class="reject" onclick="moderatePost('${post._id}', 'rejected')">Từ chối</button>
//           </div>
//         </div>
//       `;
//     return postDiv;
// }
//
// function moderatePost(postId, status) {
//     fetch(`http://192.168.1.122:3000/moderation/${postId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ moderationStatus: status }),
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//             fetchPosts(); // Refresh the list after moderation
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }
//
// // Fetch posts when the page loads
// fetchPosts();

const API_URL = 'http://192.168.1.122:3000/api/posts';

// Lấy danh sách bài viết
function fetchPosts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = ''; // Xóa nội dung cũ

            posts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.className = 'post-card';

                // Kiểm tra nếu post có imageUrl là mảng và có ảnh
                let images = '';
                if (Array.isArray(post.imageUrl) && post.imageUrl.length > 0) {
                    // Lặp qua mảng imageUrl và hiển thị các ảnh
                    images = post.imageUrl.map(url => `<img src="${url}" alt="Ảnh bài viết">`).join('');
                }

                postCard.innerHTML = `
                    <div class="post-header">
                        <img src="${post.userImageUrl}" alt="${post.userName}">
                        <div class="user-info">
                            <div class="name">${post.userName}</div>
                            <div class="date">${new Date(post.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="post-content">
                        <p>${post.caption}</p>
                        <div class="post-images">
                            ${images} <!-- Hiển thị ảnh từ mảng imageUrl -->
                        </div>
                    </div>
                    <div class="post-actions">
                        <button onclick="deletePost('${post._id}')">Xóa</button>
                    </div>
                `;
                postList.appendChild(postCard);
            });
        })
        .catch(error => console.error('Lỗi khi lấy danh sách bài viết:', error));
}

// Xóa bài viết
function deletePost(postId) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
        fetch(`${API_URL}/${postId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchPosts(); // Refresh danh sách bài viết
            })
            .catch(error => console.error('Lỗi khi xóa bài viết:', error));
    }
}

