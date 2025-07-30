using backend.Models.ViewModel;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("Admin/[controller]")]
    public class PackagesController : Controller
    {
        private readonly IPackageService _packageService;

        public PackagesController(IPackageService packageService)
        {
            _packageService = packageService;
        }

        // GET: Admin/Packages
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var packages = await _packageService.GetAllPackages();
            return View(packages);
        }

        // GET: Admin/Packages/Details/5
        [HttpGet("Details/{id}")]
        public async Task<IActionResult> Details(string id)
        {
            var package = await _packageService.GetPackageById(id);
            if (package == null)
            {
                return NotFound();
            }
            return View(package);
        }

        // GET: Admin/Packages/Create
        [HttpGet("Create")]
        public async Task<IActionResult> Create()
        {
            ViewBag.Specialties = await _packageService.GetAllSpecialties();
            return View();
        }

        // POST: Admin/Packages/Create
        [HttpPost("Create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(PackageViewModel packageVM)
        {
            if (ModelState.IsValid)
            {
                await _packageService.CreatePackage(packageVM);
                TempData["Success"] = "Gói khám đã được tạo thành công!";
                return RedirectToAction(nameof(Index));
            }
            
            ViewBag.Specialties = await _packageService.GetAllSpecialties();
            return View(packageVM);
        }

        // GET: Admin/Packages/Edit/5
        [HttpGet("Edit/{id}")]
        public async Task<IActionResult> Edit(string id)
        {
            var package = await _packageService.GetPackageById(id);
            if (package == null)
            {
                return NotFound();
            }

            var packageVM = new PackageViewModel
            {
                IdPackage = package.IdPackage,
                PackageName = package.PackageName,
                Description = package.Description,
                Price = package.Price,
                DurationMinutes = package.DurationMinutes,
                IdSpecialty = package.Specialty?.IdSpecialty ?? string.Empty,
                SpecialtyName = package.Specialty?.SpecialtyName ?? string.Empty
            };

            ViewBag.Specialties = await _packageService.GetAllSpecialties();
            return View(packageVM);
        }

        // POST: Admin/Packages/Edit/5
        [HttpPost("Edit/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, PackageViewModel packageVM)
        {
            if (id != packageVM.IdPackage)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                await _packageService.UpdatePackage(id, packageVM);
                TempData["Success"] = "Gói khám đã được cập nhật thành công!";
                return RedirectToAction(nameof(Index));
            }
            
            ViewBag.Specialties = await _packageService.GetAllSpecialties();
            return View(packageVM);
        }

        // GET: Admin/Packages/Delete/5
        [HttpGet("Delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var package = await _packageService.GetPackageById(id);
            if (package == null)
            {
                return NotFound();
            }

            return View(package);
        }

        // POST: Admin/Packages/Delete/5
        [HttpPost("Delete/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            await _packageService.DeletePackage(id);
            TempData["Success"] = "Gói khám đã được xóa thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}