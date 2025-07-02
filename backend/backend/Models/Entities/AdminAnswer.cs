using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend.Models.Entities
{
    public class AdminAnswer
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("AnswerId")]
        public int AnswerId { get; set; }

        [BsonElement("QuestionId")]
        public int QuestionId { get; set; }

        [BsonElement("AdminId")]
        public int AdminId { get; set; }

        [BsonElement("Answer")]
        public string AnswerText { get; set; } = string.Empty;

        [BsonElement("CreatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}