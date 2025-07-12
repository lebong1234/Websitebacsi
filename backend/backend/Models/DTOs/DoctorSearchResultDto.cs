using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using backend.Models.Entities.Doctor;

namespace backend.Models.DTOs
{
    public class DoctorSearchResultDto
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public DoctorGender Gender { get; set; } = DoctorGender.Other;

        public string Name { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string Cccd { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; } = DateTime.MinValue;

        [BsonRepresentation(BsonType.ObjectId)]
        public string DoctorId { get; set; } = string.Empty;

        public string DoctorImage { get; set; } = string.Empty;
        public string DoctorDegree { get; set; } = string.Empty;
        public string WorkingAtBranch { get; set; } = string.Empty;
        public string WorkingInDepartment { get; set; } = string.Empty;
        public string SpecializingIn { get; set; } = string.Empty;
        public string JobDescription { get; set; } = string.Empty;
        public string Img { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string SpecialtyName { get; set; } = string.Empty;
        public string BranchName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public double Rating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;

        [BsonRepresentation(BsonType.ObjectId)]
        public string BranchId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string DepartmentId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string SpecialtyId { get; set; } = string.Empty;
    }
}