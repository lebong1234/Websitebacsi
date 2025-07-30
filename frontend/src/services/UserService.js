import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:2000/api/user', // baseURL chung
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // timeout nếu muốn
});

export async function registerUser(registerDto) {
    try {
        // Đảm bảo gửi đúng các trường cho API mới
        const response = await apiClient.post('/register', registerDto);
        return response.data; // dữ liệu trả về từ server
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                // Lỗi trùng email hoặc phone
                throw new Error(error.response.data.message || 'Email hoặc số điện thoại đã tồn tại.');
            }
            // Lỗi khác từ server
            throw new Error('Đăng ký thất bại: ' + JSON.stringify(error.response.data));
        } else if (error.request) {
            // Lỗi không nhận được phản hồi
            throw new Error('Không nhận được phản hồi từ server.');
        } else {
            // Lỗi khác khi cấu hình request
            throw new Error('Lỗi khi gửi yêu cầu: ' + error.message);
        }
    }
}

export async function loginUser(loginDto) {
    try {
        const response = await apiClient.post('/login', loginDto);

        // Lưu thông tin user vào localStorage hoặc biến tạm
        const user = response.data;
        // Lưu cả id và patientId nếu có
        localStorage.setItem('currentUser', JSON.stringify(user));

        return user;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                // Lỗi xác thực
                throw new Error(error.response.data?.message || 'Email hoặc mật khẩu không đúng');
            } else if (error.response.status === 409) {
                // Lỗi trùng email hoặc phone
                throw new Error(error.response.data?.message || 'Email hoặc số điện thoại đã tồn tại.');
            } else if (error.response.status === 500) {
                // Lỗi server
                console.error('Server error:', error.response.data);
                throw new Error('Lỗi server. Vui lòng thử lại sau.');
            }
            // Lỗi khác từ server
            throw new Error('Đăng nhập thất bại: ' + (error.response.data?.message || JSON.stringify(error.response.data)));
        } else if (error.request) {
            // Lỗi không nhận được phản hồi
            throw new Error('Không nhận được phản hồi từ server.');
        } else {
            // Lỗi khác khi cấu hình request
            throw new Error('Lỗi khi gửi yêu cầu: ' + error.message);
        }
    }
}

export async function getUserProfile(userId) {
    const res = await apiClient.get(`/${userId}`);
    return res.data;
}

export async function getUserBookings(user) {
    // Ưu tiên dùng patientId nếu có, nếu không thì dùng id
    const userId = user.patientId || user.id;
    const res = await axios.get(`http://localhost:2000/api/booking/user/${userId}`);
    return res.data;
}

export async function getUserPackages(userId) {
    const res = await axios.get(`http://localhost:2000/api/package/user/${userId}`);
    return res.data;
}

