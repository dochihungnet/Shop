using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Shop.Api.App_Start;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Data;
using Shop.Model.Models;
using Shop.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/account")]
    public class AccountController : ApiControllerBase
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

 
        public AccountController(IErrorService errorService ,ApplicationUserManager userManager, ApplicationSignInManager signInManager) :  base(errorService)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<HttpResponseMessage> Login(HttpRequestMessage request, string userName, string password, bool rememberMe)
        {
            if (!ModelState.IsValid)
            {
                return request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var result = await SignInManager.PasswordSignInAsync(userName, password, rememberMe, shouldLockout: false);
            return request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Authorize]
        [Route("logout")]
        public HttpResponseMessage Logout(HttpRequestMessage request)
        {
            var authenticationManager = HttpContext.Current.GetOwinContext().Authentication;
            authenticationManager.SignOut();
            return request.CreateResponse(HttpStatusCode.OK, new { success = true });
        }

        [HttpPost]
        [Route("register")]
        public async Task<HttpResponseMessage> Register(HttpRequestMessage request, RegisterViewModel register)
        {
            if (ModelState.IsValid)
            {
                var userByEmail = await _userManager.FindByEmailAsync(register.Email);
                if (userByEmail != null)
                {
                    ModelState.AddModelError("email", "Email đã tồn tại");
                    return request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }

                var userByUserName = await _userManager.FindByNameAsync(register.UserName);
                if (userByUserName != null)
                {
                    ModelState.AddModelError("UserName", "Tài khoản đã tồn tại");
                    return request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }

                var user = new ApplicationUser()
                {
                    UserName = register.UserName,
                    Email = register.Email,
                    EmailConfirmed = true,
                    BirthDay = DateTime.Now,
                    FullName = register.FullName,
                    PhoneNumber = register.PhoneNumber,
                    Address = register.Address
                };

                await _userManager.CreateAsync(user, register.Password);

                var adminUser = await _userManager.FindByEmailAsync(register.Email);
                if(adminUser != null)
                {
                    await _userManager.AddToRolesAsync(adminUser.Id, new string[] { "User" });
                }
                return request.CreateResponse(HttpStatusCode.Created, adminUser);
            }
            return request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
          
            
        }

    }
}