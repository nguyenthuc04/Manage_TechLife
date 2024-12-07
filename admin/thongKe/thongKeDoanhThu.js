const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const dropdownMenu = document.getElementById("dropdownMenu3");
const resultDisplay = document.getElementById("textUserSelected3");
let dataDuyTri = document.getElementById("data-duytritk")
let dataNangCap = document.getElementById("data-nangcaptk")

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


const ctx = document.getElementById('barChart').getContext('2d');

const barChart = new Chart(ctx, {
    type: 'bar', // Kiểu biểu đồ cột
    data: {
        labels: ['...'], // Nhãn (trục X)
        datasets: [{
            label: 'Doanh thu', // Tên dataset
            data: [], // Dữ liệu cột
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true // Trục Y bắt đầu từ 0
            }
        }
    }
});


const updateChartDataDT = (chart, newLabels, newDatasets) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

async function fetchDoanhThuByDate(filterType, startDate = null, endDate = null) {
    try {
        let url = `${API_URL}/getRevenueByDate?filterType=${filterType}`;
        console.log(url)

        // Thêm tham số ngày bắt đầu và kết thúc nếu là chế độ tùy chỉnh
        if (filterType === "custom" && startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
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

async function fetchDoanhThuByDateAndType(filterType, startDate = null, endDate = null, type) {
    try {
        let url = `${API_URL}/getRevenueByDateAndType?filterType=${filterType}&type=${type}`;
        console.log(url)

        // Thêm tham số ngày bắt đầu và kết thúc nếu là chế độ tùy chỉnh
        if (filterType === "custom" && startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await fetch(url);

        // Kiểm tra xem yêu cầu có thành công không
        if (!response.ok) {
            throw new Error("Lỗi khi lấy dữ liệu");
        }

        // Chuyển phản hồi thành JSON
        const data = await response.json();

        return data.totalRevenue
    } catch (error) {
        console.error('Lỗi khi gọi API:', error.message);
    }
}


async function getTotalAndDate(filterType, startDate = null, endDate = null) {
    try {
        // Gọi hàm fetch API
        const data = await fetchDoanhThuByDate(filterType, startDate, endDate);

        if (data && Array.isArray(data)) {
            // Tách riêng ngày (date) và tổng doanh thu (total)
            const result = data.map(item => ({
                date: item.date,
                total: item.total
            }));


            return result;
        } else {
            console.error('No valid data returned from API.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching and processing data:', error.message);
        return [];
    }
}

function updateChartDT(chart, data) {
    const labels = data.map(item => formatDateDT(item.date)); // Tách ngày và format
    const revenues = data.map(item => item.total); // Tách doanh thu
    console.log(revenues)
    // Cập nhật labels và datasets
    updateChartDataDT(chart, labels, [
        {
            label: 'Doanh thu', // Nhãn dataset
            data: revenues,    // Dữ liệu doanh thu
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
        }
    ]);
}


async function handleViewSelection3(selectedValue) {
    switch (selectedValue) {
        case "ngay_dt": {
            document.getElementById("form_date_custom_dt").style.display = "none";
            const data = await getTotalAndDate("day"); // Lấy dữ liệu
            updateChartDT(barChart, data); // Cập nhật biểu đồ
            let dataUpdate = await  fetchDoanhThuByDateAndType("day", "", "", "update")
            let dataMaintain = await fetchDoanhThuByDateAndType("day", "", "", "maintain")
            dataDuyTri.textContent = dataMaintain
            dataNangCap.textContent = dataUpdate
            break;
        }
        case "tuan_dt": {
            document.getElementById("form_date_custom_dt").style.display = "none";
            const data = await getTotalAndDate("week");
            updateChartDT(barChart, data);
            // fetchDoanhThuByDateAndType("week", "", "", "update")
            // fetchDoanhThuByDateAndType("week", "", "", "maintain")
            let dataUpdate = await fetchDoanhThuByDateAndType("week", "", "", "update")
            let dataMaintain = await fetchDoanhThuByDateAndType("week", "", "", "maintain")
            dataDuyTri.textContent = dataMaintain
            dataNangCap.textContent = dataUpdate

            break;
        }
        case "thang_dt": {
            document.getElementById("form_date_custom_dt").style.display = "none";
            const data = await getTotalAndDate("month");
            updateChartDT(barChart, data);
            // fetchDoanhThuByDateAndType("month", "", "", "update")
            // fetchDoanhThuByDateAndType("month", "", "", "maintain")
            let dataUpdate = await fetchDoanhThuByDateAndType("month", "", "", "update")
            let dataMaintain = await fetchDoanhThuByDateAndType("month", "", "", "maintain")
            dataDuyTri.textContent = dataMaintain
            dataNangCap.textContent = dataUpdate
            break;
        }
        case "tuy-chinh_dt": {
            document.getElementById("form_date_custom_dt").style.display = "block";

            document.getElementById("submitButton3").addEventListener("click", async () => {
                const startDate = document.getElementById("startDateDT").value;
                const endDate = document.getElementById("endDateDT").value;

                if (!startDate || !endDate) {
                    alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!");
                    return;
                }

                const data = await getTotalAndDate("custom", startDate, endDate);
                updateChartDT(barChart, data);
                // fetchDoanhThuByDateAndType("custom", "", "", "update")
                // fetchDoanhThuByDateAndType("custom", "", "", "maintain")
                let dataUpdate = await fetchDoanhThuByDateAndType("custom", startDate, endDate, "update")
                let dataMaintain = await fetchDoanhThuByDateAndType("custom", startDate, endDate, "maintain")
                dataDuyTri.textContent = dataMaintain
                dataNangCap.textContent = dataUpdate

            });
            break;
        }
        default:
            console.error("Không xác định chế độ xem");
    }
}

handleViewSelection3("tuan_dt")
resultDisplay.textContent = `Chế độ xem: Tuần`;
fetchDoanhThuByDateAndType("week", "", "", "update")
fetchDoanhThuByDateAndType("week", "", "", "maintain")

function formatDateDT(dateString) {
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
        handleViewSelection3(selectedValue);
    }
});
