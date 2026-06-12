using System;
using System.Collections.Generic;

namespace HelperC.Backend.Models
{
    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string? University { get; set; }
        public int? AdmissionYear { get; set; }
        public string? Group { get; set; }
        public string? Role { get; set; } // "student" or "teacher"
        public string? TeacherAccessCode { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string Role { get; set; } = string.Empty;
        public string? University { get; set; }
        public int? AdmissionYear { get; set; }
        public string? Group { get; set; }
        public int Progress { get; set; }
        public List<int> CompletedModules { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public Dictionary<string, QuizAttemptDto> QuizAttempts { get; set; } = new();
    }

    public class QuizAttemptDto
    {
        public int Score { get; set; }
        public List<int> Answers { get; set; } = new();
        public DateTime TakenAt { get; set; }
    }

    public class ProfileUpdateDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string? University { get; set; }
        public int? AdmissionYear { get; set; }
        public string? Group { get; set; }
    }

    public class QuizSubmitDto
    {
        public int ModuleId { get; set; }
        public List<int> Answers { get; set; } = new();
    }

    public class QuizResultResponseDto
    {
        public int Score { get; set; }
        public int CorrectCount { get; set; }
        public int TotalCount { get; set; }
        public List<bool> ValidationResults { get; set; } = new();
    }
}
