using Microsoft.EntityFrameworkCore;
using HelperC.Backend.Models;

namespace HelperC.Backend.Data
{
    public class HelperCDbContext : DbContext
    {
        public HelperCDbContext(DbContextOptions<HelperCDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Module> Modules { get; set; } = null!;
        public DbSet<Topic> Topics { get; set; } = null!;
        public DbSet<Quiz> Quizzes { get; set; } = null!;
        public DbSet<CourseTask> Tasks { get; set; } = null!;
        public DbSet<QuizAttempt> QuizAttempts { get; set; } = null!;
        public DbSet<TaskSubmission> TaskSubmissions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
