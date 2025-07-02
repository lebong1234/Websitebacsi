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
using backend.Services;
using backend.Models.Entities;
using backend.Models.DTOs;
using backend.Settings;

namespace backend.Services
{
    public class DoctorDetailService : IDoctorDetailService
    {
        private readonly IMongoCollection<DoctorDetail> _DoctorDetailCollection;
        private readonly IMongoCollection<Branch> _BranchCollection;
        private readonly IMongoCollection<Doctor> _doctorCollection; // <<< THÊM LẠI DÒNG NÀY
        private readonly IMongoCollection<Department> _departmentCollection;
        private readonly IMongoCollection<Specialty> _specialtyCollection;
        private readonly IMongoCollection<DoctorSchedule> _DoctorScheduleCollectionName;
        private readonly IWebHostEnvironment _env;

        public DoctorDetailService(IOptions<MongoDbSettings> mongoDbSettings, IWebHostEnvironment env)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);

            _DoctorDetailCollection = mongoDatabase.GetCollection<DoctorDetail>(mongoDbSettings.Value.DoctorDetailCollectionName);
            _BranchCollection = mongoDatabase.GetCollection<Branch>(mongoDbSettings.Value.BranchCollectionName);
            _departmentCollection = mongoDatabase.GetCollection<Department>(mongoDbSettings.Value.DepartmentCollectionName);
            _specialtyCollection = mongoDatabase.GetCollection<Specialty>(mongoDbSettings.Value.SpecialtyCollectionName);
            _doctorCollection = mongoDatabase.GetCollection<Doctor>(mongoDbSettings.Value.DoctorCollectionName);
            _DoctorScheduleCollectionName = mongoDatabase.GetCollection<DoctorSchedule>(mongoDbSettings.Value.DoctorScheduleCollectionName);
            _env = env;
        }

        public async Task<List<DoctorDetail>> GetAllAsync() =>
            await _DoctorDetailCollection.Find(_ => true).ToListAsync();

        public async Task<DoctorDetail?> GetDoctorDetailByDoctorIdAsync(string doctorId) =>
            await _DoctorDetailCollection.Find(d => d.DoctorId == doctorId).FirstOrDefaultAsync();

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

            // Check Branch exists
            var branch = await _BranchCollection.Find(b => b.IdBranch == branchId.ToString()).FirstOrDefaultAsync();
            if (branch == null)
                return (false, $"Branch with id {dto.BranchId} not found", null);

            // Check Department exists
            var department = await _departmentCollection.Find(d => d.IdDepartment == departmentId.ToString()).FirstOrDefaultAsync();
            if (department == null)
                return (false, $"Department with id {dto.DepartmentId} not found", null);

            // Check Specialty exists
            var specialty = await _specialtyCollection.Find(s => s.IdSpecialty == specialtyId.ToString()).FirstOrDefaultAsync();
            if (specialty == null)
                return (false, $"Specialty with id {dto.SpecialtyId} not found", null);

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

            await _DoctorDetailCollection.InsertOneAsync(doctorDetail);
            return (true, null, doctorDetail);
        }

        public async Task<bool> UpdateAsync(string id, DoctorDetail updated)
        {
            var result = await _DoctorDetailCollection.ReplaceOneAsync(d => d.IdDoctorDetail == id, updated);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _DoctorDetailCollection.DeleteOneAsync(d => d.IdDoctorDetail == id);
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

            // Trả về đường dẫn dạng URL có thể dùng ở client
            return $"/uploads/{folderName}/{fileName}";
        }

        public async Task<List<DoctorSearchResultDto>> FindDoctorsByCriteriaAsync(string branchId, string departmentId, string? specialtyId = null)
        {
            var matchFilter = new BsonDocument();
            // Chỉ thêm điều kiện nếu ID là ObjectId hợp lệ
            if (ObjectId.TryParse(branchId, out var parsedBranchId))
                matchFilter.Add("branchId", parsedBranchId);
            else
                // Lỗi: branchId không hợp lệ, bạn có thể throw exception hoặc trả về danh sách rỗng
                // Ví dụ: throw new ArgumentException("Invalid Branch ID format", nameof(branchId));
                return new List<DoctorSearchResultDto>(); // Hoặc xử lý lỗi theo cách của bạn

            if (ObjectId.TryParse(departmentId, out var parsedDepartmentId))
                matchFilter.Add("departmentId", parsedDepartmentId);
            else
                // Lỗi: departmentId không hợp lệ
                // Ví dụ: throw new ArgumentException("Invalid Department ID format", nameof(departmentId));
                return new List<DoctorSearchResultDto>(); // Hoặc xử lý lỗi theo cách của bạn


            if (!string.IsNullOrEmpty(specialtyId) && ObjectId.TryParse(specialtyId, out var parsedSpecialtyObjectId))
            {
                matchFilter.Add("specialtyId", parsedSpecialtyObjectId);
            }
            else if (specialtyId == null) // Client muốn tìm những người không có chuyên khoa cụ thể (specialtyId là null trong DB)
            {
                matchFilter.Add("specialtyId", BsonNull.Value);
            }
            // Nếu specialtyId là chuỗi rỗng nhưng không phải null, hiện tại sẽ không lọc theo specialtyId.

            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$match", matchFilter),
                new BsonDocument("$lookup",
                    new BsonDocument
                    {
                        { "from", _doctorCollection.CollectionNamespace.CollectionName },
                        { "let", new BsonDocument("doctor_id_str", "$doctorId") },
                        { "pipeline", new BsonArray
                            {
                                new BsonDocument("$match",
                                    new BsonDocument("$expr",
                                        new BsonDocument("$eq", new BsonArray { "$_id", new BsonDocument("$toObjectId", "$$doctor_id_str") })
                                    )
                                ),
                                new BsonDocument("$project", // Các trường từ collection Doctor
                                   new BsonDocument
    {
        { "_id", 1 },
        { "name", 1 },
        { "gender", 1 },      // sửa lại chữ thường và giá trị là 1
        { "dateOfBirth", 1 },
        { "cccd", 1 },
        { "phone", 1 },       // sửa thành chữ thường
        { "email", 1 }        // sửa thành chữ thường
    })
                            }
                        },
                        { "as", "doctorInfoArray" }
                    }),
                new BsonDocument("$unwind",
                    new BsonDocument
                    {
                        { "path", "$doctorInfoArray" },
                        { "preserveNullAndEmptyArrays", false }
                    }),
                new BsonDocument("$project", // Định dạng kết quả cuối cùng thành DoctorSearchResultDto
                    new BsonDocument
                    {
                        // Tên các trường ở đây PHẢI KHỚP với tên thuộc tính trong DoctorSearchResultDto
                       { "_id", "$doctorInfoArray._id" },
// Sửa "Id" thành "id"
                     { "Name", "$doctorInfoArray.name" },          // Phải trùng với DTO
        { "Gender", "$doctorInfoArray.gender" },
        { "DateOfBirth", "$doctorInfoArray.dateOfBirth" },
        { "Cccd", "$doctorInfoArray.cccd" },
        { "Phone", "$doctorInfoArray.phone" },
        { "Email", "$doctorInfoArray.email" },
                        { "DoctorDetailRecordId", "$_id" },
                        { "DoctorImage", "$img" },
                        { "DoctorDegree", "$degree" },
                        { "WorkingAtBranch", "$branch" },
                        { "WorkingInDepartment", "$department" },
                        { "SpecializingIn", "$specialty" },
                        { "JobDescription", "$description" },
                        { "BranchIdRef", "$branchId" },
                        { "DepartmentIdRef", "$departmentId" },
                        { "SpecialtyIdRef", "$specialtyId" }
                    })
            };

            // SỬA ĐỔI Ở ĐÂY: Kiểu Generic cho Aggregate
            return await _DoctorDetailCollection.Aggregate<DoctorSearchResultDto>(pipeline).ToListAsync();
        }

        public async Task<List<DoctorSearchResultDto>> SearchDoctorsByCriteria(SearchDoctorCriteriaDto criteria)
        {
            return await FindDoctorsByCriteriaAsync(
                criteria.BranchId,
                criteria.DepartmentId,
                criteria.SpecialtyId
            );
        }


        // lấy full thông tin bác sĩ theo id
        public async Task<DoctorFullInfoDto?> GetDoctorFullInfoAsync(string doctorId)
        {
            var doctor = await _doctorCollection.Find(d => d.IdDoctor == doctorId).FirstOrDefaultAsync();
            if (doctor == null)
            {
                return null; // Hoặc throw exception nếu bạn muốn
            }
            var doctordetail = await _DoctorDetailCollection.Find(d => d.DoctorId == doctorId).FirstOrDefaultAsync();
            if (doctordetail == null)
            {
                return null; // Hoặc throw exception nếu bạn muốn
            }
            var doctorschedules = await _DoctorScheduleCollectionName.Find(d => d.DoctorId == doctorId).ToListAsync();

            string? branchName = null;
            string? departmentName = null;
            string? specialtyName = null;

            if (doctordetail?.BranchId != null)
            {
                var branch = await _BranchCollection.Find(b => b.IdBranch == doctordetail.BranchId).FirstOrDefaultAsync();
                branchName = branch?.BranchName;
            }

            if (doctordetail?.DepartmentId != null)
            {
                var department = await _departmentCollection.Find(d => d.IdDepartment == doctordetail.DepartmentId).FirstOrDefaultAsync();
                departmentName = department?.DepartmentName;
            }
            if (doctordetail?.SpecialtyId != null)
            {
                var specialty = await _specialtyCollection.Find(d => d.IdSpecialty == doctordetail.SpecialtyId).FirstOrDefaultAsync();
                specialtyName = specialty?.SpecialtyName;
            }


            return new DoctorFullInfoDto
            {
                Doctor = doctor,
                DoctorDetail = doctordetail,
                DoctorSchedules = doctorschedules,
                BranchName = branchName,
                DepartmentName = departmentName,
                SpecialtyName = specialtyName
            };

        }
    }
}
