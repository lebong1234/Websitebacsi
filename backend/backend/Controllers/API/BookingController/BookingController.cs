using Microsoft.AspNetCore.Mvc;
using backend.Models.Entities.Booking;
using backend.Services.Booking;
using backend.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using Net.payOS;
using Net.payOS.Types;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly ConfirmAppointmentService _confirmAppointmentService;
        private readonly EmailService _emailService;
        private readonly PayOS _payOS; // Thêm field này
        public BookingController(ConfirmAppointmentService confirmAppointmentService, EmailService emailService, PayOS payOS)
        {
            _confirmAppointmentService = confirmAppointmentService;
            _emailService = emailService;
            _payOS = payOS;
        }

        [HttpGet("check-slot")]
        public async Task<IActionResult> CheckSlotTaken([FromQuery] string doctorId, [FromQuery] DateTime date, [FromQuery] string slot)
        {
            if (string.IsNullOrEmpty(doctorId) || string.IsNullOrEmpty(slot))
            {
                return BadRequest("DoctorId và slot không được để trống.");
            }

            bool isTaken = await _confirmAppointmentService.IsSlotTakenAsync(doctorId, date, slot);

            return Ok(new { isTaken });
        }
        [HttpGet("appointments/doctor/{doctorId}")]
        public async Task<IActionResult> GetAllAppointmentsByDoctorId(string doctorId)
        {
            var appointments = await _confirmAppointmentService.GetAppointmentsByDoctorIdAsync(doctorId);

            if (appointments == null || !appointments.Any())
            {
                return NotFound($"Không tìm thấy lịch hẹn nào cho bác sĩ có ID: {doctorId}");
            }

            return Ok(appointments);
        }


        [HttpPost("create")]
        public async Task<IActionResult> CreateAppointment([FromBody] ConfirmAppointment appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra slot đã được đặt chưa
            bool isTaken = await _confirmAppointmentService.IsSlotTakenAsync(
                appointment.DoctorId,
                appointment.Date,
                appointment.Slot
            );

            if (isTaken)
            {
                return Conflict("Slot đã được đặt. Vui lòng chọn thời gian khác.");
            }

            await _confirmAppointmentService.CreateAppointmentAsync(appointment);

            return Ok(new
            {
                message = "Đặt lịch thành công!",
                appointment
            });
        }

        [HttpGet("doctor/{doctorId}/date/{date}")]
        public async Task<IActionResult> GetAppointmentsByDoctorAndDate(string doctorId, DateTime date)
        {
            var result = await _confirmAppointmentService.GetAppointmentsByDoctorAndDateAsync(doctorId, date);
            return Ok(result);
        }
        [HttpGet("check-patient-booking")]
        public async Task<IActionResult> CheckPatientBooking([FromQuery] string patientId, [FromQuery] string doctorId, [FromQuery] DateTime date, [FromQuery] string slot)
        {
            if (string.IsNullOrEmpty(patientId) || string.IsNullOrEmpty(doctorId) || string.IsNullOrEmpty(slot))
            {
                return BadRequest("PatientId, DoctorId và slot không được để trống.");
            }

            bool hasBooking = await _confirmAppointmentService.CheckPatientBookingAsync(patientId, doctorId, date, slot);

            return Ok(new { hasBooking });
        }

        [HttpGet("check-daily-limit")] // Endpoint sẽ là GET api/booking/check-daily-limit
        public async Task<IActionResult> CheckDailyBookingLimit(
           [FromQuery] string patientId,
           [FromQuery] string doctorId,
           [FromQuery] DateTime date) // ASP.NET Core sẽ tự động parse "YYYY-MM-DD" từ query string sang DateTime
        {
            if (string.IsNullOrEmpty(patientId) || string.IsNullOrEmpty(doctorId))
            {
                return BadRequest("PatientId và DoctorId không được để trống.");
            }
            // `date` ở đây sẽ có Time là 00:00:00 nếu query string chỉ có YYYY-MM-DD

            bool hasBookingToday = await _confirmAppointmentService.HasPatientBookedWithDoctorOnDateAsync(patientId, doctorId, date);

            return Ok(new { hasBookingToday }); // Trả về JSON: { "hasBookingToday": true/false }
        }

        [HttpPost("create-and-get-payment-link")]
        public async Task<IActionResult> CreateAppointmentAndGetPaymentLink([FromBody] ConfirmAppointment appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Kiểm tra slot đã được đặt chưa
                bool isTaken = await _confirmAppointmentService.IsSlotTakenAsync(appointment.DoctorId, appointment.Date, appointment.Slot);
                if (isTaken)
                {
                    return Conflict(new { message = "Slot đã được đặt. Vui lòng chọn thời gian khác." });
                }

                // Chuẩn bị và lưu lịch hẹn vào database
                appointment.OrderCode = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                appointment.Status = PaymentStatus.PENDING_PAYMENT;
                await _confirmAppointmentService.CreateAppointmentAsync(appointment);
                Console.WriteLine($"[INFO] Đã tạo lịch hẹn trong DB với OrderCode: {appointment.OrderCode}");

                // Tạo link thanh toán với PayOS
                var items = new List<ItemData>
                {
                    new ItemData(
                        name: $"Phí khám {appointment.NameDr}",
                        quantity: 1,
                        price: (int)appointment.ConsultationFee
                    )
                };
                
                var paymentData = new PaymentData(
                    orderCode: appointment.OrderCode,
                    amount: (int)appointment.ConsultationFee,
                    description: $"TT lich hen {appointment.OrderCode}",
                    items: items,
                    returnUrl: $"http://localhost:5173/payment-result?orderCode={appointment.OrderCode}",
                    cancelUrl: $"http://localhost:5173/payment-result?orderCode={appointment.OrderCode}&cancel=1"
                );
                
                CreatePaymentResult paymentResult = await _payOS.createPaymentLink(paymentData);
                Console.WriteLine($"[INFO] Đã tạo link thanh toán PayOS cho OrderCode: {appointment.OrderCode}");

                // Gửi email yêu cầu thanh toán (kèm link)
                try
                {
                    await _emailService.SendPaymentRequestEmailAsync(
                        toEmail: appointment.PatientEmail,
                        patientName: appointment.PatientName,
                        consultationFee: appointment.ConsultationFee,
                        doctorName: appointment.NameDr,
                        bookingDate: appointment.Date,
                        timeSlot: appointment.Slot,
                        paymentUrl: paymentResult.checkoutUrl
                    );
                    Console.WriteLine($"[INFO] Đã gửi email yêu cầu thanh toán cho OrderCode: {appointment.OrderCode}");
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"[WARNING] Gửi email yêu cầu thanh toán thất bại cho OrderCode {appointment.OrderCode}. Lỗi: {emailEx.Message}");
                }

                return Ok(paymentResult);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"[ERROR] Lỗi nghiêm trọng trong CreateAppointmentAndGetPaymentLink: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi hệ thống.", error = ex.Message });
            }
        }
    }
}