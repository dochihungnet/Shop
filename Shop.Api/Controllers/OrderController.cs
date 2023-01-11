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
        
        [Route("get-order-by-id")]
        [HttpGet]
        public HttpResponseMessage GetOrderById(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                
                var order = _orderService.GetOrderById(id);
                var orderViewModel = Mapper.Map<OrderViewModel>(order);

                response = request.CreateResponse(HttpStatusCode.OK, orderViewModel);
                return response;
            });
        }

        [Route("delete-order-by-id")]
        [HttpDelete]
        public HttpResponseMessage DeleteOrderById(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                
                var order = _orderService.DeleteOrder(id);
                _orderService.SaveChanges();
                
                var orderDelViewModel = Mapper.Map<OrderViewModel>(order);

                response = request.CreateResponse(HttpStatusCode.OK, orderDelViewModel);
                return response;
            });
        }

        [Route("update-payment-status")]
        [HttpPut]
        public HttpResponseMessage UpdatePaymentStatus(HttpRequestMessage request, OrderViewModel orderViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                
                var order = _orderService.UpdatePaymentStatus(orderViewModel.Id, orderViewModel.Status);

                response = request.CreateResponse(HttpStatusCode.OK, order);
                return response;
            });
        }

        [Route("get-order-by-email-order-id")]
        [HttpGet]
        public HttpResponseMessage GetOrderByEmailOrderId(HttpRequestMessage request, string email, int orderId)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var order = _orderService.GetOrderByEmailOrderId(email, orderId);

                var orderViewModel = Mapper.Map<OrderViewModel>(order);

                response = request.CreateResponse(HttpStatusCode.OK, orderViewModel);

                return response;
            });
        }

        [Route("get-all-order")]
        [HttpGet]
        public HttpResponseMessage GetAllOrder(HttpRequestMessage request, string keyword,
            string customerName, string email, bool? paymentStatus = null, int? orderId = null,
            int? orderStatus = null, DateTime? createdDate = null, int page = 0, int pageSize = 10)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                int totalRow = 0;
                
                // Conditional: có điều kiện
                var orders = _orderService.GetAllOrderConditional(keyword, orderId, customerName, email, paymentStatus, orderStatus, createdDate);
                
                totalRow = orders.Count();
                orders = orders.Skip(page * pageSize).Take(pageSize);
                
                var ordersViewModel = Mapper.Map<IEnumerable<OrderViewModel>>(orders);
                var paginationSet = new PaginationSet<OrderViewModel>()
                {
                    Items = ordersViewModel,
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize)
                };
                response = request.CreateResponse(HttpStatusCode.OK, paginationSet);
                return response;
            });
        }


        [Route("update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, OrderViewModel orderViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var order = Mapper.Map<Order>(orderViewModel);
                var orderUpdate = _orderService.UpdateOrder(order);
                var orderUpdateViewModel = Mapper.Map<OrderViewModel>(orderUpdate);

                response = request.CreateResponse(HttpStatusCode.OK, orderUpdateViewModel);
                return response;
            });
        }
    }
}