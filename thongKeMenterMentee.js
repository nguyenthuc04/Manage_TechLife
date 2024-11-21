// Lấy dropdown menu
const dropdownMenu = document.getElementById("dropdownMenu");
const resultDisplay = document.getElementById("textUserSelected");
var chart1
var chart2
const dataMentee = document.getElementById("data-mentee");
const dataMenter = document.getElementById("data-menter");


document.addEventListener("DOMContentLoaded", function () {
    // Dữ liệu cho biểu đồ 1
    var ctx1 = document.getElementById('lineChart1').getContext('2d');
    chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Dữ liệu cho biểu đồ 2
    var ctx2 = document.getElementById('lineChart2').getContext('2d');
    chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


});

const SelectedView = () => {
    // Gắn sự kiện click vào từng item
    dropdownMenu.addEventListener("click", function (event) {
        // Kiểm tra xem người dùng click vào item nào
        const target = event.target;

        // Nếu item có class "dropdown-item", lấy dữ liệu
        if (target.classList.contains("dropdown-item")) {
            const selectedValue = target.getAttribute("data-value");
            const selectedText = target.textContent.trim();

            resultDisplay.textContent = `Chế độ xem: ${selectedText}`;

            if (selectedValue === "ngay") {
                updateChartDataLabelMenter(chart1,["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]);
                updateChartDataMenter(chart1, [
                    {
                        label: 'Số lượng',
                        data: [1, 2, 3,2,1],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }
                ]);

                updateChartDataLabelMentee(chart2,["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]);
                updateChartDataMentee(chart2, [
                    {
                        label: 'Số lượng',
                        data: [1, 2, 3,2,1],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }
                ]);
                // const mentorCount = 60; // Số lượng mentor
                // const menteeCount = 60; // Số lượng mentee
                // updateDoughnutData(mentorCount, menteeCount);

                // updateChartDataLabelMentee(chart2,["Hôm qua","Hôm nay"])
                // Gọi hàm fetch dữ liệu
                // fetchDataMenter(chart1);
                // fetchMenteeCount()
            } else if (selectedValue === "tuan") {
                updateChartDataLabelMenter(chart1,["1","2","3","4","5","6","7"])
                // updateChartDataLabelMentee(chart2,["1","2","3","4","5","6","7"])
            } else if (selectedValue === "thang") {

            } else if (selectedValue === "tuy-chinh") {

            }

            // Gọi API hoặc thực hiện hành động khác ở đây
        }
    });
}


const updateChartDataMenter = (chart, newDatasets) => {
    // Cập nhật datasets
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

const updateChartDataMentee = (chart, newDatasets) => {
    // Cập nhật datasets
    chart.data.datasets = newDatasets;
    // Cập nhật lại biểu đồ
    chart.update();
};

const updateChartDataLabelMenter = (chart, newLabels) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    // Cập nhật lại biểu đồ
    chart.update();
};
const updateChartDataLabelMentee = (chart, newLabels, newDatasets) => {
    // Cập nhật labels
    chart.data.labels = newLabels;
    // Cập nhật lại biểu đồ
    chart.update();
};


// Gọi API và cập nhật dữ liệu menter
const fetchMenterCount = async () => {
    try {
        const response = await fetch('http://26.187.200.144:3000/getListUsersByAccountType?accountType=menter'); // Đổi URL cho phù hợp
        const data = await response.json();

        console.log('User List:', data.users.length);  // In ra danh sách người dùng nếu cần
        // updateChartDataMenter(chart1,data.users.length)
        return data.users.length
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
};


// Gọi API và cập nhật dữ liệu mentee
const fetchMenteeCount = async () => {
    try {
        const response = await fetch('http://26.187.200.144:3000/getListUsersByAccountType?accountType=mentee'); // Đổi URL cho phù hợp
        const data = await response.json();

        console.log('User List:', data.users.length);  // In ra danh sách người dùng nếu cần
        // updateChartDataMenter(chart2,data.users.length)
        return data.users.length
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
};

// Hàm cập nhật dữ liệu vào thẻ HTML
const updateStatistics = async () => {
    const soLuongMentee = await fetchMenteeCount(); // Đợi kết quả API
    const soLuongMenter = await fetchMenterCount(); // Đợi kết quả API


    dataMentee.textContent = soLuongMentee; // Cập nhật số lượng mentee vào thẻ
    dataMenter.textContent = soLuongMenter; // Cập nhật số lượng menter vào thẻ
};

// Gọi hàm updateStatistics để cập nhật dữ liệu
updateStatistics();
