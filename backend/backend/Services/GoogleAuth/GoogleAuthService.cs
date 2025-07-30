using backend.Models.DTOs;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Text;

namespace backend.Services.GoogleAuth
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public GoogleAuthService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public async Task<GooglePayload?> VerifyGoogleTokenAsync(string idToken)
        {
            try
            {
                var clientId = _configuration["Google:ClientId"];
                var url = $"https://oauth2.googleapis.com/tokeninfo?id_token={idToken}";

                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                var content = await response.Content.ReadAsStringAsync();
                var tokenInfo = JsonSerializer.Deserialize<GoogleTokenInfo>(content);

                if (tokenInfo == null || tokenInfo.Aud != clientId)
                {
                    return null;
                }

                return new GooglePayload
                {
                    Subject = tokenInfo.Sub,
                    Email = tokenInfo.Email,
                    Name = tokenInfo.Name,
                    Picture = tokenInfo.Picture,
                    EmailVerified = tokenInfo.EmailVerified
                };
            }
            catch (Exception)
            {
                return null;
            }
        }
    }

    public class GoogleTokenInfo
    {
        public string Sub { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public string Aud { get; set; } = string.Empty;
        public bool EmailVerified { get; set; }
    }
}