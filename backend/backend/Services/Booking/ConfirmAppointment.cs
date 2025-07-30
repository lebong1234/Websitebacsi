using MongoDB.Driver;
using Microsoft.Extensions.Options;
using backend.Data;
using backend.Models.Entities;
using backend.Models.Entities.Booking;
using backend.Settings;
using backend.Models.Entities.Doctor;
using backend.Services; // Namespace chứa IEmailService (nếu khác, chỉnh lại cho đúng)

namespace backend.Services
{
    public class ConfirmAppointmentService
    {
        private readonly IMongoCollection<ConfirmAppointment> _confirmAppointmentCollection;

        private readonly IMongoCollection<Doctor> _doctorCollection; // <<< THÊM LẠI DÒNG NÀY
        private readonly IMongoCollection<backend.Models.Entities.User> _userCollection;
        private readonly IWebHostEnvironment _env;
        private readonly IEmailService _emailService;


        public ConfirmAppointmentService(IOptions<MongoDbSettings> mongoDbSettings, IWebHostEnvironment env, IEmailService emailService)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _userCollection = mongoDatabase.GetCollection<backend.Models.Entities.User>(mongoDbSettings.Value.UserCollectionName);

            _confirmAppointmentCollection = mongoDatabase
                .GetCollection<ConfirmAppointment>(mongoDbSettings.Value.ConfirmAppointmentCollectionName);
            _doctorCollection = mongoDatabase.GetCollection<Doctor>(mongoDbSettings.Value.DoctorCollectionName);
            _emailService = emailService; // 👈 Gán vào field
            _env = env;
        }

        // ✅ Tạo lịch hẹn mới
        public async Task CreateAppointmentAsync(ConfirmAppointment appointment)
        {
            appointment.CreatedAt = DateTime.UtcNow;
            appointment.UpdatedAt = DateTime.UtcNow;
            await _confirmAppointmentCollection.InsertOneAsync(appointment);

            // ✅ Gửi email xác nhận
            // var subject = "Xác nhận lịch hẹn thành công";
            // var message = $@"
            // <h3>Xin chào {appointment.PatientName},</h3>
            // <p>Bạn đã đặt lịch hẹn với bác sĩ <strong>{appointment.NameDr}</strong> thành công.</p>
            // <p><strong>Thời gian:</strong> {appointment.Date.ToString("dd/MM/yyyy")} - {appointment.Slot}</p>
            // <p><strong>Chuyên khoa:</strong> {appointment.SpecialtyName}</p>
            // <p><strong>Triệu chứng:</strong> {appointment.Symptoms}</p>
            // <p><strong>Phí khám:</strong> {appointment.ConsultationFee.ToString("N0")} VNĐ</p>
            // <br/>
            // <p>Trân trọng,<br/>Phòng khám của chúng tôi.</p>"
            // ;


            await _emailService.SendBookingConfirmationEmailAsync(
     appointment.PatientEmail,
     patientName: appointment.PatientName,
     doctorName: appointment.NameDr,
     bookingDate: appointment.Date,
     timeSlot: appointment.Slot,
     symptoms: appointment.Symptoms,
     consultationFee: appointment.ConsultationFee
 );


        }

