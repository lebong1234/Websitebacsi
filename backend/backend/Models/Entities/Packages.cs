using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities
{
    public class Packages
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string IdPackage { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string PackageName { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int DurationMinutes { get; set; }

        public SpecialtyRef? Specialty { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }

    public class SpecialtyRef
    {
        public string IdSpecialty { get; set; } = string.Empty;
        public string SpecialtyName { get; set; } = string.Empty;
    }
} 