using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Course_Sphere_api.Models;
using Course_Sphere_api.Repositories;

namespace Course_Sphere_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonController : ControllerBase
{
    private readonly ILessonRepository _lessons;
    private readonly ICourseRepository _courses;
    private readonly IUserRepository _users;

    public LessonController(ILessonRepository lessons, ICourseRepository courses, IUserRepository users)
    {
        _lessons = lessons;
        _courses = courses;
        _users = users;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(Lesson lesson)
    {
        // ensure user is creator or instructor of the course
        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();
        var user = await _users.GetByUsernameAsync(username);
        if (user == null) return Unauthorized();

        var course = await _courses.GetByIdAsync(lesson.CourseId);
        if (course == null) return NotFound(new { message = "Course not found" });

        var isInstructor = course.CreatorId == user.Id || course.Instructors.Any(i => i.Id == user.Id);
        if (!isInstructor) return Forbid();

        // set creator id on lesson
        lesson.CreatorId = user.Id;
        await _lessons.AddAsync(lesson);
        return CreatedAtAction(nameof(GetByCourse), new { courseId = lesson.CourseId }, lesson);
    }

    [HttpGet("course/{courseId:guid}")]
    public async Task<IActionResult> GetByCourse(Guid courseId)
    {
        var list = await _lessons.GetByCourseIdAsync(courseId);
        return Ok(list ?? new List<Lesson>());
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Lesson updated)
    {
        var existingList = await _lessons.GetByCourseIdAsync(updated.CourseId);
        var existing = existingList?.FirstOrDefault(l => l.Id == id);
        if (existing == null) return NotFound();

        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();
        var user = await _users.GetByUsernameAsync(username);
        if (user == null) return Unauthorized();

        var course = await _courses.GetByIdAsync(updated.CourseId);
        if (course == null) return NotFound(new { message = "Course not found" });

        var canEdit = existing.CreatorId == user.Id || course.CreatorId == user.Id;
        if (!canEdit) return Forbid();

        updated.Id = id;
        updated.CreatorId = existing.CreatorId; // preserve original creator
        await _lessons.UpdateAsync(updated);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        // need to find lesson and check permissions
        // search all courses to locate lesson
        var allCourses = await _courses.GetAllAsync();
        Lesson? found = null;
        Guid courseId = Guid.Empty;
        foreach (var c in allCourses)
        {
            var list = await _lessons.GetByCourseIdAsync(c.Id);
            var l = list?.FirstOrDefault(x => x.Id == id);
            if (l != null) { found = l; courseId = c.Id; break; }
        }
        if (found == null) return NotFound();

        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();
        var user = await _users.GetByUsernameAsync(username);
        if (user == null) return Unauthorized();

        var course = await _courses.GetByIdAsync(courseId);
        if (course == null) return NotFound();

        var canDelete = found.CreatorId == user.Id || course.CreatorId == user.Id;
        if (!canDelete) return Forbid();

        await _lessons.RemoveAsync(id);
        return NoContent();
    }
}
