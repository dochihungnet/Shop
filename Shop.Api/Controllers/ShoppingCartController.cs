using Microsoft.AspNet.Identity.Owin;
using Shop.Api.App_Start;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Model.Models;
using Shop.Service;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Microsoft.AspNet.Identity;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using Shop.Common;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/shopping-cart")]
    // [Authorize]
    public class ShoppingCartController: ApiControllerBase
    {
        private IShoppingCartService _shoppingCartService;
        private IProductService _productService;
        private IOrderService _orderService;
        private ApplicationUserManager _userManager;
        public ShoppingCartController(IErrorService errorService, IShoppingCartService shoppingCartService, IProductService productService, ApplicationUserManager userManager, IOrderService orderService) : base(errorService)
        {
            _shoppingCartService = shoppingCartService;
            _productService = productService;
            _orderService = orderService;
            _userManager = userManager;
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
        
        [Route("get-all-product-by-customer-id")]
        [HttpGet]
        public HttpResponseMessage GetAllProductByCustomerId(HttpRequestMessage request, string customerId)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var shoppingCarts = _shoppingCartService.GetAllProductShoppingCartByCustomerId(customerId);

                var shoppingCartsViewModel = Mapper.Map<List<ShoppingCartViewModel>>(shoppingCarts);

                response = request.CreateResponse(HttpStatusCode.OK, shoppingCartsViewModel);

                return response;
            });
        }
        
        [Route("add-product-shopping-cart")]
        [HttpPost]
        public HttpResponseMessage AddProductShoppingCart(HttpRequestMessage request, ShoppingCartViewModel shoppingCartViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                
                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, false);
                    return response;
                }

                // IF PRODUCT SHOPPING CART ALREADY EXIST
                var productShoppingCart =
                    _shoppingCartService.GetSingleProductShoppingCart(shoppingCartViewModel.CustomerId,
                        shoppingCartViewModel.ProductId);
                
                if (productShoppingCart != null)
                {
                    productShoppingCart.Quantity += shoppingCartViewModel.Quantity;
                    productShoppingCart.UpdatedBy = productShoppingCart.CreatedBy;
                    productShoppingCart.UpdatedDate = DateTime.Now;
                    _shoppingCartService.SaveChanges();
                    
                    response = request.CreateResponse(HttpStatusCode.OK, true);
                    return response;
                }
                
                // IF PRODUCT SHOPPING CART NOT EXISTED YET
                var customer = _userManager.FindById(shoppingCartViewModel.CustomerId);
                var product = _productService.GetById(shoppingCartViewModel.ProductId);
                
                var newShoppingCart = Mapper.Map<ShoppingCart>(shoppingCartViewModel);
                newShoppingCart.CreatedDate = DateTime.Now;
                newShoppingCart.CreatedBy = customer.FullName;
                newShoppingCart.Name = product.Name;
                newShoppingCart.Image = product.Image;
                newShoppingCart.Price = product.PriceAfterDiscount.HasValue == true ? product.PriceAfterDiscount.Value : product.Price;

                _shoppingCartService.AddProductShoppingCart(newShoppingCart);

                response = request.CreateResponse(HttpStatusCode.OK, true);
                
                return response;
            });
        }
        
        
        [Route("delete-product-shopping-cart")]
        [HttpDelete]
        public HttpResponseMessage DeleteProductShoppingCart(HttpRequestMessage request, string customerId, int productId)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                
                _shoppingCartService.DeleteProductShoppingCart(customerId, productId);

                response = request.CreateResponse(HttpStatusCode.OK, true);
                
                return response;
            });
        }

        [Route("delete-shopping-cart")]
        [HttpDelete]
        public HttpResponseMessage DeleteShoppingCart(HttpRequestMessage request, string customerId)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                _shoppingCartService.DeleteShoppingCart(customerId);

                response = request.CreateResponse(HttpStatusCode.OK, true);
                
                return response;
            });
        }
        
        [Route("update-quantity")]
        [HttpPut]
        public HttpResponseMessage UpdateQuantityProductShoppingCart(HttpRequestMessage request,
            ShoppingCartViewModel shoppingCartViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, false);
                    return response;
                }
                    
                var shoppingCart = Mapper.Map<ShoppingCart>(shoppingCartViewModel);
                _shoppingCartService.UpdateQuantityProductShoppingCart(shoppingCart);
                
                response = request.CreateResponse(HttpStatusCode.OK, true);
                return response;
            });
        }
        
        [Route("update-shopping-cart")]
        [HttpPut]
        public HttpResponseMessage UpdateShoppingCart(HttpRequestMessage request, List<ShoppingCartViewModel> shoppingCartsViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var customerId = shoppingCartsViewModel[0].CustomerId;
                
                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, false);
                    return response;
                }

                var newShoppingCarts = Mapper.Map<List<ShoppingCart>>(shoppingCartsViewModel);

                _shoppingCartService.UpdateShoppingCart(customerId, newShoppingCarts);

                response = request.CreateResponse(HttpStatusCode.OK, true);

                return response;
            });
        }

        [Route("check-out")]
        [HttpPost]
        public HttpResponseMessage CheckOut(HttpRequestMessage request, OrderViewModel orderViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, false);
                    return response;
                }

                var order = Mapper.Map<Order>(orderViewModel);
                order.CreatedDate = DateTime.Now;
                var orderNew = _orderService.AddOrder(order);
                
                if (orderNew == null)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, false);
                    return response;
                }

                var orderNewViewModel = Mapper.Map<OrderViewModel>(orderNew);

               
                SendMailWhenOrderSuccess(orderNewViewModel);
             
                
                response = request.CreateResponse(HttpStatusCode.OK, orderNewViewModel);
                return response;
            });
        }

        // [Route("send-mail")]
        // [HttpGet]
        // public HttpResponseMessage SendMail(HttpRequestMessage request, int orderId)
        // {
        //     return CreateHttpResponse(request, () =>
        //     {
        //         HttpResponseMessage response = null;
        //
        //         var order = _orderService.GetOrderById(orderId);
        //         var orderViewModel = Mapper.Map<OrderViewModel>(order);
        //         SendMailWhenOrderSuccess(orderViewModel);
        //         response
        //         return response;
        //     });
        // }
        
        [NonAction]
        public void SendMailWhenOrderSuccess(OrderViewModel orderNew)
        {

            // SendMail
            string content = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Assets/template/contact_template.html"));
            content = content.Replace("{{Name}}", orderNew.CustomerName);
            content = content.Replace("{{ShopName}}", "Shop MasterYi");
            content = content.Replace("{{LinkOrder}}", "https://localhost:44394/home#!/orders");
            content = content.Replace("{{LinkWeb}}", "https://localhost:44394/home#!/home");
            content = content.Replace("{{OrderId}}", orderNew.Id.ToString());
            content = content.Replace("{{OrderCreateDate}}", orderNew.CreatedDate?.ToString("dd/MM/yyyy hh:mm tt"));
            content = content.Replace("{{PaymentStatus}}", orderNew.PaymentStatus ? "Đã thanh toán" : "Thanh toán khi nhận hàng");
            content = content.Replace("{{CustomerName}}", orderNew.CustomerName);
            content = content.Replace("{{CustomerPhone}}", orderNew.CustomerMobile);
            content = content.Replace("{{DeliveryAddress}}", orderNew.CustomerDeliveryAddress);

            MailHelper.SendMail(orderNew.CustomerEmail,  "Thông tin đơn hàng", content);
        }
        
    }
}