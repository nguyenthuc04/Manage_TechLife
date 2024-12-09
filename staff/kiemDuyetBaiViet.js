const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || !token) {
    window.location.href = "../login.html";
} else {
    console.log(user);
    document.getElementById('user-name').innerHTML = user.name;
    document.getElementById('name-user-2').innerHTML = user.account;
    document.getElementById("profileImage").src = user.avatar
    document.getElementById("typeAccount").innerHTML = user.accountType
}

if(user.accountType === "staff") {
    document.getElementById("idTKmenter_mentee").style.display = "none"
    document.getElementById("idTKdoanhthu").style.display = "none"
    document.getElementById("idTKkhoahoc").style.display = "none"
    document.getElementById("idQLuser").style.display = "none"
    document.getElementById("idQLtb").style.display = "none"
    document.getElementById("idQLnv").style.display = "none"
    document.getElementById("idBXH").style.display = "none"
    document.getElementById("titleTK").style.display = "none"
    document.getElementById("titleQL").style.display = "none"
}

if(user.accountType === "admin") {
    document.getElementById("idKDreel").style.display = "none"
    document.getElementById("idKDthanhtoan").style.display = "none"
    document.getElementById("idKDmenter").style.display = "none"
    document.getElementById("idKDkhoahoc").style.display = "none"
    document.getElementById("idKDbaiviet").style.display = "none"
    document.getElementById("idKDdanhgia").style.display = "none"
    document.getElementById("titleKD").style.display = "none"
}

const logout = () => {
    const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = "../login.html";
    }
};

const ip = localStorage.getItem('ipAddress');
const API_URL = `http://${ip}:3000/postsQT`;

function fetchAcceptedPosts() {
    console.log('Đang tải danh sách bài viết đã chấp nhận...');
    const acceptedPostsList = document.getElementById('accepted-posts-list');

    fetch(`${API_URL}/accepted`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            console.log('Đã nhận được dữ liệu:', posts);
            // Sort posts by acceptedAt date, most recent first
            posts.sort((a, b) => new Date(b.acceptedAt) - new Date(a.acceptedAt));
            displayAcceptedPosts(posts);
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách bài viết đã chấp nhận:', error);
            acceptedPostsList.innerHTML = `<p>Đã xảy ra lỗi khi tải danh sách bài viết đã chấp nhận: ${error.message}</p>`;
        });
}

function displayAcceptedPosts(posts) {
    const acceptedPostsList = document.getElementById('accepted-posts-list');
    acceptedPostsList.innerHTML = '';

    if (posts.length === 0) {
        acceptedPostsList.innerHTML = '<p>Không có bài viết nào đã được chấp nhận.</p>';
    } else {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card';

            let imagesHtml = '';
            let imageClass = '';

            if (Array.isArray(post.imageUrl) && post.imageUrl.length > 0) {
                const imageCount = post.imageUrl.length;
                if (imageCount === 1) imageClass = 'single';
                else if (imageCount === 2) imageClass = 'double';
                else if (imageCount === 3) imageClass = 'triple';
                else if (imageCount === 4) imageClass = 'quad';
                else imageClass = 'many';

                imagesHtml = `
                    <div class="post-images ${imageClass}">
                        ${post.imageUrl.map(url => `<img src="${url}" alt="Post Image">`).join('')}
                    </div>
                `;
            }

            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.userImageUrl}" alt="${post.userName}">
                    <div class="user-info">
                        <div class="name">${post.userName}</div>
                        <div class="date">${new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.caption}</p>
                    ${imagesHtml}
                </div>
                <div class="accepted-info">
                    Chấp nhận lúc: ${new Date(post.acceptedAt).toLocaleString()}
                </div>
                <div class="post-actions">
                    <button onclick="unarchivePost('${post._id}')" class="unarchive-button">Hủy</button>
                </div>
            `;
            acceptedPostsList.appendChild(postElement);
        });
    }
}

function unarchivePost(postId) {
    if (confirm('Bạn có chắc chắn muốn hủy lưu trữ bài viết này không?')) {
        fetch(`${API_URL}/${postId}/unarchive`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Bài viết đã được hủy lưu trữ và chuyển về danh sách chờ kiểm duyệt.');
                    fetchPosts();
                    fetchAcceptedPosts();
                } else {
                    alert('Có lỗi xảy ra khi hủy lưu trữ bài viết.');
                }
            })
            .catch(error => {
                console.error('Lỗi khi hủy lưu trữ bài viết:', error);
                alert('Có lỗi xảy ra khi hủy lưu trữ bài viết.');
            });
    }
}

function acceptPost(postId) {
    console.log('Đang chấp nhận bài viết:', postId);
    fetch(`${API_URL}/${postId}/accept`, {
        method: 'PUT',
    })
        .then(response => response.json())
        .then(data => {
            if (data.post) {
                console.log('Bài viết đã được chấp nhận:', data.post);
                alert('Bài viết đã được chấp nhận và lưu trữ.');
                fetchPosts();
                fetchAcceptedPosts();
            } else {
                throw new Error('Không nhận được dữ liệu bài viết từ server');
            }
        })
        .catch(error => console.error('Lỗi khi chấp nhận bài viết:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const pendingTab = document.getElementById('pending-tab');
    const acceptedTab = document.getElementById('accepted-tab');
    const postList = document.getElementById('post-list');
    const acceptedPostsContainer = document.getElementById('accepted-posts-container');

    pendingTab.addEventListener('click', function() {
        pendingTab.classList.add('active');
        acceptedTab.classList.remove('active');
        postList.classList.add('active');
        acceptedPostsContainer.classList.remove('active');
        fetchPosts();
    });

    acceptedTab.addEventListener('click', function() {
        acceptedTab.classList.add('active');
        pendingTab.classList.remove('active');
        acceptedPostsContainer.classList.add('active');
        postList.classList.remove('active');
        fetchAcceptedPosts();
    });

    fetchPosts();
});

function fetchPosts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(posts => {
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const postList = document.getElementById('post-list');
            postList.innerHTML = '';

            posts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.className = 'post-card';

                let imagesHtml = '';
                let imageClass = '';

                if (Array.isArray(post.imageUrl) && post.imageUrl.length > 0) {
                    const imageCount = post.imageUrl.length;
                    if (imageCount === 1) imageClass = 'single';
                    else if (imageCount === 2) imageClass = 'double';
                    else if (imageCount === 3) imageClass = 'triple';
                    else if (imageCount === 4) imageClass = 'quad';
                    else imageClass = 'many';

                    imagesHtml = `
                        <div class="post-images ${imageClass}">
                            ${post.imageUrl.map(url => `<img src="${url}" alt="Post Image">`).join('')}
                        </div>
                    `;
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
                        ${imagesHtml}
                    </div>
                    <div class="post-actions">
                        <button onclick="acceptPost('${post._id}')" class="accept-button">Đã kiểm tra</button>
                        <button onclick="deletePost('${post._id}')" class="reject-button">Từ chối</button>
                    </div>
                `;
                postList.appendChild(postCard);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}

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

