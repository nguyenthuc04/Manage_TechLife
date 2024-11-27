const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || !token) {
    // Nếu không có user hoặc token, chuyển hướng về login
    window.location.href = "../login.html";
} else {
    // Nếu có user, hiển thị thông tin người dùng
    console.log(user); // Thông tin người dùng
    document.getElementById('user-name').innerHTML = user.name;
    document.getElementById('name-user-2').innerHTML = user.account;
    document.getElementById("profileImage").src = user.avatar;
    document.getElementById("typeAccount").innerHTML = user.accountType;
}

if (user.accountType === "staff") {
    document.getElementById("idTKmenter_mentee").style.display = "none";
    document.getElementById("idTKdoanhthu").style.display = "none";
    document.getElementById("idTKkhoahoc").style.display = "none";
    document.getElementById("idQLuser").style.display = "none";
    document.getElementById("idQLtb").style.display = "none";
    document.getElementById("idQLnv").style.display = "none";
    document.getElementById("idBXH").style.display = "none";
    document.getElementById("titleTK").style.display = "none";
    document.getElementById("titleQL").style.display = "none";
}

if (user.accountType === "admin") {
    document.getElementById("idKDreel").style.display = "none";
    document.getElementById("idKDthanhtoan").style.display = "none";
    document.getElementById("idKDmenter").style.display = "none";
    document.getElementById("idKDkhoahoc").style.display = "none";
    document.getElementById("idKDbaiviet").style.display = "none";
    document.getElementById("idKDdanhgia").style.display = "none";
    document.getElementById("titleKD").style.display = "none";
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
const API_URL = `http://${ip}:3000/reelsQT`;

function fetchAcceptedReels() {
    console.log('Đang tải danh sách reels đã chấp nhận...');
    const acceptedPostsList = document.getElementById('accepted-posts-list');

    fetch(`${API_URL}/accepted`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(reels => {
            console.log('Đã nhận được dữ liệu:', reels);
            // Sort posts by acceptedAt date, most recent first
            reels.sort((a, b) => new Date(b.acceptedAt) - new Date(a.acceptedAt));
            displayAcceptedReels(reels);
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách reels đã chấp nhận:', error);
            acceptedPostsList.innerHTML = `<p>Đã xảy ra lỗi khi tải danh sách reels đã chấp nhận: ${error.message}</p>`;
        });
}

function displayAcceptedReels(reels) {
    const acceptedReelsList = document.getElementById('accepted-posts-list');
    acceptedReelsList.innerHTML = '';

    if (reels.length === 0) {
        acceptedReelsList.innerHTML = '<p>Không có bài viết nào đã được chấp nhận.</p>';
    } else {
        reels.forEach(reel => {
            const reelElement = document.createElement('div');
            reelElement.className = 'post-card';
            reelElement.innerHTML = `
                <div class="post-header">
                    <img src="${reel.userImageUrl}" alt="${reel.userName}">
                    <div class="user-info">
                        <div class="name">${reel.userName}</div>
                        <div class="date">${new Date(reel.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="post-content">
                    <p>${reel.caption}</p>
                    <div class="post-video video-container">
                        <video src="${reel.videoUrl}" controls></video>
                    </div>
                </div>
                <div class="accepted-info">
                    Chấp nhận lúc: ${new Date(reel.acceptedAt).toLocaleString()}
                </div>
                <div class="post-actions">
                    <button onclick="unarchiveReel('${reel._id}')" class="unarchive-button">Hủy lưu trữ</button>
                </div>
            `;
            acceptedReelsList.appendChild(reelElement);
        });
    }
}

function unarchiveReel(reelId) {
    if (confirm('Bạn có chắc chắn muốn hủy lưu trữ reels này không?')) {
        fetch(`${API_URL}/${reelId}/unarchive`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Reels đã được hủy lưu trữ và chuyển về danh sách chờ kiểm duyệt.');
                    fetchReels();
                    fetchAcceptedReels();
                } else {
                    alert('Có lỗi xảy ra khi hủy lưu trữ reels.');
                }
            })
            .catch(error => {
                console.error('Lỗi khi hủy lưu trữ reels:', error);
                alert('Có lỗi xảy ra khi hủy lưu trữ reels.');
            });
    }
}

function acceptReel(reelId) {
    console.log('Đang chấp nhận reels:', reelId);
    fetch(`${API_URL}/${reelId}/accept`, {
        method: 'PUT',
    })
        .then(response => response.json())
        .then(data => {
            if (data.reel) {
                console.log('Reels đã được chấp nhận:', data.reel);
                alert('Reels đã được chấp nhận và lưu trữ.');
                fetchReels();
                fetchAcceptedReels();
            } else {
                throw new Error('Không nhận được dữ liệu reels từ server');
            }
        })
        .catch(error => console.error('Lỗi khi chấp nhận reels:', error));
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
        fetchReels();
    });

    acceptedTab.addEventListener('click', function() {
        acceptedTab.classList.add('active');
        pendingTab.classList.remove('active');
        acceptedPostsContainer.classList.add('active');
        postList.classList.remove('active');
        fetchAcceptedReels();
    });

    fetchReels();
});

function fetchReels() {
    fetch(API_URL)
        .then(response => response.json())
        .then(reels => {
            reels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const reelList = document.getElementById('post-list');
            reelList.innerHTML = '';

            reels.forEach(reel => {
                const reelCard = document.createElement('div');
                reelCard.className = 'post-card';

                reelCard.innerHTML = `
                    <div class="post-header">
                        <img src="${reel.userImageUrl}" alt="${reel.userName}">
                        <div class="user-info">
                            <div class="name">${reel.userName}</div>
                            <div class="date">${new Date(reel.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="post-content">
                        <p>${reel.caption}</p>
                        <div class="post-video video-container">
                            <video src="${reel.videoUrl}" controls></video>
                        </div>
                    </div>
                    <div class="post-actions">
                        <button onclick="acceptReel('${reel._id}')" class="accept-button">Chấp nhận</button>
                        <button onclick="deleteReel('${reel._id}')" class="reject-button">Từ chối</button>
                    </div>
                `;
                reelList.appendChild(reelCard);
            });
        })
        .catch(error => console.error('Error fetching reels:', error));
}

function deleteReel(reelId) {
    if (confirm('Bạn có chắc chắn muốn xóa reels này không?')) {
        fetch(`${API_URL}/${reelId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchReels(); // Refresh danh sách bài viết
            })
            .catch(error => console.error('Lỗi khi xóa reels:', error));
    }
}


