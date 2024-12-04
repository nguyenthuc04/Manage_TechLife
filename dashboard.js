// Kiểm tra nếu người dùng đã đăng nhập
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

window.onload = () => {
    const loginMessage = localStorage.getItem('loginMessage');
    if (loginMessage) {
        alert(loginMessage); // Hiển thị thông báo khi chuyển sang trang dashboard
        localStorage.removeItem('loginMessage'); // Xóa thông báo sau khi đã hiển thị
    }
};

if (!user || !token) {
    // Nếu không có user hoặc token, chuyển hướng về login
    window.location.href = "login.html";
} else {
    // Nếu có user, hiển thị thông tin người dùng
    console.log(user); // Thông tin người dùng
    document.getElementById('user-name').innerHTML = user.name;
    document.getElementById('name-user-2').innerHTML = user.account;
    document.getElementById("profileImage").src = user.avatar
    document.getElementById("typeAccount").innerHTML = user.accountType
}

if (user.accountType === "staff") {
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

if (user.accountType === "admin") {
    document.getElementById("idKDreel").style.display = "none"
    document.getElementById("idKDthanhtoan").style.display = "none"
    document.getElementById("idKDmenter").style.display = "none"
    document.getElementById("idKDkhoahoc").style.display = "none"
    document.getElementById("idKDbaiviet").style.display = "none"
    document.getElementById("idKDdanhgia").style.display = "none"
    document.getElementById("titleKD").style.display = "none"
}

const logout = () => {
    // Hiển thị hộp thoại xác nhận
    const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (isConfirmed) {
        // Xóa thông tin người dùng và token khỏi localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Chuyển hướng về trang đăng nhập
        window.location.href = "./login.html"; // Đổi đường dẫn đến trang đăng nhập của bạn
    }
};
const ip = localStorage.getItem('ipAddress');
const API_URL = `http://${ip}:3000`;

// Lấy thống kê người dùng
async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {totalUsers} = await response.json();

        document.getElementById('totalUsers').textContent = totalUsers;
    } catch (error) {
        console.error('Error fetching total users:', error);
        alert('Lỗi khi lấy tổng số người dùng. Vui lòng thử lại.');
    }
}

// Lấy tổng số khóa học
async function fetchCourseStats() {
    try {
        const response = await fetch(`${API_URL}/totalCoursesQT`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {totalCourses} = await response.json();

        document.getElementById('totalCourses').textContent = totalCourses;
    } catch (error) {
        console.error('Error fetching course stats:', error);
        alert('Lỗi khi lấy thống kê khóa học. Vui lòng thử lại.');
    }
}

// Lấy tổng số bài viết
async function fetchPostStats() {
    try {
        const response = await fetch(`${API_URL}/totalPostsQT`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {totalPosts} = await response.json();

        document.getElementById('totalPosts').textContent = totalPosts;
    } catch (error) {
        console.error('Error fetching post stats:', error);
        alert('Lỗi khi lấy thống kê bài viết. Vui lòng thử lại.');
    }
}

// Lấy tổng số reels
async function fetchReelStats() {
    try {
        const response = await fetch(`${API_URL}/totalReelsQT`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {totalReels} = await response.json();

        document.getElementById('totalReels').textContent = totalReels;
    } catch (error) {
        console.error('Error fetching reel stats:', error);
        alert('Lỗi khi lấy thống kê reels. Vui lòng thử lại.');
    }
}

// Lấy tổng số doanh thu
async function fetchRevenueStats() {
    try {
        const response = await fetch(`${API_URL}/mentor-statistics`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {totalRevenue} = await response.json();

        // Format the revenue number with commas and append "VND"
        const formattedRevenue = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(totalRevenue);

        document.getElementById('totalRevenue').textContent = formattedRevenue;
    } catch (error) {
        console.error('Error fetching revenue stats:', error);
        alert('Lỗi khi lấy thống kê doanh thu. Vui lòng thử lại.');
    }
}

// Lấy người dùng hoạt động nhiều nhất
async function fetchMostActiveUsers() {
    try {
        const response = await fetch(`${API_URL}/most-active-users`);
        const users = await response.json();
        const userList = document.getElementById('activeUsersList');

        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${user.avatar}" alt="${user.name}">
                <div>
                    <p><strong>${user.name}</strong> (${user.nickname})</p>
                    <p>Đăng nhập cuối: ${new Date(user.lastLog).toLocaleString()}</p>
                </div>
            `;
            userList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching most active users:', error);
    }
}

// Lấy bài viết được thích nhiều nhất
async function fetchMostLikedPosts() {
    try {
        const response = await fetch(`${API_URL}/most-liked-posts`);
        const posts = await response.json();
        const postList = document.getElementById('likedPostsList');

        posts.forEach(post => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${post.userImageUrl}" alt="${post.userName}">
                <div>
                    <p><strong>${post.userName}</strong></p>
                    <p>${post.caption}</p>
                    <p><strong>${post.likesCount}</strong> lượt thích</p>
                </div>
            `;
            postList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching most liked posts:', error);
    }
}

async function fetchEngagementStats() {
    try {
        const response = await fetch(`${API_URL}/statsPostReel`); // Thay URL API của bạn
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // Lấy dữ liệu thống kê
        const totalPosts = data.totalPosts;
        const totalLikesPosts = data.totalLikesPosts;
        const totalCommentsPosts = data.totalCommentsPosts;
        const totalReels = data.totalReels;
        const totalLikesReels = data.totalLikesReels;
        const totalCommentsReels = data.totalCommentsReels;

        // Vẽ biểu đồ
        const ctx = document.getElementById('engagementChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Bài viết', 'Reels', 'Lượt thích Bài viết', 'Lượt thích Reels', 'Bình luận Bài viết', 'Bình luận Reels'],
                datasets: [{
                    label: 'Mức độ tương tác',
                    data: [
                        totalPosts,
                        totalReels,
                        totalLikesPosts,
                        totalLikesReels,
                        totalCommentsPosts,
                        totalCommentsReels
                    ],
                    backgroundColor: ['#3498db', '#1abc9c', '#9b59b6', '#e74c3c', '#f1c40f', '#2ecc71'],
                    borderColor: ['#2980b9', '#16a085', '#8e44ad', '#c0392b', '#f39c12', '#27ae60'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Biểu đồ tương tác bài viết và reels'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    fetchCourseStats();
    fetchPostStats();
    fetchReelStats();
    fetchRevenueStats()
    fetchMostActiveUsers();
    fetchMostLikedPosts();
    fetchEngagementStats()
});
