using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelperC.Backend.Models
{
    [Table("QuizAttempts")]
    public class QuizAttempt
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [Required]
        public int ModuleId { get; set; }

        [ForeignKey(nameof(ModuleId))]
        public Module? Module { get; set; }

        [Required]
        public int Score { get; set; }

        [Required]
        public List<int> Answers { get; set; } = new();

        public DateTime TakenAt { get; set; } = DateTime.UtcNow;
    }
}
