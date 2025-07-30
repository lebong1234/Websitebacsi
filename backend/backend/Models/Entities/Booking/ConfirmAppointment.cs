using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Entities.Booking
{
    public class ConfirmAppointment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string IdConfirmAppointment { get; set; } = ObjectId.GenerateNewId().ToString();
        // ✅ THÊM TRƯỜNG MỚI NÀY
        [BsonElement("orderCode")]
        public long OrderCode { get; set; }
        [Required]
        public required string NameDr { get; set; }

        [Required]
        public required string DoctorId { get; set; }

        [Required]
        public required string Slot { get; set; }

        [Required]
        public required string PatientId { get; set; }

        [Required]
        [EmailAddress]
        public required string PatientEmail { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public required string Symptoms { get; set; } // ✅ thêm dòng này
        [Required]
        [BsonElement("consultationFee")]
        public decimal ConsultationFee { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = PaymentStatus.PENDING_PAYMENT; // Mặc định là chờ thanh toá
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // ✅ THÊM CÁC PROPERTY CHỈ ĐỂ HIỂN THỊ (không lưu vào DB)
        [BsonIgnore]
        public string PatientName { get; set; } = string.Empty;

        [BsonIgnore]
        public string SpecialtyName { get; set; } = string.Empty;
    }
    // public static class PaymentStatus
    // {
    //     public const string PENDING_PAYMENT = "PENDING_PAYMENT"; // Chờ thanh toán
    //     public const string PAID = "PAID";                     // Đã thanh toán
    //     public const string CANCELLED = "CANCELLED";           // Đã hủy
    // }
}
