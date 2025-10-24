
using Course_Sphere_api.Models;

namespace Course_Sphere_api.Dtos;

public record CourseCreateDto(string Title, string Description, DateTime StartDate, DateTime EndDate, List<User> Instructors);
public record CourseUpdateDto(string? Title, string? Description, DateTime? StartDate, DateTime? EndDate, List<User>? Instructors);
// Include CreatorId in read DTO so frontend can determine ownership/permissions
public record CourseReadDto(System.Guid Id, string Title, string Description, DateTime StartDate, DateTime EndDate, System.Guid CreatorId, List<User> Instructors);
