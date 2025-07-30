import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, MapPin, GraduationCap, Phone, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import "react-datepicker/dist/react-datepicker.css";

import {
    getDoctorById,
    bookAppointment,
    getAppointmentsByDoctorId,
    checkUserDailyBookingLimit, API_IMG_URL,
    createAppointmentAndGetPaymentLink,
} from '../../../services/BookingService';
import { useLocation } from 'react-router-dom';

registerLocale('vi', vi);

const datePickerCustomStyles = `
  .react-datepicker-wrapper { display: block; width: 100%; }
  .react-datepicker__input-container input { width: 100%; padding: 0.65rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
  .react-datepicker__input-container input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25); }
  .react-datepicker { font-family: inherit; border: 1px solid #d1d5db; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .react-datepicker__header { background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; padding-top: 8px; }
  .react-datepicker__navigation-icon::before { border-color: #6b7280; }
  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header { color: #111827; font-weight: 600; }
  .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name { color: #374151; }
  .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range { background-color: #2563eb; color: white; border-radius: 0.375rem; }
  .react-datepicker__day:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover { background-color: #eff6ff; border-radius: 0.375rem; }
  .react-datepicker__day--disabled { color: #9ca3af; cursor: not-allowed; }
  .react-datepicker__day--available-custom { background-color: #dcfce7 !important; color: #166534 !important; font-weight: 600; border-radius: 0.375rem; }
  .react-datepicker__day--unavailable-custom { background-color: #fee2e2 !important; color: #991b1b !important; }
  .react-datepicker__day--outside-month { color: #9ca3af; }
  .react-datepicker__triangle { display: none; }
`;

