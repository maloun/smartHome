﻿using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{

    public string FirstName { get; set; }

    public string MidleName { get; set; }

    public string LastName { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }

    public string ServiceToken {get;set;}

}