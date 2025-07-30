using backend.Models.Entities;
using backend.Models.DTOs;
using backend.Data;
using MongoDB.Driver;

namespace backend.Services.GoogleAuth
{
    public class GoogleUserService : IGoogleUserService
    {
        private readonly MongoDbContext _mongoDbContext;

        public GoogleUserService(MongoDbContext mongoDbContext)
        {
            _mongoDbContext = mongoDbContext;
        }

        public async Task<backend.Models.Entities.User?> GetUserByGoogleIdAsync(string googleId)
        {
            return await _mongoDbContext.Users
                .Find(u => u.GoogleId == googleId)
                .FirstOrDefaultAsync();
        }

        public async Task<backend.Models.Entities.User?> GetUserByEmailAsync(string email)
        {
            return await _mongoDbContext.Users
                .Find(u => u.Email == email)
                .FirstOrDefaultAsync();
        }

        public async Task<backend.Models.Entities.User> CreateUserFromGoogleAsync(GooglePayload payload)
        {
            var user = new backend.Models.Entities.User
            {
                Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
                Email = payload.Email,
                FullName = payload.Name,
                GoogleId = payload.Subject,
                Name = payload.Name,
                Role = "Patient",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _mongoDbContext.Users.InsertOneAsync(user);
            return user;
        }

        public async Task<bool> LinkGoogleAccountAsync(string userId, string googleId, string name, string picture)
        {
            var update = Builders<backend.Models.Entities.User>.Update
                .Set(u => u.GoogleId, googleId)
                .Set(u => u.FullName, name)
                .Set(u => u.Name, name)
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            var result = await _mongoDbContext.Users.UpdateOneAsync(
                u => u.Id == userId,
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task<bool> UpdateUserAsync(backend.Models.Entities.User user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            
            var result = await _mongoDbContext.Users.ReplaceOneAsync(
                u => u.Id == user.Id,
                user
            );

            return result.ModifiedCount > 0;
        }
    }
}
