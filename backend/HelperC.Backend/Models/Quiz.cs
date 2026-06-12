using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelperC.Backend.Models
{
    [Table("Quizzes")]
    public class Quiz
    {
        [Key]
        [MaxLength(100)]
        public string Id { get; set; } = string.Empty;

        [Required]
        public int ModuleId { get; set; }

        [ForeignKey(nameof(ModuleId))]
        public Module? Module { get; set; }

        [Required]
        public string Question { get; set; } = string.Empty;

        [Required]
        public List<string> Options { get; set; } = new();

        [Required]
        public int CorrectAnswerIndex { get; set; }

        public string? Image { get; set; }
    }
}