        // ✅ Kiểm tra xem slot đã được đặt chưa
        public async Task<bool> IsSlotTakenAsync(string doctorId, DateTime date, string slot)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Date, date.Date) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Slot, slot);
            return await _confirmAppointmentCollection.Find(filter).AnyAsync();
        }

        // ✅ Lấy toàn bộ lịch hẹn của một bác sĩ theo doctorId
        public async Task<List<ConfirmAppointment>> GetAppointmentsByDoctorIdAsync(string doctorId)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId);
            return await _confirmAppointmentCollection.Find(filter).ToListAsync();
        }

        // ✅ Lấy danh sách lịch hẹn theo bác sĩ và ngày (tuỳ chọn mở rộng)
        public async Task<List<ConfirmAppointment>> GetAppointmentsByDoctorAndDateAsync(string doctorId, DateTime date)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Date, date.Date);
            return await _confirmAppointmentCollection.Find(filter).ToListAsync();
        }

        // ✅ Kiểm tra bệnh nhân đã đặt lịch với bác sĩ đó, ngày đó, slot đó chưa
        public async Task<bool> CheckPatientBookingAsync(string patientId, string doctorId, DateTime date, string slot)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.PatientId, patientId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Date, date.Date) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Slot, slot);

            return await _confirmAppointmentCollection.Find(filter).AnyAsync();
        }

        // ... (các hàm khác) ...

        // ✅ Kiểm tra xem bệnh nhân đã đặt lịch với bác sĩ này trong ngày cụ thể chưa
        public async Task<bool> HasPatientBookedWithDoctorOnDateAsync(string patientId, string doctorId, DateTime date)
        {
            var startOfDay = date.Date; // Lấy phần ngày, bỏ qua giờ phút giây
            var endOfDay = startOfDay.AddDays(1).AddTicks(-1); // Kết thúc của ngày đó

            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.PatientId, patientId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Gte(a => a.Date, startOfDay) & // Lớn hơn hoặc bằng đầu ngày
                        Builders<ConfirmAppointment>.Filter.Lte(a => a.Date, endOfDay);   // Nhỏ hơn hoặc bằng cuối ngày

            return await _confirmAppointmentCollection.Find(filter).AnyAsync();
        }

        // Trong ConfirmAppointmentService.cs - thêm logging chi tiết
        // File: backend/Services/Booking/ConfirmAppointmentService.cs

        public async Task<bool> UpdateAppointmentStatusByOrderCodeAsync(long orderCode, string newStatus)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.OrderCode, orderCode);

            // Kiểm tra xem appointment có tồn tại và chưa được cập nhật không
            var existingAppointment = await _confirmAppointmentCollection.Find(filter).FirstOrDefaultAsync();
            if (existingAppointment == null || existingAppointment.Status == newStatus)
            {
                // Ghi log để biết tại sao không cập nhật
                if (existingAppointment == null)
                    Console.WriteLine($"[INFO] Không tìm thấy lịch hẹn với OrderCode: {orderCode}");
                else
                    Console.WriteLine($"[INFO] Lịch hẹn {orderCode} đã ở trạng thái {newStatus}.");

                return false; // Không có gì để cập nhật
            }

            var update = Builders<ConfirmAppointment>.Update
                .Set(a => a.Status, newStatus)
                .Set(a => a.UpdatedAt, DateTime.UtcNow);

            var result = await _confirmAppointmentCollection.UpdateOneAsync(filter, update);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                // Nếu cập nhật thành công và trạng thái là PAID, gửi email xác nhận
                if (newStatus == PaymentStatus.PAID)
                {
                    try
                    {
                        // ✅ SỬA LỖI: GỌI ĐÚNG HÀM EMAIL "SendBookingConfirmationEmailAsync"
                        // Hàm này không yêu cầu paymentUrl.
                        await _emailService.SendBookingConfirmationEmailAsync(
                            patientEmail: existingAppointment.PatientEmail,
                            patientName: existingAppointment.PatientName, // Sẽ dùng tên từ DB
                            doctorName: existingAppointment.NameDr,
                            bookingDate: existingAppointment.Date,
                            timeSlot: existingAppointment.Slot,
                            symptoms: existingAppointment.Symptoms,
                            consultationFee: existingAppointment.ConsultationFee
                        );
                        Console.WriteLine($"[INFO] Đã gửi email xác nhận thanh toán cho OrderCode: {orderCode}");
                    }
                    catch (Exception emailEx)
                    {
                        // Ghi log nếu gửi email thất bại, nhưng không ảnh hưởng đến kết quả cập nhật
                        Console.WriteLine($"[WARNING] Gửi email xác nhận thất bại cho OrderCode {orderCode}. Lỗi: {emailEx.Message}");
                    }
                }
                return true;
            }

            return false;
        }
    }
}
