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
let currentPage = 1;

// Lấy danh sách người dùng
async function fetchUsers() {
    try {
        const search = document.getElementById('searchInput').value;
        const response = await fetch(`${API_URL}/getListUserQT/?search=${search}&page=${currentPage}&limit=10`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { users } = await response.json();
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';

        // Lọc danh sách người dùng để chỉ hiển thị những người có accountType là 'staff'
        const staffUsers = users.filter(user => user.accountType === 'staff');

        staffUsers.forEach(user => {
            const row = `
                <tr>
                    <td>${user._id}</td>
                    <td>${user.account}</td>
                    <td>${user.name}</td>
                    <td>${user.nickname}</td>
                    <td>${user.accountType}</td>
                    <td class="actions">
                        <button class="delete" onclick="deleteUser('${user._id}')">Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        document.getElementById('currentPage').textContent = currentPage;
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Lỗi khi lấy danh sách người dùng. Vui lòng thử lại.');
    }
}



// Xóa người dùng
async function deleteUser(id) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        try {
            const response = await fetch(`${API_URL}/deleteUserQT/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Lỗi khi xóa người dùng. Vui lòng thử lại.');
        }
    }
}



// Phân trang
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchUsers();
    }
}

function nextPage() {
    currentPage++;
    fetchUsers();
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    fetchStats();
    document.getElementById('userForm').addEventListener('submit', submitForm);
});