using MongoDB.Driver;
using Microsoft.Extensions.Options;
using backend.Data;
using backend.Models.Entities;
using backend.Models.Entities.Booking;
using backend.Settings;
using backend.Models.Entities.Doctor;
using backend.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services.Booking
{
    public class ConfirmAppointmentService
    {
        private readonly IMongoCollection<ConfirmAppointment> _confirmAppointmentCollection;
        private readonly IMongoCollection<Doctor> _doctorCollection;
        private readonly IMongoCollection<backend.Models.Entities.User> _userCollection;
        private readonly IWebHostEnvironment _env;
        private readonly IEmailService _emailService;

        public ConfirmAppointmentService(IOptions<MongoDbSettings> mongoDbSettings, IWebHostEnvironment env, IEmailService emailService)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _userCollection = mongoDatabase.GetCollection<backend.Models.Entities.User>(mongoDbSettings.Value.UserCollectionName);
            _confirmAppointmentCollection = mongoDatabase.GetCollection<ConfirmAppointment>(mongoDbSettings.Value.ConfirmAppointmentCollectionName);
            _doctorCollection = mongoDatabase.GetCollection<Doctor>(mongoDbSettings.Value.DoctorCollectionName);
            _emailService = emailService;
            _env = env;
        }

        public async Task CreateAppointmentAsync(ConfirmAppointment appointment)
        {
            appointment.CreatedAt = DateTime.UtcNow;
            appointment.UpdatedAt = DateTime.UtcNow;
            await _confirmAppointmentCollection.InsertOneAsync(appointment);
            // Gửi email xác nhận
            await _emailService.SendBookingConfirmationEmailAsync(
                appointment.PatientEmail,
                appointment.PatientName,
                appointment.NameDr,
                appointment.Date,
                appointment.Slot,
                appointment.Symptoms,
                appointment.ConsultationFee
            );
        }

        public async Task<bool> IsSlotTakenAsync(string doctorId, DateTime date, string slot)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Date, date.Date) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Slot, slot);
            return await _confirmAppointmentCollection.Find(filter).AnyAsync();
        }

        public async Task<List<ConfirmAppointment>> GetAppointmentsByDoctorIdAsync(string doctorId)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId);
            return await _confirmAppointmentCollection.Find(filter).ToListAsync();
        }

        public async Task<List<ConfirmAppointment>> GetAppointmentsByDoctorAndDateAsync(string doctorId, DateTime date)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Date, date.Date);
            return await _confirmAppointmentCollection.Find(filter).ToListAsync();
        }

        public async Task<bool> CheckPatientBookingAsync(string patientId, string doctorId, DateTime date, string slot)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.PatientId, patientId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Date, date.Date) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.Slot, slot);
            return await _confirmAppointmentCollection.Find(filter).AnyAsync();
        }

        public async Task<bool> HasPatientBookedWithDoctorOnDateAsync(string patientId, string doctorId, DateTime date)
        {
            var startOfDay = date.Date;
            var endOfDay = startOfDay.AddDays(1).AddTicks(-1);
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.PatientId, patientId) &
                        Builders<ConfirmAppointment>.Filter.Eq(a => a.DoctorId, doctorId) &
                        Builders<ConfirmAppointment>.Filter.Gte(a => a.Date, startOfDay) &
                        Builders<ConfirmAppointment>.Filter.Lte(a => a.Date, endOfDay);
            return await _confirmAppointmentCollection.Find(filter).AnyAsync();
        }

        public async Task<bool> UpdateAppointmentStatusByOrderCodeAsync(long orderCode, string newStatus)
        {
            var filter = Builders<ConfirmAppointment>.Filter.Eq(a => a.OrderCode, orderCode);
            var existingAppointment = await _confirmAppointmentCollection.Find(filter).FirstOrDefaultAsync();
            if (existingAppointment == null || existingAppointment.Status == newStatus)
            {
                return false;
            }
            var update = Builders<ConfirmAppointment>.Update
                .Set(a => a.Status, newStatus)
                .Set(a => a.UpdatedAt, DateTime.UtcNow);
            var result = await _confirmAppointmentCollection.UpdateOneAsync(filter, update);
            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                if (newStatus == PaymentStatus.PAID)
                {
                    try
                    {
                        await _emailService.SendBookingConfirmationEmailAsync(
                            existingAppointment.PatientEmail,
                            existingAppointment.PatientName,
                            existingAppointment.NameDr,
                            existingAppointment.Date,
                            existingAppointment.Slot,
                            existingAppointment.Symptoms,
                            existingAppointment.ConsultationFee
                        );
                    }
                    catch (Exception emailEx)
                    {
                        Console.WriteLine($"[WARNING] Gửi email xác nhận thất bại cho OrderCode {orderCode}. Lỗi: {emailEx.Message}");
                    }
                }
                return true;
            }
            return false;
        }
    }
} 