using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities.Doctor;

public class DoctorSchedule
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string IdDoctorSchedule { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("doctorId")]
    public string DoctorId { get; set; } = string.Empty;

    [BsonElement("date")]
    public string Date { get; set; } = string.Empty; // format "yyyy-MM-dd"

    [BsonElement("timeSlots")]
    public List<TimeSlot> TimeSlots { get; set; } = new();

    public class TimeSlot
    {
        public string StartTime { get; set; } = string.Empty; // format "HH:mm"
        public string EndTime { get; set; } = string.Empty;   // format "HH:mm"
        public int ConsultationFee { get; set; }
        public int ExaminationTime { get; set; } // minutes
    }
}