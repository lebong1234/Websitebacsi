using Microsoft.AspNetCore.Mvc;
using backend.Models.Entities.Doctor;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorScheduleController : ControllerBase
    {
        private readonly DoctorScheduleService _scheduleService;

        public DoctorScheduleController(DoctorScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll() =>
            Ok(await _scheduleService.GetAllAsync());

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetByDoctorId(string doctorId)
        {
            var schedules = await _scheduleService.GetDoctorScheduleByDoctorIdAsync(doctorId);
            foreach (var schedule in schedules)
            {
                schedule.TimeSlots = schedule.TimeSlots?.Where(ts => ts.IsAvailable && !ts.IsBooked).ToList() ?? new List<DoctorSchedule.TimeSlot>();
            }
            return Ok(schedules);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var schedule = await _scheduleService.GetByIdAsync(id);
            if (schedule == null)
                return NotFound();
            return Ok(schedule);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] DoctorSchedule schedule)
        {
            if (string.IsNullOrEmpty(schedule.DoctorId))
                return BadRequest("DoctorId is required.");

            await _scheduleService.AddAsync(schedule);
            return Ok(new { message = "Schedule created successfully", schedule });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] DoctorSchedule schedule)
        {
            var updated = await _scheduleService.UpdateAsync(id, schedule);
            if (!updated) return NotFound("Schedule not found.");
            return Ok(new { message = "Updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _scheduleService.DeleteAsync(id);
            if (!deleted) return NotFound("Schedule not found.");
            return Ok(new { message = "Deleted successfully" });
        }

        [HttpGet("doctor/{doctorId}/by-date")]
        public async Task<IActionResult> GetSchedulesByDoctorGroupedByDate(string doctorId)
        {
            var schedules = await _scheduleService.GetDoctorScheduleByDoctorIdAsync(doctorId);
            var grouped = schedules
                .GroupBy(s => s.Date)
                .ToDictionary(g => g.Key, g => g.Select(s => s.TimeSlots).SelectMany(x => x).ToList());
            return Ok(grouped);
        }

        // GET: api/DoctorSchedule/doctor/{doctorId}/date/{date}
        [HttpGet("doctor/{doctorId}/date/{date}")]
        public async Task<IActionResult> GetScheduleByDoctorAndDate(string doctorId, string date)
        {
            var schedule = await _scheduleService.GetByDoctorIdAndDateAsync(doctorId, date);
            if (schedule == null)
                return Ok(new List<DoctorSchedule.TimeSlot>()); // Không có lịch thì trả về mảng rỗng
            var slots = schedule.TimeSlots?.Where(ts => ts.IsAvailable && !ts.IsBooked).ToList() ?? new List<DoctorSchedule.TimeSlot>();
            return Ok(slots); // Trả về slot còn trống
        }

        [HttpPost("doctor/{doctorId}/date/{date}/add-slot")]
        public async Task<IActionResult> AddTimeSlot(string doctorId, string date, [FromBody] DoctorSchedule.TimeSlot slot)
        {
            var result = await _scheduleService.AddTimeSlotAsync(doctorId, date, slot);
            if (!result)
                return BadRequest("Could not add time slot.");
            return Ok(new { message = "Time slot added successfully" });
        }

        [HttpPut("doctor/{doctorId}/date/{date}/update-slot")]
        public async Task<IActionResult> UpdateTimeSlot(string doctorId, string date, [FromBody] DoctorSchedule.TimeSlot slot)
        {
            var result = await _scheduleService.UpdateTimeSlotAsync(doctorId, date, slot);
            if (!result)
                return BadRequest("Could not update time slot.");
            return Ok(new { message = "Time slot updated successfully" });
        }

        [HttpDelete("doctor/{doctorId}/date/{date}/remove-slot")]
        public async Task<IActionResult> RemoveTimeSlot(string doctorId, string date, [FromBody] DoctorSchedule.TimeSlot slot)
        {
            var result = await _scheduleService.RemoveTimeSlotAsync(doctorId, date, slot);
            if (!result)
                return BadRequest("Could not remove time slot.");
            return Ok(new { message = "Time slot removed successfully" });
        }
    }
}
