﻿using backend.Models.ViewModel;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class SpecialtiesController : Controller
    {
        private readonly ISpecialtyService _specialtyService;
        private readonly IDepartmentService _departmentService;

        public SpecialtiesController(ISpecialtyService specialtyService, IDepartmentService departmentService)
        {
            _specialtyService = specialtyService;
            _departmentService = departmentService;
        }

        public async Task<IActionResult> Index()
        {
            var specialties = await _specialtyService.GetAllSpecialties();
            return View(specialties);
        }

        public async Task<IActionResult> Details(string id)
        {
            var specialty = await _specialtyService.GetSpecialtyById(id);
            if (specialty == null) return NotFound();
            return View(specialty);
        }

        public async Task<IActionResult> Create()
        {
            var departments = await _departmentService.GetAllDepartments();
            ViewBag.Departments = departments;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(SpecialtyViewModel specialtyVM)
        {
            if (ModelState.IsValid)
            {
                await _specialtyService.CreateSpecialty(specialtyVM);
                return RedirectToAction(nameof(Index));
            }

            var departments = await _departmentService.GetAllDepartments();
            ViewBag.Departments = departments;
            return View(specialtyVM);
        }

        public async Task<IActionResult> Edit(string id)
        {
            var specialty = await _specialtyService.GetSpecialtyById(id);
            if (specialty == null) return NotFound();

            var departments = await _departmentService.GetAllDepartments();
            ViewBag.Departments = departments;

            var specialtyVM = new SpecialtyViewModel
            {
                SpecialtyName = specialty.SpecialtyName,
                Description = specialty.Description,
                DepartmentId = specialty.Department.IdDepartment
            };

            return View(specialtyVM);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, SpecialtyViewModel specialtyVM)
        {
            if (ModelState.IsValid)
            {
                await _specialtyService.UpdateSpecialty(id, specialtyVM);
                return RedirectToAction(nameof(Index));
            }

            var departments = await _departmentService.GetAllDepartments();
            ViewBag.Departments = departments;
            return View(specialtyVM);
        }

        public async Task<IActionResult> Delete(string id)
        {
            var specialty = await _specialtyService.GetSpecialtyById(id);
            if (specialty == null) return NotFound();
            return View(specialty);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            await _specialtyService.DeleteSpecialty(id);
            return RedirectToAction(nameof(Index));
        }
    }
}