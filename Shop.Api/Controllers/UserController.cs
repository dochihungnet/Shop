using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Shop.Api.App_Start;
using Shop.Api.Infrastructure.Core;
using Shop.Service;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/user")]
    public class UserController : ApiControllerBase
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? System.Web.HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>();
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
                return _userManager ?? System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public UserController(IErrorService errorService ,ApplicationUserManager userManager, ApplicationSignInManager signInManager) :  base(errorService)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }
        
        [Route("get-user-by-user-name")]
        [HttpGet]
        public HttpResponseMessage GetUserByUserName(HttpRequestMessage request, string userName)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var user =  UserManager.FindByName(userName);
                
                if (user == null)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, false);
                    return response;
                }

                response = request.CreateResponse(HttpStatusCode.OK, user);
                
                return response;
            });
        }

    }
}