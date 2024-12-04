const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const dropdownMenu = document.getElementById("dropdownMenu2");
const resultDisplay = document.getElementById("textUserSelected2");

var chart1_KH
const dataAllKH = document.getElementById("data-khoahoc-all");
const dataDhdKH = document.getElementById("data-khoahoc-danghd");
const dataDktKH = document.getElementById("data-khoahoc-dakt");

const ip = localStorage.getItem('ipAddress');
const API_URL = `http://${ip}:3000/`;

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


async function fetchCourses() {
    try {
        const response = await fetch(`${API_URL}getListCourses`);

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

async function fetchCourseCountByDate(filterType, startDate = null, endDate = null) {
    try {
        let url = `${API_URL}getCoursesByStartDate?filterType=${filterType}`;

        // Thêm tham số ngày bắt đầu và kết thúc nếu là chế độ tùy chỉnh
        if (filterType === "custom" && startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
            console.log(url);
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.data) {
            return result.data;
        } else {
            throw new Error('API response does not contain expected data');
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
    }
}

const updateChartDataKH = (chart, newDatasets) => {
    // Cập nhật datasets
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

const updateChartDataLabelKH = (chart, newLabels, newDatasets) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    // Cập nhật lại biểu đồ
    chart.update();
};

function updateChartKH(chart, data) {
    const labels = data.map(item => formatDateKH(item.date));
    const counts = data.map(item => item.courses.length);

    console.log(counts)

    if (counts.length === 1) {
        counts.push(0); // Thêm một điểm giả với giá trị 0 để tạo không gian trên biểu đồ
        labels.push("");  // Thêm label trống cho điểm giả
    }

    updateChartDataLabelKH(chart, labels);
    updateChartDataKH(chart, [
        {
            label: 'Số lượng khóa học',
            data: counts,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
        },
    ]);
}

async function handleViewSelection2(selectedValue) {
    switch (selectedValue) {
        case "ngay_kh": {
            document.getElementById("form_date_custom2").style.display = "none";
            const courseData = await fetchCourseCountByDate("day");
            updateChartKH(chart1_KH, courseData);
            break;
        }
        case "tuan_kh": {
            document.getElementById("form_date_custom2").style.display = "none";
            const courseData = await fetchCourseCountByDate("week");
            updateChartKH(chart1_KH, courseData);
            break;
        }
        case "thang_kh": {
            document.getElementById("form_date_custom2").style.display = "none";
            const courseData = await fetchCourseCountByDate("month");
            updateChartKH(chart1_KH, courseData);
            break;
        }
        case "tuy-chinh_kh": {
            document.getElementById("form_date_custom2").style.display = "block";

            document.getElementById("submitButtonKH").addEventListener("click", async () => {
                const startDate = document.getElementById("startDateKH").value;
                const endDate = document.getElementById("endDateKH").value;

                if (!startDate || !endDate) {
                    alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!");
                    return;
                }

                const courseData = await fetchCourseCountByDate("custom", startDate, endDate);
                updateChartKH(chart1_KH, courseData);
            });
            break;
        }
        default:
            console.error("Không xác định chế độ xem");
    }
}

handleViewSelection2("tuan_kh")
resultDisplay.textContent = `Chế độ xem: Tuần`;

function formatDateKH(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');  // Lấy ngày và thêm số 0 nếu ngày < 10
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Lấy tháng, tháng bắt đầu từ 0 nên phải cộng thêm 1
    return `${day}/${month}`;
}

dropdownMenu.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("dropdown-item")) {
        const selectedValue = target.getAttribute("data-value");
        const selectedText = target.textContent.trim();
        resultDisplay.textContent = `Chế độ xem: ${selectedText}`;
        handleViewSelection2(selectedValue);
    }
});






