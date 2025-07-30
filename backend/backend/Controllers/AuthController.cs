using backend.Models.Entities;
using backend.Services.GoogleAuth;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Data;
using MongoDB.Driver;
using System.Security.Cryptography;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IGoogleAuthService _googleAuthService;
        private readonly IGoogleUserService _googleUserService;
        private readonly ILogger<AuthController> _logger;
        private readonly MongoDbContext _mongoDbContext;
        private readonly IConfiguration _configuration;

        public AuthController(
            IGoogleAuthService googleAuthService,
            IGoogleUserService googleUserService,
            ILogger<AuthController> logger,
            MongoDbContext mongoDbContext,
            IConfiguration configuration)
        {
            _googleAuthService = googleAuthService;
            _googleUserService = googleUserService;
            _logger = logger;
            _mongoDbContext = mongoDbContext;
            _configuration = configuration;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.IdToken))
            {
                _logger.LogWarning("GoogleSignIn: ID token is missing.");
                return BadRequest(new { message = "ID token is required." });
            }

            try
            {
                // Verify Google ID token
                var googlePayload = await _googleAuthService.VerifyGoogleTokenAsync(request.IdToken);

                if (googlePayload == null)
                {
                    _logger.LogWarning("GoogleSignIn: Failed to verify Google token.");
                    return Unauthorized(new { message = "Invalid Google token." });
                }

                _logger.LogInformation("GoogleSignIn: Google token verified. User Email: {Email}, GoogleID: {GoogleID}", 
                    googlePayload.Email, googlePayload.Subject);

                // Check if user exists
                backend.Models.Entities.User? user = await _googleUserService.GetUserByGoogleIdAsync(googlePayload.Subject);

                if (user == null)
                {
                    _logger.LogInformation("GoogleSignIn: User not found by GoogleID. Checking by email: {Email}", googlePayload.Email);
                    user = await _googleUserService.GetUserByEmailAsync(googlePayload.Email);

                    if (user != null)
                    {
                        // Link Google account to existing user
                        if (string.IsNullOrEmpty(user.GoogleId))
                        {
                            bool linkSuccess = await _googleUserService.LinkGoogleAccountAsync(
                                user.Id, googlePayload.Subject, googlePayload.Name, googlePayload.Picture);
                            
                            if (linkSuccess)
                            {
                                user.GoogleId = googlePayload.Subject;
                                user.FullName = googlePayload.Name;
                                user.Name = googlePayload.Name;
                                _logger.LogInformation("GoogleSignIn: Successfully linked Google ID {GoogleID} to existing user ID {UserId}", 
                                    googlePayload.Subject, user.Id);
                            }
                            else
                            {
                                return StatusCode(500, new { message = "Failed to link Google account." });
                            }
                        }
                        else if (user.GoogleId != googlePayload.Subject)
                        {
                            return Conflict(new { message = "This email is already linked to a different Google account." });
                        }
                    }
                    else
                    {
                        // Create new user
                        user = await _googleUserService.CreateUserFromGoogleAsync(googlePayload);
                        _logger.LogInformation("GoogleSignIn: New user created with ID: {UserId}", user.Id);
                    }
                }
                else
                {
                    // Update existing user info
                    bool needsUpdate = false;
                    if (user.FullName != googlePayload.Name && !string.IsNullOrEmpty(googlePayload.Name))
                    {
                        user.FullName = googlePayload.Name;
                        user.Name = googlePayload.Name;
                        needsUpdate = true;
                    }
                    if (user.Email != googlePayload.Email)
                    {
                        user.Email = googlePayload.Email;
                        needsUpdate = true;
                    }

                    if (needsUpdate)
                    {
                        user.UpdatedAt = DateTime.UtcNow;
                        await _googleUserService.UpdateUserAsync(user);
                    }
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                // Save refresh token to database
                await SaveRefreshToken(user.Id, refreshToken);

                var userDto = new GoogleUserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role
                };

                return Ok(new
                {
                    token = token,
                    refreshToken = refreshToken,
                    userId = user.Id,
                    user = userDto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Google sign in");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Implement your login logic here
                // This is a placeholder - you'll need to implement actual user authentication
                var user = await _mongoDbContext.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
                
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid credentials." });
                }

                // Verify password (implement your password verification logic)
                // if (!VerifyPassword(request.Password, user.PasswordHash))
                // {
                //     return Unauthorized(new { message = "Invalid credentials." });
                // }

                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                await SaveRefreshToken(user.Id, refreshToken);

                return Ok(new
                {
                    token = token,
                    refreshToken = refreshToken,
                    userId = user.Id,
                    user = new
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FullName = user.FullName,
                        Role = user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _mongoDbContext.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    return BadRequest(new { message = "User already exists." });
                }

                // Create new user
                var user = new backend.Models.Entities.User
                {
                    Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
                    Email = request.Email,
                    FullName = request.FullName,
                    PasswordHash = HashPassword(request.Password), // Implement password hashing
                    Role = "Patient",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _mongoDbContext.Users.InsertOneAsync(user);

                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                await SaveRefreshToken(user.Id, refreshToken);

                return CreatedAtAction(nameof(Register), new
                {
                    token = token,
                    refreshToken = refreshToken,
                    userId = user.Id,
                    user = new
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FullName = user.FullName,
                        Role = user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var refreshToken = await GetRefreshToken(request.RefreshToken);
                if (refreshToken == null)
                {
                    return Unauthorized(new { message = "Invalid refresh token." });
                }

                var user = await _mongoDbContext.Users.Find(u => u.Id == refreshToken.UserId).FirstOrDefaultAsync();
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found." });
                }

                var newToken = GenerateJwtToken(user);
                var newRefreshToken = GenerateRefreshToken();

                // Remove old refresh token and save new one
                await RemoveRefreshToken(request.RefreshToken);
                await SaveRefreshToken(user.Id, newRefreshToken);

                return Ok(new
                {
                    token = newToken,
                    refreshToken = newRefreshToken
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                var user = await _mongoDbContext.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                return Ok(new
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            try
            {
                if (!string.IsNullOrEmpty(request.RefreshToken))
                {
                    await RemoveRefreshToken(request.RefreshToken);
                }

                return Ok(new { message = "Logout successful." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        private string GenerateJwtToken(backend.Models.Entities.User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-here");
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task SaveRefreshToken(string userId, string refreshToken)
        {
            // Implement saving refresh token to database
            // This is a placeholder - you'll need to create a RefreshToken collection
        }

        private async Task<RefreshToken?> GetRefreshToken(string token)
        {
            // Implement getting refresh token from database
            // This is a placeholder
            return null;
        }

        private async Task RemoveRefreshToken(string token)
        {
            // Implement removing refresh token from database
            // This is a placeholder
        }

        private string HashPassword(string password)
        {
            // Implement password hashing
            // This is a placeholder
            return password;
        }
    }

    // DTOs
    public class GoogleSignInRequest
    {
        public string IdToken { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class LogoutRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class RefreshToken
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}