const ShowDetailDoctor = () => {
    const location = useLocation();
    const doctorID = location.state?.doctorID;

    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    });
    // const imagePath = doctorDetail?.img;

    // const fullImageUrl = imagePath ? `${API_BASE_URL}${imagePath}` : null;
    const [doctorFullInfo, setDoctorFullInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [availableSlotsByDate, setAvailableSlotsByDate] = useState({});
    const [symptoms, setSymptoms] = useState('');
    const [isBooked, setIsBooked] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [currentMonthView, setCurrentMonthView] = useState(new Date());
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            setError('Vui lòng đăng nhập để đặt lịch khám.');
            setLoading(false);
        } else {
            if (error === 'Vui lòng đăng nhập để đặt lịch khám.') {
                setError(null);
            }
        }
    }, [currentUser, error]);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            if (!doctorID) {
                setError('Không có ID bác sĩ được cung cấp.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getDoctorById(doctorID);
                setDoctorFullInfo(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching doctor info:", err);
                setError(`Lỗi tải thông tin bác sĩ: ${err.message}`);
                setDoctorFullInfo(null);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && doctorID) {
            fetchDoctorInfo();
        } else if (!doctorID && currentUser) {
            setError('Không có ID bác sĩ được cung cấp.');
            setLoading(false);
        }
    }, [doctorID, currentUser]);

    const generateDefaultTimeSlots = useCallback(() => {
        const slots = [];
        for (let hour = 8; hour <= 14; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if ((hour >= 11 && hour < 13) || (hour === 14 && minute > 0)) continue;
                slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            }
        }
        return slots;
    }, []);

    const generateTimeSlots = useCallback(() => {
        if (!doctorFullInfo?.doctorSchedules?.length) {
            return generateDefaultTimeSlots();
        }
        const schedule = doctorFullInfo.doctorSchedules[0];
        if (!schedule.startTime || !schedule.endTime || typeof schedule.examinationTime !== 'number' || schedule.examinationTime <= 0) {
            return generateDefaultTimeSlots();
        }
        const { startTime, endTime, examinationTime } = schedule;
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        const lunchStart = 11 * 60;
        const lunchEnd = 13 * 60;
        const slots = [];
        for (let totalMinutes = startTotalMinutes; totalMinutes < endTotalMinutes; totalMinutes += examinationTime) {
            if (totalMinutes >= lunchStart && totalMinutes < lunchEnd) continue;
            const hour = Math.floor(totalMinutes / 60);
            const minute = totalMinutes % 60;
            slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
        }
        return slots;
    }, [doctorFullInfo, generateDefaultTimeSlots]);

    const getDaysInMonth = useCallback((year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days.map(d => ({
            full: d,
            display: `${d.getDate()}/${d.getMonth() + 1}`,
            value: d.toISOString().split('T')[0]
        }));
    }, []);

    useEffect(() => {
        const fetchAllAvailableSlotsForMonth = async (monthDate) => {
            if (!doctorFullInfo || !doctorID || !currentUser) {
                setAvailableSlotsByDate(prev => ({ ...prev }));
                return;
            }
            setSlotsLoading(true);
            try {
                const year = monthDate.getFullYear();
                const month = monthDate.getMonth();
                const daysToFetchCurrentMonth = getDaysInMonth(year, month);
                const nextMonthDate = new Date(year, month + 1, 1);
                const daysToFetchNextMonth = getDaysInMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth());
                const daysToFetch = [...daysToFetchCurrentMonth, ...daysToFetchNextMonth].filter(day => {
                    const today = new Date(); today.setHours(0, 0, 0, 0);
                    return day.full >= today;
                });

                const allBookedAppointments = await getAppointmentsByDoctorId(doctorID);
                const newSlotsByDate = { ...availableSlotsByDate };

                for (const day of daysToFetch) {
                    if (newSlotsByDate.hasOwnProperty(day.value) && newSlotsByDate[day.value].length > 0 && selectedDate !== day.value) continue;

                    const dateString = day.value;
                    const allPossibleSlotsForDay = generateTimeSlots();
                    const bookedStartTimesForThisDate = allBookedAppointments
                        .filter(app => new Date(app.date).toISOString().split('T')[0] === dateString)
                        .map(app => app.slot.split('-')[0]);
                    const availableSlots = allPossibleSlotsForDay.filter(
                        slotStartTime => !bookedStartTimesForThisDate.includes(slotStartTime)
                    );
                    newSlotsByDate[dateString] = availableSlots;
                }
                setAvailableSlotsByDate(newSlotsByDate);

                if (!selectedDate) {
                    const today = new Date(); today.setHours(0, 0, 0, 0);
                    const firstAvailableDay = daysToFetch
                        .filter(d => d.full >= today)
                        .find(day => newSlotsByDate[day.value]?.length > 0);
                    if (firstAvailableDay) {
                        setSelectedDate(firstAvailableDay.value);
                    } else {
                        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
                        setSelectedDate(tomorrow.toISOString().split('T')[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching or processing available slots for month:', err);
            } finally {
                setSlotsLoading(false);
            }
        };

        if (doctorFullInfo && currentUser) {
            fetchAllAvailableSlotsForMonth(currentMonthView);
        }
    }, [doctorFullInfo, doctorID, currentUser, generateTimeSlots, getDaysInMonth, currentMonthView, selectedDate]); // Removed availableSlotsByDate from deps

    useEffect(() => {
        if (selectedDate && availableSlotsByDate[selectedDate]) {
            setAvailableTimeSlots(availableSlotsByDate[selectedDate]);
            setSelectedTime('');
        } else if (selectedDate) {
            setAvailableTimeSlots([]);
            setSelectedTime('');
        } else {
            setAvailableTimeSlots([]);
            setSelectedTime('');
        }
    }, [selectedDate, availableSlotsByDate]);

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return 'N/A';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleBooking = () => {
        if (!currentUser) { alert('Vui lòng đăng nhập để đặt lịch khám!'); return; }
        if (!selectedDate || !selectedTime) { alert('Vui lòng chọn ngày và giờ khám!'); return; }
        setError(null);
        setShowConfirmModal(true);
    };

    const confirmBooking = async () => {
        // === BƯỚC 1: CẬP NHẬT TRẠNG THÁI UI ===
        setShowConfirmModal(false); // Đóng modal xác nhận
        setBookingLoading(true);    // Hiển thị trạng thái "đang xử lý"
        setError(null);             // Xóa các lỗi cũ

        try {
            // === BƯỚC 2: CHUẨN BỊ DỮ LIỆU ĐỂ GỬI LÊN SERVER ===

            // Lấy các thông tin cần thiết từ state và props
            const scheduleInfo = doctorFullInfo.doctorSchedules?.[0];
            const examinationTime = scheduleInfo?.examinationTime || 30; // Mặc định 30 phút nếu không có
            const consultationFee = scheduleInfo?.consultationFee || 0;  // Mặc định 0 nếu không có

            // Tạo chuỗi slot (ví dụ: "09:00-09:30")
            const startTime = selectedTime;
            const [hour, minute] = startTime.split(':').map(Number);
            const endTimeMinutes = hour * 60 + minute + examinationTime;
            const endHour = Math.floor(endTimeMinutes / 60);
            const endMinute = endTimeMinutes % 60;
            const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
            const slotForBooking = `${startTime}-${endTime}`;

            // Kiểm tra xem người dùng đã đặt lịch với bác sĩ này trong ngày chưa
            const alreadyBookedToday = await checkUserDailyBookingLimit(currentUser.id, doctorID, selectedDate);
            if (alreadyBookedToday) {
                // Nếu đã đặt, ném ra lỗi để dừng tiến trình và hiển thị thông báo
                throw new Error(`Bạn đã có một lịch hẹn với bác sĩ ${doctorFullInfo.doctor.name} vào ngày ${new Date(selectedDate + "T00:00:00").toLocaleDateString('vi-VN')}. Mỗi ngày chỉ được đặt 1 lịch hẹn với cùng một bác sĩ.`);
            }

            // Định dạng lại ngày tháng theo chuẩn ISO 8601 UTC để gửi đi
            const dateForBooking = new Date(selectedDate);
            dateForBooking.setUTCHours(0, 0, 0, 0);
            const selectedDateISO = dateForBooking.toISOString();

            // Tạo đối tượng JSON hoàn chỉnh để gửi trong body của request
            const bookingData = {
                doctorId: doctorID,
                nameDr: doctorFullInfo.doctor.name,
                date: selectedDateISO,
                slot: slotForBooking,
                patientId: currentUser.id,
                patientName: currentUser.name, // Thêm tên bệnh nhân
                patientEmail: currentUser.email,
                consultationFee: consultationFee,
                symptoms: symptoms || '',
            };

            // === BƯỚC 3: GỌI API ĐỂ LẤY LINK THANH TOÁN ===
            console.log("Đang gửi dữ liệu đặt lịch:", bookingData);
            const paymentResult = await createAppointmentAndGetPaymentLink(bookingData);
            console.log("Nhận được kết quả từ PayOS:", paymentResult);

            // === BƯỚC 4: CHUYỂN HƯỚNG NGƯỜI DÙNG ĐẾN TRANG THANH TOÁN ===
            if (paymentResult && paymentResult.checkoutUrl) {
                // Nếu có checkoutUrl, chuyển hướng trình duyệt của người dùng đến đó
                window.location.href = paymentResult.checkoutUrl;
            } else {
                // Nếu không có link, ném ra lỗi để người dùng biết
                throw new Error("Không nhận được link thanh toán từ hệ thống. Vui lòng thử lại.");
            }

        } catch (err) {
            // === BƯỚC 5: XỬ LÝ LỖI ===
            console.error('Quá trình đặt lịch và lấy link thanh toán thất bại:', err);

            let errorMessage = err.message || 'Đặt lịch khám thất bại!';

            // Xử lý lỗi cụ thể khi slot vừa bị người khác đặt
            if (err.message && (err.message.includes("Slot đã được đặt") || err.message.includes("vừa có người khác đặt"))) {
                errorMessage = "Khung giờ này vừa có người khác đặt. Vui lòng chọn khung giờ khác.";
                // Cập nhật lại danh sách slot để loại bỏ slot đã bị chiếm
                setAvailableSlotsByDate(prev => ({
                    ...prev,
                    [selectedDate]: prev[selectedDate]?.filter(s => s !== selectedTime) || []
                }));
                setSelectedTime(''); // Reset lại giờ đã chọn
            }

            // Hiển thị lỗi cho người dùng
            setError(errorMessage);
        } finally {
            // Dù thành công hay thất bại, cũng dừng trạng thái "loading"
            setBookingLoading(false);
        }
    };

    const resetBooking = () => {
        setSelectedTime('');
        setSymptoms('');
        setIsBooked(false);
        setError(null);
    };

    const dayClassName = (date) => {
        const dateString = date.toISOString().split('T')[0];
        if (slotsLoading && !availableSlotsByDate.hasOwnProperty(dateString)) { return ''; }
        if (availableSlotsByDate[dateString]?.length > 0) { return 'react-datepicker__day--available-custom'; }
        if (availableSlotsByDate.hasOwnProperty(dateString) && availableSlotsByDate[dateString]?.length === 0) { return 'react-datepicker__day--unavailable-custom'; }
        return '';
    };

    if (loading && !doctorFullInfo) {
        return (<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="ml-3 text-gray-700">Đang tải thông tin bác sĩ...</p></div>);
    }

    if (isBooked) {
        return <BookingSuccess
            doctorFullInfo={doctorFullInfo} selectedDate={selectedDate} selectedTime={selectedTime}
            symptoms={symptoms} formatCurrency={formatCurrency} resetBooking={resetBooking} currentUser={currentUser}
        />;
    }

    if (!currentUser) {
        return (<div className="max-w-2xl mx-auto p-6 mt-10"><div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md" role="alert"><p className="font-bold">Thông báo</p><p>{error || 'Vui lòng đăng nhập để xem chi tiết và đặt lịch khám.'}</p></div></div>);
    }

    if (!doctorFullInfo) {
        return (<div className="max-w-2xl mx-auto p-6 mt-10"><div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><p className="font-bold">Lỗi</p><p>{error || 'Không tìm thấy thông tin bác sĩ hoặc có lỗi xảy ra.'}</p></div></div>);
    }

    return (
        <>
            <style>{datePickerCustomStyles}</style>
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <DoctorHeader doctorFullInfo={doctorFullInfo} formatCurrency={formatCurrency} />

                    {error && (
                        <div className="mx-4 sm:mx-6 mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md" role="alert">
                            <div className="flex">
                                <div className="py-1"><AlertTriangle className="h-5 w-5 text-red-500 mr-3" /></div>
                                <div>
                                    <p className="font-bold">Thông báo lỗi</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <BookingSection
                        availableTimeSlots={availableTimeSlots} selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                        selectedTime={selectedTime} setSelectedTime={setSelectedTime} symptoms={symptoms} setSymptoms={setSymptoms}
                        handleBooking={handleBooking} doctorFullInfo={doctorFullInfo} bookingLoading={bookingLoading} currentUser={currentUser}
                        slotsLoading={slotsLoading} availableSlotsByDate={availableSlotsByDate} dayClassName={dayClassName}
                        currentMonthView={currentMonthView} setCurrentMonthView={setCurrentMonthView}
                        showConfirmModal={showConfirmModal}
                        setShowConfirmModal={setShowConfirmModal}
                        confirmBooking={confirmBooking}
                        formatCurrency={formatCurrency}
                    />
                </div>
            </div>
        </>
    );
};

const DoctorHeader = ({ doctorFullInfo, formatCurrency }) => {
    const { doctor, doctorDetail, specialtyName, branchName, doctorSchedules } = doctorFullInfo;
    const handleImageError = (e) => { e.target.style.display = 'none'; const placeholder = e.target.nextElementSibling; if (placeholder && placeholder.tagName === 'svg') { placeholder.style.display = 'flex'; } };
    const infoItems = [{ icon: GraduationCap, text: doctorDetail?.degree || 'Chưa cập nhật' }, { icon: Stethoscope, text: specialtyName || 'Chưa cập nhật' }, { icon: MapPin, text: branchName || 'Chưa cập nhật' }, { icon: Phone, text: doctor?.phone || 'Chưa cập nhật' }, { icon: Mail, text: doctor?.email || 'Chưa cập nhật', span: 'md:col-span-2' }];
    const doctorImage = doctorDetail?.img;
    return (<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6"> <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6"> <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-indigo-300"> {doctorImage ? (
        <img src={`${API_IMG_URL}${doctorImage}`} alt={doctor?.name || "Ảnh bác sĩ"}
            className="w-full h-full rounded-full object-cover p-1" onError={handleImageError} />) :
        (<User className="w-16 h-16 text-indigo-500" />)} </div> <div className="flex-1 text-center sm:text-left"> <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{doctor?.name || "Bác sĩ"}</h1> <p className="text-indigo-200 text-sm mb-3">{specialtyName || 'Chuyên khoa'}</p> <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-indigo-100"> {infoItems.filter(item => item.icon !== Stethoscope && item.icon !== MapPin).map(({ icon: Icon, text, span }, index) => (<div key={index} className={`flex items-center justify-center sm:justify-start space-x-2 ${span || ''}`}> <Icon className="w-4 h-4 flex-shrink-0 text-indigo-300" /> <span>{text}</span> </div>))} </div> {branchName && (<div className="flex items-center justify-center sm:justify-start space-x-2 mt-2 text-sm text-indigo-100"> <MapPin className="w-4 h-4 flex-shrink-0 text-indigo-300" /> <span>{branchName}</span> </div>)} {doctorSchedules?.length > 0 && doctorSchedules[0].consultationFee != null && (<div className="mt-3 p-2 bg-white/20 rounded-lg inline-block"> <div className="text-sm"> <span className="font-semibold">Phí khám: </span> <span className="text-yellow-300 font-bold"> {formatCurrency(doctorSchedules[0].consultationFee)} </span> </div> </div>)} </div> </div> {doctorDetail?.description && (<div className="mt-4 pt-3 border-t border-white/20"> <p className="text-sm text-indigo-100 leading-relaxed">{doctorDetail.description}</p> </div>)} </div>);
};

const ConfirmBookingModal = ({
    doctorFullInfo, currentUser, selectedDate, selectedTime, symptoms, formatCurrency,
    setShowConfirmModal, confirmBooking, bookingLoading
}) => {
    if (!doctorFullInfo || !currentUser || !selectedDate || !selectedTime) return null;

    const scheduleInfo = doctorFullInfo.doctorSchedules?.[0];
    const examinationTime = scheduleInfo?.examinationTime || 30;
    const [hour, minute] = selectedTime.split(':').map(Number);
    const endTimeMinutes = hour * 60 + minute + examinationTime;
    const endHour = Math.floor(endTimeMinutes / 60);
    const endMinute = endTimeMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    const displaySlot = `${selectedTime} - ${endTime}`;
    const displayDate = selectedDate
        ? new Date(selectedDate + "T00:00:00").toLocaleDateString('vi-VN', {
            weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
        })
        : 'Không rõ ngày';

    const confirmInfo = [
        { icon: User, label: 'Bệnh nhân:', value: currentUser.name },
        { icon: Mail, label: 'Email:', value: currentUser.email },
        { icon: User, label: 'Bác sĩ:', value: doctorFullInfo.doctor.name },
        { icon: CalendarIcon, label: 'Ngày khám:', value: displayDate },
        { icon: Clock, label: 'Thời gian:', value: displaySlot },
        // ADDED: Conditionally add consultation fee to the list
        ...(scheduleInfo && scheduleInfo.consultationFee != null ? [{
            icon: '💰',
            label: 'Phí khám (dự kiến):',
            value: formatCurrency(scheduleInfo.consultationFee),
            className: 'text-green-700 font-semibold'
        }] : []),
        { icon: Stethoscope, label: 'Triệu chứng:', value: symptoms || 'Không có', start: true }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-6 max-w-lg w-full transform transition-all">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Xác nhận thông tin đặt lịch</h3>
                    <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-5">Vui lòng kiểm tra kỹ thông tin lịch hẹn dưới đây trước khi xác nhận.</p>

                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
                    {confirmInfo.map(({ icon: Icon, label, value, className = '', start = false }, index) => (
                        <div key={index} className={`flex ${start ? 'items-start' : 'items-center'} space-x-3 text-sm`}>
                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                {typeof Icon === 'string' ? (<span className="text-lg">{Icon}</span>) : (<Icon className={`w-full h-full text-slate-500 ${start ? 'mt-px' : ''}`} />)}
                            </div>
                            <span className="font-medium text-slate-700 w-2/5">{label}</span>
                            <span className={`flex-1 text-slate-800 ${className} ${start ? 'whitespace-pre-wrap break-words' : ''}`}>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                    <button
                        onClick={() => setShowConfirmModal(false)}
                        disabled={bookingLoading}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={confirmBooking}
                        disabled={bookingLoading}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {bookingLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang xác nhận...
                            </>
                        ) : (
                            'Xác nhận đặt lịch'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


const BookingSection = ({
    availableTimeSlots, selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    symptoms, setSymptoms, handleBooking, doctorFullInfo, bookingLoading, currentUser,
    slotsLoading, availableSlotsByDate, dayClassName, currentMonthView, setCurrentMonthView,
    showConfirmModal, setShowConfirmModal, confirmBooking, formatCurrency
}) => {
    const minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
    const maxDate = new Date(); maxDate.setMonth(maxDate.getMonth() + 2); maxDate.setDate(0);
    const handleDateChange = (date) => { if (date) { setSelectedDate(date.toISOString().split('T')[0]); } else { setSelectedDate(''); } };
    const datePickerSelectedDate = selectedDate ? new Date(selectedDate + "T00:00:00") : null;

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Đặt lịch khám</h2>
            {currentUser ? (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-md sm:text-lg font-medium mb-2 flex items-center text-blue-700"> <User className="w-5 h-5 mr-2" /> Thông tin bệnh nhân </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                        <div><span className="font-semibold">Họ tên:</span> {currentUser.name}</div>
                        <div><span className="font-semibold">Email:</span> {currentUser.email}</div>
                    </div>
                </div>
            ) : (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-700 text-sm sm:text-base">Vui lòng đăng nhập để đặt lịch khám.</p>
                </div>
            )}

            <div className="mb-4 sm:mb-6">
                <h3 className="text-md sm:text-lg font-medium mb-2 sm:mb-3 flex items-center text-gray-700">
                    <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" /> Chọn ngày khám
                </h3>
                <div className="p-1 bg-white rounded-lg shadow-sm border">
                    <DatePicker selected={datePickerSelectedDate} onChange={handleDateChange} onMonthChange={(date) => setCurrentMonthView(date)} minDate={minDate} maxDate={maxDate} dateFormat="dd/MM/yyyy" locale="vi" inline dayClassName={dayClassName} calendarClassName="w-full border-0 shadow-none" wrapperClassName="w-full" />
                </div>
                {slotsLoading && !Object.keys(availableSlotsByDate).length && (<p className="text-sm text-blue-500 mt-2 animate-pulse">Đang kiểm tra lịch trống...</p>)}
            </div>

            <TimeSelection availableTimeSlots={availableTimeSlots} selectedTime={selectedTime} setSelectedTime={setSelectedTime} doctorFullInfo={doctorFullInfo} slotsLoading={slotsLoading && selectedDate && !availableSlotsByDate[selectedDate]} selectedDate={selectedDate} />
            <SymptomsInput symptoms={symptoms} setSymptoms={setSymptoms} />

            <div className="text-center mt-6 sm:mt-8">
                <button
                    onClick={handleBooking}
                    disabled={!currentUser || !selectedDate || !selectedTime || bookingLoading || slotsLoading}
                    className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-colors text-base ${currentUser && selectedDate && selectedTime && !bookingLoading && !slotsLoading ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    Đặt lịch ngay
                </button>
            </div>

            {showConfirmModal && (
                <ConfirmBookingModal
                    doctorFullInfo={doctorFullInfo} currentUser={currentUser} selectedDate={selectedDate}
                    selectedTime={selectedTime} symptoms={symptoms} formatCurrency={formatCurrency}
                    setShowConfirmModal={setShowConfirmModal} confirmBooking={confirmBooking}
                    bookingLoading={bookingLoading}
                />
            )}
        </div>
    );
};

const TimeSelection = ({ availableTimeSlots, selectedTime, setSelectedTime, doctorFullInfo, slotsLoading, selectedDate }) => (<div className="mb-4 sm:mb-6"> <h3 className="text-md sm:text-lg font-medium mb-2 sm:mb-3 flex items-center text-gray-700"> <Clock className="w-5 h-5 mr-2 text-blue-600" /> Chọn giờ khám {selectedDate && <span className="ml-2 text-sm font-normal text-gray-500">cho ngày {new Date(selectedDate + "T00:00:00").toLocaleDateString('vi-VN')}</span>} </h3> {slotsLoading ? (<div className="flex items-center justify-center py-6 text-gray-500 bg-gray-50 rounded-md"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>Đang tải khung giờ...</div>) : (selectedDate ? (availableTimeSlots.length > 0 ? (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3"> {availableTimeSlots.map((time) => (<button key={time} onClick={() => setSelectedTime(time)} className={`px-2 py-2 sm:px-3 sm:py-2.5 rounded-md border text-center transition-colors text-sm font-medium ${selectedTime === time ? 'border-blue-600 bg-blue-500 text-white shadow-md' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-700'}`} > {time} </button>))} </div>) : (<p className="text-gray-500 col-span-full text-center py-4 sm:py-6 italic bg-gray-50 rounded-md">Không có khung giờ trống cho ngày đã chọn.</p>)) : (<p className="text-gray-500 col-span-full text-center py-4 sm:py-6 italic bg-gray-50 rounded-md">Vui lòng chọn ngày khám để xem giờ trống.</p>))} <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3"> * Nghỉ trưa thường từ 11:00 - 13:00. {doctorFullInfo?.doctorSchedules?.[0]?.examinationTime && (<span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">Thời gian mỗi lượt khám: {doctorFullInfo.doctorSchedules[0].examinationTime} phút.</span>)} </p> </div>);
const SymptomsInput = ({ symptoms, setSymptoms }) => (<div className="mb-4 sm:mb-6"> <h3 className="text-md sm:text-lg font-medium mb-2 sm:mb-3 flex items-center text-gray-700"> <Stethoscope className="w-5 h-5 mr-2 text-blue-600" /> Triệu chứng/Lý do khám <span className="text-xs text-gray-500 ml-1">(không bắt buộc)</span> </h3> <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Mô tả ngắn gọn..." className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none transition-colors text-sm sm:text-base" rows="3" /> </div>);

const BookingSuccess = ({ doctorFullInfo, selectedDate, selectedTime, symptoms, formatCurrency, resetBooking, currentUser }) => {
    const scheduleInfo = doctorFullInfo.doctorSchedules?.[0];
    const examinationTime = scheduleInfo?.examinationTime || 30;
    const [hour, minute] = selectedTime.split(':').map(Number);
    const endTimeMinutes = hour * 60 + minute + examinationTime;
    const endHour = Math.floor(endTimeMinutes / 60); const endMinute = endTimeMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    const displaySlot = `${selectedTime} - ${endTime}`;
    const dateObjectForDisplay = selectedDate ? new Date(selectedDate + "T00:00:00") : null;
    const displayDate = dateObjectForDisplay ? dateObjectForDisplay.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Không rõ ngày';

    const successInfo = [
        { icon: User, label: 'Bệnh nhân:', value: currentUser.name },
        { icon: Mail, label: 'Email:', value: currentUser.email },
        { icon: User, label: 'Bác sĩ:', value: doctorFullInfo.doctor.name },
        { icon: CalendarIcon, label: 'Ngày khám:', value: displayDate },
        { icon: Clock, label: 'Thời gian:', value: displaySlot },
        // ADDED: Conditionally add consultation fee to the success screen
        ...(scheduleInfo && scheduleInfo.consultationFee != null ? [{
            icon: '💰',
            label: 'Phí khám (dự kiến):',
            value: formatCurrency(scheduleInfo.consultationFee),
            className: 'text-green-700 font-semibold'
        }] : []),
        { icon: Stethoscope, label: 'Triệu chứng:', value: symptoms || 'Không có', start: true }
    ];

    return (<div className="max-w-2xl mx-auto p-4 sm:p-6 my-6 sm:my-8"> <div className="bg-green-50 border-2 border-green-300 rounded-xl shadow-lg p-4 sm:p-6 md:p-8"> <div className="text-center mb-4 sm:mb-6"> <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ring-4 ring-green-200"> <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" /> </div> <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-1 sm:mb-2">Đặt lịch thành công!</h2> <p className="text-green-700 text-sm sm:text-base"> Thông tin lịch khám của bạn đã được ghi nhận. </p> </div> <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-4 rounded-lg shadow-inner border border-green-200"> {successInfo.map(({ icon: Icon, label, value, className = '', start = false }, index) => (<div key={index} className={`flex ${start ? 'items-start' : 'items-center'} space-x-2 sm:space-x-3 text-xs sm:text-sm`}> <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center"> {typeof Icon === 'string' ? (<span className="text-base sm:text-lg">{Icon}</span>) : (<Icon className={`w-full h-full text-gray-500 ${start ? 'mt-px' : ''}`} />)} </div> <span className="font-semibold text-gray-700 w-2/5 sm:w-1/3">{label}</span> <span className={`flex-1 text-gray-800 ${className} ${start ? 'whitespace-pre-wrap break-words' : ''}`}>{value}</span> </div>))} </div> <div className="mt-6 sm:mt-8 text-center"> <button onClick={resetBooking} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" > Đặt lịch khám khác </button> </div> </div> </div>);
};

export default ShowDetailDoctor;