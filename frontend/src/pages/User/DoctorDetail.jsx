import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper: star rating display
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center space-x-1 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={'full' + i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 7.91l6.564-.955L10 1.5l2.948 5.455 6.564.955-4.756 4.635 1.122 6.545z" />
        </svg>
      ))}
      {halfStar && (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)" d="M10 15l-5.878 3.09 1.122-6.545L.488 7.91l6.564-.955L10 1.5l2.948 5.455 6.564.955-4.756 4.635 1.122 6.545z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={'empty' + i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 7.91l6.564-.955L10 1.5l2.948 5.455 6.564.955-4.756 4.635 1.122 6.545z" />
        </svg>
      ))}
    </div>
  );
};

const Review = ({ user, comment, rating, date }) => (
  <div className="border-b border-gray-200 py-4 last:border-none">
    <div className="flex justify-between items-center">
      <p className="font-semibold text-gray-800">{user}</p>
      <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</span>
    </div>
    <StarRating rating={rating} />
    <p className="mt-2 text-gray-700">{comment}</p>
  </div>
);

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showMoreQual, setShowMoreQual] = React.useState(false);
  const [showMoreExp, setShowMoreExp] = React.useState(false);

  React.useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      // Kiểm tra id hợp lệ (24 ký tự hex)
      if (!id || typeof id !== 'string' || id.length !== 24) {
        setDoctor({ error: 'ID bác sĩ không hợp lệ!' });
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:2000/api/Doctor/${id}/fullinfo`);
        console.log('Doctor detail API response:', res.data);
        if (res.data && res.data.message) {
          setDoctor({ error: res.data.message });
        } else {
          setDoctor(res.data);
        }
      } catch (err) {
        setDoctor({ error: err?.response?.data?.message || err.message });
        console.error('Doctor detail API error:', err?.response?.data || err.message);
      }
      setLoading(false);
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-600 text-xl">Đang tải thông tin bác sĩ...</div>;
  if (!doctor) return <div className="text-center py-20 text-gray-600 text-xl">Không tìm thấy bác sĩ</div>;
  if (doctor.error) return <div className="text-center py-20 text-red-600 text-xl">{doctor.error}</div>;

  const { Doctor: doc, DoctorDetail: detail, BranchName, DepartmentName, SpecialtyName } = doctor;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Trở lại trang trước"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Trở lại
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left section: Image and info */}
        <div className="md:w-1/3 flex flex-col items-center text-center">
          <img
            src={detail?.Img || '/default-doctor.png'}
            alt={`Dr. ${doc?.Name}`}
            className="rounded-full w-48 h-48 object-cover shadow-lg"
          />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{doc?.Name}</h1>
          <p className="text-lg text-gray-600 mt-1">{detail?.Degree}</p>
          <p className="text-blue-600 font-semibold mt-2 text-xl">{SpecialtyName}</p>
          <p className="text-gray-800 font-semibold mt-4 text-2xl">{DepartmentName}</p>
          <button 
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-300"
            onClick={() => alert('Chức năng đặt khám sẽ được phát triển sau.')}
          >
            Đặt khám
          </button>
        </div>

        {/* Right section: Details */}
        <div className="md:w-2/3 space-y-10">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Giới thiệu</h2>
            <p className="text-gray-700 leading-relaxed">{detail?.Description || 'Chưa có mô tả.'}</p>
          </section>

          {/* Qualifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Văn bằng</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 max-h-36 overflow-hidden transition-all duration-300"
              style={{ maxHeight: showMoreQual ? '9999px' : '9rem' }}
            >
              <li>{detail?.Degree}</li>
            </ul>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Kinh nghiệm</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 max-h-36 overflow-hidden transition-all duration-300"
              style={{ maxHeight: showMoreExp ? '9999px' : '9rem' }}
              id="experience-list"
            >
              <li>{detail?.Description}</li>
            </ul>
          </section>

          {/* Ratings and Reviews */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Đánh giá</h2>
            <div className="flex items-center mb-4">
              <StarRating rating={doctor.ratings || 0} />
              <p className="ml-3 text-gray-700 font-medium">{(doctor.ratings || 0).toFixed(1)} / 5</p>
              <p className="ml-2 text-gray-600">({(doctor.reviews ? doctor.reviews.length : 0)} đánh giá)</p>
            </div>
            <div className="space-y-6 max-h-80 overflow-y-auto pr-3">
              {(doctor.reviews && doctor.reviews.length > 0) ? doctor.reviews.map(review => (
                <Review key={review.id} {...review} />
              )) : <p className="text-gray-500">Chưa có đánh giá nào.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;

