const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const dropdownMenu = document.getElementById("dropdownMenu");
const resultDisplay = document.getElementById("textUserSelected");
var chart1
var chart2
const dataMentee = document.getElementById("data-mentee");
const dataMenter = document.getElementById("data-menter");

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
        window.location.href = "../../login.html"; // Đổi đường dẫn đến trang đăng nhập của bạn
    }
};

const ip = localStorage.getItem('ipAddress');
const API_URL = `http://${ip}:3000`;

document.addEventListener("DOMContentLoaded", function () {
    // Dữ liệu cho biểu đồ 1
    var ctx1 = document.getElementById('lineChart1').getContext('2d');
    chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
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

    // Dữ liệu cho biểu đồ 2
    var ctx2 = document.getElementById('lineChart2').getContext('2d');
    chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
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

const SelectedView = () => {
    // Gắn sự kiện click vào từng item
    dropdownMenu.addEventListener("click", function (event) {
        // Kiểm tra xem người dùng click vào item nào
        const target = event.target;

        // Nếu item có class "dropdown-item", lấy dữ liệu
        if (target.classList.contains("dropdown-item")) {
            const selectedValue = target.getAttribute("data-value");
            const selectedText = target.textContent.trim();

            resultDisplay.textContent = `Chế độ xem: ${selectedText}`;

            if (selectedValue === "ngay") {
                updateChartDataLabelMenter(chart1,["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]);
                updateChartDataMenter(chart1, [
                    {
                        label: 'Số lượng',
                        data: [1, 2, 3,2,1],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }
                ]);

                updateChartDataLabelMentee(chart2,["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]);
                updateChartDataMentee(chart2, [
                    {
                        label: 'Số lượng',
                        data: [1, 2, 3,2,1],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }
                ]);
                // const mentorCount = 60; // Số lượng mentor
                // const menteeCount = 60; // Số lượng mentee
                // updateDoughnutData(mentorCount, menteeCount);

                // updateChartDataLabelMentee(chart2,["Hôm qua","Hôm nay"])
                // Gọi hàm fetch dữ liệu
                // fetchDataMenter(chart1);
                // fetchMenteeCount()
            } else if (selectedValue === "tuan") {
                updateChartDataLabelMenter(chart1,["1","2","3","4","5","6","7"])
                // updateChartDataLabelMentee(chart2,["1","2","3","4","5","6","7"])
            } else if (selectedValue === "thang") {

            } else if (selectedValue === "tuy-chinh") {

            }

            // Gọi API hoặc thực hiện hành động khác ở đây
        }
    });
}


const updateChartDataMenter = (chart, newDatasets) => {
    // Cập nhật datasets
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

const updateChartDataMentee = (chart, newDatasets) => {
    // Cập nhật datasets
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

const updateChartDataLabelMenter = (chart, newLabels) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    // Cập nhật lại biểu đồ
    chart.update();
};
const updateChartDataLabelMentee = (chart, newLabels, newDatasets) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    // Cập nhật lại biểu đồ
    chart.update();
};


// Gọi API và cập nhật dữ liệu menter
const fetchMenterCount = async () => {
    try {
        const response = await fetch(`${API_URL}/getListUsersByAccountType?accountType=menter`); // Đổi URL cho phù hợp
        const data = await response.json();

        console.log('User List:', data.users.length);  // In ra danh sách người dùng nếu cần
        // updateChartDataMenter(chart1,data.users.length)
        return data.users.length
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
};


// Gọi API và cập nhật dữ liệu mentee
const fetchMenteeCount = async () => {
    try {
        const response = await fetch(`${API_URL}/getListUsersByAccountType?accountType=mentee`); // Đổi URL cho phù hợp
        const data = await response.json();

        console.log('User List:', data.users.length);  // In ra danh sách người dùng nếu cần
        // updateChartDataMenter(chart2,data.users.length)
        return data.users.length
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
};

// Hàm cập nhật dữ liệu vào thẻ HTML
const updateStatistics = async () => {
    const soLuongMentee = await fetchMenteeCount(); // Đợi kết quả API
    const soLuongMenter = await fetchMenterCount(); // Đợi kết quả API


    dataMentee.textContent = soLuongMentee; // Cập nhật số lượng mentee vào thẻ
    dataMenter.textContent = soLuongMenter; // Cập nhật số lượng menter vào thẻ
};

// Gọi hàm updateStatistics để cập nhật dữ liệu
updateStatistics();
