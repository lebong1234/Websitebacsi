using MongoDB.Driver;
using backend.Models.Entities.Doctor;
using Microsoft.Extensions.Options;
using backend.Data;
using backend.Settings;

namespace backend.Services

{
    public class DoctorScheduleService
    {
        private readonly IMongoCollection<DoctorSchedule> _doctorScheduleCollection;

        public DoctorScheduleService(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var client = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _doctorScheduleCollection = database.GetCollection<DoctorSchedule>(mongoDbSettings.Value.DoctorScheduleCollectionName);
        }

        public async Task<List<DoctorSchedule>> GetAllAsync() =>
            await _doctorScheduleCollection.Find(_ => true).ToListAsync();

        public async Task<List<DoctorSchedule>> GetDoctorScheduleByDoctorIdAsync(string doctorId) =>
            await _doctorScheduleCollection.Find(s => s.DoctorId == doctorId).ToListAsync();

        public async Task<DoctorSchedule?> GetByIdAsync(string id) =>
            await _doctorScheduleCollection.Find(s => s.IdDoctorSchedule == id).FirstOrDefaultAsync();

        public async Task AddAsync(DoctorSchedule schedule) =>
            await _doctorScheduleCollection.InsertOneAsync(schedule);

        public async Task<bool> UpdateAsync(string id, DoctorSchedule updated)
        {
            var result = await _doctorScheduleCollection.ReplaceOneAsync(s => s.IdDoctorSchedule == id, updated);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _doctorScheduleCollection.DeleteOneAsync(s => s.IdDoctorSchedule == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<DoctorSchedule?> GetByDoctorIdAndDateAsync(string doctorId, string date) =>
            await _doctorScheduleCollection.Find(s => s.DoctorId == doctorId && s.Date == date).FirstOrDefaultAsync();

        public async Task<bool> AddTimeSlotAsync(string doctorId, string date, DoctorSchedule.TimeSlot slot)
        {
            var filter = Builders<DoctorSchedule>.Filter.Where(s => s.DoctorId == doctorId && s.Date == date);
            var update = Builders<DoctorSchedule>.Update.Push(s => s.TimeSlots, slot);
            var result = await _doctorScheduleCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
            {
                // If no schedule for this date, create one
                var newSchedule = new DoctorSchedule
                {
                    DoctorId = doctorId,
                    Date = date,
                    TimeSlots = new List<DoctorSchedule.TimeSlot> { slot }
                };
                await _doctorScheduleCollection.InsertOneAsync(newSchedule);
                return true;
            }
            return result.ModifiedCount > 0;
        }

        public async Task<bool> UpdateTimeSlotAsync(string doctorId, string date, DoctorSchedule.TimeSlot slot)
        {
            var schedule = await GetByDoctorIdAndDateAsync(doctorId, date);
            if (schedule == null) return false;
            var slots = schedule.TimeSlots;
            var idx = slots.FindIndex(s => s.StartTime == slot.StartTime && s.EndTime == slot.EndTime);
            if (idx == -1) return false;
            slots[idx] = slot;
            var update = Builders<DoctorSchedule>.Update.Set(s => s.TimeSlots, slots);
            var filter = Builders<DoctorSchedule>.Filter.Where(s => s.DoctorId == doctorId && s.Date == date);
            var result = await _doctorScheduleCollection.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> RemoveTimeSlotAsync(string doctorId, string date, DoctorSchedule.TimeSlot slot)
        {
            var filter = Builders<DoctorSchedule>.Filter.Where(s => s.DoctorId == doctorId && s.Date == date);
            var update = Builders<DoctorSchedule>.Update.PullFilter(s => s.TimeSlots, s => s.StartTime == slot.StartTime && s.EndTime == slot.EndTime);
            var result = await _doctorScheduleCollection.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task DeleteAllByDoctorIdAsync(string doctorId)
        {
            await _doctorScheduleCollection.DeleteManyAsync(s => s.DoctorId == doctorId);
        }
    }
}
