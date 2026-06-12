using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HelperC.Backend.Data;
using HelperC.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelperC.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProgressController : ControllerBase
    {
        private readonly HelperCDbContext _context;

        public ProgressController(HelperCDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Серверна перевірка відповідей на тести.
        /// Студент надсилає масив обраних індексів відповідей. Сервер самостійно звіряє їх 
        /// з базою даних, виключаючи підробку балів на стороні клієнта.
        /// </summary>
        [HttpPost("quiz")]
        public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmitDto dto)
        {
            // Перевіряємо JWT токен та отримуємо ID користувача
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Користувача не знайдено" });
            }

            var module = await _context.Modules
                .Include(m => m.Quizzes.OrderBy(q => q.Id))
                .FirstOrDefaultAsync(m => m.Id == dto.ModuleId);

            if (module == null)
            {
                return BadRequest(new { message = "Модуль не знайдено" });
            }

            var quizzes = module.Quizzes;
            if (quizzes.Count == 0)
            {
                return BadRequest(new { message = "У цьому модулі немає тестів" });
            }

            int correctCount = 0;
            var validationResults = new List<bool>();

            for (int i = 0; i < quizzes.Count; i++)
            {
                var quiz = quizzes[i];
                var selectedAnswerIndex = i < dto.Answers.Count ? dto.Answers[i] : -1;
                var isCorrect = selectedAnswerIndex == quiz.CorrectAnswerIndex;

                if (isCorrect)
                {
                    correctCount++;
                }
                validationResults.Add(isCorrect);
            }

            int scorePercent = (int)Math.Round((double)correctCount / quizzes.Count * 100);

            // Save attempt
            var existingAttempt = await _context.QuizAttempts
                .FirstOrDefaultAsync(qa => qa.UserId == userId && qa.ModuleId == dto.ModuleId);

            if (existingAttempt != null)
            {
                existingAttempt.Score = scorePercent;
                existingAttempt.Answers = dto.Answers;
                existingAttempt.TakenAt = DateTime.UtcNow;
            }
            else
            {
                var attempt = new QuizAttempt
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ModuleId = dto.ModuleId,
                    Score = scorePercent,
                    Answers = dto.Answers,
                    TakenAt = DateTime.UtcNow
                };
                _context.QuizAttempts.Add(attempt);
            }

            await _context.SaveChangesAsync();

            return Ok(new QuizResultResponseDto
            {
                Score = scorePercent,
                CorrectCount = correctCount,
                TotalCount = quizzes.Count,
                ValidationResults = validationResults
            });
        }

        /// <summary>
        /// Фіксація успішного виконання практичного завдання в вбудованій IDE.
        /// Зберігає код студента та зараховує модуль.
        /// </summary>
        [HttpPost("task")]
        public async Task<IActionResult> CompleteTask([FromBody] TaskCompletionDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Користувача не знайдено" });
            }

            // Save submissions
            if (dto.Submissions != null && dto.Submissions.Any())
            {
                foreach (var sub in dto.Submissions)
                {
                    var submission = new TaskSubmission
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        ModuleId = dto.ModuleId,
                        TaskId = sub.TaskId,
                        Code = sub.Code,
                        IsSuccessful = sub.IsSuccessful,
                        SubmittedAt = DateTime.UtcNow
                    };
                    _context.TaskSubmissions.Add(submission);
                }
            }

            var totalModulesCount = await _context.Modules.CountAsync();
            if (totalModulesCount == 0) totalModulesCount = 9;

            if (!user.CompletedModules.Contains(dto.ModuleId))
            {
                user.CompletedModules.Add(dto.ModuleId);
                user.Progress = (int)Math.Round((double)user.CompletedModules.Count / totalModulesCount * 100);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                progress = user.Progress,
                completedModules = user.CompletedModules
            });
        }
    }

    public class TaskCompletionDto
    {
        public int ModuleId { get; set; }
        public List<TaskSubmissionDto> Submissions { get; set; } = new();
    }

    public class TaskSubmissionDto
    {
        public int TaskId { get; set; }
        public string Code { get; set; } = string.Empty;
        public bool IsSuccessful { get; set; }
    }
}
