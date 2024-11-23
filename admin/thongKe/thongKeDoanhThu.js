const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

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
let revenueChart;

async function fetchMentorStatistics() {
    try {
        const response = await fetch(`${API_URL}/mentor-statistics`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching mentor statistics:', error);
        return null;
    }
}

function populateTable(data) {
    const tableBody = document.querySelector('#mentorTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    data.mentors.forEach(mentor => {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell(0);
        const nicknameCell = row.insertCell(1);
        nameCell.textContent = mentor.name;
        nicknameCell.textContent = mentor.nickname;
    });
}

function createRevenueChart(data) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    if (revenueChart) {
        revenueChart.destroy();
    }
    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tổng doanh thu'],
            datasets: [{
                label: 'Doanh thu từ nâng cấp Mentor',
                data: [data.totalRevenue],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: data.totalRevenue,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                        },
                        stepSize: Math.ceil(data.totalRevenue / 5)
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                        }
                    }
                }
            }
        }
    });
}

async function updateDashboard() {
    const data = await fetchMentorStatistics();
    if (data) {
        document.getElementById('totalMentors').textContent = data.totalMentors;
        document.getElementById('upgradePrice').textContent = data.upgradePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        document.getElementById('totalRevenue').textContent = data.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        populateTable(data);
        createRevenueChart(data);
    }
}

document.addEventListener('DOMContentLoaded', updateDashboard);
























