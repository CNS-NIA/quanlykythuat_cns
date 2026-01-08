// vehicles.js - Quản lý phương tiện cho hệ thống QLKT Nội Bài

// Dữ liệu mẫu cho phương tiện
let vehiclesData = [
    {
        id: 1,
        licensePlate: "29A-123.45",
        name: "Xe kiểm tra đường băng 01",
        type: "inspection",
        registrationDate: "2020-05-15",
        inspectionDate: "2023-10-20",
        fuelLevel: 92,
        status: "active",
        assignedTo: "Nguyễn Văn A",
        notes: "Xe chuyên dụng kiểm tra đường băng, hoạt động tốt"
    },
    {
        id: 2,
        licensePlate: "29A-456.78",
        name: "Xe vận chuyển thiết bị",
        type: "transport",
        registrationDate: "2021-03-10",
        inspectionDate: "2023-11-05",
        fuelLevel: 78,
        status: "active",
        assignedTo: "Trần Thị B",
        notes: "Xe chở thiết bị kỹ thuật, vừa bảo dưỡng định kỳ"
    },
    {
        id: 3,
        licensePlate: "29A-789.01",
        name: "Xe cứu hộ khẩn cấp",
        type: "emergency",
        registrationDate: "2019-11-22",
        inspectionDate: "2023-09-15",
        fuelLevel: 85,
        status: "maintenance",
        assignedTo: "Lê Văn C",
        notes: "Đang sửa chữa hệ thống phun nhiên liệu"
    },
    {
        id: 4,
        licensePlate: "29A-234.56",
        name: "Xe hỗ trợ kỹ thuật",
        type: "other",
        registrationDate: "2022-01-30",
        inspectionDate: "2023-12-01",
        fuelLevel: 95,
        status: "active",
        assignedTo: "Phạm Thị D",
        notes: "Xe hỗ trợ kỹ thuật đa năng"
    },
    {
        id: 5,
        licensePlate: "29A-567.89",
        name: "Xe kiểm tra đèn hiệu",
        type: "inspection",
        registrationDate: "2020-08-12",
        inspectionDate: "2023-08-25",
        fuelLevel: 65,
        status: "active",
        assignedTo: "Nguyễn Văn A",
        notes: "Cần đổ nhiên liệu trong tuần này"
    },
    {
        id: 6,
        licensePlate: "29A-890.12",
        name: "Xe vận chuyển nhân sự",
        type: "transport",
        registrationDate: "2021-06-18",
        inspectionDate: "2023-10-30",
        fuelLevel: 100,
        status: "inactive",
        assignedTo: "Trần Thị B",
        notes: "Tạm ngừng hoạt động chờ thay lốp"
    }
];

// Biến quản lý phân trang
let currentPage = 1;
const itemsPerPage = 5;
let filteredVehicles = [...vehiclesData];

// Khởi tạo trang phương tiện
document.addEventListener('DOMContentLoaded', function() {
    renderVehiclesTable();
    setupEventListeners();
    renderVehicleTypeChart();
    updateVehicleStats();
    
    // Đặt ngày mặc định cho form
    document.getElementById('refillDate').valueAsDate = new Date();
    document.getElementById('registrationDate').valueAsDate = new Date();
    document.getElementById('inspectionDate').valueAsDate = new Date();
});

