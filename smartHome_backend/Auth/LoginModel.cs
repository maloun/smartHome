using System.ComponentModel.DataAnnotations;

namespace JWTRefreshToken.NET6._0.Auth
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Требуется ввести E-mail")]
        [EmailAddress(ErrorMessage = "Неверный E-mail")]
        public string email { get; set; }

        [Required(ErrorMessage = "Требуется ввести пароль")]
        [DataType(DataType.Password)]
        public string password { get; set; }

        [Display(Name = "Запомнить меня ?")]
        public bool rememberMe { get; set; }
    }
}