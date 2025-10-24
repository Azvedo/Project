using Course_Sphere_api.Models;

namespace Course_Sphere_api.Repositories;

public class InMemoryLessonRepository : ILessonRepository
{
    private readonly List<Lesson> _lessons = new();

    public Task AddAsync(Lesson lesson)
    {
        _lessons.Add(lesson);
        return Task.CompletedTask;
    }

    public Task<List<Lesson>?> GetByCourseIdAsync(Guid courseId)
    {
        var list = _lessons.Where(l => l.CourseId == courseId).ToList();
        return Task.FromResult<List<Lesson>?>(list);
    }

    public Task RemoveAsync(Guid lessonId)
    {
        var l = _lessons.FirstOrDefault(x => x.Id == lessonId);
        if (l != null) _lessons.Remove(l);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Lesson lesson)
    {
        var idx = _lessons.FindIndex(x => x.Id == lesson.Id);
        if (idx >= 0) _lessons[idx] = lesson;
        return Task.CompletedTask;
    }
}
