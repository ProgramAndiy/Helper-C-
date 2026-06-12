using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelperC.Backend.Models
{
    [Table("Modules")]
    public class Module
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public int Order { get; set; }

        public List<Topic> Topics { get; set; } = new();
        public List<Quiz> Quizzes { get; set; } = new();
        public List<CourseTask> Tasks { get; set; } = new();
    }
}
