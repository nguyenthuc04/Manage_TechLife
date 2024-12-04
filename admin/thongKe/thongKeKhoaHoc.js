const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const dropdownMenu = document.getElementById("dropdownMenu2");
const resultDisplay = document.getElementById("textUserSelected2");

var chart1_KH
const dataAllKH = document.getElementById("data-khoahoc-all");
const dataDhdKH = document.getElementById("data-khoahoc-danghd");
const dataDktKH = document.getElementById("data-khoahoc-dakt");
var stateActive

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

const ip = localStorage.getItem('ipAddress');
const API_URL = `http://${ip}:3000`;
// Hàm fetch danh sách khóa học
async function fetchCourses() {
    try {
        // Gọi API /getListCourses
        const response = await fetch(`${API_URL}/getListCourses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Kiểm tra trạng thái phản hồi
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi từ server:', errorData.message);
            return;
        }

        // Lấy dữ liệu danh sách khóa học
        const courses = await response.json();

        dataAllKH.innerHTML = courses.length

        // Lấy ngày hiện tại
        const today = new Date();

        // Biến đếm số khóa học có ngày lớn hơn ngày hiện tại
        let countFutureCourses = 0;

        // Duyệt qua danh sách khóa học và so sánh ngày
        courses.forEach(course => {
            const courseDate = new Date(course.date); // Chuyển ngày của khóa học thành đối tượng Date
            if (courseDate <= today) {
                countFutureCourses++; // Tăng biến đếm nếu ngày khóa học lớn hơn ngày hiện tại
            }
        });

        let slKt = Number(courses.length) - Number(countFutureCourses)
        dataDhdKH.innerHTML = countFutureCourses;
        dataDktKH.innerHTML = slKt

    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
}

async function fetchCoursesByDate(startDate, endDate) {
    try {
        const response = await fetch(`${API_URL}/getCoursesByDate?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi từ server:', errorData.message);
            return undefined; // Trả về undefined khi có lỗi
        }

        // Trả về dữ liệu phản hồi
        const coursesCount = await response.json();
        return coursesCount;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return undefined; // Trả về undefined khi xảy ra lỗi
    }
}

const getDateNow = () => {
    // Lấy ngày hiện tại
    const currentDate = new Date();

// Lấy từng thành phần ngày, tháng, năm
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
    const day = String(currentDate.getDate()).padStart(2, '0'); // Đảm bảo luôn có 2 chữ số

// Định dạng ngày theo kiểu YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate
}


fetchCourses().then(r => {
    console.log("get data ok")
})


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

const updateChartData = (chart, newDatasets) => {
    // Cập nhật datasets
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

const updateChartDataLabel = (chart, newLabels) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    // Cập nhật lại biểu đồ
    chart.update();
};

// Gắn sự kiện click vào từng item
dropdownMenu.addEventListener("click", async function (event) {
    // Kiểm tra xem người dùng click vào item nào
    const target = event.target;
    event.preventDefault()

    // Nếu item có class "dropdown-item", lấy dữ liệu
    if (target.classList.contains("dropdown-item")) {
        const selectedValue = target.getAttribute("data-value");
        const selectedText = target.textContent.trim();

        resultDisplay.textContent = `Chế độ xem: ${selectedText}`;

        if (selectedValue === "ngay_kh") {
            try {
                // Gọi API để lấy dữ liệu
                const coursesCount = await fetchCoursesByDate(getDateNow(), getDateNow());

                // Kiểm tra nếu dữ liệu hợp lệ
                if (coursesCount !== undefined) {
                    // Cập nhật label cho biểu đồ
                    updateChartDataLabel(chart1_KH, ["Hôm nay", "Ngày mai"]);

                    // Cập nhật dữ liệu vào biểu đồ
                    updateChartData(chart1_KH, [
                        {
                            label: 'Số lượng',
                            data: [coursesCount,coursesCount], // Thay coursesCount vào dữ liệu
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        }
                    ]);
                } else {
                    console.error('Không nhận được dữ liệu hợp lệ từ API.');
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật biểu đồ:', error);
            }
        } else if (selectedValue === "tuan_kh") {
            // Xử lý cho tuần
        } else if (selectedValue === "thang_kh") {
            // Xử lý cho tháng
        } else if (selectedValue === "tuy-chinh_kh") {
            // Xử lý cho tùy chỉnh
        }
    }
});


