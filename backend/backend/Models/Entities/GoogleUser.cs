// backend/Models/Entities/User.cs
using System;
using System.ComponentModel.DataAnnotations; // Vẫn có thể dùng cho validation ở DTOs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Entities
{
    public class GoogleUser
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string GoogleId { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
        public string LoginProvider { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}