// Helper/Sms/SmsHelper.cs
public class SmsHelper
{
    private readonly string _apiKey;
    private readonly string _senderId;

    public SmsHelper(IConfiguration configuration)
    {
        _apiKey = configuration["SmsSettings:ApiKey"];
        _senderId = configuration["SmsSettings:SenderId"];
    }

    public async Task SendAppointmentSms(string phoneNumber, string patientName, DateTime appointmentDate)
    {
        // Mock implementation - in real app, integrate with SMS provider API
        var message = $"Kính gửi {patientName}, lịch hẹn khám của Quý khách vào {appointmentDate.ToString("dd/MM/yyyy HH:mm")} đã được xác nhận. Vui lòng đến trước 15 phút. Hotline: 19001234";
        
        // In production, you would call the actual SMS API here
        Console.WriteLine($"SMS sent to {phoneNumber}: {message}");
        await Task.CompletedTask;
    }
}