// Khởi tạo lượt truy cập
let visitCount = localStorage.getItem('visitCount') || 1847;
visitCount = parseInt(visitCount) + 1;
localStorage.setItem('visitCount', visitCount);
document.getElementById('visit-count').textContent = visitCount.toLocaleString();

// Cập nhật ngày giờ
function updateDateTime() {
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const months = ['Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    
    const dateString = `${dayName}, ${day} Tháng ${monthName} ${year}`;
    document.getElementById('current-date').textContent = dateString;
}

// Xử lý tìm kiếm
document.getElementById('search-btn').addEventListener('click', function() {
    const searchTerm = document.getElementById('search-input').value.trim();
    const searchType = document.querySelector('input[name="search-type"]:checked').parentNode.textContent.trim();
    
    if (!searchTerm) {
        alert('Vui lòng nhập từ khóa tìm kiếm!');
        return;
    }
    
    alert(`Đang tìm kiếm "${searchTerm}" trong ${searchType}...\n\n(Chức năng đang phát triển)`);
});

// Xử lý đăng nhập
document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Thông tin admin mặc định
    const adminEmail = 'naoc.cns@gmail.com';
    const adminPassword = 'Noibai@Cns';
    
    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu!');
        return;
    }
    
    if (email === adminEmail && password === adminPassword) {
        alert('✅ Đăng nhập thành công!\n\nChuyển đến trang Dashboard...');
        // Trong thực tế: window.location.href = 'dashboard.html';
        window.location.href = 'dashboard.html'; // File này cần tạo sau
    } else {
        alert('❌ Email hoặc mật khẩu không đúng!\n\nThử với:\nEmail: naoc.cns@gmail.com\nMật khẩu: Noibai@Cns');
    }
});

// Cho phép đăng nhập bằng phím Enter
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('login-btn').click();
    }
});

// Hiệu ứng cho các card menu
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Khởi chạy
updateDateTime();

// Cập nhật thời gian mỗi phút
setInterval(updateDateTime, 60000);