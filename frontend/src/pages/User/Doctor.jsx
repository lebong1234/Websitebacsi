import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Bradcam from '../../components/ui/Breadcumb';
import DoctorSearchFilter from '../../components/sections/Doctors/DoctorSearchFilter';
import DoctorGrid from '../../components/sections/Doctors/DoctorGrid';
import doctorService from '../../services/doctorService';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({
        branches: [],
        departments: [],
        specialties: [],
    });
    const [searchFilters, setSearchFilters] = useState({
        branchId: '',
        departmentId: '',
        specialtyId: '',
        doctorName: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOptions = async () => {
            const options = await doctorService.getFilterOptions();
            setFilterOptions(options);
        };
        fetchOptions();
    }, []);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const results = await doctorService.searchDoctors(searchFilters);
            setDoctors(results);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        }
        setLoading(false);
    }, [searchFilters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDoctors();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchDoctors]);

    const handleSearch = () => {
        fetchDoctors();
    };

    const handleDoctorClick = (doctor) => {
        const id = doctor?.id || doctor?._id || doctor?.doctorId;
        if (!id) {
            alert('Không thể xem chi tiết bác sĩ này.');
            return;
        }
        navigate(`/doctor/${id}`);
    };

    const handleResetFilters = () => {
        setSearchFilters({
            branchId: '',
            departmentId: '',
            specialtyId: '',
            doctorName: ''
        });
    };

    return (
        <div>
            <Bradcam />
            <section className="expert_doctors_area doctor_page">
                <div className="py-10 md:py-20">
                    <div className="container mx-auto px-4 max-w-7xl">
                        {filterOptions.errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {filterOptions.errorMessage}
                            </div>
                        )}
                        <DoctorSearchFilter
                            onSearch={handleSearch}
                            searchFilters={searchFilters}
                            setSearchFilters={setSearchFilters}
                            departments={filterOptions.departments}
                            specialties={filterOptions.specialties}
                            branches={filterOptions.branches}
                            onReset={handleResetFilters}
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
        </div>
    );
};

export default Doctors;