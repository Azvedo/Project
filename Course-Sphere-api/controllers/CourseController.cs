using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Course_Sphere_api.Dtos;
using Course_Sphere_api.Models;
using Course_Sphere_api.Repositories;

namespace Course_Sphere_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseController : ControllerBase
{
    private readonly ICourseRepository _courses;
    private readonly IUserRepository _users;

    public CourseController(ICourseRepository courses, IUserRepository users)
    {
        _courses = courses;
        _users = users;
    }

    [HttpGet]
    public async Task<IEnumerable<CourseReadDto>> Get()
    {
        var list = await _courses.GetAllAsync();
        return list.Select(c => new CourseReadDto(c.Id, c.Title, c.Description, c.StartDate, c.EndDate, c.CreatorId, c.Instructors));
    }
  
    [HttpPost]
    public async Task<IActionResult> Create(CourseCreateDto dto)
    {
        // set creator from JWT claim
        var username = User?.Identity?.Name;
        Guid creatorId = Guid.Empty;
        if (!string.IsNullOrEmpty(username))
        {
            var found = await _users.GetByUsernameAsync(username);
            if (found != null) creatorId = found.Id;
        }

        var course = new Course { Title = dto.Title, Description = dto.Description, StartDate = dto.StartDate, EndDate = dto.EndDate, CreatorId = creatorId, Instructors = dto.Instructors ?? new List<User>() };
        await _courses.AddAsync(course);
        return CreatedAtAction(nameof(GetById), new { id = course.Id }, new CourseReadDto(course.Id, course.Title, course.Description, course.StartDate, course.EndDate, course.CreatorId, course.Instructors));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var c = await _courses.GetByIdAsync(id);
        if (c == null) return NotFound();
        return Ok(new CourseReadDto(c.Id, c.Title, c.Description, c.StartDate, c.EndDate, c.CreatorId, c.Instructors));
    }

    
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, CourseUpdateDto dto)
    {
        var c = await _courses.GetByIdAsync(id);
        if (c == null) return NotFound();
        // only creator may update
        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();
        var user = await _users.GetByUsernameAsync(username);
        if (user == null) return Unauthorized();
        if (c.CreatorId != user.Id) return Forbid();

        c.Title = dto?.Title ?? c.Title;
        c.Description = dto?.Description ?? c.Description;
        c.StartDate = dto?.StartDate ?? c.StartDate;
        c.EndDate = dto?.EndDate ?? c.EndDate;
        c.Instructors = dto?.Instructors ?? c.Instructors;
        await _courses.UpdateAsync(c);
        return NoContent();
    }


    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var c = await _courses.GetByIdAsync(id);
        if (c == null) return NotFound();
        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();
        var user = await _users.GetByUsernameAsync(username);
        if (user == null) return Unauthorized();
        if (c.CreatorId != user.Id) return Forbid();

        await _courses.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("{id:guid}/instructors")]
    public async Task<IActionResult> GetInstructorsByCourseId(Guid id)
    {
        var instructors = await _courses.GetInstructorsByCourseIdAsync(id);
        if (instructors == null || !instructors.Any()) return NotFound();
        return Ok(instructors);
    }

}
