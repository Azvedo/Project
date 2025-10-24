using Course_Sphere_api.Models;

namespace Course_Sphere_api.Repositories;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
    Task<IEnumerable<User>> GetAllAsync();
}
