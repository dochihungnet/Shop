using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Shop.Api.App_Start;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Service;
using System.Data.Entity;
using System.Web.Http;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/order")]
    public class OrderController : ApiControllerBase
    {
        private IOrderService _orderService;
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        public OrderController(IErrorService errorService, IOrderService orderService, ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(errorService)
        {
            _orderService = orderService;
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

        [Route("get-all-order-by-customer-id")]
        [HttpGet]
        public HttpResponseMessage GetAllOrderByCustomerId(HttpRequestMessage request, string customerId)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var user = _userManager.FindById(customerId);
                if (user == null)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, false);
                    return response;
                }

                var listOrder = _orderService.GetAllOrderByCustomerId(customerId);
                var listOrderViewModel = Mapper.Map<List<OrderViewModel>>(listOrder);

                response = request.CreateResponse(HttpStatusCode.OK, listOrderViewModel);
                return response;
            });
        }
        
    }
}