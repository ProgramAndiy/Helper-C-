using System.Linq;
using System.Threading.Tasks;
using HelperC.Backend.Data;
using HelperC.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelperC.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModulesController : ControllerBase
    {
        private readonly HelperCDbContext _context;

        public ModulesController(HelperCDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetModules()
        {
            var modules = await _context.Modules
                .Include(m => m.Topics.OrderBy(t => t.Id))
                .Include(m => m.Quizzes.OrderBy(q => q.Id))
                .Include(m => m.Tasks.OrderBy(t => t.Id))
                .OrderBy(m => m.Order)
                .ToListAsync();

            return Ok(modules);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetModule(int id)
        {
            var module = await _context.Modules
                .Include(m => m.Topics.OrderBy(t => t.Id))
                .Include(m => m.Quizzes.OrderBy(q => q.Id))
                .Include(m => m.Tasks.OrderBy(t => t.Id))
                .FirstOrDefaultAsync(m => m.Id == id);

            if (module == null)
            {
                return NotFound();
            }

            return Ok(module);
        }

        [Authorize(Roles = "teacher")]
        [HttpPost("save")]
        public async Task<IActionResult> SaveModule([FromBody] Module module)
        {
            if (module == null)
            {
                return BadRequest();
            }

            var existing = await _context.Modules
                .Include(m => m.Topics)
                .Include(m => m.Quizzes)
                .Include(m => m.Tasks)
                .FirstOrDefaultAsync(m => m.Id == module.Id);

            if (existing == null)
            {
                // Create new module
                _context.Modules.Add(module);
            }
            else
            {
                // Update properties
                existing.Title = module.Title;
                existing.Description = module.Description;
                existing.Order = module.Order;

                // Sync Topics
                _context.Topics.RemoveRange(existing.Topics);
                foreach (var topic in module.Topics)
                {
                    topic.ModuleId = module.Id;
                    topic.Module = null; // Prevent EF circular ref issues
                    _context.Topics.Add(topic);
                }

                // Sync Quizzes
                _context.Quizzes.RemoveRange(existing.Quizzes);
                foreach (var quiz in module.Quizzes)
                {
                    quiz.ModuleId = module.Id;
                    quiz.Module = null;
                    _context.Quizzes.Add(quiz);
                }

                // Sync Tasks
                _context.Tasks.RemoveRange(existing.Tasks);
                foreach (var task in module.Tasks)
                {
                    task.ModuleId = module.Id;
                    task.Module = null;
                    _context.Tasks.Add(task);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(module);
        }

        [Authorize(Roles = "teacher")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModule(int id)
        {
            var module = await _context.Modules
                .Include(m => m.Topics)
                .Include(m => m.Quizzes)
                .Include(m => m.Tasks)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (module == null)
            {
                return NotFound();
            }

            // Remove related elements first
            _context.Topics.RemoveRange(module.Topics);
            _context.Quizzes.RemoveRange(module.Quizzes);
            _context.Tasks.RemoveRange(module.Tasks);
            
            // Remove module itself
            _context.Modules.Remove(module);

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
