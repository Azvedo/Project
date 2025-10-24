using Course_Sphere_api.Models;

namespace Course_Sphere_api.Repositories
{
    public interface ILessonRepository
    {
        Task AddAsync(Lesson lesson);
        Task<List<Lesson>?> GetByCourseIdAsync(Guid courseId);
        Task RemoveAsync(Guid lessonId);
        Task UpdateAsync(Lesson lesson);
    }
}