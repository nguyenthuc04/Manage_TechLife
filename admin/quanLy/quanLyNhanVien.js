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
// URL của API (thay đổi nếu cần)
const API_URL = "http://192.168.0.126:3000";

// Hàm tải danh sách nhân viên
const loadStaffList = async () => {
    try {
        const response = await fetch(`${API_URL}/getListStaff`);
        if (!response.ok) throw new Error("Không thể tải danh sách nhân viên.");

        const staffList = await response.json();
        console.log("Dữ liệu trả về từ API:", staffList); // Kiểm tra dữ liệu trả về

        const tableBody = document.getElementById("staffTable");
        tableBody.innerHTML = ""; // Xóa các dòng cũ

        staffList.forEach((staff) => {
            const row = `
                <tr>
                    <td>${staff._id}</td>
                    <td>${staff.name}</td>
                    <td>${staff.email}</td>
                    <td>${staff.phone}</td>
                    <td>${staff.position}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editStaff('${staff._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStaff('${staff._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
        alert("Lỗi khi tải danh sách nhân viên!");
    }
};


// Hàm thêm nhân viên
const addStaff = async (event) => {
    event.preventDefault();
    const name = document.getElementById("staffName").value;
    const email = document.getElementById("staffEmail").value;
    const phone = document.getElementById("staffPhone").value;
    const position = document.getElementById("staffPosition").value;

    try {
        const response = await fetch(`${API_URL}/createStaff`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                phone,
                position,
                department: "Default",
                hireDate: new Date().toISOString().split("T")[0], // Ngày hiện tại
                salary: 0,
                isActive: true
            }),
        });

        if (!response.ok) throw new Error("Không thể thêm nhân viên.");
        alert("Nhân viên đã được thêm thành công!");
        document.getElementById("addStaffForm").reset();
        $('#addStaffModal').modal('hide');
        loadStaffList();  // Tải lại danh sách nhân viên sau khi thêm mới
    } catch (error) {
        console.error(error);
        alert("Lỗi khi thêm nhân viên!");
    }
};


const editStaff = async (id) => {
    try {
        // Lấy thông tin nhân viên cần chỉnh sửa từ API
        const response = await fetch(`${API_URL}/getStaff/${id}`);
        if (!response.ok) throw new Error("Không thể lấy thông tin nhân viên!");

        const staff = await response.json();

        // Điền thông tin nhân viên vào form chỉnh sửa
        document.getElementById("editStaffName").value = staff.name;
        document.getElementById("editStaffEmail").value = staff.email;
        document.getElementById("editStaffPhone").value = staff.phone;
        document.getElementById("editStaffPosition").value = staff.position;

        // Cập nhật dữ liệu nhân viên
        document.getElementById("editStaffForm").onsubmit = async (event) => {
            event.preventDefault();
            const name = document.getElementById("editStaffName").value;
            const email = document.getElementById("editStaffEmail").value;
            const phone = document.getElementById("editStaffPhone").value;
            const position = document.getElementById("editStaffPosition").value;

            try {
                const response = await fetch(`${API_URL}/updateStaff/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        position,
                    }),
                });

                if (!response.ok) throw new Error("Không thể cập nhật nhân viên.");
                alert("Nhân viên đã được cập nhật thành công!");
                $('#editStaffModal').modal('hide');
                loadStaffList();  // Tải lại danh sách nhân viên sau khi cập nhật
            } catch (error) {
                console.error(error);
                alert("Lỗi khi cập nhật nhân viên!");
            }
        };

        // Hiển thị modal chỉnh sửa
        $('#editStaffModal').modal('show');

    } catch (error) {
        console.error(error);
        alert("Lỗi khi lấy thông tin nhân viên!");
    }
};








// Hàm xóa nhân viên
const deleteStaff = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) return;

    try {
        const response = await fetch(`${API_URL}/deleteStaff/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Không thể xóa nhân viên.");
        alert("Nhân viên đã được xóa thành công!");
        loadStaffList();  // Tải lại danh sách nhân viên sau khi xóa
    } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa nhân viên!");
    }
};

// Khởi tạo trang
document.addEventListener("DOMContentLoaded", () => {
    loadStaffList();  // Tải danh sách nhân viên khi trang được tải
    document.getElementById("addStaffForm").addEventListener("submit", addStaff); // Lắng nghe sự kiện submit form thêm nhân viên
});
fetch('http://26.187.200.144:3000/getListStaff')
    .then(response => response.json())
    .then(data => console.log('Dữ liệu:', data))
    .catch(error => console.error('Lỗi fetch:', error));

