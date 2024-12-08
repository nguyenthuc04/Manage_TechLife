const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || !token) {
    // Nếu không có user hoặc token, chuyển hướng về login
    window.location.href = "../login.html";
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
        window.location.href = "../login.html";
    }
};

const ip = localStorage.getItem('ipAddress');
const API_URL = `http://${ip}:3000`;

// Hàm lấy danh sách yêu cầu premium từ API và hiển thị trong bảng
async function loadPremiumRequests() {
    const response = await fetch(`${API_URL}/getPremiumRequests`);

    const data = await response.json();

    const premiumRequestsTable = document.getElementById('premiumRequestsTable');
    premiumRequestsTable.innerHTML = ''; // Xóa bảng cũ trước khi thêm dữ liệu

    if (data.success) {
        if (data.data.length === 0) {
            // Hiển thị thông báo nếu danh sách rỗng
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" style="text-align: center;">Không có yêu cầu nào để hiển thị</td>
            `;
            premiumRequestsTable.appendChild(row);
        } else {
            // Hiển thị danh sách yêu cầu
            data.data.forEach(request => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${request._id}</td>
                    <td>${request.userName}</td>
                    <td><img src="${request.userImageUrl}" alt="User Image" width="50"></td>
                    <td>
                        <img src="${request.imageUrl}" alt="Request Image" class="request-image" onclick="viewImage('${request.imageUrl}')">
                    </td>
                    <td>
                        <button class="btn btn-success" onclick="showApproveModal('${request._id}', '${request.userId}')">Duyệt</button>
                        <button class="btn btn-danger" onclick="deleteRequest('${request._id}')">Xóa</button>
                    </td>
                `;
                premiumRequestsTable.appendChild(row);
            });
        }
    } else {
        alert(data.message || 'Không thể tải danh sách yêu cầu.');
    }
}


// Hiển thị ảnh chi tiết trong modal
function viewImage(imageUrl) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;  // Set the src of the image in the modal
    $('#imageModal').modal('show');  // Show the modal with the image
}

// Hiển thị modal để xác nhận duyệt mentor
async function showApproveModal(requestId,idUser) {

    let AccountType = await getAccountType(idUser)
    let typeAcc
    if(AccountType === "mentor") {
        typeAcc = "maintain"
    } else if (AccountType === "mentee") {
        typeAcc = "update"
    }

    const approveBtn = document.getElementById('confirmApproveMentorBtn');
    approveBtn.onclick = () => approveMentor(requestId, idUser,typeAcc);
    $('#approveMentorModal').modal('show');
}

async function approveMentor(requestId, idUser, accountType) {
    try {
        const response = await fetch(`${API_URL}/approveMentor/${requestId}`, {
            method: 'POST',
        });
        const data = await response.json();

        console.log('API response:', data); // Debug thông tin trả về từ server
        if (!data.success) {
            alert('Không thể duyệt mentor: ' + (data.message || 'Unknown error'));
            return;
        }

        const userPremiumResponse = await fetch(`${API_URL}/getUserPremium/${idUser}`);
        const userPremiumData = await userPremiumResponse.json();

        console.log('UserPremium data trả về:', userPremiumData); // Debug dữ liệu UserPremium

        if (userPremiumResponse.ok) {
            let endDate = new Date();
            if (userPremiumData?.success && userPremiumData?.data?.endDate) {
                endDate = new Date(userPremiumData.data.endDate);
                endDate.setDate(endDate.getDate() + 30);
            } else {
                alert('Không tìm thấy thông tin UserPremium hợp lệ.');
                return;
            }

            const premiumData = {
                userId: idUser,
                userName: data.data.user?.name || 'Unknown',
                startDate: new Date().toISOString(),
                endDate: endDate.toISOString(),
            };

            const premiumResponse = await fetch(`${API_URL}/updateOrCreateUserPremium`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(premiumData),
            });

            const premiumResult = await premiumResponse.json();
            console.log('Premium API response:', premiumResult); // Debug thông tin premiumResponse

            if (premiumResult.success) {
                alert('Cập nhật thông tin UserPremium thành công!');

                // Xóa yêu cầu khỏi bảng Premium
                const deleteResponse = await fetch(`${API_URL}/deletePremiumRequest/${requestId}`, {
                    method: 'DELETE',
                });

                const deleteResult = await deleteResponse.json();

                createRevenue(idUser, accountType, "500000", "ok");
                loadPremiumRequests();
                $('#approveMentorModal').modal('hide');
            } else {
                alert(premiumResult.message || 'Không thể cập nhật thông tin UserPremium');
            }
        } else {
            alert('Không thể lấy thông tin UserPremium.');
        }
    } catch (error) {
        console.error('Lỗi xảy ra:', error);
        alert('Đã xảy ra lỗi trong quá trình xử lý.');
    }
}







// Xóa yêu cầu
async function deleteRequest(requestId) {
    const response = await fetch(`${API_URL}/deletePremiumRequest/${requestId}`, {
        method: 'DELETE',
    });
    const data = await response.json();

    if (data.success) {
        alert('Yêu cầu đã bị xóa.');
        loadPremiumRequests();  // Tải lại danh sách yêu cầu premium
    } else {
        alert('Đã xảy ra lỗi khi xóa yêu cầu.');
    }
}

function createRevenue(idUser,type,price,idStaff) {
    // Tạo đối tượng dữ liệu
    const revenueData = {
        idUser,
        type,
        price,
        idStaff
    };

    // Gửi yêu cầu POST tới API
    fetch(`${API_URL}/createRevenue`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(revenueData)
    })
        .then(response => response.json())
        .then(data => {
            // Hiển thị kết quả trả về từ server
            if (data.success) {
                console.log('Revenue created successfully:', data.revenue);
            } else {
                console.log('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getAccountType (id) {
    try {
        const response = await fetch(`${API_URL}/getUser/${id}`);
        if (!response.ok) {
            throw new Error('Không thể gọi API');
        }

        const data = await response.json();
        const accountType = data?.user?.accountType || 'Không có thông tin accountType';

        return accountType
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Gọi hàm để tải danh sách yêu cầu premium khi trang được tải
document.addEventListener('DOMContentLoaded', loadPremiumRequests);
