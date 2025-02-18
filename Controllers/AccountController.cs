using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModernCMS.Models;

namespace ModernCMS.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View(new LoginViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid && model.Email != null && model.Password != null)
            {
                // Check if user exists
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    ModelState.AddModelError("Email", "Email not found.");
                    return View(model);
                }

                var result = await _signInManager.PasswordSignInAsync(
                    user.UserName ?? model.Email, // Fallback to email if username is null
                    model.Password, 
                    isPersistent: false, 
                    lockoutOnFailure: false);
                
                if (result.Succeeded)
                {
                    return RedirectToLocal(returnUrl);
                }
                
                ModelState.AddModelError("Password", "Invalid password.");
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                return Ok();
            }
            return RedirectToAction("Login");
        }

        private IActionResult RedirectToLocal(string? returnUrl)
        {
            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction(nameof(DashboardController.Index), "Dashboard");
        }
    }
} 