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
    // Hiển thị hộp thoại xác nhận
    const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (isConfirmed) {
        // Xóa thông tin người dùng và token khỏi localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Chuyển hướng về trang đăng nhập
        window.location.href = "../login.html"; // Đổi đường dẫn đến trang đăng nhập của bạn
    }
};

const ip = localStorage.getItem('ipAddress');
const API_URL = `http://${ip}:3000/reviewsQT`;

// Function to fetch the list of pending reviews
async function fetchPendingReviews() {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        const reviews = await response.json();
        renderReviews(reviews);  // Render the reviews on the table
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Function to render reviews in the table
function renderReviews(reviews) {
    const reviewList = document.getElementById("review-list");
    reviewList.innerHTML = ''; // Clear the current list

    reviews.forEach((review, index) => {
        const row = document.createElement("tr");

        // Escape the `_id` safely as a string in the function calls
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${review.idMentor}</td>
            <td>${review.rating}</td>
            <td>${review.comment}</td>
            <td>${review.userId}</td>
            <td>${review.date}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteReview('${review._id}')">Xóa</button>
            </td>
        `;

        reviewList.appendChild(row);
    });
}

// Function to delete a review
async function deleteReview(reviewId) {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) {
        fetch(`${API_URL}/${reviewId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchPendingReviews();
            })
            .catch(error => console.error('Lỗi khi xóa đánh giá', error));
    }
}

// Initial fetch and render the reviews when the page loads
fetchPendingReviews();