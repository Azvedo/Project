using Microsoft.AspNetCore.Mvc;
using Course_Sphere_api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Course_Sphere_api.Models;
using Course_Sphere_api.Repositories;
using Course_Sphere_api.Services;
using System.Security.Cryptography;

namespace Course_Sphere_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _users;
    private readonly ITokenService _tokens;

    public AuthController(IUserRepository users, ITokenService tokens)
    {
        _users = users;
        _tokens = tokens;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup(SignupRequest req)
    {
        Console.WriteLine($"Signup attempt: {req.Username}, {req.Email}");

        // basic validation
        if (string.IsNullOrWhiteSpace(req.Username)) return BadRequest(new { message = "Username is required" });
        if (string.IsNullOrWhiteSpace(req.Email)) return BadRequest(new { message = "Email is required" });
        if (!req.Email.Contains('@') || !req.Email.Contains('.')) return BadRequest(new { message = "Invalid email format" });
        if (string.IsNullOrEmpty(req.Password) || req.Password.Length < 6) return BadRequest(new { message = "Password must be at least 6 characters" });
        var existingByUsername = await _users.GetByUsernameAsync(req.Username);
        if (existingByUsername != null) return Conflict(new { message = "Username already taken" });

        var existingByEmail = await _users.GetByEmailAsync(req.Email);
        if (existingByEmail != null) return Conflict(new { message = "Email already registered" });

        var user = new User
        {
            Username = req.Username,
            Email = req.Email,
            PasswordHash = HashPassword(req.Password)
        };

        await _users.AddAsync(user);
        var token = _tokens.CreateToken(user.Username);
        return Ok(new AuthResponse(token, user.Id));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        Console.WriteLine($"Login attempt: {req.Email}");

        var user = await _users.GetByEmailAsync(req.Email);
        Console.WriteLine(user == null ? "User not found" : "User found");
        if (user == null) return Unauthorized(new { message = "Invalid credentials" });

        if (!VerifyPassword(req.Password, user.PasswordHash)) return Unauthorized(new { message = "Invalid credentials" });

        var token = _tokens.CreateToken(user.Username);
        return Ok(new AuthResponse(token, user.Id));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var user = await _users.GetByUsernameAsync(username);
        if (user == null) return NotFound();

        // don't return password hash
        return Ok(new { id = user.Id, name = user.Username, email = user.Email });
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _users.GetAllAsync();
        return Ok(users.Select(u => new { id = u.Id, name = u.Username, email = u.Email }));
    }

    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        return HashPassword(password) == storedHash;
    }
}
