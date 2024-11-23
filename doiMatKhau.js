const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || !token) {
    // Nếu không có user hoặc token, chuyển hướng về login
    window.location.href = "./login.html";
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
        window.location.href = "./login.html"; // Đổi đường dẫn đến trang đăng nhập của bạn
    }
};


    document.getElementById("changePasswordForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Ngăn không reload trang

        const oldPassword = document.getElementById("pwd").value;
        const newPassword = document.getElementById("npwd").value;

        try {
            // Gửi yêu cầu đến API
            const response = await fetch('http://192.168.0.106:3000/changepassword', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            // const data = await response.json();

            // Hiển thị thông báo dựa vào phản hồi
            if (response.ok) {
                alert("Đổi mật khẩu thành công")
            } else {
                const errorData = await response.json();
                console.log(errorData)
                alert("Đổi mật khẩu thất bại")
            }
        } catch (error) {
            console.error("Lỗi trong quá trình đổi mật khẩu:", error);
            alert("Có lỗi xảy ra")
        }
    });


