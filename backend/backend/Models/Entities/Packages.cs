using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend.Models.Entities
{
    public class Packages
    {
        [BsonId]
        [BsonElement("IdPackage")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string IdPackage { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("PackageName")]
        public string PackageName { get; set; } = string.Empty;

        [BsonElement("Description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("Price")]
        public decimal Price { get; set; }

        [BsonElement("DurationMinutes")]
        public int DurationMinutes { get; set; }

        [BsonElement("Specialty")]
        public SpecialtyRef? Specialty { get; set; } // Reference to Specialty as a foreign key-like structure

        [BsonElement("CreatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("UpdatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class SpecialtyRef
    {
        [BsonElement("IdSpecialty")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? IdSpecialty { get; set; }

        [BsonElement("SpecialtyName")]
        public string? SpecialtyName { get; set; }
    }
}
