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
const API_URL = `http://${ip}:3000/coursesQT`;

function fetchAcceptedCourses() {
    console.log('Đang tải danh sách khoá học đã chấp nhận...');
    const acceptedCoursesList = document.getElementById('accepted-courses-list');

    fetch(`${API_URL}/accepted`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(courses => {
            console.log('Đã nhận được dữ liệu:', courses);
            // Sort posts by acceptedAt date, most recent first
            courses.sort((a, b) => new Date(b.date) - new Date(a.date));
            displayAcceptedCourses(courses);
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách bài viết đã chấp nhận:', error);
            acceptedCoursesList.innerHTML = `<p>Đã xảy ra lỗi khi tải danh sách khoá học đã chấp nhận: ${error.message}</p>`;
        });
}

function displayAcceptedCourses(courses) {
    const acceptedCoursesList = document.getElementById('accepted-courses-list');
    acceptedCoursesList.innerHTML = '';

    if (courses.length === 0) {
        acceptedCoursesList.innerHTML = '<p>Không có khoá học nào đã được chấp nhận.</p>';
    } else {
        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-card';
            courseElement.innerHTML = `
                <div class="course-header">
                        <img src="${course.userImageUrl}" alt="${course.userName}">
                        <div class="user-info">
                            <div class="name">${course.userName}</div>
                            <div class="date">${new Date(course.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="course-content">
                        <p>Mô tả: ${course.describe}</p>
                        <div class="course-images">
                            <img src="${course.imageUrl}">
                        </div>
                    </div>
                    </div>
                <div class="accepted-info">
                    Chấp nhận lúc: ${new Date(course.date).toLocaleString()}
                </div>
                <div class="course-actions">
                    <button onclick="unarchiveCourse('${course._id}')" class="unarchive-button">Hủy lưu trữ</button>
                </div>
            `;
            acceptedCoursesList.appendChild(courseElement);
        });
    }
}

function unarchiveCourse(courseId) {
    if (confirm('Bạn có chắc chắn muốn hủy lưu trữ khoá học này không?')) {
        fetch(`${API_URL}/${courseId}/unarchive`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Khoá học đã được hủy lưu trữ và chuyển về danh sách chờ kiểm duyệt.');
                    fetchCourses();
                    fetchAcceptedCourses();
                } else {
                    alert('Có lỗi xảy ra khi hủy lưu trữ khoá học.');
                }
            })
            .catch(error => {
                console.error('Lỗi khi hủy lưu trữ khoá học:', error);
                alert('Có lỗi xảy ra khi hủy lưu trữ khoá học.');
            });
    }
}

function acceptCourse(courseId) {
    console.log('Đang chấp nhận khoá học:', courseId);
    fetch(`${API_URL}/${courseId}/accept`, {
        method: 'PUT',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                console.log('Khoá học đã được chấp nhận:', data.message);
                alert('Khoá học đã được chấp nhận và lưu trữ.');
                fetchCourses();
                fetchAcceptedCourses();
            } else {
                throw new Error('Không nhận được dữ liệu khoá học từ server');
            }
        })
        .catch(error => {
            console.error('Lỗi khi chấp nhận khoá học:', error);
            alert(`Có lỗi xảy ra: ${error.message}`);
        });
}


document.addEventListener('DOMContentLoaded', function() {
    const pendingTab = document.getElementById('pending-tab');
    const acceptedTab = document.getElementById('accepted-tab');
    const courseList = document.getElementById('course-list');
    const acceptedCoursesContainer = document.getElementById('accepted-courses-container');

    pendingTab.addEventListener('click', function() {
        pendingTab.classList.add('active');
        acceptedTab.classList.remove('active');
        courseList.classList.add('active');
        acceptedCoursesContainer.classList.remove('active');
        fetchCourses();
    });

    acceptedTab.addEventListener('click', function() {
        acceptedTab.classList.add('active');
        pendingTab.classList.remove('active');
        acceptedCoursesContainer.classList.add('active');
        courseList.classList.remove('active');
        fetchAcceptedCourses();
    });

    fetchCourses();
});

function fetchCourses() {
    fetch(API_URL)
        .then(response => response.json())
        .then(courses => {
            courses.sort((a, b) => new Date(b.date) - new Date(a.date));

            const courseList = document.getElementById('course-list');
            courseList.innerHTML = '';

            courses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';


                courseCard.innerHTML = `
                    <div class="course-header">
                        <img src="${course.userImageUrl}" alt="${course.userName}">
                        <div class="user-info">
                            <div class="name">${course.userName}</div>
                            <div class="date">${new Date(course.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="course-content">
                        <p>Mô tả: ${course.describe}</p>
                        <div class="course-images">
                            <img src="${course.imageUrl}">
                        </div>
                    </div>
                    </div>
                    <div class="course-actions">
                        <button onclick="acceptCourse('${course._id}')" class="accept-button">Chấp nhận</button>
                        <button onclick="deleteCourse('${course._id}')" class="reject-button">Từ chối</button>
                    </div>
                `;
                courseList.appendChild(courseCard);
            });
        })
        .catch(error => console.error('Error fetching reels:', error));
}

function deleteCourse(courseId) {
    if (confirm('Bạn có chắc chắn muốn xóa khoá học này không?')) {
        fetch(`${API_URL}/${courseId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchCourses(); // Refresh danh sách bài viết
            })
            .catch(error => console.error('Lỗi khi xóa khoá học', error));
    }
}



