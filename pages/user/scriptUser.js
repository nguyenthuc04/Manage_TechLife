const apiUrl = 'http://192.168.1.122:3000';
let currentPage = 1;

// Lấy danh sách người dùng
async function fetchUsers() {
    try {
        const search = document.getElementById('searchInput').value;
        const response = await fetch(`${apiUrl}/getListUserQT/?search=${search}&page=${currentPage}&limit=10`);

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
        const response = await fetch(`${apiUrl}/stats`);

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

    const payload = {
        account,
        password,
        birthday: new Date().toISOString().split("T")[0],
        name,
        nickname,
        bio: "",
        avatar: "data:image/png;base64,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",
        accountType,
        following: [],
        followers: [],
        posts: []
    };
    try {
        const url = id ? `${apiUrl}/updateUserQT/${id}` : `${apiUrl}/createUserQT`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert("Cập nhập người dùng thêm thành công!");

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
        const response = await fetch(`${apiUrl}/getUserQT/${id}`);


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
            const response = await fetch(`${apiUrl}/deleteUserQT/${id}`, {
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


