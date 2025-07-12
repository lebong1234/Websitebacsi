using MongoDB.Driver;
using backend.Models.Entities.Doctor;
using Microsoft.Extensions.Options;
using backend.Data;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;
using MongoDB.Bson;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.Models.Entities;
using backend.Settings;

namespace backend.Services
{
    public class DoctorDetailService : IDoctorDetailService
    {
        private readonly IMongoCollection<DoctorDetail> _doctorDetailCollection;
        private readonly IMongoCollection<Branch> _branchCollection;
        private readonly IMongoCollection<Doctor> _doctorCollection;
        private readonly IMongoCollection<Department> _departmentCollection;
        private readonly IMongoCollection<Specialty> _specialtyCollection;
        private readonly IMongoCollection<DoctorSchedule> _doctorScheduleCollection;
        private readonly IWebHostEnvironment _env;

        public DoctorDetailService(IOptions<MongoDbSettings> mongoDbSettings, IWebHostEnvironment env)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);

            _doctorDetailCollection = mongoDatabase.GetCollection<DoctorDetail>(mongoDbSettings.Value.DoctorDetailCollectionName);
            _branchCollection = mongoDatabase.GetCollection<Branch>(mongoDbSettings.Value.BranchCollectionName);
            _departmentCollection = mongoDatabase.GetCollection<Department>(mongoDbSettings.Value.DepartmentCollectionName);
            _specialtyCollection = mongoDatabase.GetCollection<Specialty>(mongoDbSettings.Value.SpecialtyCollectionName);
            _doctorCollection = mongoDatabase.GetCollection<Doctor>(mongoDbSettings.Value.DoctorCollectionName);
            _doctorScheduleCollection = mongoDatabase.GetCollection<DoctorSchedule>(mongoDbSettings.Value.DoctorScheduleCollectionName);
            _env = env;
        }

        public async Task<List<DoctorDetail>> GetAllAsync() =>
            await _doctorDetailCollection.Find(_ => true).ToListAsync();

        public async Task<DoctorDetail?> GetDoctorDetailByDoctorIdAsync(string doctorId) =>
            await _doctorDetailCollection.Find(d => d.DoctorId == doctorId).FirstOrDefaultAsync();

        public async Task<(bool Success, string? ErrorMessage, DoctorDetail? Result)> CreateAsync(DoctorDetailUploadDto dto)
        {
            // Validate all IDs
            if (!ObjectId.TryParse(dto.BranchId, out var branchId))
                return (false, $"Invalid BranchId: {dto.BranchId}", null);

            if (!ObjectId.TryParse(dto.DepartmentId, out var departmentId))
                return (false, $"Invalid DepartmentId: {dto.DepartmentId}", null);

            if (!ObjectId.TryParse(dto.SpecialtyId, out var specialtyId))
                return (false, $"Invalid SpecialtyId: {dto.SpecialtyId}", null);

            if (!ObjectId.TryParse(dto.DoctorId, out var doctorId))
                return (false, $"Invalid DoctorId: {dto.DoctorId}", null);

            // Check references exist
            var branch = await _branchCollection.Find(b => b.IdBranch == branchId.ToString()).FirstOrDefaultAsync();
            if (branch == null)
                return (false, $"Branch with id {dto.BranchId} not found", null);

            var department = await _departmentCollection.Find(d => d.IdDepartment == departmentId.ToString()).FirstOrDefaultAsync();
            if (department == null)
                return (false, $"Department with id {dto.DepartmentId} not found", null);

            var specialty = await _specialtyCollection.Find(s => s.IdSpecialty == specialtyId.ToString()).FirstOrDefaultAsync();
            if (specialty == null)
                return (false, $"Specialty with id {dto.SpecialtyId} not found", null);

            var doctor = await _doctorCollection.Find(d => d.IdDoctor == doctorId.ToString()).FirstOrDefaultAsync();
            if (doctor == null)
                return (false, $"Doctor with id {dto.DoctorId} not found", null);

            var doctorDetail = new DoctorDetail
            {
                DoctorId = doctorId.ToString(),
                Degree = dto.Degree,
                BranchId = branch.IdBranch,
                DepartmentId = department.IdDepartment,
                SpecialtyId = specialty.IdSpecialty,
                Description = dto.Description ?? string.Empty,
                Img = dto.ImgFile != null ? await SaveImageAsync(dto.ImgFile, "Doctor/Img") : string.Empty,
                CertificateImg = dto.CertificateImgFile != null ? await SaveImageAsync(dto.CertificateImgFile, "Doctor/CertificateImg") : string.Empty,
                DegreeImg = dto.DegreeImgFile != null ? await SaveImageAsync(dto.DegreeImgFile, "Doctor/DegreeImg") : string.Empty,
            };

            await _doctorDetailCollection.InsertOneAsync(doctorDetail);
            return (true, null, doctorDetail);
        }

        public async Task<bool> UpdateAsync(string id, DoctorDetail updated)
        {
            var result = await _doctorDetailCollection.ReplaceOneAsync(d => d.IdDoctorDetail == id, updated);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _doctorDetailCollection.DeleteOneAsync(d => d.IdDoctorDetail == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        private async Task<string> SaveImageAsync(IFormFile file, string folderName)
        {
            var folderPath = Path.Combine(_env.WebRootPath, "uploads", folderName);
            Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/{folderName}/{fileName}";
        }

        public async Task<List<DoctorSearchResultDto>> FindDoctorsByCriteriaAsync(string branchId, string departmentId, string? specialtyId = null)
        {
            var matchFilter = new BsonDocument();

            if (ObjectId.TryParse(branchId, out var parsedBranchId))
                matchFilter.Add("branchId", parsedBranchId);
            else
                return new List<DoctorSearchResultDto>();

            if (ObjectId.TryParse(departmentId, out var parsedDepartmentId))
                matchFilter.Add("departmentId", parsedDepartmentId);
            else
                return new List<DoctorSearchResultDto>();

            if (!string.IsNullOrEmpty(specialtyId) && ObjectId.TryParse(specialtyId, out var parsedSpecialtyId))
            {
                matchFilter.Add("specialtyId", parsedSpecialtyId);
            }

            var pipeline = new BsonDocument[]
            {
        new BsonDocument("$match", matchFilter),
        new BsonDocument("$lookup",
            new BsonDocument
            {
                { "from", _doctorCollection.CollectionNamespace.CollectionName },
                { "localField", "doctorId" },
                { "foreignField", "_id" },
                { "as", "doctorInfo" }
            }),
        new BsonDocument("$unwind", "$doctorInfo"),
        new BsonDocument("$project",
            new BsonDocument
            {
                { "Id", "$doctorInfo._id" },
                { "Name", "$doctorInfo.name" },
                { "DoctorName", "$doctorInfo.name" },
                { "Gender", "$doctorInfo.gender" },
                { "DateOfBirth", "$doctorInfo.dateOfBirth" },
                { "Cccd", "$doctorInfo.cccd" },
                { "Phone", "$doctorInfo.phone" },
                { "Email", "$doctorInfo.email" },
                { "DoctorId", "$doctorId" },
                { "DoctorImage", "$img" },
                { "Img", "$img" },
                { "DoctorDegree", "$degree" },
                { "Degree", "$degree" },
                { "WorkingAtBranch", "$branchName" },
                { "BranchName", "$branchName" },
                { "WorkingInDepartment", "$departmentName" },
                { "DepartmentName", "$departmentName" },
                { "SpecializingIn", "$specialtyName" },
                { "SpecialtyName", "$specialtyName" },
                { "JobDescription", "$description" },
                { "Rating", 0 },
                { "ReviewCount", 0 },
                { "BranchId", "$branchId" },
                { "DepartmentId", "$departmentId" },
                { "SpecialtyId", "$specialtyId" }
            })
            };

            return await _doctorDetailCollection.Aggregate<DoctorSearchResultDto>(pipeline).ToListAsync();
        }
        public async Task<DoctorFullInfoDto?> GetDoctorFullInfoAsync(string doctorId)
        {
            var doctor = await _doctorCollection.Find(d => d.IdDoctor == doctorId).FirstOrDefaultAsync();
            if (doctor == null) return null;

            var doctorDetail = await _doctorDetailCollection.Find(d => d.DoctorId == doctorId).FirstOrDefaultAsync();
            var doctorSchedules = await _doctorScheduleCollection.Find(d => d.DoctorId == doctorId).ToListAsync();

            string? branchName = null;
            string? departmentName = null;
            string? specialtyName = null;

            if (doctorDetail?.BranchId != null)
            {
                var branch = await _branchCollection.Find(b => b.IdBranch == doctorDetail.BranchId).FirstOrDefaultAsync();
                branchName = branch?.BranchName;
            }

            if (doctorDetail?.DepartmentId != null)
            {
                var department = await _departmentCollection.Find(d => d.IdDepartment == doctorDetail.DepartmentId).FirstOrDefaultAsync();
                departmentName = department?.DepartmentName;
            }

            if (doctorDetail?.SpecialtyId != null)
            {
                var specialty = await _specialtyCollection.Find(d => d.IdSpecialty == doctorDetail.SpecialtyId).FirstOrDefaultAsync();
                specialtyName = specialty?.SpecialtyName;
            }

            return new DoctorFullInfoDto
            {
                Doctor = doctor,
                DoctorDetail = doctorDetail!,
                DoctorSchedules = doctorSchedules,
                BranchName = branchName,
                DepartmentName = departmentName,
                SpecialtyName = specialtyName
            };
        }
    }
}