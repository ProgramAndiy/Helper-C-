using System;
using System.Collections.Generic;

namespace HelperCSharp.Backend
{
    public class StudentProgress
    {
        public string StudentId { get; set; }
        public int CompletedTests { get; set; }
        public double AverageScore { get; set; }
    }

    public class ProgressMonitorService
    {
        // Симуляція "маленької частини на C#" для моніторингу прогресу
        public List<StudentProgress> GetTopStudents()
        {
            Console.WriteLine("Fetching progress from database...");
            return new List<StudentProgress>
            {
                new StudentProgress { StudentId = "ST-001", CompletedTests = 12, AverageScore = 95.5 },
                new StudentProgress { StudentId = "ST-002", CompletedTests = 10, AverageScore = 88.0 }
            };
        }
    }
}
