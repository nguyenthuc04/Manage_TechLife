// URL của API (thay đổi nếu cần)
// const API_URL = "http://26.187.200.144:3000";
// Hàm tải danh sách nhân viên
import { API_URL_TONG } from './ip.js';

const loadStaffList = async () => {
    try {
        const response = await fetch(`${API_URL_TONG}/getListStaff`);
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
        const response = await fetch(`${API_URL_TONG}/createStaff`, {
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
        const response = await fetch(`${API_URL_TONG}/getStaff/${id}`);
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
                const response = await fetch(`${API_URL_TONG}/updateStaff/${id}`, {
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
        const response = await fetch(`${API_URL_TONG}/deleteStaff/${id}`, { method: "DELETE" });
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
// fetch('http://26.187.200.144:3000/getListStaff')
//     .then(response => response.json())
//     .then(data => console.log('Dữ liệu:', data))
//     .catch(error => console.error('Lỗi fetch:', error));
