namespace Course_Sphere_api.Services;

public interface ITokenService
{
    string CreateToken(string username);
}
