// File: backend/Services/IEmailService.cs

using backend.Models.Entities.Booking; // ✅ THÊM DÒNG NÀY
using System;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IEmailService
    {
        Task SendBookingConfirmationEmailAsync(string patientEmail, string patientName, string doctorName, DateTime bookingDate, string timeSlot, string? symptoms, decimal consultationFee);
        // ✅ SỬA LẠI: Nhận patientName là một string, không cần biết ConfirmAppointment là gì
        Task SendPaymentRequestEmailAsync(string toEmail, string patientName, decimal consultationFee, string doctorName, DateTime bookingDate, string timeSlot, string paymentUrl);
    }
}