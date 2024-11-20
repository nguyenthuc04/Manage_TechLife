const apiUrl = 'http://192.168.1.122:3000';
let currentPage = 1;
let token = localStorage.getItem('authToken');

// Lấy danh sách người dùng
async function fetchUsers() {
    try {
        const search = document.getElementById('searchInput').value;
        const response = await fetch(`${apiUrl}/?search=${search}&page=${currentPage}&limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {users, total} = await response.json();
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user._id}</td>
                    <td>${user.account}</td>
                    <td>${user.name}</td>
                    <td>${user.nickname}</td>
                    <td>${user.accountType}</td>
                    <td>
                        <button onclick="editUser('${user._id}')">Sửa</button>
                        <button onclick="deleteUser('${user._id}')">Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('totalUsers').textContent = total;
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Lỗi khi lấy danh sách người dùng. Vui lòng thử lại.');
    }
}

// Lấy thống kê người dùng
async function fetchStats() {
    try {
        const response = await fetch(`${apiUrl}/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {totalUsers, accountTypes} = await response.json();

        document.getElementById('totalUsers').textContent = totalUsers;
        const accountTypeList = document.getElementById('accountTypes');
        accountTypeList.innerHTML = '';

        accountTypes.forEach(type => {
            const listItem = `<li>${type._id}: ${type.count}</li>`;
            accountTypeList.innerHTML += listItem;
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        alert('Lỗi khi lấy thống kê. Vui lòng thử lại.');
    }
}

// Thêm/sửa người dùng
async function submitForm(event) {
    event.preventDefault();

    const id = document.getElementById('userId').value;
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const nickname = document.getElementById('nickname').value;
    const accountType = document.getElementById('accountType').value;

    const payload = {account, password, name, nickname, accountType};

    try {
        const url = id ? `${apiUrl}/${id}` : apiUrl;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        resetForm();
        fetchUsers();
        fetchStats();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Lỗi khi lưu thông tin người dùng. Vui lòng thử lại.');
    }
}

// Hiển thị dữ liệu người dùng để chỉnh sửa
async function editUser(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();

        document.getElementById('formTitle').textContent = 'Sửa Người dùng';
        document.getElementById('userId').value = user._id;
        document.getElementById('account').value = user.account;
        document.getElementById('password').value = '';
        document.getElementById('name').value = user.name;
        document.getElementById('nickname').value = user.nickname;
        document.getElementById('accountType').value = user.accountType;
    } catch (error) {
        console.error('Error editing user:', error);
        alert('Lỗi khi lấy thông tin người dùng. Vui lòng thử lại.');
    }
}

// Xóa người dùng
async function deleteUser(id) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchUsers();
            fetchStats();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Lỗi khi xóa người dùng. Vui lòng thử lại.');
        }
    }
}

// Reset form thêm/sửa
function resetForm() {
    document.getElementById('formTitle').textContent = 'Thêm Người dùng';
    document.getElementById('userId').value = '';
    document.getElementById('account').value = '';
    document.getElementById('password').value = '';
    document.getElementById('name').value = '';
    document.getElementById('nickname').value = '';
    document.getElementById('accountType').value = '';
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

// Hàm đăng nhập (giả định)
async function login(username, password) {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        token = data.token;
        localStorage.setItem('authToken', token);
        fetchUsers();
        fetchStats();
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Lỗi khi đăng nhập. Vui lòng thử lại.');
    }
}

