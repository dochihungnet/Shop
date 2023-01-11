using System;
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
using System.Linq;
using System.Web.Http;
using Shop.Model.Models;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/statistical")]
    public class StatisticalController :  ApiControllerBase
    {
        private IOrderService _orderService;
        private ApplicationUserManager _userManager;
        private IProductCategoryService _productCategoryService;
        private IProductService _productService;
        public StatisticalController(IErrorService errorService,
            IOrderService orderService,
            ApplicationUserManager userManager,
            IProductCategoryService productCategoryService,
            IProductService productService) : base(errorService)
        {
            _orderService = orderService;
            _userManager = userManager;
            _productCategoryService = productCategoryService;
            _productService = productService;
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
        [Route("statistical")]
        [HttpGet]
        public HttpResponseMessage Statistical(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var totalOrders = _orderService.GetAllOrder().Count();

                var totalRevenue = _orderService.GetTotalRevenue();

                var totalCustomer = _userManager.Users.Count();

                var topProductCategories = _productCategoryService.GetProductCategoryBestSelling(10);
                var topProductCategoriesViewModel = Mapper.Map<List<ProductCategoryViewModel>>(topProductCategories);

                var topProducts = _productService.GetListTopProduct(10);
                var topProductsViewModel = Mapper.Map<List<ProductViewModel>>(topProducts);

                var topUser = GetListTopUserOrder(10);

                var recentOrders = _orderService.GetRecentOrders(10);
                var recentOrdersViewModel = Mapper.Map<List<OrderViewModel>>(recentOrders);

                var statisticalViewModel = new StatisticalViewModel()
                {
                    TotalOrders = totalOrders,
                    TotalRevenue = totalRevenue,
                    TotalCustomer = totalCustomer,
                    TopProductCategoryViewModels = topProductCategoriesViewModel,
                    TopProductViewModels = topProductsViewModel,
                    TopUsers = topUser,
                    RecentOrders = recentOrdersViewModel
                };

                response = request.CreateResponse(HttpStatusCode.OK, statisticalViewModel);

                return response;
            });
        }

        [NonAction]
        public List<ApplicationUser> GetListTopUserOrder(int amount)
        {
            var user = _userManager.Users.ToList();
            
            user.Sort((x, y) =>
            {
                int orderCount_x = _orderService.GetAllOrderByCustomerId(x.Id).Count();
                int orderCount_y = _orderService.GetAllOrderByCustomerId(y.Id).Count();

                return orderCount_y - orderCount_x;
            });

            if(user.Count < amount)
            {
                return user.GetRange(0, user.Count);
            }
            return user.GetRange(0, amount);
        }
    }
}