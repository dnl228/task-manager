using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TaskApi.Controllers
{
    public record LoginRequest(string Username, string Password);
    public record LoginResponse(string Token);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IConfiguration config) : ControllerBase
    {
        [HttpPost("login")]
        public ActionResult<LoginResponse> Login(LoginRequest req)
        {
            var valid = (req.Username == "admin" && req.Password == "admin123")
                     || (req.Username == "user" && req.Password == "user123");

            if (!valid) return Unauthorized();

            var jwt = BuildToken(req.Username, config);
            return Ok(new LoginResponse(jwt));
        }

        private static string BuildToken(string username, IConfiguration config)
        {
            var jwtSection = config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(ClaimTypes.Name, username)
        };

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
