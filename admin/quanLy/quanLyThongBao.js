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
// Hàm tải danh sách thông báo
const loadNotificationList = async () => {
    try {
        const response = await fetch(`${API_URL}/getNotificationsBE`);
        if (!response.ok) throw new Error("Không thể tải danh sách thông báo.");

        const notiList = await response.json();
        console.log("Dữ liệu trả về từ API:", notiList); // Kiểm tra dữ liệu trả về

        const tableBody = document.getElementById("notificationTable");
        tableBody.innerHTML = ""; // Xóa các dòng cũ

        notiList.notifications.forEach((noti) => {
            const row = `
        <tr>
            <td>${noti._id}</td>
            <td>${noti.contentId}</td>
            <td>${new Date(new Date(noti.time).getTime() - 7 * 60 * 60 * 1000).toLocaleString()}</td>
        </tr>
    `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Lỗi khi tải danh sách thông báo:", error);
        alert("Lỗi khi tải danh sách thông báo!");
    }
};


// Hàm thêm nhân viên
const addNoti = async (event) => {
    event.preventDefault();
    const contentId = document.getElementById("notiContent").value;


    try {
        const response = await fetch(`${API_URL}/createGlobalNotification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contentId,
            }),
        });

        if (!response.ok) throw new Error("Không thể thêm thông báo.");
        alert("Thông báo đã được thêm thành công!");
        document.getElementById("addNotiForm").reset();
        $('#addNotiModal').modal('hide');
        loadNotificationList();  // Tải lại danh sách nhân viên sau khi thêm mới
    } catch (error) {
        console.error(error);
        alert("Lỗi khi thêm thông báo!");
    }
};
// Khởi tạo trang
document.addEventListener("DOMContentLoaded", () => {
    loadNotificationList();  // Tải danh sách thông báo khi trang được tải
    document.getElementById("addNotiForm").addEventListener("submit", addNoti);
});

