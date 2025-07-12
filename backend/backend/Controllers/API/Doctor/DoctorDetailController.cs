using Microsoft.AspNetCore.Mvc;
using backend.Models.Entities.Doctor;
using backend.Services;
using backend.Models.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;
using MongoDB.Bson;
using System;
using Microsoft.AspNetCore.Http;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorDetailController : ControllerBase
    {
        private readonly DoctorDetailService _doctorDetailService;

        public DoctorDetailController(DoctorDetailService doctorDetailService)
        {
            _doctorDetailService = doctorDetailService;
        }

        [HttpGet("all")]
        [ProducesResponseType(typeof(List<DoctorDetail>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var details = await _doctorDetailService.GetAllAsync();
            return Ok(details);
        }

        [HttpGet("by-doctor/{doctorId}")]
        [ProducesResponseType(typeof(DoctorDetail), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByDoctorId(string doctorId)
        {
            if (string.IsNullOrEmpty(doctorId) || !ObjectId.TryParse(doctorId, out _))
            {
                return BadRequest(new { message = "Valid Doctor ID is required." });
            }

            var detail = await _doctorDetailService.GetDoctorDetailByDoctorIdAsync(doctorId);
            if (detail == null)
            {
                return NotFound(new { message = $"No details found for Doctor ID: {doctorId}" });
            }
            return Ok(detail);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (string.IsNullOrEmpty(id) || !ObjectId.TryParse(id, out _))
                return BadRequest("Invalid ID");

            var detail = await _doctorDetailService.GetDoctorDetailByDoctorIdAsync(id);
            if (detail == null) return NotFound();

            return Ok(detail);
        }
        [HttpPost("create")]
        [ProducesResponseType(typeof(DoctorDetail), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromForm] DoctorDetailUploadDto dto)
        {
            if (string.IsNullOrEmpty(dto.DoctorId))
                return BadRequest(new { message = "DoctorId is required." });

            var (success, errorMessage, createdDetail) = await _doctorDetailService.CreateAsync(dto);

            if (!success)
            {
                return BadRequest(new { message = errorMessage ?? "Failed to create doctor detail." });
            }

            return CreatedAtAction(nameof(GetByDoctorId),
                new { doctorId = createdDetail!.DoctorId },
                createdDetail);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(string id, [FromBody] DoctorDetail detailToUpdate)
        {
            if (string.IsNullOrEmpty(id) || !ObjectId.TryParse(id, out _))
            {
                return BadRequest(new { message = "Valid Doctor Detail ID is required." });
            }
            if (id != detailToUpdate.IdDoctorDetail)
            {
                return BadRequest(new { message = "ID in URL must match ID in request body." });
            }

            var updated = await _doctorDetailService.UpdateAsync(id, detailToUpdate);
            if (!updated)
            {
                return NotFound(new { message = $"Doctor detail with ID {id} not found." });
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id) || !ObjectId.TryParse(id, out _))
            {
                return BadRequest(new { message = "Valid Doctor Detail ID is required." });
            }

            var deleted = await _doctorDetailService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = $"Doctor detail with ID {id} not found." });
            }
            return NoContent();
        }

        [HttpGet("search-by-criteria")]
        [ProducesResponseType(typeof(List<DoctorSearchResultDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SearchDoctorsByCriteria(
            [FromQuery] string branchId,
            [FromQuery] string departmentId,
            [FromQuery] string? specialtyId = null
        )
        {
            if (string.IsNullOrEmpty(branchId))
                return BadRequest(new { message = "Branch ID is required." });
            if (string.IsNullOrEmpty(departmentId))
                return BadRequest(new { message = "Department ID is required." });

            if (!ObjectId.TryParse(branchId, out _))
                return BadRequest(new { message = "Invalid Branch ID format." });
            if (!ObjectId.TryParse(departmentId, out _))
                return BadRequest(new { message = "Invalid Department ID format." });
            if (!string.IsNullOrEmpty(specialtyId) && !ObjectId.TryParse(specialtyId, out _))
                return BadRequest(new { message = "Invalid Specialty ID format." });

            try
            {
                var doctors = await _doctorDetailService.FindDoctorsByCriteriaAsync(branchId, departmentId, specialtyId);

                if (doctors == null || doctors.Count == 0)
                {
                    return NotFound(new { message = "No doctors found matching the specified criteria." });
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while searching doctors." });
            }
        }

        [HttpGet("full-info/{doctorId}")]
        [ProducesResponseType(typeof(DoctorFullInfoDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetFullInfo(string doctorId)
        {
            if (string.IsNullOrEmpty(doctorId) || !ObjectId.TryParse(doctorId, out _))
            {
                return BadRequest(new { message = "Valid Doctor ID is required." });
            }

            var fullInfo = await _doctorDetailService.GetDoctorFullInfoAsync(doctorId);
            if (fullInfo == null)
            {
                return NotFound(new { message = $"Doctor with ID {doctorId} not found." });
            }

            return Ok(fullInfo);
        }
    }
}