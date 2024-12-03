let btnLogin = document.getElementById('signInButton');
let username = document.getElementById('username');
let password = document.getElementById('password');
const rememberMeCheckbox = document.getElementById("rememberMe");
const togglePassword = document.getElementById("toggle-password");
const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


window.onload = () => {
    const savedUsername = localStorage.getItem("SaveUsername");
    const savedPassword = localStorage.getItem("SavePassword");

    if (savedUsername && savedPassword) {
        username.value = savedUsername;
        password.value = savedPassword;
        rememberMeCheckbox.checked = true; // Tự động tick vào checkbox "Remember Me"
    }
};

const isValidEmail = (email) => {
    return regex.test(email);
}


btnLogin.addEventListener('click', async (e) => {
    e.preventDefault()
    if (username.value.trim() === "" || password.value.trim() === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    if (rememberMeCheckbox.checked) {
        // Lưu thông tin tài khoản và mật khẩu vào localStorage nếu checkbox "Remember Me" được chọn
        localStorage.setItem("SaveUsername", username.value);
        localStorage.setItem("SavePassword", password.value);
    } else {
        // Nếu checkbox "Remember Me" không được chọn, xóa thông tin đã lưu trong localStorage
        localStorage.removeItem("SaveUsername");
        localStorage.removeItem("SavePassword");
    }
    if (isValidEmail(username.value)) {
        await Login(username.value, password.value)
    } else {
        alert("Vui lòng điền đúng định dạng email cho username");
    }

})

const ipAddress = '192.168.0.163'; // thay ip chung tai day
localStorage.setItem('myIpAddress', ipAddress);
const API_URL = `http://${ipAddress}:3000/`;

console.log(`${API_URL}loginweb`)

const Login = async (account, password) => {
    try {
        // Gửi yêu cầu tới backend
        const response = await fetch(`${API_URL}loginweb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({account, password}),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('loginMessage', data.message);
            localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin user
            localStorage.setItem('token', data.token); // Lưu token JWT
            if(data.user.accountType === "staff" || data.user.accountType === "admin") {
                window.location.href = "dashboard.html"; // Chuyển tới trang dashboard
            } else{
                alert("Bạn không có quyền để truy cập");
            }
        } else {
            alert(data.message); // Sai tài khoản hoặc mật khẩu
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
};


togglePassword.addEventListener("click", () => {
    // Kiểm tra kiểu của input password
    if (password.type === "password") {
        // Thay đổi type thành text để hiển thị mật khẩu
        password.type = "text";
        // Thay đổi icon thành mắt đóng
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        // Thay đổi type thành password để ẩn mật khẩu
        password.type = "password";
        // Thay đổi icon thành mắt mở
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
});

