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

        [Required]
        public string NameDr { get; set; }

        [Required]
        public string DoctorId { get; set; }

        [Required]
        public string Slot { get; set; }

        [Required]
        public string PatientId { get; set; }

        [Required]
        [EmailAddress]
        public string PatientEmail { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string Symptoms { get; set; } // ✅ thêm dòng này

        public string PatientName { get; set; } // Họ tên bệnh nhân
        public decimal ConsultationFee { get; set; } // Phí khám
        public long OrderCode { get; set; } // Mã đơn hàng thanh toán
        public string Status { get; set; } // Trạng thái thanh toán

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

}
