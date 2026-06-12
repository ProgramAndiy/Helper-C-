using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelperC.Backend.Models
{
    [Table("TaskSubmissions")]
    public class TaskSubmission
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [Required]
        public int ModuleId { get; set; }

        [ForeignKey(nameof(ModuleId))]
        public Module? Module { get; set; }

        [Required]
        public int TaskId { get; set; }

        [ForeignKey(nameof(TaskId))]
        public CourseTask? Task { get; set; }

        [Required]
        public string Code { get; set; } = string.Empty;

        public bool IsSuccessful { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
