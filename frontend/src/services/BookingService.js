import axios from 'axios';

const API_SERVER_URL = 'http://localhost:2000'; // Sử dụng một hằng số chung

// Branch
const apiClient = axios.create({
    baseURL: `${API_SERVER_URL}/api/Branch`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Tăng timeout một chút
});

// Department
const apiDepartment = axios.create({
    baseURL: `${API_SERVER_URL}/api/department`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Specialty
const apiSpecialty = axios.create({
    baseURL: `${API_SERVER_URL}/api/specialty`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Doctor
const apiDoctor = axios.create({
    baseURL: `${API_SERVER_URL}/api/DoctorDetail`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});


export async function getBranchs() {
    try {
        const response = await apiClient.get('/all');
        // Đảm bảo mỗi branch có 'id' duy nhất và hợp lệ
        return response.data.map((branch, index) => ({
            ...branch,
            id: branch.id || `branch-${Date.now()}-${index}` // Fallback nếu id thiếu
        }));
    } catch (error) {
        console.error("Error fetching branches:", error);
        if (error.response) {
            throw new Error(`Lấy chi nhánh thất bại: ${error.response.data.message || error.response.status}`);
        } else if (error.request) {
            throw new Error('Không nhận được phản hồi từ server khi lấy chi nhánh.');
        } else {
            throw new Error('Lỗi khi gửi yêu cầu lấy chi nhánh: ' + error.message);
        }
    }
}

export async function getDepartment() {
    try {
        const response = await apiDepartment.get('/');
        // Đảm bảo mỗi department có 'idDepartment' duy nhất và hợp lệ
        return response.data.map((dept, index) => ({
            ...dept,
            idDepartment: dept.idDepartment || `dept-${Date.now()}-${index}` // Fallback
        }));
    } catch (error) {
        console.error("Error fetching departments:", error);
        if (error.response) {
            throw new Error(`Lấy khoa thất bại: ${error.response.data.message || error.response.status}`);
        } else if (error.request) {
            throw new Error('Không nhận được phản hồi từ server khi lấy khoa.');
        } else {
            throw new Error('Lỗi khi gửi yêu cầu lấy khoa: ' + error.message);
        }
    }
}


export async function getSpecialtiesByDepartment(idDepartment) {
    if (!idDepartment) {
        console.warn("idDepartment is undefined, cannot fetch specialties.");
        return [];
    }
    try {
        const response = await apiSpecialty.get(`/by-department/${idDepartment}`);
        // Đảm bảo mỗi specialty có 'idSpecialty' duy nhất và hợp lệ
        return response.data.map((spec, index) => ({
            ...spec,
            idSpecialty: spec.idSpecialty || `spec-${Date.now()}-${index}` // Fallback
        }));
    } catch (error) {
        console.error(`Error fetching specialties for department ${idDepartment}:`, error);
        if (error.response?.status === 404) {
            return []; // Trả về mảng rỗng nếu không tìm thấy, không coi là lỗi nghiêm trọng
        }
        // Không throw error ở đây nữa để UI không bị vỡ, chỉ log lỗi
        // throw new Error('Lỗi khi lấy chuyên khoa: ' + error.message);
        return []; // Trả về mảng rỗng khi có lỗi khác
    }
}

// BookingService.js
const API_URL = 'http://0.0.0.0:2000/api/DoctorDetail';

export const searchDoctorsByCriteria = async (criteria) => {
    console.log("Sending criteria to API:", criteria);
    try {
        const response = await fetch(`${API_URL}/search-by-criteria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // RẤT QUAN TRỌNG
                // 'Accept': 'application/json' // Thường cũng nên có
            },
            body: JSON.stringify(criteria) // RẤT QUAN TRỌNG
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            // Dòng 126 có thể là ở đây
            console.error('API Error in searchDoctorsByCriteria:', errorData);
            throw new Error(`Tìm bác sĩ thất bại: ${errorData.message || 'Validation failed'}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch Error in searchDoctorsByCriteria:', error.message);
        // Đảm bảo ném lại lỗi hoặc một lỗi có ý nghĩa
        if (error.message.startsWith('Tìm bác sĩ thất bại:')) {
            throw error;
        }
        throw new Error(`Tìm bác sĩ thất bại: Lỗi hệ thống khi gọi API`);
    }
};

// Hằng số API_BASE_URL để sử dụng trong các component cho hình ảnh
export const API_IMG_URL = API_SERVER_URL; // ví dụ: http://localhost:2000


// lấy id bác sĩ theo id
export async function getDoctorById(doctorID) {
    if (!doctorID) {
        throw new Error('Thiếu doctorId khi gọi API.');
    }
    try {
        const response = await axios.get(`${API_SERVER_URL}/api/doctor/${doctorID}/fullinfo`);
        return response.data;
    }
    catch (error) {
        console.error('Lỗi khi lấy thông tin đầy đủ bác sĩ:', error);

        if (error.response) {
            throw new Error(`Lỗi từ server: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Không nhận được phản hồi từ server.');
        } else {
            throw new Error('Lỗi khi gửi yêu cầu: ' + error.message);
        }
    }
}


// Gửi thông tin đặt lịch khám
export async function bookAppointment(bookingData) {
    try {
        const response = await fetch(`${API_SERVER_URL}/api/booking/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Đặt lịch khám thất bại: ${errorData.message || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu đặt lịch:', error);
        throw new Error(error.message || 'Đặt lịch khám thất bại!');
    }
}

export async function checkSlotTaken(doctorId, date, slot) {
    if (!doctorId || !date || !slot) {
        throw new Error('Thiếu thông tin doctorId, date hoặc slot.');
    }

    try {
        const response = await axios.get(`${API_SERVER_URL}/api/booking/check-slot`, {
            params: {
                doctorId,
                date,   // Định dạng yyyy-MM-dd hoặc ISO string, backend nên parse đúng
                slot
            }
        });
        // Response example: { isTaken: true/false }
        return response.data.isTaken;
    } catch (error) {
        console.error('Lỗi khi kiểm tra slot:', error);
        if (error.response) {
            throw new Error(`Lỗi từ server: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Không nhận được phản hồi từ server.');
        } else {
            throw new Error('Lỗi khi gửi yêu cầu: ' + error.message);
        }
    }
}


// src/services/BookingService.js

// ... (các hàm khác giữ nguyên) ...

export const getAppointmentsByDoctorId = async (doctorId) => {
    if (!doctorId) {
        // Trả về mảng rỗng nếu không có doctorId để tránh lỗi không cần thiết ở UI
        // console.warn("Doctor ID is required for getAppointmentsByDoctorId, returning empty array.");
        return [];
    }
    try {
        const response = await axios.get(`${API_SERVER_URL}/api/booking/appointments/doctor/${doctorId}`);
        return response.data; // Backend nên trả về danh sách hoặc 404 nếu không có.
    } catch (error) {
        console.error(`Error fetching appointments for doctor ${doctorId}:`, error);
        if (error.response) {
            if (error.response.status === 404) {
                return []; // Không tìm thấy lịch hẹn nào, trả về mảng rỗng.
            }
            // Ném lỗi cho các trường hợp khác để UI có thể xử lý
            throw new Error(`Lỗi từ server khi lấy lịch hẹn: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Không nhận được phản hồi từ server khi lấy lịch hẹn.');
        } else {
            throw new Error('Lỗi khi gửi yêu cầu lấy lịch hẹn: ' + error.message);
        }
    }
};

// ... (các hàm khác giữ nguyên) ...




export async function checkPatientBooking(patientId, doctorId, date, slot) {
    if (!patientId || !doctorId || !date || !slot) {
        throw new Error('Thiếu thông tin patientId, doctorId, date hoặc slot.');
    }

    try {
        // Chuyển date sang dạng yyyy-MM-dd để backend dễ xử lý
        const dateString = new Date(date).toISOString().split('T')[0];

        const response = await axios.get(`${API_SERVER_URL}/api/booking/check-patient-booking`, {
            params: {
                patientId,
                doctorId,
                date: dateString,
                slot,
            },
        });

        // Response dạng: { hasBooking: true/false }
        return response.data.hasBooking;
    } catch (error) {
        console.error('Lỗi khi kiểm tra lịch hẹn của bệnh nhân:', error);
        if (error.response) {
            throw new Error(error.response.data.message || error.response.statusText);
        } else if (error.request) {
            throw new Error('Không nhận được phản hồi từ server.');
        } else {
            throw new Error('Lỗi khi gửi yêu cầu: ' + error.message);
        }
    }
}

export const createAppointmentAndGetPaymentLink = async (bookingData) => {
    try {
        // Gọi đến API mới
        const response = await axios.post(`${API_SERVER_URL}/api/booking/create-and-get-payment-link`, bookingData);
        return response.data; // Trả về kết quả từ PayOS (chứa checkoutUrl)
    } catch (error) {
        // Xử lý lỗi
        console.error('Error creating payment link:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tạo link thanh toán.');
    }
};


export async function checkUserDailyBookingLimit(patientId, doctorId, date) {
    if (!patientId || !doctorId || !date) {
        // Có thể throw error hoặc trả về một giá trị mặc định (ví dụ, coi như đã đặt để an toàn)
        console.error('Thiếu thông tin patientId, doctorId, hoặc date cho checkUserDailyBookingLimit.');
        throw new Error('Thiếu thông tin đầu vào để kiểm tra giới hạn đặt lịch.');
    }
    try {
        const dateString = new Date(date).toISOString().split('T')[0]; // date ở đây là YYYY-MM-DD từ selectedDate
        const response = await axios.get(`${API_SERVER_URL}/api/booking/check-daily-limit`, {
            params: {
                patientId,
                doctorId,
                date: dateString, // Gửi dateString (YYYY-MM-DD) cho backend
            },
        });
        return response.data.hasBookingToday; // Mong đợi { hasBookingToday: boolean }
    } catch (error) {
        console.error('Lỗi khi kiểm tra giới hạn đặt lịch hàng ngày của bệnh nhân:', error);
        if (error.response) {
            // Lỗi 404 sẽ rơi vào đây
            throw new Error(error.response.data?.message || `Lỗi server khi kiểm tra giới hạn đặt lịch: ${error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Không nhận được phản hồi từ server khi kiểm tra giới hạn đặt lịch.');
        } else {
            throw new Error('Lỗi khi gửi yêu cầu kiểm tra giới hạn đặt lịch: ' + error.message);
        }
    }
}

