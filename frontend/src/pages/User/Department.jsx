import React, { useState } from 'react';
import { X, Eye, Activity, Heart, Stethoscope, Scissors, Zap, Search, Calendar } from 'lucide-react';

// Import các ảnh trực tiếp
import EyeCareImage from '../../assets/img/department/101638-mat.png';
import PhysicalTherapyImage from '../../assets/img/department/101627-co-xuong-khop.png';
import DentalCareImage from '../../assets/img/department/101655-nha-khoa.png';
import DiagnosticTestingImage from '../../assets/img/department/101713-tim-mach.png';
import DermatologicSurgeryImage from '../../assets/img/department/101638-da-lieu-tham-my.png';
import SurgicalServicesImage from '../../assets/img/department/101713-san-phu-khoa.png';
import DepartmentsGrid from '../../components/Department/DepartmentsGrid';
import DepartmentModal from '../../components/Department/DepartmentModal';

const Department = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const departments = [
    {
      id: 1,
      title: "Chăm Sóc Mắt",
      icon: Eye,
      color: "bg-blue-500",
      image: EyeCareImage, // Sử dụng ảnh đã import
      details: {
        overview: "Khoa Chăm Sóc Mắt của chúng tôi cung cấp các dịch vụ nhãn khoa toàn diện với thiết bị hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.",
        services: [
          "Khám mắt tổng quát",
          "Phẫu thuật đục thủy tinh thể",
          "Điều trị bệnh tăng nhãn áp",
          "Điều trị bệnh võng mạc",
          "Phẫu thuật laser mắt",
          "Nhãn khoa trẻ em"
        ],
        specialists: "BS. Nguyễn Minh Hòa, BS. Trần Văn Nam",
        hours: "Thứ 2 - Thứ 6: 8:00 - 18:00"
      }
    },
    {
      id: 2,
      title: "Vật Lý Trị Liệu",
      icon: Activity,
      color: "bg-green-500",
      image: PhysicalTherapyImage,
      details: {
        overview: "Khoa Vật Lý Trị Liệu giúp bệnh nhân phục hồi sau chấn thương và cải thiện chức năng vận động thông qua các phương pháp điều trị cá nhân hóa.",
        services: [
          "Phục hồi chức năng sau phẫu thuật",
          "Điều trị chấn thương thể thao",
          "Vật lý trị liệu xương khớp",
          "Phục hồi chức năng thần kinh",
          "Tập thăng bằng và đi lại",
          "Quản lý cơn đau"
        ],
        specialists: "BS. Lê Thị Hương, BS. Phạm Minh Đức",
        hours: "Thứ 2 - Thứ 7: 7:00 - 19:00"
      }
    },
    {
      id: 3,
      title: "Chăm Sóc Răng Miệng",
      icon: Heart,
      color: "bg-purple-500",
      image: DentalCareImage,
      details: {
        overview: "Khoa Chăm Sóc Răng Miệng cung cấp các dịch vụ sức khỏe răng miệng toàn diện từ vệ sinh răng miệng thường quy đến các thủ thuật nha khoa phức tạp.",
        services: [
          "Vệ sinh răng miệng định kỳ",
          "Cấy ghép implant",
          "Chỉnh nha răng",
          "Điều trị tủy răng",
          "Nha khoa thẩm mỹ",
          "Phẫu thuật răng hàm mặt"
        ],
        specialists: "BS. Võ Thị Lan, BS. Đặng Quốc Duy",
        hours: "Thứ 2 - Thứ 6: 8:00 - 17:00"
      }
    },
    {
      id: 4,
      title: "Xét Nghiệm Chẩn Đoán",
      icon: Stethoscope,
      color: "bg-red-500",
      image: DiagnosticTestingImage,
      details: {
        overview: "Khoa Xét Nghiệm Chẩn Đoán cung cấp các dịch vụ chẩn đoán chính xác và kịp thời sử dụng công nghệ y tế tiên tiến nhất.",
        services: [
          "Xét nghiệm máu và sinh hóa",
          "Chụp X-quang và chẩn đoán hình ảnh",
          "Chụp MRI và CT scan",
          "Siêu âm y khoa",
          "Điện tim và stress test",
          "Xét nghiệm mô bệnh học"
        ],
        specialists: "BS. Hoàng Thị Mai, BS. Lý Văn Tân",
        hours: "Thứ 2 - Chủ Nhật: 6:00 - 22:00"
      }
    },
    {
      id: 5,
      title: "Phẫu Thuật Da Liễu",
      icon: Scissors,
      color: "bg-orange-500",
      image: DermatologicSurgeryImage,
      details: {
        overview: "Khoa Phẫu Thuật Da Liễu chuyên về các thủ thuật da liễu và điều trị ung thư da với kỹ thuật ít để lại scar nhất.",
        services: [
          "Cắt bỏ ung thư da",
          "Cắt bỏ nốt ruồi và tổn thương da",
          "Thủ thuật thẩm mỹ da",
          "Điều trị scar",
          "Điều trị laser",
          "Phẫu thuật Mohs"
        ],
        specialists: "BS. Ngô Thị Bích, BS. Kim Đức Minh",
        hours: "Thứ 3 - Thứ 6: 9:00 - 16:00"
      }
    },
    {
      id: 6,
      title: "Dịch Vụ Phẫu Thuật",
      icon: Zap,
      color: "bg-indigo-500",
      image: SurgicalServicesImage,
      details: {
        overview: "Khoa Dịch Vụ Phẫu Thuật cung cấp chăm sóc phẫu thuật toàn diện với kỹ thuật ít xâm lấn và kết quả điều trị xuất sắc.",
        services: [
          "Phẫu thuật tổng quát",
          "Phẫu thuật nội soi",
          "Phẫu thuật cấp cứu",
          "Phẫu thuật ngoại trú",
          "Phẫu thuật robot",
          "Phẫu thuật chấn thương"
        ],
        specialists: "BS. Trương Minh Quân, BS. Huỳnh Thị Hạnh",
        hours: "Cấp cứu 24/7"
      }
    }
  ];

  const openModal = (department) => {
    setSelectedDepartment(department);
  };

  const closeModal = () => {
    setSelectedDepartment(null);
  };

  return (
    <div className="min-h-screen">

      <div className="relative py-10 bg-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Các Chuyên Khoa</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed ">
              Chúng tôi cung cấp các dịch vụ y tế chuyên nghiệp với đội ngũ bác sĩ giàu kinh nghiệm
              và trang thiết bị y tế hiện đại nhất
            </p>
          </div>
        </div>
      </div>

      <DepartmentsGrid
        departments={departments}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        onCardClick={openModal}
      />

      <DepartmentModal
        department={selectedDepartment}
        onClose={closeModal}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(50px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Department;


