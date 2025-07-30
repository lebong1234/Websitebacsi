using backend.Models.Entities;
using backend.Models.ViewModel;
using backend.Settings;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace backend.Services
{
    public class PackageService : IPackageService
    {
        private readonly IMongoCollection<Packages> _packages;
        private readonly IMongoCollection<Specialty> _specialties;

        public PackageService(IMongoDatabase database, IOptions<MongoDbSettings> mongoDbSettings)
        {
            var settings = mongoDbSettings.Value;
            _packages = database.GetCollection<Packages>(settings.Collections.Packages);
            _specialties = database.GetCollection<Specialty>(settings.Collections.Specialties);
        }

         public async Task<List<Packages>> GetAllPackages()
        {
            var packages = await _packages.Find(_ => true).ToListAsync();
            
            // Join với bảng Specialties để lấy tên chuyên khoa
            foreach (var package in packages)
            {
                if (package.Specialty?.IdSpecialty != null)
                {
                    var specialty = await _specialties.Find(s => s.IdSpecialty == package.Specialty.IdSpecialty).FirstOrDefaultAsync();
                    if (specialty != null)
                    {
                        package.Specialty.SpecialtyName = specialty.SpecialtyName;
                    }
                }
            }
            
            return packages;
        }

        public async Task<Packages?> GetPackageById(string id)
        {
            var package = await _packages.Find(p => p.IdPackage == id).FirstOrDefaultAsync();
            
            if (package?.Specialty?.IdSpecialty != null)
            {
                var specialty = await _specialties.Find(s => s.IdSpecialty == package.Specialty.IdSpecialty).FirstOrDefaultAsync();
                if (specialty != null)
                {
                    package.Specialty.SpecialtyName = specialty.SpecialtyName;
                }
            }
            
            return package;
        }
        public async Task CreatePackage(PackageViewModel packageVM)
        {
            var package = new Packages
            {
                PackageName = packageVM.PackageName,
                Description = packageVM.Description,
                Price = packageVM.Price,
                DurationMinutes = packageVM.DurationMinutes,
                Specialty = new SpecialtyRef
                {
                    IdSpecialty = packageVM.IdSpecialty ?? string.Empty,
                    SpecialtyName = packageVM.SpecialtyName ?? string.Empty
                }
            };

            await _packages.InsertOneAsync(package);
        }

        public async Task UpdatePackage(string id, PackageViewModel packageVM)
        {
            var update = Builders<Packages>.Update
                .Set(p => p.PackageName, packageVM.PackageName)
                .Set(p => p.Description, packageVM.Description)
                .Set(p => p.Price, packageVM.Price)
                .Set(p => p.DurationMinutes, packageVM.DurationMinutes)
                .Set(p => p.Specialty, new SpecialtyRef
                {
                    IdSpecialty = packageVM.IdSpecialty ?? string.Empty,
                    SpecialtyName = packageVM.SpecialtyName ?? string.Empty
                })
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _packages.UpdateOneAsync(p => p.IdPackage == id, update);
        }

        public async Task DeletePackage(string id)
        {
            await _packages.DeleteOneAsync(p => p.IdPackage == id);
        }

        public async Task<int> CountPackagesAsync()
        {
            return (int)await _packages.CountDocumentsAsync(_ => true);
        }

        public async Task<List<Specialty>> GetAllSpecialties()
        {
            return await _specialties.Find(_ => true).ToListAsync();
        }

        public async Task<Specialty> GetSpecialtyById(string id)
        {
            return await _specialties.Find(s => s.IdSpecialty == id).FirstOrDefaultAsync();
        }
    }
}
