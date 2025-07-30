using backend.Models.Entities;
using backend.Models.DTOs;

namespace backend.Services.GoogleAuth
{
    public interface IGoogleUserService
    {
        Task<backend.Models.Entities.User?> GetUserByGoogleIdAsync(string googleId);
        Task<backend.Models.Entities.User?> GetUserByEmailAsync(string email);
        Task<backend.Models.Entities.User> CreateUserFromGoogleAsync(GooglePayload payload);
        Task<bool> LinkGoogleAccountAsync(string userId, string googleId, string name, string picture);
        Task<bool> UpdateUserAsync(backend.Models.Entities.User user);
    }
}
