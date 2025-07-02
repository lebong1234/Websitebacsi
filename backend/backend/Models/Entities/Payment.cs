using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend.Models.Entities
{
    public class Payment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("PaymentId")]
        public int PaymentId { get; set; }

        [BsonElement("BookingId")]
        public int BookingId { get; set; }

        [BsonElement("UserId")]
        public int UserId { get; set; }

        [BsonElement("Amount")]
        public decimal Amount { get; set; }

        [BsonElement("PaymentMethod")]
        public string PaymentMethod { get; set; } = string.Empty;

        [BsonElement("PaymentDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime PaymentDate { get; set; }

        [BsonElement("PaymentStatus")]
        public string PaymentStatus { get; set; } = string.Empty;

        [BsonElement("TransactionId")]
        public string TransactionId { get; set; } = string.Empty;

        [BsonElement("CreatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("UpdatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}