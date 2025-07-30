
import axios from 'axios';

// --- Cấu hình ---
const API_BASE_URL = 'http://localhost:2000/api';
const STATIC_ASSETS_URL = 'http://localhost:2000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Chuẩn hóa dữ liệu bác sĩ từ API thành định dạng thống nhất cho frontend
 * @param {object} raw - Dữ liệu thô từ API
 * @returns {object} - Dữ liệu bác sĩ đã chuẩn hóa
 */
const normalizeDoctorData = (raw) => {
  if (!raw) return null;

  // Lấy dữ liệu từ các object lồng nhau (nếu có)
  const doctor = raw.Doctor || raw.doctor || {};
  const detail = raw.DoctorDetail || raw.doctorDetail || {};

  // Gộp tên từ nhiều nguồn
  let name =
    raw.name ||
    raw.doctorName ||
    raw.fullName ||
    raw.ten ||
    raw.Name ||
    raw.DoctorName ||
    doctor.name ||
    doctor.doctorName ||
    doctor.fullName ||
    doctor.ten ||
    detail.name ||
    detail.doctorName ||
    detail.fullName ||
    detail.ten ||
    '';

  name = (typeof name === 'string' && name.trim().length > 0) ? name.trim() : 'Bác sĩ chưa cập nhật tên';

  const processImage = (path) => {
    if (!path || typeof path !== 'string') return null;
    if (path.startsWith('http')) return path;
    return `${STATIC_ASSETS_URL}${path.startsWith('/') ? path : '/' + path}`;
  };

  const avatarPath = detail.img || raw.img || raw.avatar || raw.image || raw.DoctorImage || '';
  const finalAvatar = processImage(avatarPath) || '/default-doctor.png';

  return {
    id: detail.doctorId || doctor.idDoctor || raw.doctorId || raw.id || raw._id || raw.Id || '',
    name,
    img: finalAvatar,
    degree: detail.degree || raw.degree || raw.Degree || '',
    description: detail.description || raw.description || raw.JobDescription || '',
    branchName: detail.branchName || raw.branchName || raw.BranchName || raw.WorkingAtBranch || '',
    departmentName: detail.departmentName || raw.departmentName || raw.DepartmentName || raw.WorkingInDepartment || '',
    specialtyName: detail.specialtyName || raw.specialtyName || raw.SpecialtyName || raw.SpecializingIn || '',
    degreeImg: processImage(detail.degreeImg || raw.degreeImg),
    certificateImg: processImage(detail.certificateImg || raw.certificateImg),
    phone: doctor.phone || raw.phone || raw.Phone || '',
    email: doctor.email || raw.email || raw.Email || '',
    gender: doctor.gender || raw.gender || raw.Gender || '',
    dateOfBirth: doctor.dateOfBirth || raw.dateOfBirth || raw.DateOfBirth,
    rating: raw.rating || raw.Rating || 0,
    reviewCount: raw.reviewCount || raw.ReviewCount || 0,
    cccd: doctor.cccd || raw.cccd || raw.Cccd || '',
  };
};

const doctorService = {
  async searchDoctors(filters = {}) {
    try {
      let doctors = [];
      const hasBranch = filters.branchId && typeof filters.branchId === 'string' && filters.branchId.trim() !== '';
      const hasDepartment = filters.departmentId && typeof filters.departmentId === 'string' && filters.departmentId.trim() !== '';
      const hasSpecialty = filters.specialtyId && typeof filters.specialtyId === 'string' && filters.specialtyId.trim() !== '';
      if (hasBranch && hasDepartment) {
        const params = {
          branchId: filters.branchId,
          departmentId: filters.departmentId,
        };
        if (hasSpecialty) params.specialtyId = filters.specialtyId;
        const res = await apiClient.get('/DoctorDetail/search-by-criteria', { params });
        doctors = res.data || [];
      } else {
        const res = await apiClient.get('/Doctor/all-with-details');
        doctors = res.data || [];
      }
      const normalizedDoctors = doctors.map(normalizeDoctorData).filter(Boolean);
      if (filters.doctorName) {
        const searchTerm = filters.doctorName.toLowerCase();
        return normalizedDoctors.filter(doc =>
          doc.name.toLowerCase().includes(searchTerm)
        );
      }
      return normalizedDoctors;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm bác sĩ:', error);
      return [];
    }
  },

  async getDoctorFullInfo(doctorId) {
    try {
      const res = await apiClient.get(`/DoctorDetail/full-info/${doctorId}`);
      return normalizeDoctorData(res.data);
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin bác sĩ ${doctorId}:`, error);
      throw error;
    }
  },

  async getFilterOptions() {
    const results = {
      branches: [],
      departments: [],
      specialties: [],
      errorMessage: ''
    };

    const errorMessages = [];

    try {
      const [branchesRes, departmentsRes, specialtiesRes] = await Promise.all([
        apiClient.get('/Branch/all').catch(err => {
          errorMessages.push('Không thể tải danh sách chi nhánh.');
          return { data: [] };
        }),
        apiClient.get('/Department/all').catch(err => {
          errorMessages.push('Không thể tải danh sách khoa.');
          return { data: [] };
        }),
        apiClient.get('/Specialty/all').catch(err => {
          errorMessages.push('Không thể tải danh sách chuyên khoa.');
          return { data: [] };
        }),
      ]);

      results.branches = (branchesRes.data || []).map(b => ({
        id: b.idBranch || b.id,
        name: b.branchName
      }));

      results.departments = (departmentsRes.data || []).map(d => ({
        id: d.idDepartment,
        name: d.departmentName
      }));

      results.specialties = (specialtiesRes.data || []).map(s => ({
        id: s.idSpecialty,
        name: s.specialtyName,
        departmentId: s.department?.idDepartment
      }));

      results.errorMessage = errorMessages.join(' ');
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bộ lọc:', error);
      results.errorMessage = 'Đã xảy ra lỗi khi tải dữ liệu bộ lọc';
    }

    return results;
  }
};

export default doctorService;