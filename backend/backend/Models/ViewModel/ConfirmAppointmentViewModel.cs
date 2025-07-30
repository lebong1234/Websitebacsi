using System;
using System.ComponentModel.DataAnnotations;

namespace backend.ViewModels.Booking
{
    public class ConfirmAppointmentViewModel
    {
        public required string IdConfirmAppointment { get; set; }

        [Required(ErrorMessage = "Doctor name is required")]
        public required string NameDr { get; set; }

        [Required(ErrorMessage = "Doctor ID is required")]
        public required string DoctorId { get; set; }

        [Required(ErrorMessage = "Time slot is required")]
        public required string Slot { get; set; }

        [Required(ErrorMessage = "Patient ID is required")]
        public required string PatientId { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string PatientEmail { get; set; }

        [Required(ErrorMessage = "Date is required")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public required string Symptoms { get; set; }

        // For search and filter functionality
        public required string SearchTerm { get; set; }
        public required string FilterDoctorId { get; set; }
        public DateTime? FilterDate { get; set; }
    }
}