using backend.Models.Entities;
using backend.Models.ViewModel;
using MongoDB.Driver;

namespace backend.Services
{
    public class SpecialtyService : ISpecialtyService
    {
        private readonly IMongoCollection<Specialty> _specialties;
        private readonly IMongoCollection<Department> _departments;

        public SpecialtyService(IMongoDatabase database)
        {
            _specialties = database.GetCollection<Specialty>("Specialties");
            _departments = database.GetCollection<Department>("Departments");
        }

        public async Task<List<Specialty>> GetAllSpecialties()
        {
            return await _specialties.Find(_ => true).ToListAsync();
        }

        public async Task<Specialty?> GetSpecialtyById(string id)
        {
            return await _specialties.Find(s => s.IdSpecialty == id).FirstOrDefaultAsync();
        }

        public async Task<Specialty> CreateSpecialty(SpecialtyViewModel specialtyVM)
        {
            var department = await _departments.Find(d => d.IdDepartment == specialtyVM.DepartmentId).FirstOrDefaultAsync();
            if (department == null) throw new Exception("Department not found");

            var specialty = new Specialty
            {
                SpecialtyName = specialtyVM.SpecialtyName,
                Description = specialtyVM.Description,
                Department = new DepartmentRef
                {
                    IdDepartment = department.IdDepartment,
                    DepartmentName = department.DepartmentName
                }
            };

            await _specialties.InsertOneAsync(specialty);
            return specialty;
        }

        public async Task UpdateSpecialty(string id, SpecialtyViewModel specialtyVM)
        {
            var specialty = await GetSpecialtyById(id);
            if (specialty == null) return;

            var department = await _departments.Find(d => d.IdDepartment == specialtyVM.DepartmentId).FirstOrDefaultAsync();
            if (department == null) throw new Exception("Department not found");

            specialty.SpecialtyName = specialtyVM.SpecialtyName;
            specialty.Description = specialtyVM.Description;
            specialty.Department = new DepartmentRef
            {
                IdDepartment = department.IdDepartment,
                DepartmentName = department.DepartmentName
            };
            specialty.UpdatedAt = DateTime.UtcNow;

            await _specialties.ReplaceOneAsync(s => s.IdSpecialty == id, specialty);
        }

        public async Task DeleteSpecialty(string id)
        {
            await _specialties.DeleteOneAsync(s => s.IdSpecialty == id);
        }
        public async Task<List<Specialty>> GetByDepartmentIdAsync(string departmentId)
        {
            return await _specialties.Find(s => s.Department != null && s.Department.IdDepartment == departmentId).ToListAsync();
        }

    }
}