const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const dropdownMenu = document.getElementById("dropdownMenu");
const resultDisplay = document.getElementById("textUserSelected");
let chart1
let chart2
const dataMentee = document.getElementById("data-mentee");
const dataMentor = document.getElementById("data-mentor");
let resultWeek;
let inputStartDate = document.getElementById("startDate")
let inputEndDate = document.getElementById("endDate")

const ip = localStorage.getItem('myIpAddress');
const API_URL = `http://${ip}:3000/`;

async function fetchCountUserByLastLog(filterType, accountType, startDate = null, endDate = null) {
    try {
        let url = `${API_URL}getUserByLastLog?filterType=${filterType}&accountType=${accountType}`;

        // Nếu là chế độ tùy chỉnh, thêm tham số startDate và endDate vào URL
        if (filterType === "custom" && startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
            console.log(url)
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.data) {
            return result.data; // Trả về dữ liệu từ API
        } else {
            throw new Error('API response does not contain expected data');
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
    }
}

if (!user || !token) {
    // Nếu không có user hoặc token, chuyển hướng về login
    window.location.href = "../../login.html";
} else {
    // Nếu có user, hiển thị thông tin người dùng
    // console.log(user); // Thông tin người dùng
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
    var ctx1 = document.getElementById('lineChart1').getContext('2d');
    chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ["Hôm nay", "Ngày mai"],
            datasets: []
        },
        options: {
            // responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });

    // Dữ liệu cho biểu đồ 2
    var ctx2 = document.getElementById('lineChart2').getContext('2d');
    chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ["Hôm nay", "Ngày mai"],
            datasets: []
        },
        options: {
            // responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
});

// Hàm lấy dữ liệu và định dạng biểu đồ
async function fetchAndFormatData(filterType, userType) {
    const data = await fetchCountUserByLastLog(filterType, userType);
    return data.map(item => ({
        date: formatDate(item.date),
        count: item.users.length,
    }));
}

// Hàm cập nhật biểu đồ
function updateChart(chart, data) {
    const labels = data.map(item => item.date);
    const counts = data.map(item => item.count);

    if (counts.length === 1) {
        counts.push(0); // Thêm một điểm giả với giá trị 0 để tạo không gian trên biểu đồ
        labels.push("");  // Thêm label trống cho điểm giả
    }

    updateChartDataLabel(chart, labels);
    updateChartData(chart, [
        {
            label: 'Số lượng',
            data: counts,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
        },
    ]);
}

// Hàm xử lý sự kiện hiển thị biểu đồ theo tùy chọn
async function handleViewSelection(selectedValue, countData) {
    switch (selectedValue) {
        case "ngay": {
            document.getElementById("form_date_custom").style.display = "none";
            const mentorData = await fetchAndFormatData("day", "mentor");
            const menteeData = await fetchAndFormatData("day", "mentee");

            updateChart(chart1, mentorData);
            updateChart(chart2, menteeData);
            break;
        }
        case "tuan": {
            document.getElementById("form_date_custom").style.display = "none";
            const mentorData = await fetchAndFormatData("week", "mentor");
            const menteeData = await fetchAndFormatData("week", "mentee");

            updateChart(chart1, mentorData);
            updateChart(chart2, menteeData);
            break;
        }
        case "thang": {
            document.getElementById("form_date_custom").style.display = "none";
            const mentorData = await fetchAndFormatData("month", "mentor");
            const menteeData = await fetchAndFormatData("month", "mentee");

            updateChart(chart1, mentorData);
            updateChart(chart2, menteeData);
            break;
        }
        case "tuy-chinh": {
            document.getElementById("form_date_custom").style.display = "block";

            document.getElementById("submitButton").addEventListener("click", async () => {
                const startDate = document.getElementById("startDate").value;
                const endDate = document.getElementById("endDate").value;

                if (!startDate || !endDate) {
                    alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!");
                    return;
                }

                const mentorData = await fetchCountUserByLastLog("custom", "mentor", startDate, endDate);
                const menteeData = await fetchCountUserByLastLog("custom", "mentee", startDate, endDate);

                const customMentorData = mentorData.map(item => ({
                    date: formatDate(item.date),
                    count: item.users.length,
                }));
                const customMenteeData = menteeData.map(item => ({
                    date: formatDate(item.date),
                    count: item.users.length,
                }));

                updateChart(chart1, customMentorData);
                updateChart(chart2, customMenteeData);
            });
            break;
        }
        default:
            console.error("Không xác định chế độ xem");
    }
}

// Hàm xử lý tổng thể
async function SelectedView() {
    const countMenteeToday = await fetchAndFormatData("day", "mentee");
    const countMentorToday = await fetchAndFormatData("day", "mentor");
    const countMenteeWeek = await fetchAndFormatData("week", "mentee");
    const countMentorWeek = await fetchAndFormatData("week", "mentor");

    const countData = {
        day: { mentor: countMentorToday, mentee: countMenteeToday },
        week: { mentor: countMentorWeek, mentee: countMenteeWeek },
    };

    dropdownMenu.addEventListener("click", function (event) {
        const target = event.target;

        if (target.classList.contains("dropdown-item")) {
            const selectedValue = target.getAttribute("data-value");
            const selectedText = target.textContent.trim();

            resultDisplay.textContent = `Chế độ xem: ${selectedText}`;
            handleViewSelection(selectedValue, countData);
        }
    });
}




const updateChartData = (chart, newDatasets) => {
    // Cập nhật datasets
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

const updateChartDataLabel = (chart, newLabels, newDatasets) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    // Cập nhật lại biểu đồ
    chart.update();
};

// Gọi API và cập nhật dữ liệu mentee
const fetchUserCount = async (type) => {
    try {
        const response = await fetch(`${API_URL}getListUsersByAccountType?accountType=${type}`); // Đổi URL cho phù hợp
        const data = await response.json();
        return data.users.length
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
};

// Hàm cập nhật dữ liệu vào thẻ HTML
const updateStatistics = async () => {
    const quantityMentee = await fetchUserCount("mentee"); // Đợi kết quả API
    const quantityMentor = await fetchUserCount("mentor"); // Đợi kết quả API
    dataMentee.textContent = quantityMentee;
    dataMentor.textContent = quantityMentor;
};

function formatDate(dateString) {
    const date = new Date(dateString);  // Chuyển chuỗi thành đối tượng Date
    const day = date.getDate().toString().padStart(2, '0');  // Lấy ngày và đảm bảo có 2 chữ số
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Lấy tháng (lưu ý tháng bắt đầu từ 0)
    return `${day}/${month}`;  // Trả về định dạng "dd/mm"
}

// Gọi hàm updateStatistics để cập nhật dữ liệu
updateStatistics();
