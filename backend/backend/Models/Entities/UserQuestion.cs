using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend.Models.Entities
{
    public class UserQuestion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string IdQuestion { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("UserId")]
        public int UserId { get; set; }

        [BsonElement("Question")]
        public string QuestionText { get; set; } = string.Empty;

        [BsonElement("Status")]
        public string Status { get; set; } = "Chưa trả lời"; // Default value

        [BsonElement("CreatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("UpdatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}