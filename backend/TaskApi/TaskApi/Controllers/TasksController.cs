using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;

namespace TaskApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController(AppDbContext db) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> Get([FromQuery] string? status)
        {
            IQueryable<TaskItem> q = db.Tasks.OrderByDescending(t => t.Id);
            q = status switch
            {
                "completed" => q.Where(t => t.IsCompleted),
                "pending" => q.Where(t => !t.IsCompleted),
                _ => q
            };
            return Ok(await q.AsNoTracking().ToListAsync());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskItem>> GetById(int id)
        {
            var item = await db.Tasks.FindAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> Create(TaskItem item)
        {
            db.Tasks.Add(item);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(Create), new { id = item.Id }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, TaskItem input)
        {
            var item = await db.Tasks.FindAsync(id);
            if (item is null) return NotFound();

            item.Title = input.Title;
            item.Description = input.Description;
            item.IsCompleted = input.IsCompleted;
            await db.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id:int}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var item = await db.Tasks.FindAsync(id);
            if (item is null) return NotFound();
            item.IsCompleted = !item.IsCompleted;
            await db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await db.Tasks.FindAsync(id);
            if (item is null) return NotFound();
            db.Tasks.Remove(item);
            await db.SaveChangesAsync();
            return NoContent();
        }
    }
}
