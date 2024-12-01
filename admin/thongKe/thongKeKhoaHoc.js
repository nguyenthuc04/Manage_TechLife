const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const dropdownMenu = document.getElementById("dropdownMenu2");
const resultDisplay = document.getElementById("textUserSelected2");

var chart1_KH
const dataAllKH = document.getElementById("data-khoahoc-all");
const dataDhdKH = document.getElementById("data-khoahoc-danghd");
const dataDktKH = document.getElementById("data-khoahoc-dakt");


if (!user || !token) {
    // Nếu không có user hoặc token, chuyển hướng về login
    window.location.href = "../../login.html";
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
        window.location.href = "../../login.html"; // Đổi đường dẫn đến trang đăng nhập của bạn
    }
};


document.addEventListener("DOMContentLoaded", function () {
    // Dữ liệu cho biểu đồ 1
    var ctx1 = document.getElementById('lineChart1_KH').getContext('2d');
    chart1_KH = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Số lượng',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

});

function updateChartData(courses) {
    const courseCountsByStartDate = {};

    // Lặp qua từng khóa học để nhóm theo startDate
    courses.forEach(course => {
        const startDate = course.startDate;  // Start date từ DB
        if (!courseCountsByStartDate[startDate]) {
            courseCountsByStartDate[startDate] = 0;
        }
        courseCountsByStartDate[startDate]++;
    });

    // Tạo các giá trị cho labels và data
    const labels = Object.keys(courseCountsByStartDate);
    const data = labels.map(date => courseCountsByStartDate[date]);

    // Cập nhật biểu đồ với dữ liệu mới
    chart1_KH.data.labels = labels; // Cập nhật labels với startDate
    chart1_KH.data.datasets[0].data = data; // Cập nhật số lượng khóa học
    chart1_KH.update(); // Cập nhật lại biểu đồ
}

async function fetchCourses() {
    try {
        const response = await fetch('http://192.168.0.126:3000/getListCourses');

        if (!response.ok) {
            throw new Error('Error fetching courses');
        }

        const courses = await response.json();
        dataAllKH.innerHTML = courses.length;
        calculateCourseStatus(courses)
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

function calculateCourseStatus(courses) {
    const currentDate = new Date(); // Lấy ngày hiện tại theo múi giờ UTC+0 (trong trình duyệt)

    // Cập nhật múi giờ UTC+7
    currentDate.setHours(currentDate.getHours() + 7);

    let activeCount = 0;
    let endedCount = 0;

    courses.forEach(course => {

        const courseEndDate = parseDate(course.endDate); // Chuyển đổi endDate của khóa học thành đối tượng Date

        // Kiểm tra xem khóa học đã kết thúc hay chưa
        if (currentDate <= courseEndDate) {
            activeCount++;
        } else {
            endedCount++;
        }
    });

    // Log ra số khóa học đã kết thúc và đang hoạt động
    dataDhdKH.innerHTML = activeCount;
    dataDktKH.innerHTML = endedCount;
}

function parseDate(dateString) {
    // Chuyển đổi định dạng dd-mm-yyyy thành đối tượng Date
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}T23:59:59.999Z`); // Đặt giờ cuối ngày để so sánh đúng
}



fetchCourses()






