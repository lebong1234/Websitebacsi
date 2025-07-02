import React from 'react';
import Bradcam from '../../components/ui/Breadcumb';
import DoctorSearchFilter from '../../components/sections/Doctors/DoctorSearchFilter';
import DoctorGrid from '../../components/sections/Doctors/DoctorGrid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// Enhanced Doctors Section with Search and Loading State
const EnhancedDoctorsSection = () => {
  const [doctors, setDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [departments, setDepartments] = React.useState([]);
  const [specialties, setSpecialties] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [searchFilters, setSearchFilters] = React.useState({
    branchId: '',
    departmentId: '',
    specialtyId: '',
    doctorName: ''
  });
  const navigate = useNavigate();

  // Lấy filter từ backend
  React.useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [depRes, speRes, braRes] = await Promise.all([
          axios.get('http://localhost:2000/api/department'),
          axios.get('http://localhost:2000/api/specialty/all'),
          axios.get('http://localhost:2000/api/Branch/all')
        ]);
        setDepartments(depRes.data.map(d => ({ id: d.idDepartment, name: d.departmentName })));
        setSpecialties(speRes.data.map(s => ({ id: s.idSpecialty, name: s.specialtyName, departmentId: s.department?.idDepartment })));
        setBranches(braRes.data.map(b => ({ id: b.id || b.idBranch, name: b.branchName })));
      } catch (err) {
        setDepartments([]);
        setSpecialties([]);
        setBranches([]);
      }
    };
    fetchFilters();
  }, []);

  // Gọi API lấy danh sách bác sĩ theo filter
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let doctorsData = [];
      // Nếu chưa chọn đủ branchId và departmentId, lấy toàn bộ bác sĩ
      if (!searchFilters.branchId || !searchFilters.departmentId) {
        const res = await axios.get('http://localhost:2000/api/DoctorDetail/all');
        doctorsData = res.data;
      } else if (
        searchFilters.branchId.length === 24 &&
        searchFilters.departmentId.length === 24 &&
        (!searchFilters.specialtyId || searchFilters.specialtyId.length === 24)
      ) {
        // Đã chọn đủ, gọi API lọc
        const criteria = {
          branchId: searchFilters.branchId,
          departmentId: searchFilters.departmentId,
        };
        if (searchFilters.specialtyId) criteria.specialtyId = searchFilters.specialtyId;
        const res = await axios.post('http://localhost:2000/api/DoctorDetail/search-by-criteria', criteria);
        doctorsData = res.data;
      }
      // Lọc theo tên nếu có
      let filtered = doctorsData;
      if (searchFilters.doctorName && searchFilters.doctorName.trim()) {
        filtered = filtered.filter(doctor => 
          (doctor.Name || doctor.name || '').toLowerCase().includes(searchFilters.doctorName.toLowerCase())
        );
      }
      setDoctors(filtered);
    } catch (err) {
      setDoctors([]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, [searchFilters.branchId, searchFilters.departmentId, searchFilters.specialtyId]);

  const handleSearch = () => {
    fetchDoctors();
  };

  const handleDoctorClick = (doctor) => {
    // Chỉ lấy doctorId (id của bảng Doctor)
    const docId = doctor.doctorId;
    console.log('Click doctor:', doctor, 'docId:', docId);
    if (typeof docId === 'string' && docId.length === 24) {
      navigate(`/doctor/${docId}`);
    } else {
      alert('Không tìm thấy thông tin chi tiết bác sĩ này (ID không hợp lệ)!');
    }
  };

  const handleResetFilters = () => {
    setSearchFilters({ branchId: '', departmentId: '', specialtyId: '', doctorName: '' });
    setDoctors([]);
  };

  return (
    <section className="expert_doctors_area doctor_page">
      <div className="py-10 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <DoctorSearchFilter 
            onSearch={handleSearch}
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            departments={departments}
            specialties={specialties}
            branches={branches}
          />
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">
              Danh sách bác sĩ
            </h2>
            <p className="text-gray-600">
              Tìm thấy {doctors.length} bác sĩ phù hợp
            </p>
          </div>
          <DoctorGrid 
            doctors={doctors}
            loading={loading}
            onDoctorClick={handleDoctorClick}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </section>
  );
};

// Main Doctors Page Component
const Doctors = () => {
  return (
    <div>
      <Bradcam />
      <EnhancedDoctorsSection />
    </div>
  );
};

export default Doctors;