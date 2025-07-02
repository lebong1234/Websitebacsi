// File: backend/Models/DTOs/Doctor/UpdateFullDoctorDto.cs
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using backend.Models.Entities.Doctor; // Cho DoctorGender
using System;
using System.Collections.Generic;

namespace backend.Models.DTOs.Doctor
{
    public class UpdateFullDoctorDto
    {
        // === Doctor Properties ===
        [Required(ErrorMessage = "Tên bác sĩ không được để trống")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giới tính không được để trống")]
        public backend.Models.Entities.Doctor.DoctorGender Gender { get; set; }

        [Required(ErrorMessage = "Ngày sinh không được để trống")]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "CCCD/CMND không được để trống")]
        public string Cccd { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        // Mật khẩu có thể để trống nếu không muốn thay đổi
        [MinLength(6, ErrorMessage = "Mật khẩu mới phải có ít nhất 6 ký tự")]
        public string? NewPassword { get; set; } // Để trống nếu không đổi mật khẩu

        [Compare("NewPassword", ErrorMessage = "Xác nhận mật khẩu không khớp.")]
        public string? ConfirmNewPassword { get; set; }

        // === DoctorDetail Properties ===
        [Required(ErrorMessage = "Bằng cấp không được để trống")]
        public string Degree { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required(ErrorMessage = "ID Chi nhánh không được để trống")]
        public string BranchId { get; set; } = string.Empty;

        [Required(ErrorMessage = "ID Khoa không được để trống")]
        public string DepartmentId { get; set; } = string.Empty;

        public string? SpecialtyId { get; set; }

        public IFormFile? ImgFile { get; set; } // Ảnh đại diện mới (nếu có)
        public string? ExistingAvatarUrl { get; set; } // Giữ URL ảnh hiện tại để hiển thị

        public IFormFile? CertificateImgFile { get; set; } // Ảnh chứng chỉ mới (nếu có)
        public string? ExistingCertificateImgUrl { get; set; }

        public IFormFile? DegreeImgFile { get; set; } // Ảnh bằng cấp mới (nếu có)
        public string? ExistingDegreeImgUrl { get; set; }


        // === DoctorSchedule Properties ===
        public string? Date { get; set; } // format "yyyy-MM-dd"
        public List<backend.Models.Entities.Doctor.DoctorSchedule.TimeSlot>? TimeSlots { get; set; }
    }
}