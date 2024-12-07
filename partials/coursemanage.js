//Hàm loadList
import { API_URL_TONG } from './ip.js';

const loadCourseList = async () => {
    try {
        const response = await fetch(`${API_URL_TONG}/getListCourses`);
        if (!response.ok) throw new Error("Không thể tải danh sách khoá học");

        const coursesList = await response.json();
        console.log("Dữ liệu trả về từ API:", coursesList);

        const tableBody = document.getElementById("courseTable");
        tableBody.innerHTML = "";

        coursesList.forEach((course) => {
            const row = `
                <tr>
                    <td>${course._id}</td>
                    <td>${course.name}</td>
                    <td>${course.date || "N/A"}</td>  <!-- Kiểm tra giá trị date -->
                    <td>${course.duration || "N/A"}</td>  <!-- Kiểm tra giá trị duration -->
                    <td>${course.price}</td>
                    <td>${course.idUser}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editCourse('${course._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Lỗi khi tải danh sách khoá học:", error);
        alert("Lỗi khi tải danh sách khoá học!");
    }
};

// Hàm add
const addCourse = async (event) => {
    event.preventDefault();
    const name = document.getElementById("courseName").value;
    const date = document.getElementById("courseDate").value;
    const duration = document.getElementById("courseDuration").value;
    const price = document.getElementById("coursePrice").value;
    const idUser = document.getElementById("courseIdUser").value;

    try {
        const response = await fetch(`${API_URL_TONG}/addCourse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                date,
                duration,
                price,
                idUser,
            }),
        });

        if (!response.ok) throw new Error("Không thể thêm khóa học.");
        alert("Khóa học đã được thêm thành công!");
        document.getElementById("addCourseForm").reset();  // Reset form sau khi thêm thành công
        $('#addCourseModal').modal('hide');  // Đóng modal
        loadCourseList();  // Tải lại danh sách khóa học sau khi thêm mới
    } catch (error) {
        console.error(error);
        alert("Lỗi khi thêm khóa học!");
    }
};
// hàm sửa
// Hàm chỉnh sửa khóa học: Lấy thông tin khóa học và hiển thị trong modal
const editCourse = async (id) => {
    try {
        console.log("Edit click");
        const response = await fetch(`${API_URL_TONG}/getCourseById/${id}`);
        if (!response.ok) throw new Error("Không thể lấy thông tin khóa học");

        const course = await response.json();

        // Điền thông tin khóa học vào các trường input trong modal
        document.getElementById("editcourseName").value = course.name;
        document.getElementById("editcourseDate").value = course.date || "";
        document.getElementById("editcourseDuration").value = course.duration || "";
        document.getElementById("editcoursePrice").value = course.price || "";
        document.getElementById("editcourseIdUser").value = course.idUser || "";

        // Mở modal
        $('#updateCourseModal').modal('show');

        // Cập nhật form submit action để sửa khóa học
        const updateForm = document.getElementById("updateCourseForm");
        updateForm.onsubmit = (event) => updateCourse(event, id);  // Gọi hàm cập nhật khi submit form
    } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
        alert("Lỗi khi lấy thông tin khóa học!");
    }
};


// hàm xoá
const deleteCourse = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;

    try {
        const response = await fetch(`${API_URL_TONG}/deleteCourse/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Không thể xóa khóa học.");
        alert("Khóa học đã được xóa thành công!");
        loadCourseList();  // Tải lại danh sách khóa học sau khi xóa
    } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa khóa học!");
    }
};

// Load Trang
document.addEventListener("DOMContentLoaded", () => {
    loadCourseList(); // Chờ hàm hoàn tất
    document.getElementById("addCourseForm").addEventListener("submit", addCourse); // Lắng nghe sự kiện submit form thêm nhân viên

});
