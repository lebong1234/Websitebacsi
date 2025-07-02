// Helper/Email/EmailHelper.cs
using System.Net;
using System.Net.Mail;

public class EmailHelper
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;

    public EmailHelper(IConfiguration configuration)
    {
        _smtpServer = configuration["EmailSettings:SmtpServer"];
        _smtpPort = int.Parse(configuration["EmailSettings:SmtpPort"]);
        _smtpUsername = configuration["EmailSettings:SmtpUsername"];
        _smtpPassword = configuration["EmailSettings:SmtpPassword"];
    }

    public async Task SendAppointmentConfirmation(string toEmail, string patientName, DateTime appointmentDate, string doctorName)
    {
        using (var message = new MailMessage())
        {
            message.From = new MailAddress(_smtpUsername);
            message.To.Add(new MailAddress(toEmail));
            message.Subject = "Xác nhận lịch hẹn khám bệnh";
            message.Body = $"Xin chào {patientName},\n\nLịch hẹn của bạn với bác sĩ {doctorName} vào ngày {appointmentDate.ToString("dd/MM/yyyy HH:mm")} đã được xác nhận.\n\nTrân trọng,\nPhòng khám ABC";

            using (var client = new SmtpClient(_smtpServer, _smtpPort))
            {
                client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                client.EnableSsl = true;
                await client.SendMailAsync(message);
            }
        }
    }
}