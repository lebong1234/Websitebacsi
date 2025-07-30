import React from 'react';

const BusinessSection = () => {
  return (
    <div className="business-section bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-gray-600 mt-4">
            Chúng tôi cung cấp các dịch vụ y tế chất lượng cao với trang thiết bị hiện đại và đội ngũ chuyên môn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Cơ Sở Vật Chất</h3>
            <p className="text-gray-700">Trang thiết bị y tế hiện đại, đạt chuẩn quốc tế.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Đội Ngũ Bác Sĩ</h3>
            <p className="text-gray-700">Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Hỗ Trợ 24/7</h3>
            <p className="text-gray-700">Dịch vụ hỗ trợ và tư vấn y tế suốt 24 giờ.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSection;