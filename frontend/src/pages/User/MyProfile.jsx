import React, { useEffect, useState, useRef } from 'react';
import { FaUserCircle, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars, FaClipboardList, FaBoxOpen, FaLock, FaSignOutAlt, FaCamera, FaInfoCircle } from 'react-icons/fa';
import { getUserProfile, getUserBookings, getUserPackages } from '../../services/UserService';

const genderLabel = (g) => g === 0 ? 'Nam' : g === 1 ? 'Nữ' : 'Khác';
const genderIcon = (g) => g === 0 ? <FaVenusMars className="text-blue-500" /> : g === 1 ? <FaVenusMars className="text-pink-500" /> : <FaVenusMars className="text-gray-500" />;
const statusColor = (status) => status === 'Hoàn thành' ? 'text-green-600' : status === 'Đã hủy' ? 'text-red-500' : 'text-yellow-600';

const sidebarMenu = [
  { key: 'profile', label: 'Thông tin cá nhân', icon: <FaUserCircle /> },
  { key: 'bookings', label: 'Lịch sử cuộc hẹn', icon: <FaClipboardList /> },
  { key: 'packages', label: 'Gói khám', icon: <FaBoxOpen /> },
  { key: 'password', label: 'Đổi mật khẩu', icon: <FaLock /> },
  { key: 'logout', label: 'Đăng xuất', icon: <FaSignOutAlt /> },
];

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tab, setTab] = useState('profile');
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef();
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem('currentUser'));
    setUser(userLocal);
    if (userLocal) {
      getUserProfile(userLocal.id).then(setUser);
      getUserBookings(userLocal).then((data) => {
        // Chuẩn hóa dữ liệu lịch sử cuộc hẹn từ backend
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data.map(b => ({
            date: b.date || b.Date,
            doctorName: b.NameDr || b.doctorName,
            specialtyName: b.SpecialtyName || b.specialtyName,
            status: b.Status || b.status,
            paymentStatus: b.Status === 'PAID' ? 'Đã thanh toán' : (b.Status === 'CANCELLED' ? 'Đã hủy' : 'Chờ thanh toán'),
            note: b.Symptoms || b.note,
            branchName: b.BranchName || b.branchName,
            time: b.Slot || b.time,
            fee: b.ConsultationFee || b.consultationFee,
          })));
        } else {
          setBookings([]);
        }
      }).catch(err => {
        console.error('Lỗi lấy bookings:', err);
        setBookings([]);
      });
      getUserPackages(userLocal.id).then(setPackages);
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleSidebarClick = (key) => {
    if (key === 'logout') {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    } else {
      setTab(key);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex p-10">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4">
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-24 h-24 mb-2">
            <img
              src={avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
            />
            <button
              className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 shadow"
              onClick={handleAvatarClick}
              title="Đổi ảnh đại diện"
            >
              <FaCamera size={18} />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="font-bold text-lg mt-1">{user?.name || user?.fullName || 'User'}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
          <div className="mt-2 text-green-600 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            <span>Tài khoản đang hoạt động</span>
          </div>
        </div>
        <nav className="flex-1">
          {sidebarMenu.map((item) => (
            <button
              key={item.key}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition ${tab===item.key ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => handleSidebarClick(item.key)}
            >
              <span className="mr-3 text-xl">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 py-10 px-4 md:px-12">
        {tab==='profile' && user && (
          <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-1">Họ tên</label>
                <input type="text" value={user.name || user.fullName || ''} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input type="email" value={user.email || ''} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Số điện thoại</label>
                <input type="text" value={user.phone || ''} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Ngày sinh</label>
                <input type="text" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : ''} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Giới tính</label>
                <input type="text" value={genderLabel(user.gender)} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
              </div>
            </form>
          </div>
        )}
        {tab==='bookings' && (
          <div className="bg-white rounded-xl shadow p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Lịch sử cuộc hẹn</h2>
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2">Ngày</th>
                  <th className="border px-3 py-2">Bác sĩ</th>
                  <th className="border px-3 py-2">Chuyên khoa</th>
                  <th className="border px-3 py-2">Trạng thái</th>
                  <th className="border px-3 py-2">Thanh toán</th>
                  <th className="border px-3 py-2">Phí khám</th>
                  <th className="border px-3 py-2">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && <tr><td colSpan={7} className="text-center py-4">Chưa có lịch sử</td></tr>}
                {bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{b.date ? new Date(b.date).toLocaleDateString() : ''}</td>
                    <td className="border px-3 py-2">{b.doctorName}</td>
                    <td className="border px-3 py-2">{b.specialtyName}</td>
                    <td className={`border px-3 py-2 font-semibold ${statusColor(b.status)}`}>{b.status}</td>
                    <td className="border px-3 py-2">{b.paymentStatus}</td>
                    <td className="border px-3 py-2">{b.fee ? b.fee.toLocaleString() + ' VNĐ' : ''}</td>
                    <td className="border px-3 py-2 text-center">
                      <button onClick={() => setSelectedBooking(b)} className="text-blue-600 hover:underline flex items-center gap-1 mx-auto">
                        <FaInfoCircle /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Modal chi tiết booking */}
            {selectedBooking && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative animate-modal-appear">
                  <button onClick={() => setSelectedBooking(null)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold">×</button>
                  <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2"><FaClipboardList /> Chi tiết lịch hẹn</h3>
                  <div className="space-y-2 text-gray-700 text-base">
                    <div><b>Ngày:</b> {selectedBooking.date ? new Date(selectedBooking.date).toLocaleString() : ''}</div>
                    <div><b>Bác sĩ:</b> {selectedBooking.doctorName}</div>
                    <div><b>Chuyên khoa:</b> {selectedBooking.specialtyName}</div>
                    <div><b>Trạng thái:</b> <span className={statusColor(selectedBooking.status)}>{selectedBooking.status}</span></div>
                    <div><b>Thanh toán:</b> {selectedBooking.paymentStatus}</div>
                    {selectedBooking.note && <div><b>Ghi chú:</b> {selectedBooking.note}</div>}
                    {selectedBooking.branchName && <div><b>Chi nhánh:</b> {selectedBooking.branchName}</div>}
                    {selectedBooking.time && <div><b>Giờ:</b> {selectedBooking.time}</div>}
                    {selectedBooking.fee && <div><b>Phí khám:</b> {selectedBooking.fee.toLocaleString()} VNĐ</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {tab==='packages' && (
          <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Gói khám đã đăng ký</h2>
            <ul className="list-disc pl-6">
              {packages.length === 0 && <li>Chưa đăng ký gói khám nào</li>}
              {packages.map((p, i) => (
                <li key={i}><b>{p.packageName}</b> - {p.description}</li>
              ))}
            </ul>
          </div>
        )}
        {tab==='password' && (
          <div className="bg-white rounded-xl shadow p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Mật khẩu hiện tại</label>
                <input type="password" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Mật khẩu mới</label>
                <input type="password" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" className="w-full border rounded px-3 py-2" />
              </div>
              <button type="button" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Đổi mật khẩu</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProfile;
