using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace TaskApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController(AppDbContext db) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TaskItem>>> Get([FromQuery] string? status)
        {
            IQueryable<TaskItem> q = db.Tasks.OrderBy(t => t.Order);
            q = status switch
            {
                "completed" => q.Where(t => t.IsCompleted),
                "pending" => q.Where(t => !t.IsCompleted),
                _ => q
            };
            return Ok(await q.AsNoTracking().ToListAsync());
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<TaskItem>> GetById(int id)
        {
            var item = await db.Tasks.FindAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TaskItem>> Create(TaskItem item)
        {
            var max = await db.Tasks.MaxAsync(t => (int?)t.Order) ?? 0;
            item.Order = max + 1;

            db.Tasks.Add(item);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(Create), new { id = item.Id }, item);
        }

        [HttpPut("{id:int}")]
        [Authorize]
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
        [Authorize]
        public async Task<IActionResult> Toggle(int id)
        {
            var item = await db.Tasks.FindAsync(id);
            if (item is null) return NotFound();
            item.IsCompleted = !item.IsCompleted;
            await db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await db.Tasks.FindAsync(id);
            if (item is null) return NotFound();
            db.Tasks.Remove(item);
            await db.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id:int}/move")]
        [Authorize]
        public async Task<IActionResult> Move(int id, [FromQuery] string direction)
        {
            if (direction is not ("up" or "down")) return BadRequest("direction must be 'up' or 'down'.");

            using var tx = await db.Database.BeginTransactionAsync();

            var current = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (current is null) return NotFound();

            var neighborQuery = db.Tasks.AsQueryable();
            neighborQuery = direction == "up"
                ? neighborQuery.Where(t => t.Order < current.Order)
                               .OrderByDescending(t => t.Order)
                : neighborQuery.Where(t => t.Order > current.Order)
                               .OrderBy(t => t.Order);

            var neighbor = await neighborQuery.FirstOrDefaultAsync();
            if (neighbor is null) return NoContent(); 

            (current.Order, neighbor.Order) = (neighbor.Order, current.Order);
            await db.SaveChangesAsync();
            await tx.CommitAsync();
            return NoContent();
        }
    }
}
