import React from 'react'
import { Heart, Users, Award, Clock, Phone, Mail, MapPin } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Về Chúng Tôi</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Cung cấp dịch vụ y tế chất lượng cao cho mọi người với tâm huyết và chuyên môn
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Docmed cam kết mang đến dịch vụ chăm sóc sức khỏe toàn diện, chuyên nghiệp và
              tận tâm để bảo vệ và nâng cao chất lượng cuộc sống của mọi người.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tận Tâm</h3>
              <p className="text-gray-600">
                Chúng tôi luôn đặt sức khỏe và hạnh phúc của bệnh nhân lên hàng đầu
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chuyên Nghiệp</h3>
              <p className="text-gray-600">
                Đội ngũ bác sĩ giàu kinh nghiệm với trình độ chuyên môn cao
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cộng Đồng</h3>
              <p className="text-gray-600">
                Phục vụ cộng đồng với tinh thần trách nhiệm và sự chăm sóc tận tình
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Năm Kinh Nghiệm</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Bác Sĩ Chuyên Khoa</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Bệnh Nhân Hài Lòng</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Hỗ Trợ Khẩn Cấp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-lg text-gray-600">
              Cung cấp đa dạng các dịch vụ y tế chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Khám Bệnh Tổng Quát</h3>
              <p className="text-gray-600">
                Khám sức khỏe định kỳ và tư vấn y tế toàn diện
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chuyên Khoa</h3>
              <p className="text-gray-600">
                Các chuyên khoa tim mạch, tiêu hóa, thần kinh, v.v.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Xét Nghiệm</h3>
              <p className="text-gray-600">
                Xét nghiệm máu, nước tiểu và các xét nghiệm chuyên sâu
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chẩn Đoán Hình Ảnh</h3>
              <p className="text-gray-600">
                X-quang, siêu âm, CT scan với thiết bị hiện đại
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tư Vấn Trực Tuyến</h3>
              <p className="text-gray-600">
                Tư vấn y tế qua video call với bác sĩ chuyên khoa
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chăm Sóc 24/7</h3>
              <p className="text-gray-600">
                Hỗ trợ khẩn cấp và chăm sóc bệnh nhân tại nhà
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-lg text-gray-600">
              Sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Điện Thoại</h3>
              <p className="text-gray-600">1900 1234</p>
              <p className="text-gray-600">Thứ 2 - Chủ Nhật: 6:00 - 22:00</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@healthcare.com</p>
              <p className="text-gray-600">Phản hồi trong 24h</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Địa Chỉ</h3>
              <p className="text-gray-600">123 Đường Y Tế, Quận 1</p>
              <p className="text-gray-600">TP.HCM, Việt Nam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn Sàng Chăm Sóc Sức Khỏe Của Bạn
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đặt lịch khám ngay hôm nay để được tư vấn từ các chuyên gia
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300">
            Đặt Lịch Khám
          </button>
        </div>
      </div>
    </div>
  )
}

export default About