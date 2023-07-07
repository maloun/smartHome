using smartHome_backend.Controllers;
using smartHome_backend.Data;
using JWTRefreshToken.NET6._0.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace JWTRefreshToken.NET6._0.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthenticateController> _logger;

        public AuthenticateController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ILogger<AuthenticateController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.password))
            {
                bool isConfirmed = await _userManager.IsEmailConfirmedAsync(user);
                if (!isConfirmed)
                {
                    return Unauthorized(new { reason = "email" });
                }
                    var userRoles = await _userManager.GetRolesAsync(user);
                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    }

                    var token = CreateToken(authClaims);
                    var refreshToken = GenerateRefreshToken();

                    _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

                    user.RefreshToken = refreshToken;
                    user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);

                    await _userManager.UpdateAsync(user);


                    CookieOptions option = new CookieOptions();
                    option.Expires = user.RefreshTokenExpiryTime;
                    HttpContext.Response.Cookies.Append("RefreshToken", refreshToken, option);
                    HttpContext.Response.Cookies.Append("Email", user.Email, option);
                    var userInfo = new { email = user.Email, id = user.Id, firstname = user.FirstName, lastName = user.LastName, vatherName = user.MidleName };
                    return Ok(new
                    {
                        Token = new JwtSecurityTokenHandler().WriteToken(token),
                        RefreshToken = refreshToken,
                        Expiration = token.ValidTo,
                        Roles = userRoles,
                        user = userInfo
                    });
                    
                
                
            }
            return Unauthorized(new {reason = "" });
        }


        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now;
            HttpContext.Response.Cookies.Append("RefreshToken", "", option);

            return Ok(new Response { Status = "Success", Message = "User logged out successfully!" });
        }

        [HttpGet]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken() 
        {
            string refreshToken = HttpContext.Request.Cookies["RefreshToken"];
            if (refreshToken == null || refreshToken == String.Empty)
            {
                return StatusCode(StatusCodes.Status511NetworkAuthenticationRequired, new Response { Status = "Error", Message = "Token not found." });
            }
            string email = HttpContext.Request.Cookies["Email"];
            if ( email == null || email == String.Empty)
            {
                return StatusCode(StatusCodes.Status511NetworkAuthenticationRequired, new Response { Status = "Error", Message = "Mail not found." });
            }
            var user = await _userManager.FindByNameAsync(email);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status511NetworkAuthenticationRequired, new Response { Status = "Error", Message = "User not found." });
            }
            if (refreshToken != user.RefreshToken)
            {
                return StatusCode(StatusCodes.Status511NetworkAuthenticationRequired, new Response { Status = "Error", Message = "Token not valid." });
            }
            bool isConfirmed = await _userManager.IsEmailConfirmedAsync(user);
            if (!isConfirmed)
            {
                return StatusCode(StatusCodes.Status511NetworkAuthenticationRequired, new Response { Status = "Error", Message = "User account not confirmed." });
            }
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }
            var token = CreateToken(authClaims);
            var newRefreshToken = GenerateRefreshToken();

            _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
            await _userManager.UpdateAsync(user);

            CookieOptions option = new CookieOptions();
            option.Expires = user.RefreshTokenExpiryTime;
            HttpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, option);
            HttpContext.Response.Cookies.Append("Email", user.Email, option);
            var userInfo = new { email = user.Email,  id = user.Id, firstname = user.FirstName, lastName = user.LastName, midleName = user.MidleName };
            return Ok(new
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refreshToken,
                Expiration = token.ValidTo,
                Roles = userRoles,
                user = userInfo
            });
        }


        [Authorize]
        [HttpGet]
        [Route("userInfo")]
        public async Task<IActionResult> UserInfo()
        {
            using (var serviceScope = ServiceActivator.GetScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                ApplicationUser user = await dbContext.Users.Where(u => u.Id == User.FindFirstValue(ClaimTypes.NameIdentifier)).FirstOrDefaultAsync();
                if (user == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Could not find user" });
                }
                await dbContext.SaveChangesAsync();
                return Ok(new { Name = user.FirstName,MidleName = user.MidleName, LastName = user.LastName });
            }
        }


        [Authorize]
        [HttpPost]
        [Route("revoke/{username}")]
        public async Task<IActionResult> Revoke(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return BadRequest("Invalid user name");

            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        [Authorize]
        [HttpPost]
        [Route("revoke-all")]
        public async Task<IActionResult> RevokeAll()
        {
            var users = _userManager.Users.ToList();
            foreach (var user in users)
            {
                user.RefreshToken = null;
                await _userManager.UpdateAsync(user);
            }

            return NoContent();
        }

        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = JwtHelper.GetJwtToken(
                                    _configuration["JWT:Secret"],
                                    _configuration["JWT:Issuer"],
                                    _configuration["JWT:Audience"],
                                    TimeSpan.FromMinutes(tokenValidityInMinutes),
                                    //TimeSpan.FromMinutes(60*8),
                                    authClaims.ToArray());

            return token;
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }

    }

    public class JwtHelper
    {
        public static JwtSecurityToken GetJwtToken(
            string signingKey,
            string issuer,
            string audience,
            TimeSpan expiration,
            Claim[] additionalClaims = null)
        {
            var claims = new[]
            {
            // this guarantees the token is unique
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            if (additionalClaims is object)
            {
                var claimList = new List<Claim>(claims);
                claimList.AddRange(additionalClaims);
                claims = claimList.ToArray();
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            return new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.Add(expiration),
                claims: claims,
                signingCredentials: creds
            );
        }
    }
}
