using Course_Sphere_api.Models;

namespace Course_Sphere_api.Repositories;

public interface ICourseRepository
{
    Task<IEnumerable<Course>> GetAllAsync();
    Task<Course?> GetByIdAsync(Guid id);
    Task AddAsync(Course course);
    Task UpdateAsync(Course course);
    Task DeleteAsync(Guid id);
    Task<IEnumerable<User>> GetInstructorsByCourseIdAsync(Guid courseId);
    
}
