using backend.Models.Entities;
using backend.Models.ViewModel;

namespace backend.Services
{
    public interface IPackageService
    {
        Task<List<Packages>> GetAllPackages();
        Task<Packages?> GetPackageById(string id);
        Task CreatePackage(PackageViewModel packageVM);
        Task UpdatePackage(string id, PackageViewModel packageVM);
        Task DeletePackage(string id);
        Task<int> CountPackagesAsync();
        Task<List<Specialty>> GetAllSpecialties();
        Task<Specialty> GetSpecialtyById(string id);
    }
}