using backend.Models.DTOs;

namespace backend.Services.GoogleAuth
{
    public interface IGoogleAuthService
    {
        Task<GooglePayload?> VerifyGoogleTokenAsync(string idToken);
    }
} 