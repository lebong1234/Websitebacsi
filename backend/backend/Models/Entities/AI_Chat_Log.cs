using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend.Models.Entities
{
    public class AI_Chat_Log
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("LogId")]
        public int LogId { get; set; }

        [BsonElement("UserId")]
        public int UserId { get; set; }

        [BsonElement("Question")]
        public string Question { get; set; } = string.Empty;

        [BsonElement("AIResponse")]
        public string AIResponse { get; set; } = string.Empty;

        [BsonElement("CreatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}