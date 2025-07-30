import React from 'react'
import { Heart, Users, Award, Clock, Phone, Mail, MapPin, Shield, Star, CheckCircle } from 'lucide-react'
import Banner from '../../assets/img/banner/banner2.png'
import Image1 from '../../assets/img/about/image.png'
const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url(${Banner})`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Về Chúng Tôi</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Cung cấp dịch vụ y tế chất lượng cao cho mọi người với tâm huyết và chuyên môn
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section with Image */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="text-lg text-gray-600 mb-6">
                Docmed cam kết mang đến dịch vụ chăm sóc sức khỏe toàn diện, chuyên nghiệp và 
                tận tâm để bảo vệ và nâng cao chất lượng cuộc sống của mọi người.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Chăm sóc y tế chất lượng cao</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Đội ngũ bác sĩ giàu kinh nghiệm</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Trang thiết bị hiện đại</span>
                </div>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <img 
                src={Image1}
                alt="Đội ngũ y tế chuyên nghiệp"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tận Tâm</h3>
              <p className="text-gray-600">
                Chúng tôi luôn đặt sức khỏe và hạnh phúc của bệnh nhân lên hàng đầu
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chuyên Nghiệp</h3>
              <p className="text-gray-600">
                Đội ngũ bác sĩ giàu kinh nghiệm với trình độ chuyên môn cao
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-md">
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

      {/* Doctor Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội Ngũ Bác Sĩ</h2>
            <p className="text-lg text-gray-600">
              Những chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Bác sĩ Tim Mạch"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                    Tim Mạch
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">BS. Nguyễn Văn An</h3>
              <p className="text-gray-600 mb-2">Chuyên khoa Tim Mạch</p>
              <p className="text-sm text-gray-500">15 năm kinh nghiệm</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Bác sĩ Nhi Khoa"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm">
                    Nhi Khoa
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">BS. Trần Thị Lan</h3>
              <p className="text-gray-600 mb-2">Chuyên khoa Nhi</p>
              <p className="text-sm text-gray-500">12 năm kinh nghiệm</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Bác sĩ Thần kinh"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
                    Thần Kinh
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">BS. Lê Minh Khôi</h3>
              <p className="text-gray-600 mb-2">Chuyên khoa Thần kinh</p>
              <p className="text-sm text-gray-500">18 năm kinh nghiệm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative bg-blue-600 py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Facilities Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cơ Sở Vật Chất</h2>
            <p className="text-lg text-gray-600">
              Trang thiết bị y tế hiện đại và môi trường chăm sóc thoải mái
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Phòng khám hiện đại"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Phòng Khám Hiện Đại</h3>
                <p className="text-gray-600">
                  Không gian khám bệnh thoải mái với trang thiết bị y tế tiên tiến
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Phòng xét nghiệm"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Phòng Xét Nghiệm</h3>
                <p className="text-gray-600">
                  Trang thiết bị xét nghiệm hiện đại cho kết quả chính xác và nhanh chóng
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Khu vực chờ"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Khu Vực Chờ</h3>
                <p className="text-gray-600">
                  Không gian chờ thoải mái và yên tĩnh cho bệnh nhân và gia đình
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info with Background */}
      <div className="relative bg-gray-100 py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-lg text-gray-600">
              Sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Điện Thoại</h3>
              <p className="text-gray-600">1900 1234</p>
              <p className="text-gray-600">Thứ 2 - Chủ Nhật: 6:00 - 22:00</p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@healthcare.com</p>
              <p className="text-gray-600">Phản hồi trong 24h</p>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-md">
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
      <div className="relative bg-blue-600 py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn Sàng Chăm Sóc Sức Khỏe Của Bạn
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đặt lịch khám ngay hôm nay để được tư vấn từ các chuyên gia
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg">
            Đặt Lịch Khám
          </button>
        </div>
      </div>
    </div>
  )
}

export default About