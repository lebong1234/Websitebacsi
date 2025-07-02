// src/services/GoogleAuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:2000/api/auth'; // Base URL cho auth API

// Đối tượng này sẽ chứa các hàm gọi API
export const GoogleAuthService = {
    /**
     * Gửi thông tin người dùng Google đã được giải mã từ ID Token đến backend.
     * @param {object} googleUserData - Đối tượng chứa { GoogleId, Email, Name }
     * @returns {Promise<object>} - Phản hồi từ backend
     */
    processGoogleSignIn: async (googleUserData) => {
        try {
            const response = await axios.post(
                `${API_URL}/process-google-signin`,
                googleUserData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Thêm withCredentials nếu backend của bạn thiết lập cookie session
                    // và bạn muốn trình duyệt tự động gửi/nhận cookie
                    // withCredentials: true,
                }
            );
            return response.data; // Trả về dữ liệu từ backend (ví dụ: { message, id, name, email })
        } catch (error) {
            console.error('Error calling processGoogleSignIn API:', error.response || error);
            // Ném lỗi để component có thể bắt và hiển thị thông báo
            throw error.response ? error.response.data : new Error('Lỗi kết nối đến server hoặc server không phản hồi.');
        }
    },

    // Bạn có thể thêm các hàm khác liên quan đến Google Auth ở đây nếu cần
    // Ví dụ: nếu bạn quyết định backend sẽ xử lý authorization code
    /*
    signInWithGoogleCode: async (authCode) => {
      try {
        const response = await axios.post(`${API_URL}/google-signin-code`, { code: authCode });
        return response.data;
      } catch (error) {
        console.error('Error sending Google auth code to backend:', error.response);
        throw error.response ? error.response.data : new Error('Lỗi khi gửi mã xác thực Google.');
      }
    }
    */
};