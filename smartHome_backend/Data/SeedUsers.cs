using smartHome_backend.Data;
using Microsoft.AspNetCore.Identity;
using smartHome_backend.Controllers;

namespace smartHome_backend.Data
{
    public class SeedUser
    {
        
        public static async void Initialize()
        {
            using (var serviceScope = ServiceActivator.GetScope())
            {

                var dbContext = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                var userManager = serviceScope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
                var roleManager = serviceScope.ServiceProvider.GetService<RoleManager<IdentityRole>>();

                // Create roles if not already role with that name exists
                string[] roles = new string[] { "Customer", "Admin" };
                foreach (string role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }

                // Create admin default buyer and default customer
                if (!dbContext.Users.Any())
                {
                    
                    await userManager.CreateAsync(
                        new ApplicationUser()
                        {
                            FirstName = "Admin",
                            MidleName = "-",
                            LastName = "Server",
                            UserName = "admin@hack.ru",
                            Email = "admin@hack.ru",
                        },
                        "Hack.123");

                    await userManager.CreateAsync(
                        new ApplicationUser()
                        {
                            FirstName = "Иван",
                            MidleName = "Иванович",
                            LastName = "Иванов",
                            UserName = "user@hack.ru",
                            PhoneNumber = "+7 999 123 12 12",
                            Email = "user@hack.ru",
                        },
                        "Hack.123");


                    await dbContext.SaveChangesAsync();
                    

                    ApplicationUser user1 = await userManager.FindByEmailAsync("user@hack.ru");
                    await userManager.AddToRoleAsync(user1, "Customer");

                    var confirmToken1 = await userManager.GenerateEmailConfirmationTokenAsync(user1);
                    await userManager.ConfirmEmailAsync(user1, confirmToken1);


                    // Ensure admin privileges
                    ApplicationUser admin = await userManager.FindByEmailAsync("admin@hack.ru");
                    foreach (string role in roles)
                    {
                        await userManager.AddToRoleAsync(admin, role);
                    }
                    var confirmToken3 = await userManager.GenerateEmailConfirmationTokenAsync(admin);
                    await userManager.ConfirmEmailAsync(admin, confirmToken3);

                    await dbContext.SaveChangesAsync();
                }

                


            }
        }
    }
}