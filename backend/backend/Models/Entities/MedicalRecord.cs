using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Entities;

public class MedicalRecord
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("bookingId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string BookingId { get; set; } = string.Empty; // Liên kết với lịch hẹn

    [BsonElement("patientId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string PatientId { get; set; } = string.Empty;

    [BsonElement("doctorId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DoctorId { get; set; } = string.Empty;

    [BsonElement("recordDate")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime RecordDate { get; set; } = DateTime.UtcNow;

    // --- GHI CHÚ LÂM SÀNG CỦA BÁC SĨ ---
    [BsonElement("symptoms")] // Triệu chứng bệnh nhân mô tả
    public string Symptoms { get; set; } = string.Empty;

    [BsonElement("diagnosis")] // Chẩn đoán của bác sĩ
    public string Diagnosis { get; set; } = string.Empty;
    
    // --- CÁC CHỈ ĐỊNH VÀ KẾT QUẢ ---
    [BsonElement("prescriptions")] // Đơn thuốc bác sĩ kê
    public List<PrescriptionItem> Prescriptions { get; set; } = new();

    [BsonElement("labOrders")] // Chỉ định xét nghiệm/chẩn đoán hình ảnh
    public List<LabOrder> LabOrders { get; set; } = new();
    
    [BsonElement("doctorNotes")] // Ghi chú thêm của bác sĩ
    public string? DoctorNotes { get; set; }
    
    [BsonElement("followUpDate")] // Lịch tái khám (nếu có)
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? FollowUpDate { get; set; }
}

// Các lớp con được nhúng vào MedicalRecord
public class PrescriptionItem
{
    [BsonElement("medicineName")]
    public string MedicineName { get; set; } = string.Empty;

    [BsonElement("dosage")]
    public string Dosage { get; set; } = string.Empty; // Ví dụ: "500mg"

    [BsonElement("instruction")]
    public string Instruction { get; set; } = string.Empty; // Ví dụ: "Uống 2 viên/ngày sau ăn"
}

public class LabOrder
{
    [BsonElement("testName")]
    public string TestName { get; set; } = string.Empty; // Tên XN, CĐHA: "Công thức máu", "X-quang ngực"

    [BsonElement("status")]
    public string Status { get; set; } = "Requested"; // "Requested", "Completed", "Cancelled"

    [BsonElement("result")]
    public string? Result { get; set; } // Khoa cận lâm sàng sẽ cập nhật kết quả vào đây
}