// Render bảng phương tiện
function renderVehiclesTable() {
    const tableBody = document.getElementById('vehiclesTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVehicles = filteredVehicles.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (currentVehicles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">Không có dữ liệu phương tiện</td>
            </tr>
        `;
        updatePageInfo();
        return;
    }
    
    currentVehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        
        // Xác định loại xe để hiển thị
        let typeText = '';
        let typeClass = '';
        switch(vehicle.type) {
            case 'inspection':
                typeText = 'Xe kiểm tra';
                typeClass = 'type-inspection';
                break;
            case 'transport':
                typeText = 'Xe vận chuyển';
                typeClass = 'type-transport';
                break;
            case 'emergency':
                typeText = 'Xe cứu hộ';
                typeClass = 'type-emergency';
                break;
            default:
                typeText = 'Khác';
                typeClass = 'type-other';
        }
        
        // Xác định trạng thái
        let statusText = '';
        let statusClass = '';
        switch(vehicle.status) {
            case 'active':
                statusText = 'Đang hoạt động';
                statusClass = 'status-active';
                break;
            case 'maintenance':
                statusText = 'Đang bảo trì';
                statusClass = 'status-maintenance';
                break;
            case 'inactive':
                statusText = 'Ngừng hoạt động';
                statusClass = 'status-inactive';
                break;
        }
        
        // Xác định màu sắc cho mức nhiên liệu
        let fuelClass = 'fuel-high';
        if (vehicle.fuelLevel < 30) {
            fuelClass = 'fuel-low';
        } else if (vehicle.fuelLevel < 70) {
            fuelClass = 'fuel-medium';
        }
        
        row.innerHTML = `
            <td><strong>${vehicle.licensePlate}</strong></td>
            <td>${vehicle.name}</td>
            <td><span class="badge ${typeClass}">${typeText}</span></td>
            <td>${formatDate(vehicle.inspectionDate)}</td>
            <td>
                <div class="fuel-container">
                    <div class="fuel-bar">
                        <div class="fuel-level ${fuelClass}" style="width: ${vehicle.fuelLevel}%"></div>
                    </div>
                    <span class="fuel-percent">${vehicle.fuelLevel}%</span>
                </div>
            </td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>${vehicle.assignedTo || 'Chưa phân công'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editVehicle(${vehicle.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="refillFuel(${vehicle.id})" title="Đổ nhiên liệu">
                        <i class="fas fa-gas-pump"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteVehicle(${vehicle.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    updatePageInfo();
}

// Cập nhật thông tin trang
function updatePageInfo() {
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Trang ${currentPage}/${totalPages}`;
}

// Chuyển trang
function changePage(direction) {
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderVehiclesTable();
    }
}

// Lọc phương tiện
function filterVehicles() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    filteredVehicles = vehiclesData.filter(vehicle => {
        const statusMatch = statusFilter === 'all' || vehicle.status === statusFilter;
        const typeMatch = typeFilter === 'all' || vehicle.type === typeFilter;
        
        return statusMatch && typeMatch;
    });
    
    currentPage = 1;
    renderVehiclesTable();
}

// Tìm kiếm phương tiện
function searchVehicles() {
    const searchTerm = document.getElementById('vehicleSearch').value.toLowerCase();
    
    filteredVehicles = vehiclesData.filter(vehicle => {
        return (
            vehicle.licensePlate.toLowerCase().includes(searchTerm) ||
            vehicle.name.toLowerCase().includes(searchTerm) ||
            (vehicle.assignedTo && vehicle.assignedTo.toLowerCase().includes(searchTerm))
        );
    });
    
    currentPage = 1;
    renderVehiclesTable();
}

// Mở modal thêm phương tiện mới
function openAddVehicleModal() {
    document.getElementById('modalTitle').textContent = 'Thêm phương tiện mới';
    document.getElementById('vehicleId').value = '';
    document.getElementById('vehicleForm').reset();
    document.getElementById('fuelLevel').value = 100;
    document.getElementById('fuelValue').textContent = '100%';
    
    // Đặt ngày mặc định
    const today = new Date();
    document.getElementById('registrationDate').valueAsDate = today;
    document.getElementById('inspectionDate').valueAsDate = today;
    
    document.getElementById('vehicleModal').style.display = 'block';
}

// Mở modal sửa phương tiện
function editVehicle(id) {
    const vehicle = vehiclesData.find(v => v.id === id);
    if (!vehicle) return;
    
    document.getElementById('modalTitle').textContent = 'Sửa thông tin phương tiện';
    document.getElementById('vehicleId').value = vehicle.id;
    document.getElementById('licensePlate').value = vehicle.licensePlate;
    document.getElementById('vehicleName').value = vehicle.name;
    document.getElementById('vehicleType').value = vehicle.type;
    document.getElementById('registrationDate').value = vehicle.registrationDate;
    document.getElementById('inspectionDate').value = vehicle.inspectionDate;
    document.getElementById('fuelLevel').value = vehicle.fuelLevel;
    document.getElementById('fuelValue').textContent = vehicle.fuelLevel + '%';
    document.getElementById('status').value = vehicle.status;
    document.getElementById('assignedTo').value = vehicle.assignedTo || '';
    document.getElementById('notes').value = vehicle.notes || '';
    
    document.getElementById('vehicleModal').style.display = 'block';
}

// Đóng modal phương tiện
function closeVehicleModal() {
    document.getElementById('vehicleModal').style.display = 'none';
}

// Cập nhật giá trị nhiên liệu khi kéo thanh trượt
function updateFuelValue() {
    const fuelLevel = document.getElementById('fuelLevel').value;
    document.getElementById('fuelValue').textContent = fuelLevel + '%';
}

// Xử lý form phương tiện
function setupEventListeners() {
    const vehicleForm = document.getElementById('vehicleForm');
    const fuelForm = document.getElementById('fuelForm');
    
    vehicleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveVehicle();
    });
    
    fuelForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveFuelRefill();
    });
    
    // Đóng modal khi click ra ngoài
    window.addEventListener('click', function(e) {
        const vehicleModal = document.getElementById('vehicleModal');
        const fuelModal = document.getElementById('fuelModal');
        
        if (e.target === vehicleModal) {
            closeVehicleModal();
        }
        
        if (e.target === fuelModal) {
            closeFuelModal();
        }
    });
}

// Lưu thông tin phương tiện
function saveVehicle() {
    const id = document.getElementById('vehicleId').value;
    const licensePlate = document.getElementById('licensePlate').value;
    const vehicleName = document.getElementById('vehicleName').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const registrationDate = document.getElementById('registrationDate').value;
    const inspectionDate = document.getElementById('inspectionDate').value;
    const fuelLevel = document.getElementById('fuelLevel').value;
    const status = document.getElementById('status').value;
    const assignedTo = document.getElementById('assignedTo').value;
    const notes = document.getElementById('notes').value;
    
    if (!licensePlate || !vehicleName || !vehicleType) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    if (id) {
        // Cập nhật phương tiện hiện có
        const index = vehiclesData.findIndex(v => v.id == id);
        if (index !== -1) {
            vehiclesData[index] = {
                ...vehiclesData[index],
                licensePlate,
                name: vehicleName,
                type: vehicleType,
                registrationDate,
                inspectionDate,
                fuelLevel: parseInt(fuelLevel),
                status,
                assignedTo,
                notes
            };
        }
    } else {
        // Thêm phương tiện mới
        const newId = vehiclesData.length > 0 ? Math.max(...vehiclesData.map(v => v.id)) + 1 : 1;
        const newVehicle = {
            id: newId,
            licensePlate,
            name: vehicleName,
            type: vehicleType,
            registrationDate,
            inspectionDate,
            fuelLevel: parseInt(fuelLevel),
            status,
            assignedTo,
            notes
        };
        
        vehiclesData.push(newVehicle);
    }
    
    // Cập nhật giao diện
    filteredVehicles = [...vehiclesData];
    renderVehiclesTable();
    renderVehicleTypeChart();
    updateVehicleStats();
    closeVehicleModal();
    
    // Hiển thị thông báo
    showNotification('Đã lưu thông tin phương tiện thành công!', 'success');
}

// Xóa phương tiện
function deleteVehicle(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
        return;
    }
    
    const index = vehiclesData.findIndex(v => v.id === id);
    if (index !== -1) {
        vehiclesData.splice(index, 1);
        filteredVehicles = [...vehiclesData];
        renderVehiclesTable();
        renderVehicleTypeChart();
        updateVehicleStats();
        
        // Hiển thị thông báo
        showNotification('Đã xóa phương tiện thành công!', 'success');
    }
}

// Mở modal đổ nhiên liệu
function refillFuel(id) {
    const vehicle = vehiclesData.find(v => v.id === id);
    if (!vehicle) return;
    
    document.getElementById('fuelVehicleId').value = vehicle.id;
    document.getElementById('currentFuel').value = `${vehicle.fuelLevel}%`;
    document.getElementById('refillAmount').value = 10;
    document.getElementById('refillDate').valueAsDate = new Date();
    document.getElementById('refillNotes').value = '';
    
    document.getElementById('fuelModal').style.display = 'block';
}

// Đóng modal đổ nhiên liệu
function closeFuelModal() {
    document.getElementById('fuelModal').style.display = 'none';
}

// Lưu thông tin đổ nhiên liệu
function saveFuelRefill() {
    const vehicleId = document.getElementById('fuelVehicleId').value;
    const refillAmount = parseInt(document.getElementById('refillAmount').value);
    const refillDate = document.getElementById('refillDate').value;
    const refillNotes = document.getElementById('refillNotes').value;
    
    const vehicleIndex = vehiclesData.findIndex(v => v.id == vehicleId);
    if (vehicleIndex === -1) return;
    
    // Cập nhật mức nhiên liệu (tăng lên nhưng không vượt quá 100%)
    const newFuelLevel = Math.min(vehiclesData[vehicleIndex].fuelLevel + refillAmount, 100);
    vehiclesData[vehicleIndex].fuelLevel = newFuelLevel;
    
    // Cập nhật ghi chú
    const refillInfo = `Đổ nhiên liệu: +${refillAmount}L vào ${formatDate(refillDate)}. ${refillNotes}`;
    vehiclesData[vehicleIndex].notes = vehiclesData[vehicleIndex].notes 
        ? vehiclesData[vehicleIndex].notes + '\n' + refillInfo
        : refillInfo;
    
    // Cập nhật giao diện
    filteredVehicles = [...vehiclesData];
    renderVehiclesTable();
    updateVehicleStats();
    closeFuelModal();
    
    // Hiển thị thông báo
    showNotification(`Đã cập nhật nhiên liệu cho phương tiện lên ${newFuelLevel}%!`, 'success');
}

// Cập nhật thống kê phương tiện
function updateVehicleStats() {
    const totalVehicles = vehiclesData.length;
    const activeVehicles = vehiclesData.filter(v => v.status === 'active').length;
    const maintenanceVehicles = vehiclesData.filter(v => v.status === 'maintenance').length;
    
    // Tính mức nhiên liệu trung bình
    const totalFuel = vehiclesData.reduce((sum, vehicle) => sum + vehicle.fuelLevel, 0);
    const avgFuel = totalVehicles > 0 ? Math.round(totalFuel / totalVehicles) : 0;
    
    // Cập nhật thống kê trên giao diện
    document.querySelectorAll('.stat-card')[0].querySelector('h3').textContent = totalVehicles;
    document.querySelectorAll('.stat-card')[1].querySelector('h3').textContent = activeVehicles;
    document.querySelectorAll('.stat-card')[2].querySelector('h3').textContent = maintenanceVehicles;
    document.querySelectorAll('.stat-card')[3].querySelector('h3').textContent = avgFuel + '%';
}

// Vẽ biểu đồ phân bố loại phương tiện
function renderVehicleTypeChart() {
    const ctx = document.getElementById('vehicleTypeChart').getContext('2d');
    
    // Đếm số lượng theo loại
    const typeCounts = {
        inspection: 0,
        transport: 0,
        emergency: 0,
        other: 0
    };
    
    vehiclesData.forEach(vehicle => {
        typeCounts[vehicle.type]++;
    });
    
    // Nếu đã có biểu đồ cũ, hủy nó
    if (window.vehicleChart) {
        window.vehicleChart.destroy();
    }
    
    // Tạo biểu đồ mới
    window.vehicleChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Xe kiểm tra', 'Xe vận chuyển', 'Xe cứu hộ', 'Khác'],
            datasets: [{
                data: [
                    typeCounts.inspection,
                    typeCounts.transport,
                    typeCounts.emergency,
                    typeCounts.other
                ],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}

// Định dạng ngày
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

// Hiển thị thông báo
function showNotification(message, type) {
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Thêm vào trang
    document.body.appendChild(notification);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}