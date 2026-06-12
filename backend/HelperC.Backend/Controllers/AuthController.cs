using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HelperC.Backend.Data;
using HelperC.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HelperC.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly HelperCDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(HelperCDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Реєстрація нового користувача (студента або викладача).
        /// Для викладача обов'язково перевіряється спеціальний секретний код доступу.
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Перевіряємо унікальність пошти
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "Користувач з такою поштою вже існує" });
            }

            string userRole = "student";
            // Якщо користувач реєструється як викладач, проводимо перевірку коду доступу з appsettings.json
            if (dto.Role?.ToLower() == "teacher")
            {
                var secretCode = _configuration["TeacherRegistrationCode"] ?? "TeacherSecretCode123";
                if (dto.TeacherAccessCode != secretCode)
                {
                    return BadRequest(new { message = "Невірний код реєстрації викладача" });
                }
                userRole = "teacher";
            }

            var user = new User
            {
                Email = dto.Email.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                MiddleName = dto.MiddleName?.Trim(),
                University = dto.University?.Trim(),
                AdmissionYear = dto.AdmissionYear,
                Group = dto.Group?.Trim(),
                Role = userRole,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = MapUserToDto(user, new List<QuizAttempt>())
            });
        }

        /// <summary>
        /// Авторизація користувача з перевіркою пароля через BCrypt.
        /// При успішному вході генерується безпечний сесійний JWT токен.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Пошук користувача та безпечне порівняння хешу пароля через BCrypt
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Невірний email або пароль" });
            }

            // Оновлюємо мітку останньої активності користувача
            user.LastActive = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var attempts = await _context.QuizAttempts
                .Where(qa => qa.UserId == user.Id)
                .ToListAsync();

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = MapUserToDto(user, attempts)
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var attempts = await _context.QuizAttempts
                .Where(qa => qa.UserId == user.Id)
                .ToListAsync();

            return Ok(MapUserToDto(user, attempts));
        }

        [Authorize]
        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = dto.FirstName.Trim();
            user.LastName = dto.LastName.Trim();
            user.MiddleName = dto.MiddleName?.Trim();
            user.University = dto.University?.Trim();
            user.AdmissionYear = dto.AdmissionYear;
            user.Group = dto.Group?.Trim();

            await _context.SaveChangesAsync();

            var attempts = await _context.QuizAttempts
                .Where(qa => qa.UserId == user.Id)
                .ToListAsync();

            return Ok(MapUserToDto(user, attempts));
        }

        [Authorize]
        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var currentUser = await _context.Users.FindAsync(userId);
            if (currentUser == null || currentUser.Role != "teacher")
            {
                return Forbid();
            }

            var students = await _context.Users
                .Where(u => u.Role == "student")
                .OrderBy(u => u.LastName)
                .ToListAsync();

            var studentIds = students.Select(s => s.Id).ToList();
            var allAttempts = await _context.QuizAttempts
                .Where(qa => studentIds.Contains(qa.UserId))
                .ToListAsync();

            var result = students.Select(s => MapUserToDto(s, allAttempts.Where(a => a.UserId == s.Id).ToList())).ToList();

            return Ok(result);
        }

        [HttpGet("teacher")]
        public async Task<IActionResult> GetTeacher()
        {
            var teacher = await _context.Users
                .Where(u => u.Role == "teacher")
                .FirstOrDefaultAsync();

            if (teacher == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                firstName = teacher.FirstName,
                lastName = teacher.LastName,
                email = teacher.Email
            });
        }

        /// <summary>
        /// Генерація сесійного JWT токена для автентифікації клієнтських запитів.
        /// Токен містить ідентифікатор, пошту та роль користувача.
        /// </summary>
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["Secret"] ?? "HelperCSharpSecretKeyWhichIsVeryLongAndSecure123!SuperSecureTokenKey";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            // Додаємо Claims, які будуть зашифровані в токені
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Використовуємо алгоритм шифрування HMAC-SHA256
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddDays(Convert.ToDouble(jwtSettings["ExpiryInDays"] ?? "7"));

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"] ?? "HelperC.Backend",
                audience: jwtSettings["Audience"] ?? "HelperC.Frontend",
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserDto MapUserToDto(User user, List<QuizAttempt> attempts)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                MiddleName = user.MiddleName,
                Role = user.Role,
                University = user.University,
                AdmissionYear = user.AdmissionYear,
                Group = user.Group,
                Progress = user.Progress,
                CompletedModules = user.CompletedModules,
                CreatedAt = user.CreatedAt,
                QuizAttempts = attempts.ToDictionary(
                    a => $"module_{a.ModuleId}",
                    a => new QuizAttemptDto
                    {
                        Score = a.Score,
                        Answers = a.Answers,
                        TakenAt = a.TakenAt
                    }
                )
            };
        }
    }
}
