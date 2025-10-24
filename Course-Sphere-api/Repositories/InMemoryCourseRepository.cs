using Course_Sphere_api.Models;

namespace Course_Sphere_api.Repositories;

public class InMemoryCourseRepository : ICourseRepository
{
    private readonly List<Course> _courses = new();

    public Task AddAsync(Course course)
    {
        _courses.Add(course);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id)
    {
        var c = _courses.FirstOrDefault(x => x.Id == id);
        if (c != null) _courses.Remove(c);
        return Task.CompletedTask;
    }

    public Task<IEnumerable<Course>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<Course>>(_courses);
    }

    public Task<Course?> GetByIdAsync(Guid id)
    {
        var c = _courses.FirstOrDefault(x => x.Id == id);
        return Task.FromResult(c);
    }
    public Task UpdateAsync(Course course)
    {
        var idx = _courses.FindIndex(x => x.Id == course.Id);
        if (idx >= 0) _courses[idx] = course;
        return Task.CompletedTask;
    }
    public Task<IEnumerable<User>> GetInstructorsByCourseIdAsync(Guid courseId)
    {
        var course = _courses.FirstOrDefault(c => c.Id == courseId);
        IEnumerable<User> instructors = course?.Instructors?.OfType<User>() ?? Enumerable.Empty<User>();
        return Task.FromResult(instructors);
    }
}

