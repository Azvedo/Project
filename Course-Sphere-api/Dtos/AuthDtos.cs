namespace Course_Sphere_api.Dtos;

public record SignupRequest(string Username, string Email, string Password);
public record LoginRequest(string Email, string Password);
// Return token and created user id so clients can reference the new user
public record AuthResponse(string Token, System.Guid Id);
