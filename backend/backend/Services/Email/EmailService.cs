    // File: backend/Services/EmailService.cs

    using backend.Models.Entities;
    using MailKit.Net.Smtp;
    using MailKit.Security;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using MimeKit;
    using System.Globalization;
    using System.Threading.Tasks;
    using backend.Settings;


    namespace backend.Services
    {
        public class EmailService : IEmailService
        {
            private readonly EmailSettings _emailSettings;
            private readonly ILogger<EmailService> _logger;

            // ✅ CONSTRUCTOR SIÊU ĐƠN GIẢN
            public EmailService(IOptions<EmailSettings> emailSettingsOptions, ILogger<EmailService> logger)
            {
                _emailSettings = emailSettingsOptions.Value;
                _logger = logger;
            }

            private async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody)
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                email.To.Add(new MailboxAddress(toName, toEmail));
                email.Subject = subject;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = htmlBody };
                try
                {
                    using var smtp = new SmtpClient();
                    await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, SecureSocketOptions.StartTlsWhenAvailable);
                    await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                    await smtp.SendAsync(email);
                    _logger.LogInformation($"Gửi email thành công tới {toEmail}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Lỗi khi gửi email tới {toEmail}");
                    throw;
                }
            }

            // Phương thức này vẫn giữ nguyên vì nó nhận patientName từ controller
            public async Task SendBookingConfirmationEmailAsync(string patientEmail, string patientName, string doctorName, DateTime bookingDate, string timeSlot, string? symptoms, decimal consultationFee)
            {
                var dateString = bookingDate.ToString("dddd, dd MMMM yyyy", new CultureInfo("vi-VN"));
                var htmlBody = $@"
                    <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                        <h2 style='color: #0056b3;'>Xác nhận lịch hẹn tại HealthCare</h2>
                        <p>Chào <strong>{patientName}</strong>,</p>
                        <p>Lịch khám của bạn đã được xác nhận thành công.</p>
                    </div>";
                await SendEmailAsync(patientEmail, patientName, "Xác nhận đặt lịch khám tại HealthCare", htmlBody);
            }

            // ✅ SỬA LẠI: KHÔNG CẦN LẤY TÊN TỪ DB NỮA
            public async Task SendPaymentRequestEmailAsync(string toEmail, string patientName, decimal consultationFee, string doctorName, DateTime bookingDate, string timeSlot, string paymentUrl)
            {
                var subject = "Yêu cầu thanh toán phí khám bệnh";
                var htmlBody = $@"
                    <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                        <h3>Xin chào {patientName},</h3>
                        <p>Cảm ơn bạn đã đặt lịch hẹn với bác sĩ <strong>{doctorName}</strong>.</p>
                        <p>Vui lòng hoàn tất thanh toán phí khám <strong>{consultationFee:N0} VNĐ</strong> để xác nhận lịch hẹn vào lúc {timeSlot} ngày {bookingDate:dd/MM/yyyy}.</p>
                        <p style='text-align: center; margin: 20px 0;'>
                            <a href='{paymentUrl}' style='background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;'>
                                Thanh toán ngay
                            </a>
                        </p>
                        <p>Trân trọng,<br/>Đội ngũ HealthCare</p>
                    </div>";

                // Giờ nó chỉ cần dùng các tham số được truyền vào
                await SendEmailAsync(toEmail, patientName, subject, htmlBody);
            }
        }
    }